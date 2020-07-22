<template>
  <div class="mes-main mes-work-order mes-material">
    <h3 class="mes-main-title">{{$t('shift_shiftManager')}}</h3>
    <div class="mes-material-handle mes-table-handle" style="border-top:none;">
      <div class="mes-btn-group">
        <!-- <el-button size="mini" icon="el-icon-search" @click="getShifts">查询</el-button>
        <span class="split-line">|</span> -->
        <el-button size="mini" icon="el-icon-plus" @click="handleShift('')">{{$t('common_Add')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-delete-solid" @click="deleteShifts('')">{{$t('common_Del')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-refresh"  @click="refreshData">{{$t('common_Refresh')}}</el-button>
      </div>
      <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
        layout="total,sizes, prev, pager, next, jumper, ->" :total="total"
        @current-change="handleCurrentChange" @size-change="handleSizeChange">
      </el-pagination>
    </div>
    <div class="mes-table">
      <el-table :data="shiftData" border highlight-current-row size="mini" @selection-change="selectRule">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
          <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod"></el-table-column>
          <el-table-column prop="officeName" :label="$t('common_Factory')" sortable align="center"></el-table-column>
          <el-table-column prop="shiftName" sortable :label="$t('shift_shiftName')" align="center"></el-table-column>
          <el-table-column prop="shiftType" sortable :label="$t('shift_shiftType')" align="center"></el-table-column>
          <el-table-column prop="beginTime" sortable :label="$t('common_startTime')" align="center"></el-table-column>
          <el-table-column prop="endTime" sortable :label="$t('common_endTime')" align="center"></el-table-column>
          <!-- <el-table-column prop="isInvalid" label="是否无效" align="center"></el-table-column> -->
          <el-table-column prop="shiftDesc" sortable :label="$t('common_Description')" align="center"></el-table-column>
          <el-table-column prop="lastEditedDt" sortable :label="$t('common_Lastedittime')" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column :label="$t('common_Operate')" align="center" width="120">
            <template slot-scope="scope">
              <handle-button @click="handleShift(scope.row)" iconClass='el-icon-edit-outline' :tipText="$t('common_Edit')"></handle-button>
              <handle-button @click="deleteShifts(scope.row.mPomShiftId)" iconClass='el-icon-delete' :tipText="$t('common_Del')" iconColor='#f56c6c'></handle-button>
            </template>
          </el-table-column>
      </el-table>
    </div>
     <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" class="handle-dialog" width="600px">
      <dialog-form v-if="dialogVisible" ref="dialog" @cannel="dialogVisible=false" @getShifts="getShifts" :isEdit="isEdit"></dialog-form>
    </el-dialog>
  </div>
</template>

<script>
import dialogForm from './dialogForm'
export default {
  data () {
    return {
      queryLevel: 1,
      shiftName: '',
      total: 0,
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      selectedList: [],
      shiftData: [],
      isEdit: false,
      dialogVisible: false
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? this.$t('shift_editShift') : this.$t('shift_addShift')
    }
  },
  methods: {
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getShifts()
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getShifts()
    },
    selectRule (selection) {
      this.selectedList = []
      selection.forEach(val => {
        this.selectedList.push(val.mPomShiftId)
      })
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    async getShifts () {
      let { shiftName, page, queryLevel } = this
      let data = Object.assign({ shiftName, queryLevel }, page)
      let res = await this.$api.getShiftList(data)
      this.total = res.data.totalNum
      this.shiftData = res.data.list
    },
    // 刷新数据，重新查询
    refreshData () {
      this.shiftName = ''
      this.page = {
        pageIndex: 1,
        pageSize: 10
      }
      this.getShifts()
    },
    handleShift (row) {
      if (row) {
        this.dialogVisible = true
        this.isEdit = true
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialog.dialogForm)
          this.$refs.dialog.dialogForm = this.$global.filterForm(row, keys)
          this.$refs.dialog.dialogForm.mPomShiftId = row.mPomShiftId
        })
      } else {
        this.dialogVisible = true
        this.isEdit = false
      }
    },
    async deleteShifts (id) {
      let ids = id ? [id] : this.selectedList
      let len = ids.length
      if (ids.length > 0) {
        let text = id ? 'shift_confirmDelCurShift' : 'shift_confirmDelSelShift'
        let confirmRes = await this.$myPrompt.confirm(this.$t(text))
        if (confirmRes) {
          let res = await this.$api.deleteShifts(ids)
          if ((this.total - len) % this.page.pageSize === 0) {
            this.page.pageIndex = this.page.pageIndex === 1 ? 1 : this.page.pageIndex - 1
          }
          this.getShifts()
          this.$message.success(res.msg)
        }
      } else {
        this.$message.warning(this.$t('shift_placeSelDelShift'))
      }
    }
  },
  created () {
    this.getShifts()
  },
  components: { dialogForm }
}
</script>
