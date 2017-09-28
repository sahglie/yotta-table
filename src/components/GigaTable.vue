<template>
<div>
  <div>
    <div class="col-sm-6">
      <progress-bar :percent="progressPercent" v-if="progressPercent"></progress-bar>
      <span>{{pager.currentRowFirst()}} to {{pager.currentRowLast()}} of {{pager.rowCount()}} entries</span>
    </div>

    <div class="col-sm-6">
      <form class="form-inline pull-right">
        <div class="btn-group form-group" v-if="csvDownload"> 
          <button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown">
            <i class="glyphicon glyphicon-cog"></i><span class="caret"></span>
          </button>
          <ul class="dropdown-menu">
            <li><a href="#" v-on:click.prevent="downloadCsv">Download CSV</a></li>
          </ul>
        </div>

        <div class="form-group">
          <select v-model="perPage" v-on:change="currentPage = 1" class="form-control">
            <option v-for="i in perPageOptions" v-bind:value="i">{{ i }}</option>
          </select>
        </div>

        <div class="form-group">
          <input class="form-control" style="width: 300px;" placeholder="Search here..." v-on:keyup="runFilter" v-model="rawFilterText" />
        </div>
      </form>
    </div>
  </div>

  <br/><br/>

  <table class="table table-hover" :id="id">
    <thead>
      <slot name="thead">
      <tr>
        <th v-for="col in columns">{{ col.name }}</th>
      </tr>
      </slot>
    </thead>

    <tbody>
      <slot name="tbody" v-for="(row, index) in pageRows" :row="row">
      <tr :key="row.get('id')">
        <td v-for="col in columns">{{row.get(col.key) }}</td>
      </tr>
      </slot>
    </tbody>
  </table>

  <div>
    <ul class="pagination" v-if="rows.length > 0">
      <li><a href="#" v-on:click.prevent="currentPage = pager.firstPage()">First</a></li>
      <li>
      <a href="#" aria-label="Previous" v-on:click.prevent="currentPage = pager.prevPage()">
        <span aria-hidden="true">&laquo; Previous</span>
      </a>
      </li>
      <li v-for="i in pager.pageRange()" v-bind:class="{ active: currentPage == i }">
      <a href="#" v-on:click.prevent="currentPage = i">{{ i }}</a>
      </li>
      <li>
      <a href="#" aria-label="Next" v-on:click.prevent="currentPage = pager.nextPage()">
        <span aria-hidden="true">Next &raquo;</span>
      </a>
      </li>
      <li><a href="#" v-on:click.prevent="currentPage = pager.lastPage()">Last</a></li>
    </ul>
  </div>
</div>
</template>

<script>
  import ProgressBar from './ProgressBar.vue';
  import { _ } from 'underscore';

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

    toCsv(rows) {
      let csv = [];

      let header = this.searcheableColumns().map(f => f.name);
      csv.push(header);

      rows.forEach(row => {
        let csvRow = header.map(f => row.get(f));
        csv.push(csvRow);
      });

      return $.csv.fromArrays(csv);
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


  class Pager {
    constructor(rows, perPage) {
      this._rows = rows;
      this._perPage = perPage;
      this._range = 5;
      this._currentPage = 1;
    }

    pageCount() {
      return Math.ceil(this._rows.length / this._perPage);
    }

    rowCount() {
      return this._rows.length;
    }

    pageRows(page) {
      page = page || this._currentPage;
      let index = page - 1;
      let offset = index * this._perPage;
      this._currentPage = page;
      return this._rows.slice(offset, offset + this._perPage);
    }

    pageRange() {
      let pages = [];

      let start = 1;
      if ((this._currentPage == this.lastPage()) && (this._currentPage >= this._range)) {
        start = this._currentPage - 4;
        } else if (this._currentPage >= this._range) {
        start = this._currentPage - 3;
      } 


      for (let i = 0; i < this._range; i++) {
        let page = i + start;
        if (page <= this.lastPage()) { pages.push(page); }
      }
      return pages;
    }

    set currentPage(i) {
      this._currentPage = i;
    }
    get currentPage() {
      return this._currentPage;
    }

    nextPage() {
      if (this._currentPage < this.lastPage()) {
        return this._currentPage + 1;
        } else {
        return this._currentPage;
      } 
    }

    prevPage() {
      if (this._currentPage > this.firstPage()) {
        return this._currentPage - 1;
        } else {
        return this._currentPage;
      } 
    }

    setRows(rows) {
      this._rows = rows;
    }

    setPerPage(pp) {
      this._perPage = pp;
    }

    firstPage() {
      return 1;
    }

    lastPage() {
      return this.pageCount();
    }

    currentRowFirst() {
      if (this.rowCount() == 0) { return 0; }
      return 1 + ((this._currentPage-1) * this._perPage);
    }

    currentRowLast() {
      if (this.rowCount() == 0) { return 0; }
      return this.currentRowFirst() + this.pageRows().length - 1;
    }
  }

  export default {
    props: { 
      id: { default: null },
      jsonData: { required: true },
      columns: { 
        default: function() { return [] } 
      },
      progressPercent: { default: 0 },
      csvDownload: { default: false }
    },

    components: {
      'progress-bar': ProgressBar
    },

    data() {
      return {
        filterText: "",
        rawFilterText: "",
        currentPage: 1,
        perPageOptions: [25, 100, 500, 1000],
        perPage: 25,
        pager: new Pager([], 25),
        table: new Table(this.columns, this.jsonData)
      }
    },

    watch: {
      jsonData(data) {
        this.table = new Table(this.columns, data);
      }
    },

    methods: {
      runFilter: _.debounce(function() {
        console.log(`debounce: ${this.rawFilterText}`);
        this.filterText = this.rawFilterText;
        this.currentPage = 1;
      }, 300),

      downloadCsv() {
        let csvData = encodeURI(`data:text/csv:charset=utf-8,${this.table.toCsv(this.rows)}`);
        let link = document.createElement("a");
        link.setAttribute("href", csvData)
        link.setAttribute("download", "table_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },

    computed: {
      rows() {
        return this.table.filter(this.filterText);
      },

      pageRows() {
        this.pager.setPerPage(this.perPage);
        this.pager.setRows(this.rows);
        return this.pager.pageRows(this.currentPage);
      }
    },
  }
</script>

