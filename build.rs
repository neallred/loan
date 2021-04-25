use std::{
    error::Error, fs::{File}, io::Write, path::Path,
};
use walkdir::{WalkDir};

const STATIC_DIR: &str = "client/build";

fn get_file_name(f: &str) -> String {
    if f.contains(&format!("{}/{}", STATIC_DIR.to_owned(), "index.html")) {
        String::from("")
    } else {
        f.to_string()
    }
}

fn main() -> Result<(), Box<dyn Error>> {
    let out_dir = "./src";
    let dest_path = Path::new(&out_dir).join("main.rs");
    let mut main_rs = File::create(&dest_path)?;

    let header = r##"use std::env;
#[macro_use]
extern crate rouille;
use rouille::Response;

fn main() {
    let args: Vec<String> = env::args().collect();
    let default_port = String::from("8000");
    let port = args.get(1).unwrap_or(&default_port);

    rouille::start_server(format!("0.0.0.0:{}", port), move |request| {
        let response = router!(request,"##;

    let footer = r##"            _ => {
                Response::empty_404()
            }
        );

        response
    });
}
"##;

    writeln!(&mut main_rs, "{}", header)?;

    for f in WalkDir::new(STATIC_DIR) {
        let f = f?;

        if !f.file_type().is_file() {
            continue;
        }
 
        let wrapped_file_name = f.file_name();
        let file_name = wrapped_file_name.to_str().unwrap();
        let as_from_data =
            file_name.ends_with("wasm") ||
            file_name.ends_with("js.gz") ||
            file_name.ends_with("js.br") ||
            file_name.ends_with(".ico") ||
            file_name.ends_with(".jpg") ||
            file_name.ends_with(".jpeg") ||
            file_name.ends_with(".png") ||
            file_name.ends_with(".ico")
        ;

        if as_from_data {
            writeln!(
                &mut main_rs,
                r#"            (GET) ["/{serve_name}"] => {{
                Response::from_data("application/wasm", include_bytes!("../{name}").to_vec())
            }},"#,
                name = f.path().display(),
                serve_name = f.file_name().to_str().unwrap().replace("assets/", "").replace("client/build/", ""),
            )?;
        } else {
            writeln!(
                &mut main_rs,
                r#"            (GET) ["/{serve_name}"] => {{
                Response::{content_type}(include_str!("../{name}"))
            }},"#,
                name = f.path().display(),
                serve_name = get_file_name(f.path().to_str().unwrap()).replace("assets/", "").replace("client/build/", ""),
                content_type = if file_name.contains(".html") { "html" } else { "text" },
            )?;
        }
    }
    writeln!(&mut main_rs, "{}", footer)?;
    Ok(())
}
