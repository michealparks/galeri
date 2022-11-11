use reqwest;
use reqwest::header;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::fs;
use std::fs::{File};
use std::path::Path;
use rand::Rng;
use uuid::Uuid;
use std::error::Error;

#[derive(Debug, Deserialize, Serialize)]
struct Query {
  pages: Value
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Response {
  query: Query
}

#[derive(Debug)]
pub struct Artwork {
  pub description_url: String,
  pub file: String,
  pub image_url: String,
  pub title: String,
}

const URL: &str = "https://en.wikipedia.org/w/api.php";

fn shuffle(mut arr: Vec<Artwork>) -> Vec<Artwork> {
  let mut rng = rand::thread_rng();
  let max = arr.len() - 1;

  for i in 0..max {
    let x = rng.gen::<usize>() % max;
    arr.swap(i, x);
  }

  return arr;
}

pub fn fetch_list() -> Result<Vec<Artwork>, Box<dyn std::error::Error>> {
  let client = reqwest::blocking::Client::builder()
    .gzip(true)
    .build()
    .expect("Error building Client");

  let count = 500;
  let response = client
    .get(URL)
    .query(&[("action", "query")])
    .query(&[("format", "json")])
    .query(&[("generator", "images")])
    .query(&[("prop", "imageinfo")])
    .query(&[("iiprop", "url|dimensions|mime")])
    .query(&[("gimlimit", count.to_string())])
    .query(&[("pageids", "16924509")])
    .send()?
    .json::<Response>()?;

  let mut artworks: Vec<Artwork> = Vec::with_capacity(count);


// https://upload.wikimedia.org/wikipedia/commons/5/55/Vasnetsov_samolet.jpg
// https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Giambattista_Tiepolo_-_The_Banquet_of_Cleopatra_-_Google_Art_Project.jpg/3091px-Giambattista_Tiepolo_-_The_Banquet_of_Cleopatra_-_Google_Art_Project.jpg

  for (_key, value) in response.query.pages.as_object().unwrap() {
    let title = value["title"].to_string().replace("\"", "")
      .replace("File:", "")
      .replace(",", "")
      .replace(" ", "_");
    let ext = match title.clone().split('.').last() {
      Some(str) => String::from(str),
      None => String::new(),
    };
    let file = [Uuid::new_v4().to_string(), ext].join(".");
    let image_url = value["imageinfo"][0]["url"].to_string().replace("\"", "");

    artworks.push(Artwork {
      description_url: value["imageinfo"][0]["descriptionurl"].to_string().replace("\"", ""),
      image_url: [image_url.replace("commons", "commons/thumb"), format!("2500px-{}", title)].join("/"),
      title: title,
      file: file,
    });
  }

  Ok(shuffle(artworks))
}

fn create_dir(path: &Path) -> Result<(), Box<dyn std::error::Error>> {
  fs::create_dir(path)?;
  Ok(())
}

pub fn delete_file(path: &Path) -> Result<(), Box<dyn std::error::Error>> {
  println!("deleting: {:?}", path);
  match fs::remove_file(path) {
    Err(why) => println!("couldn't delete file: {:?}", why),
    Ok(_) => println!("successfully deleted file"),
  };
  Ok(())
}

pub fn fetch_image(url: &str, path: &Path, file: &str) -> bool {
  let client = reqwest::blocking::Client::builder()
    .gzip(true)
    .build()
    .expect("Error building Client");

  println!("url {:?}", url);

  let mut response = client.get(url)
    .header(header::USER_AGENT, "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36")
    .send()
    .unwrap();

  create_dir(&path);

  let fullpath = path.join(file);
  let mut file = match File::create(fullpath) {
    Err(why) => return false,
    Ok(file) => file,
  };
  

  match std::io::copy(&mut response, &mut file) {
    Err(why) => return false,
    Ok(_) => println!("successfully wrote to file"),
  }

  return true;
}
