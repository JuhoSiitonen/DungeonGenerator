import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'coverage/**',
        'dist/**',
        '**/*.d.ts',
        'test{,s}/**',
        '**/*{.,-}{test,spec}.{js,cjs,mjs,ts,tsx,jsx}',
        
        '**/*.{jsx,tsx}',           
        '**/*.types.{ts,js}',       
        '**/types.{ts,js}',         
        '**/App.{tsx,jsx}',        
      ],
      include: [
        '**/algorithms/**/*.{ts,js}',  
        '**/helpers/**/*.{ts,js}',     
        '**/utils/**/*.{ts,js}',       
      ],
      thresholds: {
        global: {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85
        }
      }
    }
  },
})