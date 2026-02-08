from pathlib import Path
import os
import logging
from typing import List

import torch
import torch.nn.functional as F
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification


# -------------------- Request / Response Schemas --------------------

class TextIn(BaseModel):
    text: str


class AnalysisOut(BaseModel):
    risk: float
    probabilities: List[float]   # ✅ array (React-friendly)
    labels: List[str]            # ✅ wordings


# -------------------- App Setup --------------------

app = FastAPI(title="MindGuard AI - Text Analyzer")

logger = logging.getLogger("mindguard")
logging.basicConfig(level=logging.INFO)

origins = os.getenv("FRONTEND_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"],
)

# -------------------- Label Mapping --------------------

ID2LABEL = {
    0: "No Risk",
    1: "Mild Risk",
    2: "Moderate Risk",
    3: "High Risk",
}

# -------------------- Startup: Load Model --------------------

@app.on_event("startup")
def load_model_and_tokenizer():
    base = Path(__file__).resolve().parent
    model_dir = base / "text_model"

    if not model_dir.exists():
        logger.error("Model directory not found: %s", model_dir)
        app.state.ready = False
        return

    try:
        logger.info("Loading tokenizer...")
        app.state.tokenizer = AutoTokenizer.from_pretrained(str(model_dir))

        logger.info("Loading model...")
        app.state.model = AutoModelForSequenceClassification.from_pretrained(
            str(model_dir),
            torch_dtype=torch.float32
        )
        app.state.model.eval()
        app.state.ready = True

        logger.info("Model loaded and ready")
    except Exception as e:
        logger.exception("Failed to load model: %s", e)
        app.state.ready = False


# -------------------- Inference Endpoint --------------------

@app.post("/analyze-text", response_model=AnalysisOut)
def analyze_text(payload: TextIn):
    text = payload.text.strip()

    if not text:
        raise HTTPException(status_code=400, detail="Empty text provided")

    if not getattr(app.state, "ready", False):
        raise HTTPException(status_code=503, detail="Model not loaded")

    inputs = app.state.tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=512,
    )

    try:
        with torch.no_grad():
            outputs = app.state.model(**inputs)
            logits = outputs.logits[0]
            probs = F.softmax(logits, dim=-1).cpu().tolist()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Risk score (0–100)
    num_classes = len(probs)
    expected_index = sum(i * p for i, p in enumerate(probs))
    risk = round((expected_index / (num_classes - 1)) * 100, 2)

    labels = [ID2LABEL[i] for i in range(num_classes)]

    return {
        "risk": risk,
        "probabilities": [round(p, 6) for p in probs],
        "labels": labels
    }


# -------------------- Health Check --------------------

@app.get("/health")
def health():
    return {
        "ok": True,
        "model_ready": getattr(app.state, "ready", False)
    }


# -------------------- Run Directly --------------------

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("fastapi_app:app", host="0.0.0.0", port=8000, reload=True)
