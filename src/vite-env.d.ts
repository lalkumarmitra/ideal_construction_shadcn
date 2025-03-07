// src/vite-env.d.ts or create one if it doesn't exist
/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface Window {
    updateSW?: () => Promise<void>;
  }