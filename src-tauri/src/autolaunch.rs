use auto_launch::AutoLaunchBuilder;
use std::env::current_exe;

pub fn setup(name: &str) {
  let mut builder = AutoLaunchBuilder::new();
  builder.set_app_name(name);
  builder.set_use_launch_agent(true);

  let current_exe = match current_exe() {
    Err(why) => {
      println!("Error getting executable filepath: {:?}", why);
      return;
    },
    Ok(exe) => exe,
  };

  #[cfg(windows)]
  let path = &current_exe.display().to_string();

  #[cfg(target_os = "macos")]
  let path = match &current_exe.canonicalize() {
    Err(why) => {
      println!("Error getting executable filepath: {:?}", why);
      return;
    },
    Ok(path_buf) => path_buf.display().to_string(),
  };

  builder.set_app_path(&path);

  let launcher = match builder.build() {
    Err(why) => {
      println!("Error building auto launcher: {:?}", why);
      return;
    },
    Ok(launcher) => launcher,
  };

  match launcher.enable() {
    Err(why) => {
      println!("Error enabling auto launcher: {:?}", why);
      return;
    },
    Ok(_) => (),
  };
}
