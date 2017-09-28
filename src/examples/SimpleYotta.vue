
<template>
<div id="main-container">
  <h1>Simple Yotta</h1>

  <div class="panel panel-default">
    <div class="panel-body">
      <yotta-table :json-data="jsonData" :columns="columns" />
    </div>
  </div>
</div>
</template>

<script>
  import YottaTable from '@/components/YottaTable'

  export default {
    components: {
      'yotta-table': YottaTable
    },

    data() {
      return {
        jsonData: [ 
          { name: "Cauchy Boy", species: "Cat" }, 
          { name: "Isis", species: "Cat" },
          { name: "Doran", species: "Human" },
        ],
        columns: [ 
          { key: 'name', name: "Name" },
          { key: 'species', name: 'Species' }
        ]
      }
    }
  }
</script>

<style>
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
</style>


