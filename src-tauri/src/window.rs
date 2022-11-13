use tauri::{self, Manager};

pub fn focus_or_create(handle: &tauri::AppHandle, label: &str, url: &str) {
  let window = match handle.get_window(label) {
    Some(window) => window,
    None => match tauri::WindowBuilder::new(
      handle,
      label,
      tauri::WindowUrl::App(url.into())
    ).build() {
      Err(why) => {
        println!("Error building window: {:?}", why);
        return
      },
      Ok(window) => window,
    },
  };

  match window.set_resizable(false) {
    Err(why) => println!("Error setting window property: {:?}", why),
    Ok(_) => (),
  };
  match window.set_title("") {
    Err(why) => println!("Error setting window title: {:?}", why),
    Ok(_) => (),
  };
  match window.center() {
    Err(why) => println!("Error centering window: {:?}", why),
    Ok(_) => (),
  };
  match window.unminimize() {
    Err(why) => println!("Error unminimizing window: {:?}", why),
    Ok(_) => (),
  };
  match window.set_focus() {
    Err(why) => println!("Error focusing window: {:?}", why),
    Ok(_) => (),
  };
}
