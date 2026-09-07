"""Load saved artifacts and run predictions on new user input."""
import json
import pickle
from pathlib import Path

import pandas as pd

ARTIFACTS_DIR = Path(__file__).resolve().parent.parent / "artifacts"


class WellnessPredictor:
    """Wraps the trained model + preprocessor for real-time predictions."""

    def __init__(self, artifacts_dir: Path = ARTIFACTS_DIR):
        with open(artifacts_dir / "model.pkl", "rb") as f:
            self.model = pickle.load(f)
        with open(artifacts_dir / "preprocessor.pkl", "rb") as f:
            self.preprocessor = pickle.load(f)
        with open(artifacts_dir / "feature_info.json") as f:
            self.feature_info = json.load(f)
        with open(artifacts_dir / "model_metadata.json") as f:
            self.metadata = json.load(f)

    def predict(self, record: dict) -> dict:
        """Predict wellness category + score/confidence/top factors for one record.

        `record` must contain exactly the raw input fields (see ml.preprocess.ALL_FEATURES
        minus derived features, which are computed here).
        """
        df = pd.DataFrame([record])
        df["leisure_screen_ratio"] = df["leisure_screen_hours"] / df["screen_time_hours"].replace(0, 1)

        feature_order = self.feature_info["numeric_features"] + self.feature_info["categorical_features"]
        X = df[feature_order]

        X_proc = self.preprocessor.transform(X)
        prediction = self.model.predict(X_proc)[0]

        proba = None
        confidence = None
        if hasattr(self.model, "predict_proba"):
            proba = self.model.predict_proba(X_proc)[0]
            classes = list(self.model.classes_)
            confidence = float(proba[classes.index(prediction)])

        # Map predicted class to an approximate 0-100 score using the tercile
        # bin edges saved at training time (midpoint of the predicted band).
        bin_edges = self.feature_info["target_bin_edges"]
        labels = ["Low", "Moderate", "High"]
        idx = labels.index(prediction)
        low, high = bin_edges[idx], bin_edges[idx + 1]
        score = round((low + high) / 2, 1)

        top_factors = self.feature_info.get("top_factors", [])[:5]

        return {
            "prediction": str(prediction),
            "score": score,
            "confidence": confidence,
            "top_factors": top_factors,
        }


_predictor_singleton = None


def get_predictor() -> WellnessPredictor:
    global _predictor_singleton
    if _predictor_singleton is None:
        _predictor_singleton = WellnessPredictor()
    return _predictor_singleton
