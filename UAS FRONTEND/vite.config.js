import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3001,
    open: false,
    allowedHosts: ['traveloop.hostsel.web.id',
      'code-server.hostsel.web.id'
    ]  // ← Tambahin ini bro!
  }
})
