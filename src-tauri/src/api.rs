use rand::Rng;
use reqwest::{self, header, StatusCode};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::fs::{self, File};
use std::path::Path;
use uuid::Uuid;

use super::files;

#[derive(Debug, Deserialize, Serialize)]
struct Query {
  pages: Value
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Response {
  query: Query
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Artwork {
  pub description_url: String,
  pub file: String,
  pub image_url: String,
  pub title: String,
}

const URL: &str = "https://en.wikipedia.org/w/api.php";
const NUM_RESULTS: usize = 500;

fn shuffle(mut vec: Vec<Artwork>) -> Vec<Artwork> {
  let mut rng = rand::thread_rng();
  let size = vec.len();

  for i in 0..(size - 1) {
    vec.swap(i, rng.gen::<usize>() % size);
  }

  return vec;
}

pub fn fetch_list() -> Vec<Artwork> {
  let client = match reqwest::blocking::Client::builder().gzip(true).build() {
    Err(why) => {
      println!("Error building fetch_list request {:?}", why);
      return Vec::with_capacity(0);
    },
    Ok(client) => client,
  };

  let response = match client
    .get(URL)
    .query(&[("action", "query")])
    .query(&[("format", "json")])
    .query(&[("generator", "images")])
    .query(&[("prop", "imageinfo")])
    .query(&[("iiprop", "url|dimensions|mime")])
    .query(&[("gimlimit", NUM_RESULTS.to_string())])
    .query(&[("pageids", "16924509")])
    .send() {
      Err(why) => {
        println!("Error fetching wikipedia artworks: {:?}", why);
        return Vec::with_capacity(0);
      },
      Ok(response) => response,
    };

  if response.status() != StatusCode::OK {
    return Vec::with_capacity(0);
  }

  let json = match response.json::<Response>() {
    Err(why) => {
      println!("Error deserializing wikipedia artworks response: {:?}", why);
      return Vec::with_capacity(0);
    },
    Ok(json) => json,
  };

  let mut artworks: Vec<Artwork> = Vec::with_capacity(NUM_RESULTS);

  for (_key, value) in json.query.pages.as_object().unwrap() {
    let title = value["title"].to_string()
      .replace("\"", "")
      .replace("File:", "");
      
    let ext = match title.clone().split('.').last() {
      Some(str) => String::from(str),
      None => String::new(),
    };
    let file = [Uuid::new_v4().to_string(), ext].join(".");
    let image_url = value["imageinfo"][0]["url"].to_string().replace("\"", "");

    artworks.push(Artwork {
      description_url: value["imageinfo"][0]["descriptionurl"].to_string().replace("\"", ""),
      image_url: [image_url.replace("commons", "commons/thumb"), format!("2500px-{}", title)].join("/"),
      title: title.replace(".jpg", ""),
      file: file,
    });
  }

  return shuffle(artworks);
}

pub fn fetch_image(url: &str, path: &Path, file: &str) -> bool {
  let client = match reqwest::blocking::Client::builder().gzip(true).build() {
    Err(why) => {
      println!("Error building fetch_image request: {:?}", why);
      return false;
    },
    Ok(client) => client,
  };

  let mut response = match client.get(url)
    .header(header::USER_AGENT, "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36")
    .send() {
      Err(why) => {
        println!("Error fetching image {:?}: {:?}", url, why);
        return false;
      },
      Ok(response) => response,
    };

  if response.status() != StatusCode::OK {
    return false
  }

  files::create_dir(&path);

  let fullpath = path.join(file);
  let mut file = match File::create(fullpath) {
    Err(why) => {
      println!("Error creating file {:?}: {:?}", file, why);
      return false;
    },
    Ok(file) => file,
  };

  match std::io::copy(&mut response, &mut file) {
    Err(why) => {
      println!("Error writing file {:?}: {:?}", file, why);
      return false;
    },
    Ok(_) => (),
  }

  return true;
}

pub fn write_json_file(path: &Path, json: &Artwork) {
  let str = match serde_json::to_string_pretty(json) {
    Err(why) => {
      println!("Error serializing json: {:?}", why);
      return;
    },
    Ok(str) => str,
  };

  match fs::write(path, str) {
    Err(why) => {
      println!("Error writing json file: {:?}", why);
    },
    Ok(_) => (),
  }
}

pub fn read_json_file(path: &Path) -> Result<Artwork, serde_json::Error> {
  let text = match fs::read_to_string(&path) {
    Err(_) => String::new(),
    Ok(str) => str,
  };

  return serde_json::from_str::<Artwork>(&text);
}
