# vue3-hybrid-scripts

By using this Vue3 hook you can define which external scripts a component is depending on. ‘vue-hybrid-scripts’ will manage the loading and synchronise the state of your scripts during server rendering and browser rendering.

## installation

```
npm install vue3-hybrid-scripts
```

## Basic vue3 composition API example with SSR

In your .vue template
``` javascript
import { useHybridScript } from 'vue3-hybrid-scripts'

const unregisterListener = useHybridScript('https://code.jquery.com/jquery-3.6.0.min.js', () => {
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
useHybridScript([
    'https://www.someurl.com/script1.js',
    'https://www.someurl.com/script1.js'
   ], () => {
    // callback
});
```

Javascript and css files are both supported:
``` javascript
useHybridScript([
    'https://www.someurl.com/styles.css',
    'https://www.someurl.com/script1.js'
   ], () => {
    // callback
});
```

Javascript and css entries support object notations:
``` javascript
useHybridScript([
    { href: 'https://www.someurl.com/styles.css'},
    { src: 'https://www.someurl.com/script1.js' async: true }
   ], () => {
    // callback
});

// script: { src: string, async: boolean, defer: boolean }
// link: { href: string }

```
