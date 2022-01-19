![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg) ![CI status](https://github.com/rvdkooy/vue3-hybrid-scripts/workflows/CI/badge.svg) [![npm version](https://img.shields.io/npm/v/vue3-hybrid-scripts.svg?style=flat)](https://www.npmjs.com/package/vue3-hybrid-scripts)

# vue3-hybrid-scripts

Often your Vue app is depending on 3rd party scripts like: Google Tag Manager, Advertising scripts, Tracking or just a script that you need to load from a CDN.
By using this Vue3 hook you can define 3rd party scripts in any Vue component you want. ‘vue-hybrid-scripts’ will then make sure your script(s) will be available both server side as client side and will notify when ready.

## installation

```
npm install vue3-hybrid-scripts
```

## Basic vue3 composition API example with SSR

In your .vue template
``` javascript
import { useHybridScripts } from 'vue3-hybrid-scripts'

const unregisterListener = useHybridScripts('https://code.jquery.com/jquery-3.6.0.min.js', () => {
    // this callback will be executed in your browser when script is loaded
});

// cleanup in onUnMount
onUnmounted(unregisterListener);
```

On your server
``` javascript
const app = createSSRApp(App);
const ssrContext = {};
const html = await renderToString(app, ssrContext);

// Render your scripts and inject into your preferred template engine
const scripts = ssrContext.hybridScripts.render();
```

## Advanced examples

Use mulitple scripts at the same time:
``` javascript
useHybridScripts([
    'https://www.someurl.com/script1.js',
    'https://www.someurl.com/script1.js'
   ], () => {
    // callback
});
```

Javascript and css files are both supported:
``` javascript
useHybridScripts([
    'https://www.someurl.com/styles.css',
    'https://www.someurl.com/script1.js'
   ], () => {
    // callback
});
```

Javascript and css entries support object notations:
``` javascript
useHybridScripts([
    { href: 'https://www.someurl.com/styles.css'},
    { src: 'https://www.someurl.com/script1.js' async: true }
   ], () => {
    // callback
});

// script: { src: string, async: boolean, defer: boolean }
// link: { href: string }

```
