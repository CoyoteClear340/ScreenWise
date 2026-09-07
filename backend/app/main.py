"""ScreenWise FastAPI application."""
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app import predictor
from app.config import ALLOWED_ORIGINS, API_TITLE, API_VERSION
from app.schemas import HealthResponse, ModelInfoResponse, PredictionRequest, PredictionResponse

logger = logging.getLogger("screenwise")


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        predictor.load_predictor()
        logger.info("Model artifacts loaded successfully.")
    except Exception:
        logger.exception("Failed to load model artifacts at startup.")
    yield


app = FastAPI(title=API_TITLE, version=API_VERSION, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
def health():
    return HealthResponse(status="ok", model_loaded=predictor.is_model_loaded())


@app.get("/model-info", response_model=ModelInfoResponse)
def model_info():
    try:
        metadata = predictor.get_metadata()
    except FileNotFoundError:
        raise HTTPException(
            status_code=503,
            detail="Model artifacts not found. Run `python -m ml.train` first.",
        )
    return ModelInfoResponse(**metadata)


@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    try:
        result = predictor.predict(request)
    except FileNotFoundError:
        raise HTTPException(
            status_code=503,
            detail="Model artifacts not found. Run `python -m ml.train` first.",
        )
    except Exception:
        logger.exception("Prediction failed.")
        raise HTTPException(status_code=500, detail="Prediction failed due to an internal error.")
    return PredictionResponse(**result)
