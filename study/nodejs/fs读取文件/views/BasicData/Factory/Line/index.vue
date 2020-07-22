<template>
  <div class="mes-main mes-work-order mes-material">
    <h3 class="mes-main-title">{{$t('line_productionLine')}}</h3>
    <el-form label-position="left">
      <el-form-item >
        <el-input v-model="searchInfo.lineName" :placeholder="$t('line_lineName')" size="mini" style="width:12vw;" @keydown.enter.native="getLineList">
          <!-- <i slot="suffix" class="el-input__icon el-icon-search" @click="getLineList"></i> -->
        </el-input>
      </el-form-item>
    </el-form>
    <div class="mes-material-handle mes-table-handle">
      <div class="mes-btn-group">
        <el-button size="mini" icon="el-icon-search" @click="getLineList">{{$t('common_Inquire')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-plus"  @click="handleLine('')">{{$t('common_Add')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-delete-solid" @click="deleteLines('')">{{$t('common_Delete')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-refresh"  @click="refreshData">{{$t('common_Refresh')}}</el-button>
      </div>
      <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
        layout="total,sizes, prev, pager, next, jumper, ->" :total="total"
        @current-change="handleCurrentChange" @size-change="handleSizeChange">
      </el-pagination>
    </div>
    <div class="mes-table">
      <el-table :data="lineData" border highlight-current-row size="mini" @selection-change="selectLine">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod"></el-table-column>
        <el-table-column prop="officeName" :label="$t('common_Factory')" sortable align="center"></el-table-column>
        <el-table-column prop="lineCode" :label="$t('line_lineCode')" sortable align="center"></el-table-column>
        <el-table-column prop="lineName" :label="$t('line_lineName')" sortable align="center"></el-table-column>
        <el-table-column prop="lineType" :label="$t('line_lineType')" sortable align="center"></el-table-column>
        <el-table-column prop="lineDesc" :label="$t('common_Description')" sortable align="center"></el-table-column>
        <el-table-column prop="lastEditedDt" :label="$t('common_Lastedittime')" sortable align="center" show-overflow-tooltip :formatter="formatterDate"></el-table-column>
        <el-table-column :label="$t('common_Operate')" align="center" width="120">
          <template slot-scope="scope">
            <handle-button @click="handleLine(scope.row)" iconClass='el-icon-edit-outline' :tipText="$t('common_Edit')"></handle-button>
            <handle-button @click="deleteLines(scope.row.mPomLineId)" iconClass='el-icon-delete' :tipText="$t('common_Del')" iconColor='#f56c6c'></handle-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="$t(dialogTitle)" :visible.sync="dialogVisible" class="handle-dialog" width="600px">
      <dialog-form v-if="dialogVisible" ref="dialog" @cannel="dialogVisible=false" @getLineList="getLineList" :isEdit="isEdit"></dialog-form>
    </el-dialog>
  </div>
</template>

<script>
import dialogForm from './dialogForm'
export default {
  data () {
    return {
      searchInfo: {
        queryLevel: 1,
        lineName: '',
        lineType: ''
      },
      total: 0,
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      selectedList: [],
      lineData: [],
      isEdit: false,
      dialogVisible: false
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? 'line_editLine' : 'line_addLine'
    }
  },
  methods: {
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getLineList()
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getLineList()
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    formatterDate (row, column, ceellValue) {
      return this.$dayjs(ceellValue).format('YYYY-MM-DD HH:mm:ss')
    },
    selectLine (selection) {
      this.selectedList = []
      selection.forEach(val => {
        this.selectedList.push(val.mPomLineId)
      })
    },
    handleLine (row) {
      if (row) {
        this.dialogVisible = true
        this.isEdit = true
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialog.dialogForm)
          this.$refs.dialog.dialogForm = this.$global.filterForm(row, keys)
          this.$refs.dialog.dialogForm.mPomLineId = row.mPomLineId
        })
      } else {
        this.dialogVisible = true
        this.isEdit = false
      }
    },
    async getLineList () {
      let data = Object.assign(this.searchInfo, this.page)
      let res = await this.$api.getLineList(data)
      if (res.code === '200') {
        this.total = res.data.totalNum
        this.lineData = res.data.list
      } else {
        this.total = 0
        this.lineData = []
      }
    },
    // 刷新数据，重新查询
    refreshData () {
      for (let i in this.searchInfo) {
        this.searchInfo[i] = ''
      }
      this.page = {
        pageIndex: 1,
        pageSize: 10
      }
      this.getLineList()
    },
    async deleteLines (id) {
      let ids = id ? [id] : this.selectedList
      let len = ids.length
      if (ids.length > 0) {
        let text = id ? this.$t('line_comfirmDelCurLine') : this.$t('line_comfirmDelSelLine')
        let confirmRes = await this.$myPrompt.confirm(text)
        if (confirmRes) {
          let res = await this.$api.delLines(ids)
          if ((this.total - len) % this.page.pageSize === 0) {
            this.page.pageIndex = this.page.pageIndex === 1 ? 1 : this.page.pageIndex - 1
          }
          this.getLineList()
          this.$message.success(res.msg)
        }
      } else {
        this.$message.warning(this.$t('line_pleaseSelDelLine'))
      }
    }
  },
  created () {
    this.getLineList()
  },
  components: { dialogForm }
}
</script>
