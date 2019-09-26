<template>
  <div id="app">
    <common-header></common-header>
    <initializer></initializer>
  </div>
</template>

<script>
import CommonHeader from './components/CommonHeader.vue';
import Initializer from './components/Initializer.vue';

export default {
  components: {
    "CommonHeader": CommonHeader,
    "Initializer": Initializer
  }
}
</script>

<style>
  html, body {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  body {
    font-family: 'Nanum Gothic', sans-serif;
    margin: 0;
  }

  #app {
    background-color: #EFF3F7;
    color: #000000;
    width: 100%;
    height: 100%;
    padding-top: 64px;
    overflow: auto;
  }

  .card {
    padding: .5em;
    border-radius: 2px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  }
</style>
