"""Train, tune, evaluate and serialize the ScreenWise wellness classifier.

Run with:  python ml/train.py
"""
import json
import pickle
from datetime import date
from pathlib import Path

import numpy as np
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import (
    GridSearchCV,
    StratifiedKFold,
    cross_val_score,
    train_test_split,
)
from sklearn.tree import DecisionTreeClassifier

from ml.evaluate import evaluate_predictions
from ml.features import build_preprocessor, get_output_feature_names
from ml.preprocess import (
    ALL_FEATURES,
    LEAKAGE_COLUMNS,
    RAW_CSV_PATH,
    TARGET_CATEGORY_COLUMN,
    load_and_prepare,
)

ARTIFACTS_DIR = Path("artifacts")
RANDOM_STATE = 42


def get_candidate_models():
    return {
        "LogisticRegression": LogisticRegression(max_iter=2000, random_state=RANDOM_STATE),
        "DecisionTree": DecisionTreeClassifier(random_state=RANDOM_STATE),
        "RandomForest": RandomForestClassifier(random_state=RANDOM_STATE),
        "GradientBoosting": GradientBoostingClassifier(random_state=RANDOM_STATE),
    }


def main():
    print(f"Loading and preparing data from {RAW_CSV_PATH} ...")
    df, bin_edges = load_and_prepare(RAW_CSV_PATH)
    print(f"Prepared dataset shape: {df.shape}")
    print("Wellness category distribution:")
    print(df[TARGET_CATEGORY_COLUMN].value_counts())

    X = df[ALL_FEATURES]
    y = df[TARGET_CATEGORY_COLUMN]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y
    )
    print(f"\nTrain size: {X_train.shape[0]}, Test size: {X_test.shape[0]}")

    preprocessor = build_preprocessor()
    X_train_proc = preprocessor.fit_transform(X_train)
    X_test_proc = preprocessor.transform(X_test)
    feature_names = get_output_feature_names(preprocessor)

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_STATE)

    print("\n=== 5-Fold Stratified Cross-Validation (accuracy) ===")
    cv_results = {}
    for name, model in get_candidate_models().items():
        scores = cross_val_score(model, X_train_proc, y_train, cv=cv, scoring="accuracy")
        cv_results[name] = {"mean": float(scores.mean()), "std": float(scores.std())}
        print(f"{name:20s} mean={scores.mean():.4f}  std={scores.std():.4f}")

    print("\n=== Hyperparameter tuning (RandomForest via GridSearchCV) ===")
    rf_param_grid = {
        "n_estimators": [100, 200, 300],
        "max_depth": [None, 5, 10],
        "min_samples_split": [2, 5],
        "min_samples_leaf": [1, 2],
    }
    rf_search = GridSearchCV(
        RandomForestClassifier(random_state=RANDOM_STATE),
        rf_param_grid,
        cv=cv,
        scoring="accuracy",
        n_jobs=-1,
    )
    rf_search.fit(X_train_proc, y_train)
    print(f"Best RF params: {rf_search.best_params_}")
    print(f"Best RF CV accuracy: {rf_search.best_score_:.4f}")
    cv_results["RandomForest_tuned"] = {
        "mean": float(rf_search.best_score_),
        "params": rf_search.best_params_,
    }

    print("\n=== Hyperparameter tuning (GradientBoosting via GridSearchCV) ===")
    gb_param_grid = {
        "n_estimators": [100, 200],
        "max_depth": [2, 3, 4],
        "learning_rate": [0.05, 0.1],
    }
    gb_search = GridSearchCV(
        GradientBoostingClassifier(random_state=RANDOM_STATE),
        gb_param_grid,
        cv=cv,
        scoring="accuracy",
        n_jobs=-1,
    )
    gb_search.fit(X_train_proc, y_train)
    print(f"Best GB params: {gb_search.best_params_}")
    print(f"Best GB CV accuracy: {gb_search.best_score_:.4f}")
    cv_results["GradientBoosting_tuned"] = {
        "mean": float(gb_search.best_score_),
        "params": gb_search.best_params_,
    }

    # Select the best model among tuned RF, tuned GB, and untuned baselines
    # by cross-validated accuracy on the training set only.
    candidates = {
        "RandomForest": (rf_search.best_estimator_, rf_search.best_score_),
        "GradientBoosting": (gb_search.best_estimator_, gb_search.best_score_),
    }
    for name, model in get_candidate_models().items():
        if name in ("RandomForest", "GradientBoosting"):
            continue
        candidates[name] = (model, cv_results[name]["mean"])

    best_name = max(candidates, key=lambda k: candidates[k][1])
    best_model = candidates[best_name][0]
    print(f"\n=== Selected best model: {best_name} (CV accuracy={candidates[best_name][1]:.4f}) ===")

    # Fit best model on full training set, evaluate once on held-out test set.
    best_model.fit(X_train_proc, y_train)
    y_train_pred = best_model.predict(X_train_proc)
    y_test_pred = best_model.predict(X_test_proc)

    train_metrics = evaluate_predictions(y_train, y_train_pred)
    test_metrics = evaluate_predictions(y_test, y_test_pred)

    print("\n=== Train metrics ===")
    print(json.dumps(train_metrics, indent=2))
    print("\n=== Test metrics (final, one-time evaluation) ===")
    print(json.dumps(test_metrics, indent=2))

    # Feature importance: native for tree-based models, mean |coefficient|
    # (normalized to sum to 1) for linear models such as LogisticRegression.
    top_factors = []
    importances = None
    if hasattr(best_model, "feature_importances_"):
        importances = best_model.feature_importances_
    elif hasattr(best_model, "coef_"):
        raw = np.abs(best_model.coef_).mean(axis=0)
        importances = raw / raw.sum()

    def clean_name(name: str) -> str:
        return name.split("__", 1)[-1]

    if importances is not None:
        ranked = sorted(zip(feature_names, importances), key=lambda t: t[1], reverse=True)
        top_factors = [{"feature": clean_name(f), "importance": float(i)} for f, i in ranked[:8]]
        print("\n=== Top feature importances ===")
        for f, i in ranked[:8]:
            print(f"{f:35s} {i:.4f}")

    # --- Save artifacts ---
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)

    with open(ARTIFACTS_DIR / "model.pkl", "wb") as f:
        pickle.dump(best_model, f)
    with open(ARTIFACTS_DIR / "preprocessor.pkl", "wb") as f:
        pickle.dump(preprocessor, f)

    metrics = {
        "cv_results": cv_results,
        "train_metrics": train_metrics,
        "test_metrics": test_metrics,
        "selected_model": best_name,
    }
    with open(ARTIFACTS_DIR / "metrics.json", "w") as f:
        json.dump(metrics, f, indent=2)

    feature_info = {
        "numeric_features": [c for c in ALL_FEATURES if c not in ("gender", "occupation", "work_mode")],
        "categorical_features": ["gender", "occupation", "work_mode"],
        "categorical_values": {
            "gender": sorted(X_train["gender"].unique().tolist()),
            "occupation": sorted(X_train["occupation"].unique().tolist()),
            "work_mode": sorted(X_train["work_mode"].unique().tolist()),
        },
        "feature_ranges": {
            col: {"min": float(X[col].min()), "max": float(X[col].max())}
            for col in ALL_FEATURES
            if col not in ("gender", "occupation", "work_mode")
        },
        "output_feature_names": feature_names,
        "top_factors": top_factors,
        "target_bin_edges": bin_edges,
        "leakage_columns_excluded": LEAKAGE_COLUMNS,
    }
    with open(ARTIFACTS_DIR / "feature_info.json", "w") as f:
        json.dump(feature_info, f, indent=2)

    model_metadata = {
        "model_name": type(best_model).__name__,
        "training_date": str(date.today()),
        "dataset": "ScreenTime vs MentalWellness.csv",
        "random_state": RANDOM_STATE,
        "features": ALL_FEATURES,
        "metrics": test_metrics,
        "target_construction": (
            "Used the dataset's existing mental_wellness_index_0_100 column as the "
            "wellness score (verified to correlate ~0.96 with a normalized "
            "combination of productivity_0_100, sleep_quality_1_5, and "
            "inverse stress_level_0_10). Bucketed into Low/Moderate/High via "
            "tercile (33rd/66th percentile) quantile thresholds computed on the "
            "cleaned dataset. Indicator columns used to build the raw index "
            "(productivity_0_100, sleep_quality_1_5, stress_level_0_10) were "
            "excluded from model features to prevent data leakage."
        ),
    }
    with open(ARTIFACTS_DIR / "model_metadata.json", "w") as f:
        json.dump(model_metadata, f, indent=2)

    print(f"\nArtifacts saved to {ARTIFACTS_DIR.resolve()}")


if __name__ == "__main__":
    main()
