<template>
<div id="app">
  <img src="./assets/logo.png">
  <router-view></router-view>
</div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  #main-container {
    padding: 1em 4em 2em 4em;
    vertical-align: top;
    background-color: #fff;
    min-width: 750px;
  }

  table.table tr td {
    text-align: left;
    padding: 2px 5px;
  }

  @import'~bootstrap/dist/css/bootstrap.css'
</style>
