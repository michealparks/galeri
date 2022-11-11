use tauri;

pub fn create(manager: &tauri::AppHandle, url: &str) {
  let _window = tauri::WindowBuilder::new(
    manager,
    "local",
    tauri::WindowUrl::App(url.into())
  ).build().expect("failed to build window");
}

