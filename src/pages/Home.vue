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
import useHybridScript from '../vue-hybrid-scripts/useHybridScript';

useHybridScript([
    'https://code.jquery.com/ui/1.13.0/themes/base/jquery-ui.css',
    'https://code.jquery.com/jquery-3.6.0.min.js',
    'https://code.jquery.com/ui/1.13.0/jquery-ui.min.js',
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
