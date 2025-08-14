import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    base: '/rummy-timer/', // 👈 IMPORTANT for GitHub Pages
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'masked-icon.svg'],
            manifest: {
                name: 'Rummy Timer',
                short_name: 'Timer',
                description: 'Personal Rummy round timer app',
                theme_color: '#0b6a3b',
                background_color: '#0b6a3b',
                display: 'standalone',
                start_url: '/rummy-timer/',
                icons: [
                    { src: '/rummy-timer/icon-192x192.png', sizes: '192x192', type: 'image/png' },
                    { src: '/rummy-timer/icon-512x512.png', sizes: '512x512', type: 'image/png' },
                    { src: '/rummy-timer/icon-512x512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
                ]
            }
        })
    ]
})
