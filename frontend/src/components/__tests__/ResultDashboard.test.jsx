import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { describe, it, expect } from "vitest";
import ResultDashboard from "../ResultDashboard.jsx";

function renderWithState(state) {
  const router = createMemoryRouter(
    [{ path: "/result", element: <ResultDashboard /> }],
    { initialEntries: [{ pathname: "/result", state }] }
  );
  return render(<RouterProvider router={router} />);
}

describe("ResultDashboard", () => {
  it("shows a fallback when there is no result in navigation state", () => {
    renderWithState(undefined);
    expect(screen.getByText("No result to show")).toBeInTheDocument();
  });

  it("renders the prediction, score, and top factors", () => {
    renderWithState({
      result: {
        prediction: "Moderate",
        score: 55.3,
        confidence: 0.72,
        top_factors: [
          { feature: "sleep_hours", importance: 0.3 },
          { feature: "screen_time_hours", importance: 0.2 },
        ],
      },
      form: {},
    });

    expect(screen.getByText("Moderate")).toBeInTheDocument();
    expect(screen.getByText("55.3/100")).toBeInTheDocument();
    expect(screen.getByText("72%")).toBeInTheDocument();
    expect(screen.getByText("Sleep Hours")).toBeInTheDocument();
  });
});
