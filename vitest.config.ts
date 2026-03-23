import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    exclude: ['node_modules/**', 'dist/**', '.tmp_instaauto_demo_src_v2/**'],
    reporters: ['default'],
  },
})
