import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PredictionForm, { validateForm } from "../PredictionForm.jsx";
import * as api from "../../services/api.js";

describe("validateForm", () => {
  const validForm = {
    age: 25,
    screen_time_hours: 8,
    work_screen_hours: 2,
    leisure_screen_hours: 6,
    sleep_hours: 7,
    exercise_minutes_per_week: 100,
    social_hours_per_week: 8,
  };

  it("returns no errors for a valid form", () => {
    expect(Object.keys(validateForm(validForm))).toHaveLength(0);
  });

  it("flags an out-of-range age", () => {
    const errors = validateForm({ ...validForm, age: 200 });
    expect(errors.age).toBeDefined();
  });

  it("flags screen time outside 0-24", () => {
    const errors = validateForm({ ...validForm, screen_time_hours: 30 });
    expect(errors.screen_time_hours).toBeDefined();
  });

  it("flags work+leisure screen time exceeding total", () => {
    const errors = validateForm({
      ...validForm,
      screen_time_hours: 2,
      work_screen_hours: 5,
      leisure_screen_hours: 5,
    });
    expect(errors.screen_time_hours).toBeDefined();
  });
});

describe("PredictionForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders all three sections", () => {
    render(
      <MemoryRouter>
        <PredictionForm />
      </MemoryRouter>
    );
    expect(screen.getByText("Personal Information")).toBeInTheDocument();
    expect(screen.getByText("Screen Time")).toBeInTheDocument();
    expect(screen.getByText("Lifestyle")).toBeInTheDocument();
  });

  it("shows an API error message when the request fails", async () => {
    vi.spyOn(api, "predictWellness").mockRejectedValue(
      new api.ApiError("Prediction failed due to an internal error.", 500)
    );

    render(
      <MemoryRouter>
        <PredictionForm />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /predict my wellness/i }));

    expect(await screen.findByText(/prediction failed/i)).toBeInTheDocument();
  });
});
