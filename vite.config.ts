import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    TanStackRouterVite({ routesDirectory: './src/routes', generatedRouteTree: './src/routeTree.gen.ts' }),
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined

          if (id.includes('recharts')) return 'charts'
          if (id.includes('@tanstack/react-router') || id.includes('@tanstack/router-core')) return 'router'
          if (id.includes('@tanstack/react-query') || id.includes('@tanstack/query-core')) return 'query'
          if (id.includes('@radix-ui')) return 'radix'
          if (
            id.includes('react-hook-form')
            || id.includes('@hookform/resolvers')
            || id.includes('zod')
            || id.includes('react-imask')
          ) {
            return 'forms'
          }
          if (id.includes('lucide-react')) return 'icons'

          return 'vendor'
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
})
