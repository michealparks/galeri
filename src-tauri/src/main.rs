#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use api::Artwork;
use std::path::{Path, PathBuf};
use tokio::time;
use tokio::task::JoinHandle;
use tokio::sync::mpsc;
use webbrowser;

mod api;
mod autolaunch;
mod files;
mod tray;
mod wallpaper;
mod window;

async fn start_artwork_loop(artpath: &Path, sender: &mpsc::Sender<Artwork>) {
  let mut error_interval = time::interval(time::Duration::from_secs(30));
  let mut interval = time::interval(time::Duration::from_secs(30)); // one hour

  let mut artworks: Vec<api::Artwork> = Vec::with_capacity(0);
  let mut last_path = PathBuf::new();

  loop {
    interval.tick().await;
  
    if artworks.len() == 0 {
      artworks = api::fetch_list().await;
    }

    if artworks.len() == 0 {
      error_interval.tick().await;
      continue;
    }

    let artwork = artworks.pop().expect("Error popping artwork off array.");

    if api::fetch_image(&artwork.image_url, &artpath, &artwork.file).await == false {
      error_interval.tick().await;
      continue;
    }

    let path = artpath.join(&artwork.file);

    if wallpaper::set(&path) == false {
      error_interval.tick().await;
      continue;
    }

    sender.send(artwork).await;

    files::delete_file(&last_path);

    last_path = path;
  }
}

fn setup (handle: tauri::AppHandle, img_dir: PathBuf) -> JoinHandle<()> {
  let (sender, mut receiver) = mpsc::channel(1);

  let task = tokio::spawn(async move {
    start_artwork_loop(&img_dir, &sender).await;
  });

  tokio::spawn(async move {
    while let Some(artwork) = receiver.recv().await {
      println!("{:?}", artwork);

      tray::set_menu_item(&handle, "title", &artwork.title);
    }
  });

  return task;
}

#[tokio::main]
async fn main() {
  tauri::async_runtime::set(tokio::runtime::Handle::current());

  tauri::Builder::default()
    .setup(|app| {
      autolaunch::setup(app);
      files::delete_dir(&app.path_resolver().app_data_dir().unwrap().join("images").as_path());

      let img_dir = app.path_resolver().app_data_dir().unwrap().as_path().join("images").as_path().to_owned();
      let handle = app.handle();
      let mut artwork_task = setup(handle.clone(), img_dir.clone());

      tray::setup(app.handle(), move |menu_title| {
        match menu_title {
          "title" => {
            match webbrowser::open("") {
              Err(why) => println!("Error opening browser: {:?}", why),
              Ok(_) => (),
            };
          },
          "next" => {
            artwork_task.abort();
            artwork_task = setup(handle.clone(), img_dir.clone());
          }
          _ => (),
        }
        println!("{:?}", menu_title);
      }).build(app).unwrap();

      Ok(())
    })
    .build(tauri::generate_context!())
    .expect("Error building Galeri")
    .run(|_handle, event| {
      match event {
        tauri::RunEvent::Updater(why) => {
          println!("Updater: {:?}", why);
        },
        // Prevent the app from exiting entirely if all windows are closed.
        tauri::RunEvent::ExitRequested { api, .. } => {
          api.prevent_exit();
        },
        _ => {}
      }
    });
}
