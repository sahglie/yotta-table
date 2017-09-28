<template>

<div>
  <table class="table table-hover">
    <thead>
      <slot name="thead">
      <tr>
        <th v-for="col in columns">{{ col.name }}</th>
      </tr>
      </slot>
    </thead>

    <tbody>
      <tr v-for="row in rows">
        <td v-for="col in columns">{{row.get(col.key) }}</td>
      </tr>
    </tbody>
  </table>
</div>
</template>

<script>
  class Table {
    constructor(columns, rows) {
      this.columns = (columns || []);
      this.rows = []
      this.addRows(rows)
    }

    addRow(row) {
      if (this.columns.length === 0) {
        this.columns = Object.keys(row).map(key => { 
          return { name: key };
        });
      }
      this.rows.push(new Row(row, this.columns));
    }

    addRows(rows) {
      rows.forEach(row => this.addRow(row));
    }

    filter(text) {
      return this.rows.filter(row => row.includes(text));
    }

    clear() {
      this.rows.splice(0);
    }

    getRows() {
      return this.rows;
    }

    searcheableColumns() {
      return this.columns.filter(field => { 
        return field.search !== false 
      });
    }
  }

  class Row {
    constructor(record, columns) {
      this.record = record;
      this.columns = columns;
      this.token = this.__makeToken(columns);
    }

    __makeToken(cols) {
      return this.searcheableColumns().map(c => {
        let val = this.get(c.name);
        return val ? val.toString() : ""; 
      }).join(" ").toLowerCase();
    }

    get(columnName) {
      return this.record[columnName];
    }

    set(columnName, value) {
      this.record[columnName] = value;
    }

    columnValues() {
      return this.columnNames().map(name => {
        let val = this.get(name);
        return val ? val.toString() : ""; 
      });
    }

    columnNames() {
      return this.columns.map(col => col.name);
    }

    searcheableColumns() {
      return this.columns.filter(c => { return c.search !== false });
    }

    includes(text) {
      text = text.toLowerCase();
      return this.token.indexOf(text) > -1; 
    }
  }

  export default {
    props: { 
      id: { default: null },
      jsonData: { required: true },
      columns: { 
      default: function() { return [] } 
      },
    },

    data() {
      return {
        table: new Table(this.columns, this.jsonData)
      }
    },

    methods: {
    },

    computed: {
      rows() {
        return this.table.getRows()
      },
    },
  }
</script>
