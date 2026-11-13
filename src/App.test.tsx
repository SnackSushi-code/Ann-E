import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

const { invokeMock } = vi.hoisted(() => ({ invokeMock: vi.fn() }));

vi.mock("@tauri-apps/api/core", () => ({ invoke: invokeMock }));

describe("Ann-E desktop shell", () => {
  beforeEach(() => invokeMock.mockReset());
  afterEach(() => cleanup());

  it("shows a pending state until the local runtime responds", () => {
    let releaseRequest: (status: { application: string; state: string; version: string }) => void = () => undefined;
    invokeMock.mockReturnValue(
      new Promise((resolve) => {
        releaseRequest = resolve;
      }),
    );

    render(<App />);

    const pendingStatus = screen.queryByText("Checking local runtime");
    releaseRequest({ application: "Ann-E", state: "ready", version: "0.1.0" });
    expect(pendingStatus).toBeTruthy();
  });

  it("shows connected only after the local runtime reports ready", async () => {
    invokeMock.mockResolvedValue({
      application: "Ann-E",
      state: "ready",
      version: "0.1.0",
    });

    render(<App />);

    expect(await screen.findByText("Local runtime connected")).toBeTruthy();
    expect(
      screen.getByText(
        "The local Rust runtime is connected. Model providers and computer-control tools are not connected in this build.",
      ),
    ).toBeTruthy();
    expect(invokeMock).toHaveBeenCalledWith("get_runtime_status");
  });

  it("does not label an unexpected runtime response as connected", async () => {
    invokeMock.mockResolvedValue({
      application: "Ann-E",
      state: "starting",
      version: "0.1.0",
    });

    render(<App />);

    expect(await screen.findByText("Could not reach the local runtime")).toBeTruthy();
    expect(
      screen.getByText(/the local Rust runtime did not respond/i),
    ).toBeTruthy();
  });
});
