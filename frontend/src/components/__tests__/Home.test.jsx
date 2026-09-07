import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Home from "../Home.jsx";

describe("Home", () => {
  it("renders the title, subtitle and CTA button", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText("ScreenWise")).toBeInTheDocument();
    expect(
      screen.getByText(/Understand your digital lifestyle/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /check my wellness/i })).toBeInTheDocument();
  });
});
