<template>
<div class="mes-table-content" >
  <!-- <table style="border:1px solid " cellpadding="10" cellspacing="0" class="table-cc">
  <tr>
    <th colspan="2">{{$t('conChartHome_SubgrNumb')}}</th>
    <td>1</td>
    <td>2</td>
    <td>3</td>
    <td>4</td>
  </tr>
  <tr>
    <th align="center"  colspan="1" rowspan="5">{{$t('conChartHome_SamplValu')}}</th>
  </tr>
   <tr>
    <th colspan="1">1</th>
    <td>1</td>
    <td>2</td>
    <td>3</td>
    <td>4</td>
  </tr>
   <tr>
    <th colspan="1">2</th>
    <td>1</td>
    <td>2</td>
    <td>3</td>
    <td>4</td>
  </tr>
   <tr>
    <th colspan="1">3</th>
    <td>1</td>
    <td>2</td>
    <td>3</td>
    <td>4</td>
  </tr>
   <tr>
    <th colspan="1">4</th>
    <td>1</td>
    <td>2</td>
    <td>3</td>
    <td>4</td>
  </tr>
  <tr>
    <th colspan="2">XBar</th>
    <td>1</td>
    <td>2</td>
    <td>3</td>
    <td>4</td>
  </tr>
  <tr>
    <th colspan="2">R</th>
    <td>1</td>
    <td>2</td>
    <td>3</td>
    <td>4</td>
  </tr>
</table> -->

<!-- <div class="control-table">
  <div class="control-table-tr" >
    <div class="control-table-th"  colspan="2">{{$t('conChartHome_SubgrNumb')}}</div>
    <div class="control-table-td" >1</div>
    <div class="control-table-td" >2</div>
  </div>
  <div class="control-table-tr">
    <div class="control-table-th"  rowspan="5" colspan="2">{{$t('conChartHome_SamplValu')}}</div>
  </div>
  <div class="control-table-tr" >
    <div class="control-table-th" >1</div>
    <div class="control-table-td" >1</div>
    <div class="control-table-td" >2</div>
  </div>
</div> -->
<el-table :data="tableData" border highlight-current-row size="mini">
  <el-table-column type="index" :label="$t('common_Number')" align="center" ></el-table-column>
  <el-table-column :label="$t('conChartHome_SamplValu')" align="center">
    <el-table-column v-for="(option,i) in sampleList" :key="i" :label="option" :prop="option" align="center"></el-table-column>
  </el-table-column>
  <el-table-column  v-for="(option,i) in typeList" :key="i" :label="option" :prop="option" align="center"></el-table-column>
</el-table>

</div>

</template>

<script>
export default {
  data () {
    return {
      keyList: [],
      sampleList: [],
      typeList: []
    }
  },
  computed: {

  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    setDefaultData () {
      this.keyList = Object.keys(this.tableData[0])
      this.len = this.keyList.length - 2
      this.sampleList = this.keyList.slice(0, this.len)
      this.typeList = this.keyList.slice(this.len, this.keyList.length)
    }

  },
  created () {
    this.setDefaultData()
  }
}
</script>

<style lang="scss" scoped>
.control-table {
  display: table;
  .control-table-tr {
    display: table-row;
    .control-table-th {
      display: table-cell;
      font-size: 20px;
      border: 1px solid black;
      padding: 10px;
    }
    .control-table-td {
      display: table-cell;
      font-size: 10px;
      border: 1px solid black;
      padding: 10px;
    }
  }
}

.table-cc {
  tr {
    th {
      border: 1px solid black;
      padding: 10px;
    }
    td {
      border: 1px solid black;
      padding: 10px;
    }
  }
}
</style>
