"""Tests for ml/predict.py (requires artifacts/ to already be trained)."""
import pytest

from ml.predict import WellnessPredictor

SAMPLE_RECORD = {
    "age": 24,
    "gender": "Female",
    "occupation": "Student",
    "work_mode": "Remote",
    "screen_time_hours": 8.5,
    "work_screen_hours": 3.0,
    "leisure_screen_hours": 5.5,
    "sleep_hours": 6.5,
    "exercise_minutes_per_week": 90,
    "social_hours_per_week": 6.0,
}


@pytest.fixture(scope="module")
def predictor():
    return WellnessPredictor()


def test_model_loads(predictor):
    assert predictor.model is not None
    assert predictor.preprocessor is not None


def test_predict_returns_expected_shape(predictor):
    result = predictor.predict(SAMPLE_RECORD)
    assert result["prediction"] in {"Low", "Moderate", "High"}
    assert 0 <= result["score"] <= 100
    assert isinstance(result["top_factors"], list)


def test_predict_is_deterministic(predictor):
    r1 = predictor.predict(SAMPLE_RECORD)
    r2 = predictor.predict(SAMPLE_RECORD)
    assert r1 == r2


def test_predict_handles_extreme_but_valid_input(predictor):
    record = dict(SAMPLE_RECORD)
    record.update({"screen_time_hours": 0.0, "leisure_screen_hours": 0.0, "sleep_hours": 12})
    result = predictor.predict(record)
    assert result["prediction"] in {"Low", "Moderate", "High"}
