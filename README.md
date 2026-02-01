# RustMD

This is a markdown editor built with Tauri, React and Typescript.
It is 100% built using Google Antigravity, no manual coding was done, only prompts were used.

## Recommended IDE Setup

- Antigravity + browser integration

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Development

### Running in Browser

To run the application in a standard browser window (useful for quick UI iteration):

```bash
npm run dev
```

### Running as Desktop App

To run the application as a Tauri desktop window:

```bash
npm run tauri dev
```

## Building for Release

To build the executable for your platform:

```bash
npm run tauri build
```

The output binaries/installers will be located in `src-tauri/target/release/bundle/`.
