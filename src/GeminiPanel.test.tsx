import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import GeminiPanel from "./GeminiPanel";

const { invokeMock } = vi.hoisted(() => ({ invokeMock: vi.fn() }));

vi.mock("@tauri-apps/api/core", () => ({ invoke: invokeMock }));

describe("Gemini provider panel", () => {
  beforeEach(() => {
    invokeMock.mockReset();
    invokeMock.mockResolvedValue(false);
  });

  afterEach(() => cleanup());

  it("stores an API key without displaying it again", async () => {
    invokeMock.mockImplementation((command: string) => {
      if (command === "get_gemini_key_status") return Promise.resolve(false);
      if (command === "save_gemini_api_key") return Promise.resolve(undefined);
      return Promise.reject(new Error(`Unexpected command: ${command}`));
    });

    render(<GeminiPanel />);

    const keyField = await screen.findByLabelText("Gemini API key");
    expect(keyField.getAttribute("type")).toBe("password");
    fireEvent.change(keyField, { target: { value: "sample-key-never-commit" } });
    fireEvent.click(screen.getByRole("button", { name: "Save key" }));

    await waitFor(() => expect(invokeMock).toHaveBeenCalledWith("save_gemini_api_key", {
      apiKey: "sample-key-never-commit",
    }));
    await waitFor(() => expect(screen.getByText(/Key saved on this Windows account/)));
    expect((keyField as HTMLInputElement).value).toBe("");
    expect(screen.queryByText("sample-key-never-commit")).toBeNull();
  });

  it("reports Gemini connected only after a real provider check resolves", async () => {
    invokeMock.mockImplementation((command: string) => {
      if (command === "get_gemini_key_status") return Promise.resolve(true);
      if (command === "test_gemini_connection") return Promise.resolve("gemini-3.8-flash");
      return Promise.reject(new Error(`Unexpected command: ${command}`));
    });

    render(<GeminiPanel />);

    fireEvent.click(await screen.findByRole("button", { name: "Test Gemini connection" }));

    expect(await screen.findByText("Gemini connected · gemini-3.8-flash")).toBeTruthy();
    expect(invokeMock).toHaveBeenCalledWith("test_gemini_connection");
  });

  it("keeps the saved key when the removal confirmation is cancelled", async () => {
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
    invokeMock.mockImplementation((command: string) => {
      if (command === "get_gemini_key_status") return Promise.resolve(true);
      return Promise.reject(new Error(`Unexpected command: ${command}`));
    });

    render(<GeminiPanel />);
    fireEvent.click(await screen.findByRole("button", { name: "Remove saved key" }));

    expect(confirm).toHaveBeenCalledOnce();
    expect(invokeMock).not.toHaveBeenCalledWith("clear_gemini_api_key");
    confirm.mockRestore();
  });

  it("sends the prompt through the local runtime and displays its reply", async () => {
    invokeMock.mockImplementation((command: string, args?: { messages?: Array<{ role: string; text: string }> }) => {
      if (command === "get_gemini_key_status") return Promise.resolve(true);
      if (command === "chat_with_gemini") {
        const latestMessage = args?.messages?.[args.messages.length - 1];
        return Promise.resolve(`Reply to: ${latestMessage?.text ?? ""}`);
      }
      return Promise.reject(new Error(`Unexpected command: ${command}`));
    });

    render(<GeminiPanel />);

    fireEvent.change(await screen.findByLabelText("Message Gemini"), {
      target: { value: "Explain a resistor." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(await screen.findByText("Reply to: Explain a resistor.")).toBeTruthy();
    expect(invokeMock).toHaveBeenCalledWith("chat_with_gemini", {
      messages: [{ role: "user", text: "Explain a resistor." }],
    });
  });
});
