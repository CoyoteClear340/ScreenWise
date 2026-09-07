"""Preprocessing pipeline construction (scaling + encoding)."""
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

from ml.preprocess import CATEGORICAL_FEATURES, NUMERIC_FEATURES


def build_preprocessor() -> ColumnTransformer:
    """Build the ColumnTransformer used to preprocess model inputs.

    Fit only on training data (see ml/train.py) to avoid leakage between
    train and test splits.
    """
    numeric_pipeline = Pipeline(steps=[("scaler", StandardScaler())])
    categorical_pipeline = Pipeline(
        steps=[("onehot", OneHotEncoder(handle_unknown="ignore"))]
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numeric_pipeline, NUMERIC_FEATURES),
            ("cat", categorical_pipeline, CATEGORICAL_FEATURES),
        ]
    )
    return preprocessor


def get_output_feature_names(preprocessor: ColumnTransformer) -> list:
    """Return the flat list of feature names produced by the fitted preprocessor."""
    return list(preprocessor.get_feature_names_out())
