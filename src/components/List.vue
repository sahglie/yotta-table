<template>
<div>
  <h1>My To Do List</h1>
  </br>
  <ul>
    <li v-for="item in items">{{ item }}</li>
  </ul>
</div>
</template>

<script>
  export default {
    name: 'list',
    data() {
      return {
        items: ['buy food', 'play games', 'sleep']
      }
    }
  }
</script>
