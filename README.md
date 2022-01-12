# vue3-hybrid-scripts

By using this Vue3 hook you can define which external scripts a component is depending on. ‘vue-hybrid-scripts’ will manage the loading and synchronise the state of your scripts during server rendering and browser rendering.

# installation

```
npm install vue3-hybrid-scripts
```

# Basic setup

```
useHybridScript('https://code.jquery.com/jquery-3.6.0.min.js', () => {
    // this callback will be executed on script load
});
```