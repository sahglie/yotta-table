
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


