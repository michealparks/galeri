#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]


use std::path::{Path};
use std::{path::PathBuf};
use tauri::{SystemTrayEvent};
use tokio::time;
use tokio::sync::{mpsc};
use tokio::sync::mpsc::Sender;
use webbrowser;

mod api;
mod autolaunch;
mod files;
mod tray;
mod wallpaper;
mod window;

async fn start_artwork_loop(appdir: &Path, handle: &tauri::AppHandle, sender: &Sender<&str>) {
  let mut error_interval = time::interval(time::Duration::from_secs(30));
  let mut interval = time::interval(time::Duration::from_secs(30)); // one hour

  let binding = appdir.join(&"images");
  let artpath = binding.as_path();

  files::delete_dir(artpath);

  let mut artworks: Vec<api::Artwork> = Vec::with_capacity(0);
  let mut last_path = PathBuf::new();

  loop {
    if artworks.len() == 0 {
      artworks = api::fetch_list().await;
    }

    if artworks.len() == 0 {
      error_interval.tick().await;
      continue;
    }

    println!("hihihihih {:?}", artworks.len());


    let artwork = artworks.pop().expect("Error popping artwork off array.");

    if api::fetch_image(&artwork.image_url, &artpath, &artwork.file.clone()).await == false {
      error_interval.tick().await;
      continue;
    }

    let path = artpath.join(&artwork.file);

    if wallpaper::set(&path) == false {
      error_interval.tick().await;
      continue;
    }

    tray::set_menu_item(&handle, "title", &artwork.title);
    sender.send(artwork.description_url.to_string()).await;
    
    files::delete_file(&last_path);

    last_path = path;

    interval.tick().await;
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

#[tokio::main]
async fn main() {
  tauri::async_runtime::set(tokio::runtime::Handle::current());

  let (sender, mut receiver) = mpsc::channel(32);

  tauri::Builder::default()
    .setup(move |app| {
      // Don't show app icon in the dock.
      #[cfg(target_os = "macos")]
      app.set_activation_policy(tauri::ActivationPolicy::Accessory);

      autolaunch::setup(&app.package_info().name);

      let handle = app.handle();
      let appdir = app.path_resolver().app_data_dir().expect("Error getting app_dir").as_path().to_owned();
      let appdir_copy = appdir.clone();

      tokio::spawn(async move {
        start_artwork_loop(&appdir_copy, &handle, &sender).await;
      });

      tokio::spawn(async move {
        while let Some(message) = receiver.recv().await {
          println!("GOT = {}", message);
        }
      });

      let handle_copy = app.handle();

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
    .build(tauri::generate_context!())
    .expect("Error building Galeri")
    .run(|_app_handle, event| match event {
      // Prevent the app from exiting entirely if all windows are closed.
      tauri::RunEvent::ExitRequested { api, .. } => {
        api.prevent_exit();
      }
      _ => {}
    });
}
