import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // L'alias '@' pointe vers le dossier 'src'
    },
  },
  test: {
    globals: true, // Permet d'utiliser des globales comme describe, it, expect, etc.
    environment: "jsdom", // Utilisation de jsdom pour simuler un navigateur
    // setupFiles: "./setupTests.ts",
    coverage: {
      reporter: ["text", "html"], // Rapports de couverture
    },
  },
});
