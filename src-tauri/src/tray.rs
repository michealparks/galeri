use tauri::SystemTray;
use tauri::{CustomMenuItem, SystemTrayMenu, SystemTrayMenuItem};

fn truncate(s: &str, max_chars: usize) -> String {
  match s.char_indices().nth(max_chars) {
      None => String::from(s),
      Some((idx, _)) => [&s[..idx], "..."].join(""),
  }
}

pub fn create_menu(title: &str) -> SystemTrayMenu {
  let title = CustomMenuItem::new("title".to_string(), truncate(title, 50));
  let quit = CustomMenuItem::new("quit".to_string(), "Quit");

  return SystemTrayMenu::new()
    .add_item(title)
    .add_native_item(SystemTrayMenuItem::Separator)
    .add_item(quit);
}

pub fn setup() -> SystemTray {
  return SystemTray::new()
    .with_id("main-tray")
    .with_menu(create_menu("Loading..."));
}
