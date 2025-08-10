import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages用のベースパス設定
  // PR環境の場合は /flow-github-pages/pr-{PR番号}/
  // 本番環境の場合は /flow-github-pages/
  base: process.env.PR_NUMBER 
    ? `/flow-github-pages/pr-${process.env.PR_NUMBER}/`
    : '/flow-github-pages/',
  
  // ビルド設定
  build: {
    // PR環境の場合は dist/pr-{PR番号}/ に出力
    // 本番環境の場合は dist/ に出力
    outDir: process.env.PR_NUMBER 
      ? `dist/pr-${process.env.PR_NUMBER}`
      : 'dist',
  },
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    // プロキシ設定
    proxy: {
      // APIエンドポイントを実際のサーバーにプロキシ
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
      // 注意: /mock エンドポイントはaxiosインターセプターで処理されるため、
      // ここではプロキシ設定を追加しません
    }
  }
})
