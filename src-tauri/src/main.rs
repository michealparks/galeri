#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::path::{Path};
use std::{thread, time, path::PathBuf};
use tauri::SystemTrayEvent;
use wallpaper;
use webbrowser;

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

fn set_artwork_loop(appdir: &Path, handle: &tauri::AppHandle) {
  println!("path {:?}", appdir);

  let interval = 5; // One hour.
  let error_interval = 30;
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
      sleep(error_interval);
      continue;
    }

    let artwork = artworks.pop().expect("Error popping artwork off array.");

    let ok = api::fetch_image(&artwork.image_url, &appdir, &artwork.file);

    if !ok {
      sleep(error_interval);
      continue;
    }

    let path = appdir.join(artwork.file);

    match wallpaper::set_from_path(&String::from(path.to_string_lossy())) {
      Ok(_) => (),
      Err(_) => continue,
    }
  
    wallpaper::set_mode(wallpaper::Mode::Center);

    let tray_handle = handle.tray_handle();
    tray_handle.set_menu(tray::create_menu(&artwork.title));

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
    .setup(move |app| {
      let handle = app.handle();
      let appdir = app.path_resolver().app_dir().expect("Error getting appdir").as_path().to_owned();

      thread::spawn(move || {
        set_artwork_loop(&appdir, &handle);
      });

      tray::setup().on_event(|event| {
        match event {
          SystemTrayEvent::MenuItemClick { id, .. } => {
            match id.as_str() {
              "quit" => std::process::exit(0),
              "title" => {
                webbrowser::open("http://github.com");
                return;
              },
              // "favorites" => window::create(&app.handle(), "index.html"),
              _ => (),
            }
          }
          _ => {}
        }
      })
      .build(app)?;

      Ok(())
    })
    .invoke_handler(tauri::generate_handler![greet])
    .run(tauri::generate_context!())
    .expect("error while running Galeri");
}
