import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    https: {
      key: fs.readFileSync("./10.0.0.223-key.pem"),
      cert: fs.readFileSync("./10.0.0.223.pem"),
    },
    host: "0.0.0.0",
  },
  css: {
    modules: {
      // Generate readable class names in development
      generateScopedName:
        process.env.NODE_ENV === "development"
          ? "[name]__[local]___[hash:base64:5]"
          : "[hash:base64:8]",
      // Enable CSS modules for all .module.css files
      localsConvention: "camelCase",
    },
    // Enable CSS source maps for better debugging
    devSourcemap: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts", // optional setup file
  },
});
