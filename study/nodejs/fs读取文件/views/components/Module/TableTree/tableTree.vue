<template>
  <el-table :data="treeData" :show-header="false" ref="childTable" @row-click="childRowClick" :row-class-name="rowClassName" :cell-class-name="cellClassName">
    <el-table-column width="50"></el-table-column>
    <el-table-column :width="expandWidth"></el-table-column>
    <el-table-column type="expand" width="50">
      <template slot-scope="props">
        <expand-table v-if="props.row.child && props.row.child.length>0" :treeData="props.row.child" :columnList="childColumnList" :rowClick="childRowClick" :formatter="formatter" :rowClassName="rowClassName" :cellClassName="cellClassName" :handleRow="handleRow" :deleteRow="deleteRow"></expand-table>
      </template>
    </el-table-column>
    <el-table-column v-for="(col,i) in childColumnList" :key="i" :label="$t(col.label)" :prop="col.key" :width="col.width?col.width:''" :min-width="col.minWidth?col.minWidth:col.width" :formatter="formatter"></el-table-column>
    <el-table-column :label="$t('common_Operate')" width="120" align="center">
      <template slot-scope="scope">
        <i class="el-icon-edit-outline mes-table-handle-icon" @click.stop="handleRow(scope.row)"></i>
        <i class="el-icon-delete mes-table-handle-icon" style="color:#F56C6C;" @click.stop="deleteRow(scope.row)"></i>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'expandTable',
  data () {
    return {}
  },
  props: {
    treeData: {
      type: Array
    },
    columnList: {
      type: Array
    },
    rowClick: {
      type: Function
    },
    formatter: {
      type: Function
    },
    rowClassName: {
      type: Function
    },
    cellClassName: {
      type: Function
    },
    handleRow: {
      type: Function
    },
    deleteRow: {
      type: Function
    }
  },
  computed: {
    expandWidth () {
      if (this.treeData[0]) {
        let { level } = this.treeData[0]
        let width = (level - 1) * 50
        return String(width)
      } else {
        return '0'
      }
    },
    childColumnList () {
      let { columnList } = this
      let arr = JSON.parse(JSON.stringify(columnList))
      arr.forEach((val, index) => {
        if (index === 0) {
          val.width -= 50
        }
      })
      return arr
    }
  },
  methods: {
    childRowClick (row, column, event) {
      this.$refs.childTable.toggleRowExpansion(row)
      this.rowClick(row, column, event)
    }
  }
}
</script>
