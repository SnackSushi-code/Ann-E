use keyring::{Entry, Error as KeyringError};
use reqwest::{Client, StatusCode};
use serde::Deserialize;
use serde_json::{Value, json};
use std::time::Duration;

const CREDENTIAL_SERVICE: &str = "com.snacksushi.anne";
const CREDENTIAL_NAME: &str = "google-gemini-api-key";
const GEMINI_ENDPOINT: &str = "https://generativelanguage.googleapis.com/v1/interactions";
const GEMINI_MODEL: &str = "gemini-3.8-flash";
const MAX_API_KEY_LENGTH: usize = 512;
const MAX_PROMPT_LENGTH: usize = 12_000;
const MAX_CONVERSATION_MESSAGES: usize = 20;
const MAX_CONVERSATION_LENGTH: usize = 32_000;

fn credential_entry() -> Result<Entry, String> {
    Entry::new(CREDENTIAL_SERVICE, CREDENTIAL_NAME)
        .map_err(|_| "Could not access Windows Credential Manager.".to_owned())
}

fn read_api_key() -> Result<String, String> {
    match credential_entry()?.get_password() {
        Ok(api_key) => Ok(api_key),
        Err(KeyringError::NoEntry) => {
            Err("No Gemini API key is saved. Add your key first.".to_owned())
        }
        Err(_) => Err("Could not read the key from Windows Credential Manager.".to_owned()),
    }
}

fn validate_api_key(api_key: &str) -> Result<&str, String> {
    let api_key = api_key.trim();
    if api_key.is_empty() {
        return Err("Enter a Gemini API key before saving.".to_owned());
    }
    if api_key.len() > MAX_API_KEY_LENGTH || api_key.chars().any(char::is_whitespace) {
        return Err("The Gemini API key has an unexpected format.".to_owned());
    }
    Ok(api_key)
}

fn validate_prompt(prompt: &str) -> Result<&str, String> {
    let prompt = prompt.trim();
    if prompt.is_empty() {
        return Err("Enter a message before sending it to Gemini.".to_owned());
    }
    if prompt.chars().count() > MAX_PROMPT_LENGTH {
        return Err(format!(
            "Keep messages under {MAX_PROMPT_LENGTH} characters."
        ));
    }
    Ok(prompt)
}

fn validate_messages(messages: &[ChatTurn]) -> Result<(), String> {
    if messages.is_empty() || messages.len() > MAX_CONVERSATION_MESSAGES {
        return Err("Gemini conversations must contain between 1 and 20 messages.".to_owned());
    }
    if !matches!(messages.last().map(|turn| &turn.role), Some(ChatRole::User)) {
        return Err("The latest Gemini conversation message must come from you.".to_owned());
    }

    let mut total_length = 0;
    for message in messages {
        let text = validate_prompt(&message.text)?;
        total_length += text.chars().count();
        if total_length > MAX_CONVERSATION_LENGTH {
            return Err(
                "This conversation is too long to send. Start a new conversation.".to_owned(),
            );
        }
    }
    Ok(())
}

#[tauri::command]
pub fn get_gemini_key_status() -> Result<bool, String> {
    match credential_entry()?.get_password() {
        Ok(_) => Ok(true),
        Err(KeyringError::NoEntry) => Ok(false),
        Err(_) => Err("Could not check Windows Credential Manager.".to_owned()),
    }
}

#[tauri::command]
pub fn save_gemini_api_key(api_key: String) -> Result<(), String> {
    let api_key = validate_api_key(&api_key)?;

    credential_entry()?
        .set_password(api_key)
        .map_err(|_| "Could not save the key to Windows Credential Manager.".to_owned())
}

#[tauri::command]
pub fn clear_gemini_api_key() -> Result<(), String> {
    match credential_entry()?.delete_credential() {
        Ok(()) | Err(KeyringError::NoEntry) => Ok(()),
        Err(_) => Err("Could not remove the key from Windows Credential Manager.".to_owned()),
    }
}

#[tauri::command]
pub async fn test_gemini_connection() -> Result<String, String> {
    let api_key = read_api_key()?;
    let message = ChatTurn {
        role: ChatRole::User,
        text: "Reply with the single word READY.".to_owned(),
    };
    generate_text(&api_key, &[message]).await?;
    Ok(GEMINI_MODEL.to_owned())
}

#[tauri::command]
pub async fn chat_with_gemini(messages: Vec<ChatTurn>) -> Result<String, String> {
    validate_messages(&messages)?;

    let api_key = read_api_key()?;
    generate_text(&api_key, &messages).await
}

async fn generate_text(api_key: &str, messages: &[ChatTurn]) -> Result<String, String> {
    let client = Client::builder()
        .timeout(Duration::from_secs(45))
        .redirect(reqwest::redirect::Policy::none())
        .build()
        .map_err(|_| "Could not prepare a secure Gemini connection.".to_owned())?;

    let mut api_key_header = reqwest::header::HeaderValue::from_str(api_key)
        .map_err(|_| "The saved Gemini API key could not be prepared.".to_owned())?;
    api_key_header.set_sensitive(true);

    let response = client
        .post(GEMINI_ENDPOINT)
        .header("x-goog-api-key", api_key_header)
        .json(&interaction_request(messages))
        .send()
        .await
        .map_err(|error| {
            if error.is_timeout() {
                "Gemini did not respond before the 45-second timeout.".to_owned()
            } else {
                "Could not reach the Gemini API. Check your internet connection.".to_owned()
            }
        })?;

    let status = response.status();
    if !status.is_success() {
        return Err(provider_error(status));
    }

    let interaction = response
        .json::<InteractionResponse>()
        .await
        .map_err(|_| "Gemini returned a response Ann-E could not read.".to_owned())?;
    interaction.reply()
}

