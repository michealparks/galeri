#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::path::{Path};
use std::{thread, time, path::PathBuf};
use tauri::{SystemTrayEvent};
use webbrowser;

mod api;
mod autolaunch;
mod files;
mod tray;
mod wallpaper;
mod window;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
  format!("Hello, {}! You've been greeted from Rust!", name)
}

fn sleep(duration: u64) {
  thread::sleep(time::Duration::from_secs(duration));
}

fn start_artwork_loop(appdir: &Path, handle: &tauri::AppHandle) {
  let binding = appdir.join(&"images");
  let artpath = binding.as_path();

  files::delete_dir(artpath);

  let interval = 5; // 60 * 60; // One hour.
  let error_interval = 30;
  let mut artworks: Vec<api::Artwork> = Vec::with_capacity(0);
  let mut last_path = PathBuf::new();

  loop {
    if artworks.len() == 0 {
      artworks = api::fetch_list();
    }

    if artworks.len() == 0 {
      sleep(error_interval);
      continue;
    }

    let artwork = artworks.pop().expect("Error popping artwork off array.");

    let ok = api::fetch_image(&artwork.image_url, &artpath, &artwork.file.clone());

    if !ok {
      sleep(error_interval);
      continue;
    }

    let path = artpath.join(&artwork.file);

    if wallpaper::set(&path) == false {
      continue;
    }

    let tray_handle = handle.tray_handle();
    match tray_handle.set_menu(tray::create_menu(&artwork.title)) {
      Err(why) => println!("Error setting tray menu: {:?}", why),
      Ok(_) => (),
    };

    api::write_json_file(appdir.join("current.json").as_path(), &api::Artwork { ..artwork });
    
    files::delete_file(&last_path);

    last_path = path;

    sleep(interval);
  }
}

fn open_artwork_source_url(appdir: &PathBuf) {
  let artwork = match api::read_json_file(appdir.join("current.json").as_path()) {
    Err(why) => {
      println!("Error reading json file: {:?}", why);
      return;
    },
    Ok(artwork) => artwork,
  };

  match webbrowser::open(&artwork.description_url) {
    Err(why) => println!("Error opening browser: {:?}", why),
    Ok(_) => (),
  };
}

fn main() {
  tauri::Builder::default()
    .setup(move |app| {
      autolaunch::setup(&app.package_info().name);

      let handle = app.handle();
      let handle_copy = app.handle();
      let appdir = app.path_resolver().app_dir().expect("Error getting app_dir").as_path().to_owned();
      let appdir_copy = appdir.clone().to_owned();
      println!("appdir: {}", appdir.display());

      thread::spawn(move || {
        start_artwork_loop(&appdir_copy, &handle);
      });

      tray::setup().on_event(move |event| {
        match event {
          SystemTrayEvent::MenuItemClick { id, .. } => {
            match id.as_str() {
              "quit" => std::process::exit(0),
              "about" => window::focus_or_create(&handle_copy, "about", "about.html"),
              "next" => {},
              "title" => open_artwork_source_url(&appdir),
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
    .build(tauri::generate_context!())
    .expect("Error building Galeri")
    .run(|_app_handle, event| match event {
      tauri::RunEvent::ExitRequested { api, .. } => {
        api.prevent_exit();
      }
      _ => {}
    });
}
