# Galeri

A perpetual artwork streaming app.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Developing:

To start the development environment:
```bash
npm install
npm run tauri dev
```

To produce a build:
```bash
# Generate a private key first
npm run tauri signer generate -- -w ~/.tauri/galeri.key
npm run tauri build
```

### References:
* https://rfdonnelly.github.io/posts/tauri-async-rust-process/
* https://github.com/jondot/tauri-tray-app/blob/master/src-tauri/src/main.rs
* https://doc.rust-lang.org/book/ch16-03-shared-state.html#sharing-a-mutext-between-multiple-threads
* https://blog.knoldus.com/message-passing-in-rust-threads-is-very-helpful/
