import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [react()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
        protocol: "ws",
        host,
        port: 1421,
      }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
  resolve: {
    alias: {
      "prosemirror-model": resolve(__dirname, "node_modules/prosemirror-model"),
      "prosemirror-state": resolve(__dirname, "node_modules/prosemirror-state"),
      "prosemirror-view": resolve(__dirname, "node_modules/prosemirror-view"),
      "prosemirror-transform": resolve(__dirname, "node_modules/prosemirror-transform"),
      "prosemirror-schema-list": resolve(__dirname, "node_modules/prosemirror-schema-list"),
      "prosemirror-commands": resolve(__dirname, "node_modules/prosemirror-commands"),
      "prosemirror-history": resolve(__dirname, "node_modules/prosemirror-history"),
      "prosemirror-inputrules": resolve(__dirname, "node_modules/prosemirror-inputrules"),
      "prosemirror-keymap": resolve(__dirname, "node_modules/prosemirror-keymap"),
      "prosemirror-gapcursor": resolve(__dirname, "node_modules/prosemirror-gapcursor"),
      "prosemirror-dropcursor": resolve(__dirname, "node_modules/prosemirror-dropcursor"),
      "prosemirror-tables": resolve(__dirname, "node_modules/prosemirror-tables"),
      "prosemirror-changeset": resolve(__dirname, "node_modules/prosemirror-changeset"),
      "prosemirror-drop-indicator": resolve(__dirname, "node_modules/prosemirror-drop-indicator"),
      "prosemirror-safari-ime-span": resolve(__dirname, "node_modules/prosemirror-safari-ime-span"),
      "prosemirror-virtual-cursor": resolve(__dirname, "node_modules/prosemirror-virtual-cursor"),
      "orderedmap": resolve(__dirname, "node_modules/orderedmap"),
    }
  }
}));
