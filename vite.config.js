const vuePlugin = require('@vitejs/plugin-vue')
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
      entry: path.resolve(__dirname, 'src/components/vue-hybrid-scripts/useHybridScript.ts'),
      name: 'vue3-hybrid-scripts',
      fileName: (format) => `vue3-hybrid-scripts.${format}.js`
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
      }
    }
  }
}
