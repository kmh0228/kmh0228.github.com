<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">ESOP播放排程管理</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-input style="width:40%" placeholder="请输入料号" v-model="materialNo" @keydown.native.enter="getTableData" clearable></el-input>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button  size="mini" icon="el-icon-search" @click="getTableData">查询</el-button>
          <span class="split-line">|</span>
          <el-button  size="mini" icon="el-icon-plus" @click="handleTable(false)">新增</el-button>
          <span class="split-line">|</span>
          <!-- <el-button  size="mini" @click="handleTable(true)">编辑</el-button>
          <span class="split-line">|</span> -->
          <el-button  size="mini" icon="el-icon-delete-solid" @click="deleteTable">批量删除</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">刷新</el-button>
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
          <el-table-column type="index" align="center" label="序号" :index="indexMethod"></el-table-column>
          <el-table-column prop="materialNo" sortable label="料号" align="center"></el-table-column>
          <el-table-column prop="lineCode" sortable label="线别" align="center" ></el-table-column>
          <el-table-column prop="startTime" sortable label="开始时间" align="center" :formatter="dateFormatter"></el-table-column>
          <el-table-column prop="endTime" sortable label="结束时间" align="center" :formatter="dateFormatter" ></el-table-column>
          <el-table-column prop="intervals" sortable label="播放间隔/单位：S" align="center" ></el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" class="handle-dialog" width="600px" :close-on-click-modal="false">
      <dialog-from v-if="dialogVisible" @cancel="cancel" ref="dialog" :isEdit="isEdit" @getTableData="getTableData"></dialog-from>
    </el-dialog>
    <div class="mes-main-tabs" v-if="showTas">
      <el-tabs v-model="activeName">
        <el-tab-pane label="ESOP物料文档" name="detail">
          <el-table :data="detailList" border highlight-current-row size="mini">
            <el-table-column type="index" align="center" label="序号" ></el-table-column>
            <el-table-column prop="docNo" sortable label="文档编号" align="center"></el-table-column>
            <el-table-column prop="docName" sortable label="文档名称" align="center" ></el-table-column>
            <el-table-column prop="version" sortable label="版本" align="center" ></el-table-column>
            <el-table-column prop="segCode" sortable label="制程" align="center" ></el-table-column>
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
      return this.isEdit ? '编辑ESOP播放排程' : '新增ESOP播放排程'
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
      const confirm = await this.$myPrompt.confirm('确定删除选中的播放排程信息吗?')
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
