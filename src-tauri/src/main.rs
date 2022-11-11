#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::{thread, time, path::PathBuf};
use wallpaper;
use tauri::SystemTrayEvent;
use std::path::{Path};

mod api;
mod tray;
mod window;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
  format!("Hello, {}! You've been greeted from Rust!", name)
}

fn sleep(duration: u64) {
  thread::sleep(time::Duration::from_secs(duration));
}

fn set_artwork_loop(appdir: &Path) {
  println!("path {:?}", appdir);

  let interval = 5;
  let mut artworks: Vec<api::Artwork> = Vec::with_capacity(0);
  let mut last_path = PathBuf::new();

  loop {
    if artworks.len() == 0 {
      artworks = match api::fetch_list() {
        Ok(results) => results,
        Err(_) => Vec::with_capacity(0),
      };
    }

    if artworks.len() == 0 {
      continue;
    }

    let artwork = artworks.pop().expect("Error popping artwork off array.");

    let ok = api::fetch_image(&artwork.image_url, &appdir, &artwork.file);

    if !ok {
      sleep(interval);
      continue;
    }

    println!("file: {:?}", artwork.file);

    let path = appdir.join(artwork.file);

    wallpaper::set_from_path(&String::from(path.to_string_lossy())).expect("Error setting wallpaper.");
    // wallpaper::set_mode(wallpaper::Mode::Crop).expect("Error setting wallpaper mode.");

    match last_path.to_str() {
      Some(str) => if str != "" {
        api::delete_file(&last_path);
        ()
      },
      None => ()
    }

    last_path = path;

    sleep(interval);
  }
}

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      let appdir = app.path_resolver().app_dir().unwrap().as_path().to_owned();
      let _handler = thread::spawn(move || {
        set_artwork_loop(&appdir);
      });
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![greet])
    .system_tray(tray::setup())
    .on_system_tray_event(|app, event| match event {
      SystemTrayEvent::MenuItemClick { id, .. } => {
        match id.as_str() {
          "quit" => std::process::exit(0),
          "favorites" => window::create(app, "index.html"),
          _ => {}
        }
      }
      _ => {}
    })
    .run(tauri::generate_context!())
    .expect("error while running Galeri");
}
