import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import bookingApiPlugin from './server/server.js';

export default defineConfig({
    plugins: [react(), bookingApiPlugin()],
    base: './',
    server: { port: 3000 },
    preview: { port: 3000 }
});
