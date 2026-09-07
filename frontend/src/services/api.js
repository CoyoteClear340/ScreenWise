const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function handleResponse(response) {
  if (!response.ok) {
    let details = null;
    try {
      details = await response.json();
    } catch {
      // response body wasn't JSON
    }
    const message =
      details?.detail && typeof details.detail === "string"
        ? details.detail
        : "Something went wrong while talking to the ScreenWise API.";
    throw new ApiError(message, response.status, details);
  }
  return response.json();
}

export async function getHealth() {
  const res = await fetch(`${API_URL}/health`);
  return handleResponse(res);
}

export async function getModelInfo() {
  const res = await fetch(`${API_URL}/model-info`);
  return handleResponse(res);
}

export async function predictWellness(payload) {
  const res = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
