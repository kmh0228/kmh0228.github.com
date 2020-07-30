<template>
  <el-table :data="tableData" border size="mini" :row-class-name="rowClassName" :class="changeSize">
    <el-table-column label="-" align="center" width="60" v-if="showCheckBox">
      <template slot-scope="scope">
        <el-checkbox v-model="scope.row.isChecked" @change="checkedCurrentRow(scope.row)"></el-checkbox>
      </template>
    </el-table-column>
    <el-table-column type="index" :label="$t('common_Number')" align="center" width="60" :index="indexMethod"></el-table-column>
    <el-table-column v-for="(col,i) in tableLabel" :key="i" :prop="col.key" :label="$t(col.label)" align="center"></el-table-column>
  </el-table>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: {
    tableLabel: {
      type: Array
    },
    tableData: {
      type: Array
    },
    rowClassName: {
      type: Function,
      default () {
        return () => { }
      }
    },
    checkedCurrentRow: {
      type: Function,
      default () {
        return () => { }
      }
    },
    showCheckBox: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  computed: {
    changeSize () {
      const changeFontSize = Number(localStorage.getItem('fontSize'))
      let size = ''
      switch (changeFontSize) {
        case 1:
          size = 'font-small'
          break
        case 2:
          size = 'font-normal'
          break
        case 3:
          size = 'font-bigger'
          break
        case 4:
          size = 'font-oversize'
          break
        default:
          size = 'font-normal'
          break
      }
      return size
    }
  },
  methods: {
    indexMethod (index) {
      return index + 1
    }
  }
}
</script>
