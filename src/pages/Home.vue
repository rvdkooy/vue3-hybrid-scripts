<template>
  <h1>Home</h1>
  <p>
    <img src="../assets/logo.png" alt="logo" />
  </p>
  <div id="dialog-message" title="Download complete">
    <p>
      This is a jQuery UI modal
    </p>
  </div>

</template>

<script setup lang="ts">
import { useHybridScripts } from '../vue-hybrid-scripts/main';

useHybridScripts([
    'https://code.jquery.com/ui/1.13.0/themes/base/jquery-ui.css',
    'https://code.jquery.com/jquery-3.6.0.min.js',
    { src: 'https://code.jquery.com/ui/1.13.0/jquery-ui.min.js', async: true },
  ],
  () => {
    $( "#dialog-message" ).dialog();
});

</script>

<style scoped>
h1,
a {
  color: green;
}
</style>
