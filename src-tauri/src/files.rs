use std::fs::{self, File};
use std::path::{Path, PathBuf};
use std::io::{self, ErrorKind, Read, Write};
use fs2::FileExt;


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
      if why.kind() != ErrorKind::NotFound {
        println!("Error deleting dir: {:?}", why);
      }

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

pub fn read_file<P: AsRef<Path>>(path: P) -> io::Result<String> {
  let mut file = File::open(path)?;
  file.lock_shared()?;
  let mut contents = String::new();
  file.read_to_string(&mut contents)?;
  file.unlock()?;
  Ok(contents)
}

pub fn write_file<P: AsRef<Path>>(path: P, data: &str) -> io::Result<()> {
  let mut file = fs::OpenOptions::new()
    .write(true)
    .create(true)
    .truncate(true)
    .open(path)?;
  file.lock_exclusive()?;
  file.write_all(data.as_bytes())?;
  file.unlock()?;
  Ok(())
}