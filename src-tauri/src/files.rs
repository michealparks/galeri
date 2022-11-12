use std::fs;
use std::path::{Path, PathBuf};

pub fn create_dir(path: &Path) {
  match fs::create_dir_all(path) {
    Err(why) => {
      println!("Error creating dir: {:?}", why);
      return;
    },
    Ok(_) => (),
  };
}

pub fn delete_dir(path: &Path) {
  match fs::remove_dir_all(path) {
    Err(why) => {
      println!("Error deleting dir: {:?}", why);
      return;
    },
    Ok(_) => (),
  }
}

pub fn delete_file(path_buf: &PathBuf) {
  let path = match path_buf.to_str() {
    Some(str) => str,
    None => return
  };

  if path == "" {
    return;
  }

  match fs::remove_file(path) {
    Err(why) => {
      println!("Error deleting file {:?}: {:?}", path, why);
      return;
    },
    Ok(_) => (),
  };
}
