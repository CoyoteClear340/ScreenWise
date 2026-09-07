"""Tests for the FastAPI backend endpoints."""
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

VALID_PAYLOAD = {
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


def test_health():
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


def test_model_info():
    resp = client.get("/model-info")
    assert resp.status_code == 200
    body = resp.json()
    assert "model_name" in body
    assert "metrics" in body


def test_predict_valid_payload():
    resp = client.post("/predict", json=VALID_PAYLOAD)
    assert resp.status_code == 200
    body = resp.json()
    assert body["prediction"] in {"Low", "Moderate", "High"}
    assert 0 <= body["score"] <= 100
    assert isinstance(body["top_factors"], list)


def test_predict_missing_field():
    payload = dict(VALID_PAYLOAD)
    del payload["age"]
    resp = client.post("/predict", json=payload)
    assert resp.status_code == 422


def test_predict_out_of_range_field():
    payload = dict(VALID_PAYLOAD)
    payload["screen_time_hours"] = 30  # out of 0-24 range
    resp = client.post("/predict", json=payload)
    assert resp.status_code == 422


def test_predict_invalid_categorical_value():
    payload = dict(VALID_PAYLOAD)
    payload["gender"] = "Unknown"
    resp = client.post("/predict", json=payload)
    assert resp.status_code == 422
