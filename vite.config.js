import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: { alias: { '@': new URL('./src', import.meta.url).pathname } },
    build: { rolldownOptions: { input: { main: new URL('./index.html', import.meta.url).pathname, portfolio: new URL('./portfolio.html', import.meta.url).pathname } } },
});
