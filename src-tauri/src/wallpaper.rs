use wallpaper;
use std::path::PathBuf;

pub fn set(path: &PathBuf) -> bool {
  match wallpaper::set_from_path(&String::from(path.to_string_lossy())) {
    Err(why) => {
      println!("Error setting wallpaper: {:?}", why);
      return false;
    },
    Ok(_) => (),
  }

  #[cfg(windows)]
  match wallpaper::set_mode(wallpaper::Mode::Center) {
    Err(why) => println!("Error setting wallpaper mode: {:?}", why),
    Ok(_) => (), 
  };

  return true;
}
