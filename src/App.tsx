import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

type RuntimeStatus = {
  application: string;
  state: "ready";
  version: string;
};

type RuntimeState = "checking" | "connected" | "unavailable";

function App() {
  const [runtimeState, setRuntimeState] = useState<RuntimeState>("checking");

  useEffect(() => {
    let isActive = true;

    invoke<RuntimeStatus>("get_runtime_status")
      .then((status) => {
        if (!isActive) return;
        setRuntimeState(
          status.application === "Ann-E" && status.state === "ready"
            ? "connected"
            : "unavailable",
        );
      })
      .catch(() => {
        if (isActive) setRuntimeState("unavailable");
      });

    return () => {
      isActive = false;
    };
  }, []);

  const runtimeMessage = {
    checking: "Checking local runtime",
    connected: "Local runtime connected",
    unavailable: "Could not reach the local runtime",
  }[runtimeState];

  const runtimeDescription = {
    checking: "Waiting for the local Rust runtime to respond.",
    connected:
      "The local Rust runtime is connected. Model providers and computer-control tools are not connected in this build.",
    unavailable:
      "The desktop shell is open, but the local Rust runtime did not respond. Model providers and computer-control tools are not connected in this build.",
  }[runtimeState];

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Ann-E home">
          <span className="brand-mark" aria-hidden="true">A</span>
          <span className="brand-copy">
            <strong>Ann-E</strong>
            <span>ENGINEERING AI</span>
          </span>
        </a>
        <div className="build-label">WINDOWS DESKTOP · FIRST BUILD</div>
      </header>

      <main id="home" className="workspace">
        <section className="intro" aria-labelledby="page-title">
          <p className="eyebrow">YOUR ENGINEERING WORKSPACE</p>
          <h1 id="page-title">Make the next hard thing easier to solve.</h1>
          <p className="intro-copy">
            A clear place to research, plan, and build technical projects, one
            verified step at a time.
          </p>
        </section>

        <section className="foundation-card" aria-labelledby="foundation-title">
          <div className="foundation-topline">
            <span className="foundation-icon" aria-hidden="true">01</span>
            <span className="eyebrow">THE FIRST BUILD</span>
          </div>
          <div className="foundation-content">
            <div>
              <h2 id="foundation-title">A small, solid foundation.</h2>
              <p>{runtimeDescription}</p>
            </div>
            <div
              className={`runtime-status runtime-status--${runtimeState}`}
              role="status"
              aria-live="polite"
            >
              <span className="status-dot" aria-hidden="true" />
              <span>{runtimeMessage}</span>
            </div>
          </div>
          <div className="foundation-footer">
            <span>LOCAL DESKTOP CORE</span>
            <span>NO PROVIDER OR COMPUTER ACCESS ENABLED</span>
          </div>
        </section>

        <footer className="workspace-footer">
          <span>Built to keep the user in control.</span>
          <span>Ann-E is under active development.</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
