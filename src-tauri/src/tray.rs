use tauri::SystemTray;
use tauri::{CustomMenuItem, SystemTrayMenu, SystemTrayMenuItem};

const MAX_TITLE_LEN: usize = 20;

fn truncate(s: &str, max_chars: usize) -> String {
  match s.char_indices().nth(max_chars) {
    None => String::from(s),
    Some((idx, _)) => [&s[..idx], "..."].join(""),
  }
}

pub fn create_menu(title: &str) -> SystemTrayMenu {
  let galeri = CustomMenuItem::new("galeri".to_string(), "Galeri").disabled();
  let title = CustomMenuItem::new("title".to_string(), truncate(title, MAX_TITLE_LEN));
  // let next = CustomMenuItem::new("next".to_string(), "Next artwork");
  let about = CustomMenuItem::new("about".to_string(), "About");
  let quit = CustomMenuItem::new("quit".to_string(), "Quit");

  return SystemTrayMenu::new()
    .add_item(galeri)
    .add_native_item(SystemTrayMenuItem::Separator)
    .add_item(title)
    // .add_item(next)
    .add_native_item(SystemTrayMenuItem::Separator)
    .add_item(about)
    .add_item(quit);
}

pub fn set_menu_item(app_handle: &tauri::AppHandle, id: &str, title: &str) {
  let item_handle = app_handle.tray_handle().get_item(id);
  match item_handle.set_title(truncate(title, MAX_TITLE_LEN)) {
    Err(why) => println!("Error setting menu item title {:?}", why),
    Ok(_) => (),
  }
}

pub fn setup() -> SystemTray {
  return SystemTray::new()
    .with_id("main-tray")
    .with_menu(create_menu("Loading..."));
}