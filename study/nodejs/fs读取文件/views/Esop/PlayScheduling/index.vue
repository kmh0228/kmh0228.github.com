<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('playSchedu_ESOPPlayScheMana')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-input style="width:40%" :placeholder="$t('common_PleasEnteItemNu')" v-model="materialNo" @keydown.native.enter="getTableData" clearable></el-input>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button  size="mini" icon="el-icon-search" @click="getTableData">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button  size="mini" icon="el-icon-plus" @click="handleTable(false)">{{$t('common_Add')}}</el-button>
          <span class="split-line">|</span>
          <!-- <el-button  size="mini" @click="handleTable(true)">{{$t('common_Edit')}}</el-button>
          <span class="split-line">|</span> -->
          <el-button  size="mini" icon="el-icon-delete-solid" @click="deleteTable">{{$t('common_Delete')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">{{$t('common_Refresh')}}</el-button>
        </el-col>
        <el-col :span="12">
          <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper, ->" :total="total" :current-page="page.pageIndex"
            @current-change="handleCurrentChange" @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
      </el-row>
      <div class="mes-table-content">
        <el-table :data="tableData"  border size="mini" @selection-change="selectionChange"  @cell-click="cellClick" highlight-current-row>
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" align="center" :label="$t('common_Number')" :index="indexMethod"></el-table-column>
          <el-table-column prop="materialNo" sortable :label="$t('common_PorN')" align="center"></el-table-column>
          <el-table-column prop="lineCode" sortable :label="$t('common_Line')" align="center" ></el-table-column>
          <el-table-column prop="startTime" sortable :label="$t('common_startTime')" align="center" :formatter="dateFormatter"></el-table-column>
          <el-table-column prop="endTime" sortable :label="$t('common_endTime')" align="center" :formatter="dateFormatter" ></el-table-column>
          <el-table-column prop="intervals" sortable label="播放间隔/单位：S" align="center" ></el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" class="handle-dialog" width="600px" :close-on-click-modal="false">
      <dialog-from v-if="dialogVisible" @cancel="cancel" ref="dialog" :isEdit="isEdit" @getTableData="getTableData"></dialog-from>
    </el-dialog>
    <div class="mes-main-tabs" v-if="showTas">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('playSchedu_MaterDocu')" name="detail">
          <el-table :data="detailList" border highlight-current-row size="mini">
            <el-table-column type="index" align="center" :label="$t('common_Number')" ></el-table-column>
            <el-table-column prop="docNo" sortable :label="$t('common_DocumNumb')" align="center"></el-table-column>
            <el-table-column prop="docName" sortable :label="$t('playSchedu_DocumName')" align="center" ></el-table-column>
            <el-table-column prop="version" sortable :label="$t('common_editi')" align="center" ></el-table-column>
            <el-table-column prop="segCode" sortable :label="$t('common_Process')" align="center" ></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import dialogFrom from './dialogFrom'
export default {
  data () {
    return {
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [],
      dialogVisible: false,
      isEdit: false,
      selectList: [],
      materialNo: '',
      showTas: false,
      activeName: 'detail',
      detailList: []
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? this.$t('playSchedu_EditESLPP') : this.$t('playSchedu_NewESOPP')
    }
  },
  methods: {
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getTableData()
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getTableData()
    },
    indexMethod (index) {
      let { pageSize, pageIndex } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    selectionChange (selection) {
      this.selectList = []
      selection.forEach(item => {
        this.selectList.push(item.mComDocScheduleId)
      })
    },
    async cellClick (row, column, cell, event) {
      this.showTas = true
      const partId = row.mcomMaterialId
      let res = await this.$api.queryDocRel({ partId })
      this.detailList = res.data
    },
    dateFormatter (row, column, cellValue, index) {
      return cellValue ? this.$dayjs(cellValue).add(8, 'hour').format('YYYY-MM-DD HH:mm:ss') : ''
    },
    async getTableData () {
      let { page, materialNo } = this
      let data = Object.assign({ materialNo }, page)
      let res = await this.$api.findPlaySchedulList(data)
      if (res.code === '200') {
        this.tableData = res.data.list
        this.total = res.data.totalNum
      } else {
        this.tableData = []
        this.total = 0
      }
    },
    refreshPage () {
      this.materialNo = ''
      this.page.pageIndex = 1
      this.page.pageSize = 10
      this.getTableData()
    },
    handleTable (isEdit) {
      this.isEdit = isEdit
      this.dialogVisible = true
      let selectObj
      if (isEdit) {
        let { tableData, selectList } = this
        let mComDocScheduleId = selectList[0]
        selectObj = tableData.filter(item => {
          return item.mComDocScheduleId === mComDocScheduleId
        })[0]
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialog.dialogForm)
          this.$refs.dialog.dialogForm = this.$global.filterForm(selectObj, keys)
          this.$refs.dialog.mComDocScheduleId = mComDocScheduleId
        })
      }
    },
    async deleteTable () {
      let { selectList } = this
      const confirm = await this.$myPrompt.confirm(this.$t('playSchedu_AreYouSureScheInfo') + '?')
      if (confirm) {
        let res = await this.$api.delPlaySchedul(selectList)
        this.$myPrompt.handleMsg(res, () => {
          this.getTableData()
        })
      }
    },
    cancel () {
      this.dialogVisible = false
    }

  },
  created () {
    this.getTableData()
  },
  components: {
    dialogFrom
  }
}
</script>
