"""Bridges the FastAPI layer to the trained ML pipeline in ml/predict.py."""
import sys

from app.config import PROJECT_ROOT

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from ml.predict import WellnessPredictor  # noqa: E402

from app.schemas import PredictionRequest  # noqa: E402

_predictor: WellnessPredictor | None = None


def load_predictor() -> WellnessPredictor:
    global _predictor
    if _predictor is None:
        _predictor = WellnessPredictor()
    return _predictor


def is_model_loaded() -> bool:
    return _predictor is not None


def predict(request: PredictionRequest) -> dict:
    predictor = load_predictor()
    record = request.model_dump()
    return predictor.predict(record)


def get_metadata() -> dict:
    predictor = load_predictor()
    return predictor.metadata
