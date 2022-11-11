use tauri::SystemTray;
use tauri::{CustomMenuItem, SystemTrayMenu, SystemTrayMenuItem};

pub fn create_menu(title: &str) -> SystemTrayMenu {
  let title = CustomMenuItem::new("title".to_string(), title);
  let quit = CustomMenuItem::new("quit".to_string(), "Quit");

  return SystemTrayMenu::new()
    .add_item(title)
    .add_native_item(SystemTrayMenuItem::Separator)
    .add_item(quit);
}

pub fn setup() -> SystemTray {
  return SystemTray::new().with_menu(create_menu("Loading..."));
}
