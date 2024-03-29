import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  build: {
    minify: false,
    target: "es2020", // Enable Big integer literals
    commonjsOptions: {
      transformMixedEsModules: true, // Enable @walletconnect/web3-provider which has some code in CommonJS
    },

    rollupOptions: {
      // maxParallelFileOps: 2,
      cache: false,
    },
    outDir: "dist",
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2020", // Enable Big integer literals
      define: {
        global: "globalThis",
      },
      supported: {
        bigint: true,
      },
    },
  },
});
