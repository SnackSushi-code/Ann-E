import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

type Message = { role: "you" | "gemini"; text: string };
type ProviderState = "checking" | "not-configured" | "saved" | "connected" | "error";

function GeminiPanel() {
  const [apiKey, setApiKey] = useState("");
  const [hasSavedKey, setHasSavedKey] = useState(false);
  const [providerState, setProviderState] = useState<ProviderState>("checking");
  const [feedback, setFeedback] = useState("");
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBusy, setIsBusy] = useState(false);

  function errorMessage(error: unknown, fallback: string) {
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message;
    return fallback;
  }

  useEffect(() => {
    let isActive = true;

    invoke<boolean>("get_gemini_key_status")
      .then((configured) => {
        if (!isActive) return;
        setHasSavedKey(configured);
        setProviderState(configured ? "saved" : "not-configured");
      })
      .catch((error: unknown) => {
        if (!isActive) return;
        setProviderState("error");
        setFeedback(errorMessage(error, "Could not check the Windows credential store."));
      });

    return () => {
      isActive = false;
    };
  }, []);

  async function saveKey() {
    setIsBusy(true);
    setFeedback("");
    try {
      await invoke("save_gemini_api_key", { apiKey });
      setApiKey("");
      setHasSavedKey(true);
      setProviderState("saved");
      setFeedback("Key saved on this Windows account. Test it before using Gemini.");
    } catch (error) {
      setProviderState("error");
      setFeedback(errorMessage(error, "Could not save the API key."));
    } finally {
      setIsBusy(false);
    }
  }

  async function testConnection() {
    setIsBusy(true);
    setFeedback("Sending a short test request to Gemini…");
    try {
      const model = await invoke<string>("test_gemini_connection");
      setProviderState("connected");
      setFeedback(`Gemini connected · ${model}`);
    } catch (error) {
      setProviderState("error");
      setFeedback(errorMessage(error, "Gemini could not be reached."));
    } finally {
      setIsBusy(false);
    }
  }

  async function clearKey() {
    if (!window.confirm("Remove the Gemini API key saved for this Windows account?")) return;

    setIsBusy(true);
    setFeedback("");
    try {
      await invoke("clear_gemini_api_key");
      setHasSavedKey(false);
      setProviderState("not-configured");
      setMessages([]);
      setFeedback("Saved Gemini key removed from Windows Credential Manager.");
    } catch (error) {
      setProviderState("error");
      setFeedback(errorMessage(error, "Could not remove the API key."));
    } finally {
      setIsBusy(false);
    }
  }

  async function sendPrompt() {
    const text = prompt.trim();
    if (!text || isBusy) return;

    setPrompt("");
    setMessages((current) => [...current, { role: "you", text }]);
    setIsBusy(true);
    setFeedback("");
    try {
      const conversation = [...messages, { role: "you" as const, text }].slice(-20);
      const providerMessages = conversation.map((message) => ({
        role: message.role === "you" ? "user" : "model",
        text: message.text,
      }));
      const reply = await invoke<string>("chat_with_gemini", { messages: providerMessages });
      setMessages((current) => [...current, { role: "gemini", text: reply }]);
      setProviderState("connected");
    } catch (error) {
      setFeedback(errorMessage(error, "Gemini could not answer the request."));
    } finally {
      setIsBusy(false);
    }
  }

  const providerMessage = {
    checking: "Checking saved credentials…",
    "not-configured": "Add a Gemini API key to get started.",
    saved: "Key saved. Test the connection before asking Gemini.",
    connected: "Gemini has answered a real request.",
    error: "There was a problem with the Gemini connection.",
  }[providerState];

  return (
    <section className="provider-card" aria-labelledby="gemini-title">
      <div className="provider-heading">
        <div>
          <p className="eyebrow">MODEL PROVIDER · FIRST INTEGRATION</p>
          <h2 id="gemini-title">Google Gemini</h2>
        </div>
        <div className={`provider-status provider-status--${providerState}`} role="status" aria-live="polite">
          <span className="status-dot" aria-hidden="true" />
          <span>{providerMessage}</span>
        </div>
      </div>

      <div className="provider-key-controls">
        <label htmlFor="gemini-api-key">Gemini API key</label>
        <div className="provider-key-row">
          <input
            id="gemini-api-key"
            type="password"
            autoComplete="new-password"
            spellCheck={false}
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            placeholder="Paste a key from Google AI Studio"
            aria-describedby="gemini-key-help"
          />
          <button type="button" onClick={saveKey} disabled={isBusy || !apiKey.trim()}>
            Save key
          </button>
        </div>
        <p id="gemini-key-help" className="provider-help">
          The key is sent to the local Rust process, stored in Windows Credential Manager, and never shown again.
        </p>
        {hasSavedKey && (
          <div className="provider-actions">
            <button type="button" onClick={testConnection} disabled={isBusy}>
              Test Gemini connection
            </button>
            <button type="button" className="button-secondary" onClick={clearKey} disabled={isBusy}>
              Remove saved key
            </button>
          </div>
        )}
      </div>

      {feedback && <p className="provider-feedback" aria-live="polite">{feedback}</p>}

      <div className="chat-panel">
        <div className="chat-messages" aria-live="polite" aria-label="Conversation with Gemini">
          {messages.length === 0 ? (
            <p className="provider-help">Your Gemini replies will appear here. Each message is sent to Google when you choose Send.</p>
          ) : messages.map((message, index) => (
            <p className={`chat-message chat-message--${message.role}`} key={`${message.role}-${index}`}>
              <strong>{message.role === "you" ? "You" : "Gemini"}</strong>
              <span>{message.text}</span>
            </p>
          ))}
        </div>
        <form onSubmit={(event) => { event.preventDefault(); void sendPrompt(); }} className="chat-composer">
          <label className="visually-hidden" htmlFor="gemini-prompt">Message Gemini</label>
          <textarea
            id="gemini-prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Ask Gemini a question…"
            rows={2}
            maxLength={12_000}
            disabled={!hasSavedKey || isBusy}
          />
          <button type="submit" disabled={!hasSavedKey || isBusy || !prompt.trim()}>
            {isBusy ? "Working…" : "Send"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default GeminiPanel;
