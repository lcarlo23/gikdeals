import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    root: 'src/',
    build: {
        outDir: '../dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/index.html'),
                favorites: resolve(__dirname, 'src/favorites/index.html'),
                search: resolve(__dirname, 'src/search/index.html')
            },
        },
    },
});