fn interaction_request(messages: &[ChatTurn]) -> Value {
    json!({
        "model": GEMINI_MODEL,
        "input": messages.iter().map(|message| json!({
            "type": message.role.step_type(),
            "content": [{ "type": "text", "text": message.text }]
        })).collect::<Vec<_>>(),
        "store": false
    })
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ChatRole {
    User,
    Model,
}

impl ChatRole {
    fn step_type(&self) -> &'static str {
        match self {
            Self::User => "user_input",
            Self::Model => "model_output",
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct ChatTurn {
    role: ChatRole,
    text: String,
}

fn provider_error(status: StatusCode) -> String {
    match status {
        StatusCode::UNAUTHORIZED | StatusCode::FORBIDDEN => {
            "Gemini rejected the saved API key. Check the key and its API access.".to_owned()
        }
        StatusCode::TOO_MANY_REQUESTS => {
            "Gemini is rate-limiting requests. Wait a moment and try again.".to_owned()
        }
        _ => format!(
            "Gemini request failed with HTTP status {}.",
            status.as_u16()
        ),
    }
}

#[derive(Debug, Deserialize)]
struct InteractionResponse {
    status: String,
    steps: Vec<InteractionStep>,
}

#[derive(Debug, Deserialize)]
struct InteractionStep {
    #[serde(rename = "type")]
    step_type: String,
    #[serde(default)]
    content: Vec<InteractionContent>,
}

#[derive(Debug, Deserialize)]
struct InteractionContent {
    #[serde(rename = "type")]
    content_type: Option<String>,
    text: Option<String>,
}

impl InteractionResponse {
    fn reply(self) -> Result<String, String> {
        if self.status != "completed" {
            return Err("Gemini did not complete the response. Try again.".to_owned());
        }

        let reply = self
            .steps
            .into_iter()
            .filter(|step| step.step_type == "model_output")
            .flat_map(|step| step.content)
            .filter(|part| part.content_type.as_deref() == Some("text"))
            .filter_map(|part| part.text)
            .collect::<Vec<_>>()
            .join("");

        if reply.trim().is_empty() {
            return Err("Gemini completed the request without a text reply.".to_owned());
        }

        Ok(reply)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn interaction_request_disables_server_storage() {
        let request = interaction_request(&[ChatTurn {
            role: ChatRole::User,
            text: "Explain a resistor.".to_owned(),
        }]);

        assert_eq!(request["model"], GEMINI_MODEL);
        assert_eq!(request["input"][0]["type"], "user_input");
        assert_eq!(
            request["input"][0]["content"][0]["text"],
            "Explain a resistor."
        );
        assert_eq!(request["store"], false);
    }

    #[test]
    fn conversation_request_keeps_user_and_model_turns_in_order() {
        let request = interaction_request(&[
            ChatTurn {
                role: ChatRole::User,
                text: "I am building a circuit.".to_owned(),
            },
            ChatTurn {
                role: ChatRole::Model,
                text: "What voltage are you using?".to_owned(),
            },
            ChatTurn {
                role: ChatRole::User,
                text: "Five volts.".to_owned(),
            },
        ]);

        assert_eq!(request["input"][0]["type"], "user_input");
        assert_eq!(request["input"][1]["type"], "model_output");
        assert_eq!(request["input"][2]["type"], "user_input");
    }

    #[test]
    fn completed_interaction_returns_only_model_text() {
        let response: InteractionResponse = serde_json::from_value(json!({
            "status": "completed",
            "steps": [
                { "type": "user_input", "content": [{ "type": "text", "text": "hello" }] },
                { "type": "model_output", "content": [{ "type": "text", "text": "A resistor limits current." }] }
            ]
        }))
        .unwrap();

        assert_eq!(response.reply().unwrap(), "A resistor limits current.");
    }

    #[test]
    fn incomplete_interaction_is_not_returned_as_a_success() {
        let response: InteractionResponse = serde_json::from_value(json!({
            "status": "in_progress",
            "steps": []
        }))
        .unwrap();

        assert_eq!(
            response.reply().unwrap_err(),
            "Gemini did not complete the response. Try again."
        );
    }

    #[test]
    fn api_key_validation_trims_outer_space_and_rejects_empty_values() {
        assert_eq!(validate_api_key("  example-key  ").unwrap(), "example-key");
        assert!(validate_api_key("  \t ").is_err());
        assert!(validate_api_key("key with spaces").is_err());
    }

    #[test]
    fn prompt_validation_trims_text_and_enforces_the_size_limit() {
        assert_eq!(
            validate_prompt("  Explain a resistor.  ").unwrap(),
            "Explain a resistor."
        );
        assert!(validate_prompt(" \n ").is_err());
        assert!(validate_prompt(&"x".repeat(MAX_PROMPT_LENGTH + 1)).is_err());
    }

    #[test]
    fn conversation_validation_requires_a_user_turn_and_bounds_context() {
        let valid = vec![ChatTurn {
            role: ChatRole::User,
            text: "hello".to_owned(),
        }];
        assert!(validate_messages(&valid).is_ok());

        let model_last = vec![ChatTurn {
            role: ChatRole::Model,
            text: "hello".to_owned(),
        }];
        assert!(validate_messages(&model_last).is_err());

        let too_many = (0..=MAX_CONVERSATION_MESSAGES)
            .map(|_| ChatTurn {
                role: ChatRole::User,
                text: "hello".to_owned(),
            })
            .collect::<Vec<_>>();
        assert!(validate_messages(&too_many).is_err());
    }
}
