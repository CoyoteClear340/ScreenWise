"""Backend configuration."""
import os
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = BACKEND_DIR.parent
ARTIFACTS_DIR = PROJECT_ROOT / "artifacts"

# Browser origins allowed by CORS. Defaults to the local Vite dev server;
# set ALLOWED_ORIGINS to a comma-separated list of origins in production,
# e.g. ALLOWED_ORIGINS=https://screenwise-frontend.onrender.com
DEFAULT_ALLOWED_ORIGINS = "http://localhost:5173,http://127.0.0.1:5173"


def get_allowed_origins() -> list[str]:
    """Parse ALLOWED_ORIGINS into a list of stripped, non-empty origins."""
    raw = os.getenv("ALLOWED_ORIGINS", DEFAULT_ALLOWED_ORIGINS)
    return [origin.strip() for origin in raw.split(",") if origin.strip()]


ALLOWED_ORIGINS = get_allowed_origins()

API_TITLE = "ScreenWise API"
API_VERSION = "1.0.0"
