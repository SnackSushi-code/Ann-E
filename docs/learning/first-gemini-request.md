# Following the first Gemini request

This guide follows one message through the parts of Ann-E that handle it. The goal is to make the first provider connection easier to understand and change later.

## The short version

```text
GeminiPanel.tsx
  -> Tauri command (chat_with_gemini)
  -> Rust provider module
  -> Windows Credential Manager (read the saved key)
  -> Gemini Interactions API over HTTPS
  -> Rust reads the response
  -> Tauri returns reply text to the screen
```

## What each file does

- `src/GeminiPanel.tsx` draws the key field and chat area. When you press **Save key**, it sends the entered value to a Rust command, then clears the field. It does not write the key to browser storage.
- `src-tauri/src/lib.rs` registers the Rust commands that the desktop webview may call.
- `src-tauri/capabilities/default.json` lists those commands as the webview's allowed permissions. The app still does not get file, shell, browser, or desktop-control access.
- `src-tauri/src/providers/gemini.rs` validates input, reads or updates the key in Windows Credential Manager, sends the HTTPS request, and converts Gemini's response into plain text.
- `.github/workflows/windows-checks.yml` runs the same frontend and Rust checks on a Windows GitHub runner and builds the desktop app without creating an installer.

## Why the key goes through Rust

The API key is a secret. The frontend only holds the value while you enter it and passes it to the local app. The Rust process stores it using the Windows Credential Manager, and later reads it locally to add it to a marked-sensitive HTTPS header. Redirects are disabled so the key is not forwarded to another host. Ann-E never returns the saved value to the screen, puts it in a URL, or writes it to the repository.

The key is still used to authenticate with Google, so Google receives the request and can associate it with your API account. The app sends a request only when you test the connection or press **Send**. Gemini requests set `store: false`. To keep follow-up questions in context without asking the API to store a session, the app sends up to the most recent 20 chat messages with each message. The chat is kept in the open app window and is lost when you close the app.

## Try it on Windows

1. Create or copy a Gemini API key in [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Start Ann-E with `npm run tauri dev`.
3. Paste the key into the password field and choose **Save key**.
4. Choose **Test Gemini connection**. This makes a real short API request; Ann-E shows connected only after Gemini responds successfully.
5. Type a question and choose **Send** to make another request.

API usage may have costs or limits under your Google account. The test button sends a short prompt and the chat button sends the message you wrote.

## Change the model or provider

The starter keeps the model name and endpoint beside the provider request code in `src-tauri/src/providers/gemini.rs`. The UI calls a small Tauri command instead of knowing the Gemini HTTP details. This boundary is what will let us add another provider adapter later without making the screen responsible for credentials or vendor-specific API rules.
