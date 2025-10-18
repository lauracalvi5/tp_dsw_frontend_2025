import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/estacionamientos': 'http://localhost:3000',
      '/estacionamientos-disponibles': 'http://localhost:3000',
      '/vehiculos': 'http://localhost:3000',
      '/cocheras': 'http://localhost:3000',
      '/tipos-vehiculo': 'http://localhost:3000',
      "/socket.io": { 
        target: "http://localhost:3000", 
        ws: true, 
        changeOrigin: true
      }
    }
  },
});
