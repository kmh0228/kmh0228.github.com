<template>
  <div class="doalog-table-select">
    <el-input v-model="content" size="mini" @focus="openDialog" :placeholder="$t('common_PleaseSelectPN')">
      <i slot="suffix" class="el-input__icon el-icon-search" @click="openDialog"></i>
    </el-input>
    <el-dialog :title="$t('common_PleasSele')" :visible.sync="dialogVisible" append-to-body>
      <el-row style="padding-bottom:1vh;">
        <el-col :span="7">
          <el-input v-model="keyWord" :placeholder="searchPlaceholder" size="mini" @keydown.enter.native="initData">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="initData"></i>
          </el-input>
        </el-col>
      </el-row>
      <el-row style="padding:1vh 0; overflow: hidden;border-top:1px solid #d4d4d4;">
        <div class="mes-btn-group" style="float:left;">
          <el-button size="mini" type="primary" @click="confirmAction">{{$t('common_ok')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" @click="dialogVisible = false">{{$t('common_cancel')}}</el-button>
        </div>
        <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
          layout="total,sizes, prev, pager, next, jumper, ->" :total="total"
          @current-change="handleCurrentChange" @size-change="handleSizeChange" style="float:right;">
        </el-pagination>
      </el-row>
      <div class="mes-table" v-if="dialogVisible">
        <el-table :data="tableData" border @selection-change="selectionCchange" @select-all="selectAll" @select="selectRow" ref="selectTable">
          <el-table-column type="selection" align="center"></el-table-column>
          <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod"></el-table-column>
          <el-table-column v-for="(col,i) in tableColumns" :key="i" :prop="col.key" :label="$t(col.label)" align="center"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import paging from '@/mixins/paging'
export default {
  mixins: [paging],
  data () {
    return {
      dialogVisible: false,
      tableData: [],
      content: '',
      hiddenValue: '',
      keyWord: '',
      selectList: []
    }
  },
  props: {
    value: [String, Number],
    contentValue: String,
    searchForm: Object,
    searchKey: String,
    showKey: [String, Array],
    selectId: String,
    searchPlaceholder: String,
    getDataFunction: String,
    tableColumns: Array,
    multiple: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    keyWord (val) {
      let key = this.searchKey
      this.searchForm[key] = val
    },
    contentValue (val) {
      this.content = val
    }
  },
  methods: {
    openDialog () {
      this.selectList = []
      this.dialogVisible = true
    },
    async initData () {
      const { page, searchForm, getDataFunction } = this
      const sendData = Object.assign(page, searchForm)
      let res = await this.$api[getDataFunction](sendData)
      const { data, code } = res
      if (code === '200') {
        this.tableData = data.list
        this.total = data.totalNum || data.total_num
        this.$emit('sendMateriaList', data.list)
      }
    },
    selectionCchange (selection) {
      const { multiple } = this
      if (multiple) {
        this.selectList = selection
      }
    },
    selectRow (selection, row) {
      const { multiple } = this
      if (!multiple) {
        this.$refs.selectTable.clearSelection()
        if (selection.length > 0) {
          this.$refs.selectTable.toggleRowSelection(row, true)
        }
        this.selectList = [row]
      }
    },
    selectAll () {
      const { multiple } = this
      if (!multiple) {
        this.$refs.selectTable.clearSelection()
      }
    },
    confirmAction () {
      const { selectList, selectId, multiple, showKey } = this
      if (selectList.length > 0) {
        if (!multiple) {
          this.content = ''
          if (typeof showKey === 'string') {
            this.content = selectList[0][showKey]
          } else {
            this.content = selectList[0][showKey[0]] + ':' + selectList[0][showKey[1]]
          }
        }
        this.$emit('input', selectList[0][selectId])
        this.$emit('change', selectList[0][selectId])
        if (!multiple) {
          this.$emit('select-change', selectList[0])
        } else {
          this.$emit('select-change', selectList)
        }
        this.dialogVisible = false
      } else {
        this.$message.warning(this.$t('component_selectNone'))
      }
    }
  },
  created () {
    this.initData()
  },
  mounted () {
    const { contentValue } = this
    if (contentValue) {
      this.content = contentValue
    }
  }
}
</script>

<style lang="scss">
.doalog-table-select {
  .el-dialog {
    .el-input__inner {
      border-color: #e4e7ed !important;
    }
  }
}
</style>
