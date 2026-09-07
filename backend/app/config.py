"""Backend configuration."""
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = BACKEND_DIR.parent
ARTIFACTS_DIR = PROJECT_ROOT / "artifacts"

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

API_TITLE = "ScreenWise API"
API_VERSION = "1.0.0"
