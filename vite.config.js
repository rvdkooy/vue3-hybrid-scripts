const vuePlugin = require('@vitejs/plugin-vue');
const typescript = require('@rollup/plugin-typescript');
const path = require('path');
/**
 * @type {import('vite').UserConfig}
 */
module.exports = {
  plugins: [
    vuePlugin(),
    {
      name: 'virtual',
    }
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/vue-hybrid-scripts/main.ts'),
      name: 'vue3-hybrid-scripts',
      fileName: (format) => {
        if (format === 'es') {
          return `vue3-hybrid-scripts.es.mjs`;
        }
        if (format === 'umd') {
          return `vue3-hybrid-scripts.umd.js`;
        }
      } 
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue'
        }
      },
    }
  }
}
