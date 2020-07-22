<template>
  <div class="mes-main mes-work-order mes-material">
    <h3 class="mes-main-title">线别工站管理</h3>
    <el-form label-position="left">
      <el-form-item >
        <el-input v-model="lineStationName" placeholder="请输入工站名称" size="mini" style="width:12vw;" @keydown.enter.native="getLineList">
        </el-input>
      </el-form-item>
    </el-form>
    <div class="mes-material-handle mes-table-handle">
      <div class="mes-btn-group">
        <el-button size="mini" icon="el-icon-search" @click="getLineList">查询</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-plus"  @click="handleLine('')">新增</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-delete-solid" @click="deleteLines('')">批量删除</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-refresh"  @click="refreshData">刷新</el-button>
      </div>
      <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
        layout="total,sizes, prev, pager, next, jumper, ->" :total="total"
        @current-change="handleCurrentChange" @size-change="handleSizeChange">
      </el-pagination>
    </div>
    <div class="mes-table">
      <el-table :data="lineStationData" border highlight-current-row size="mini" @selection-change="selectTable">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column type="index" label="序号" width="80" align="center" :index="indexMethod"></el-table-column>
        <el-table-column prop="lineStationCode" label="工站代码" align="center" sortable></el-table-column>
        <el-table-column prop="lineStationName" label="工站名称" align="center" sortable></el-table-column>
        <el-table-column prop="lineName" label="线别" align="center" sortable></el-table-column>
        <el-table-column prop="mComEqpHierarchyId" label="设备层级" align="center" sortable></el-table-column>
        <el-table-column prop="segName" label="制程" align="center" sortable></el-table-column>
        <!-- <el-table-column prop="isInvalid" label="是否启用" align="center" :formatter="formatterBoolean"></el-table-column> -->
        <!-- <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <i class="el-icon-edit-outline mes-table-handle-icon"></i>
            <i class="el-icon-delete mes-table-handle-icon"  @click="deleteRows(scope.$index)"></i>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
            <handle-button @click="getPrinter(scope.row.mPomLineStationId)" iconClass='el-icon-printer' tipText="查看打印机"></handle-button>
            <handle-button @click="handleLine(scope.row)" iconClass='el-icon-edit-outline' tipText="编辑"></handle-button>
            <handle-button @click="deleteLines(scope.row.mPomLineStationId)" iconClass='el-icon-delete' tipText="删除" iconColor='#f56c6c'></handle-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :visible.sync="showDialog" :title="dialogTitle" class="handle-dialog" width="600px">
      <el-form :model="lineStationForm" v-if="showDialog" ref="lineStationForm" :rules="rules" label-width="30%" label-position="left" class="el-row mes-form-rule">
        <el-form-item label="工站代码" prop="lineStationCode" class="el-col el-col-24">
          <el-input v-model.trim="lineStationForm.lineStationCode" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="工站名称" prop="lineStationName" class="el-col el-col-24">
          <el-input v-model.trim="lineStationForm.lineStationName" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="线别" prop="mPomLineId" placeholder="请选择线别" class="el-col-24">
          <el-select v-model="lineStationForm.mPomLineId" size="mini" style="width:100%" >
            <el-option v-for="(option,i) in lineList" :key="i" :value="option.mPomLineId" :label="option.lineName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备层级" prop="mComEqpHierarchyId" placeholder="请选择设备层级" class="el-col el-col-24">
          <el-input v-model.trim="lineStationForm.mComEqpHierarchyId" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="制程" prop="mComProcessSegId" placeholder="请选择制程" class="el-col el-col-24">
          <el-select v-model="lineStationForm.mComProcessSegId" filterable clearable size="mini" style="width:100%">
            <el-option v-for="(option,i) in processList" :key="i" :value="option.mComProcessSegId" :label="option.segCode"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="showDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="showPrinterDialog" title="关联打印机" class="handle-dialog">
      <div class="dialog-btn-group">
        <el-button size="mini" @click="showChoiceDialog">新增</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" @click="delAssociatedPrinter">删除</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" @click="setDefaultPrinter" :disabled="defaultPrinterBtn">设置默认</el-button>
      </div>
      <div class="mes-table">
        <el-table :data="printerData" border size="mini" @selection-change="selectPrinter">
          <el-table-column type="selection" width="50" align="center"></el-table-column>
          <el-table-column prop="printerName" label="打印机" align="center"></el-table-column>
          <el-table-column prop="printerPath" label="打印机路径" align="center"></el-table-column>
          <el-table-column label="默认打印机" align="center">
            <template slot-scope="prop">
              <span>{{ prop.row.isDefault === '0'?'否':'是'}}</span>
            </template>
           </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="choiceDialog" title="选择打印机" width="500px" class="handle-dialog">
      <el-select v-model="mComPrinterId" size="mini" style="width:100%">
        <el-option v-for="(option,i) in printerList" :key="i" :label="option.printerName" :value="option.mComPrinterId"> </el-option>
      </el-select>
      <div class="dialog-footer">
        <el-button type="primary" @click="associatedPrinter">确 定</el-button>
        <el-button @click="choiceDialog=false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryLevel: 1,
      isEdit: '',
      processList: [],
      lineList: [],
      mComEqpHierarchyIdList: [],
      segNameList: [],
      lineStationCode: '',
      lineStationName: '',
      mPomLineStationId: '',
      total: 0,
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      lineStationData: [],
      selectedList: [],
      lineStationForm: {
        lineStationCode: '',
        lineStationName: '',
        mComEqpHierarchyId: '',
        mComProcessSegId: '',
        mPomLineId: ''
      },
      rules: {
        lineStationCode: [{ required: true, message: '工站代码不能为空' }],
        lineStationName: [{ required: true, message: '工站名称不能为空' }],
        mPomLineId: [{ required: true, message: '线别不能为空' }],
        mComEqpHierarchyId: [{ required: true, message: '设备层级不能为空' }],
        mComProcessSegId: [{ required: true, message: '制程不能为空' }]
      },
      showDialog: false,
      showPrinterDialog: false,
      printerData: [],
      choiceDialog: false,
      printerList: [],
      relationPrinters: [],
      mComPrinterId: ''
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? '编辑线别工站' : '新增线别工站'
    },
    sendData () {
      const { mPomLineStationId, lineStationForm, isEdit } = this
      const data = isEdit ? Object.assign({ mPomLineStationId }, lineStationForm) : lineStationForm
      return data
    },
    defaultPrinterBtn () {
      return this.relationPrinters.length !== 1
    }
  },
  methods: {
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getLineList()
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getLineList()
    },
    indexMethod (index) {
      const { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    selectTable (selection) {
      this.selectedList = []
      selection.forEach(val => {
        this.selectedList.push(val.mPomLineStationId)
      })
    },
    // 格式化是否启用
    // formatterBoolean (row, col) {
    //   return this.lineStationForm.isInvalid === '1' ? '是' : '否'
    // },
    // 获取线别列表
    async getLineList () {
      const { lineStationName, queryLevel } = this
      const data = Object.assign({ lineStationName, mPomLineStationId: '', queryLevel }, this.page)
      const res = await this.$api.getLineStationByLike(data)
      if (res.code === '200') {
        this.total = res.data.total_num
        this.lineStationData = res.data.list
      }
    },
    // 刷新请求参数，重新获取
    refreshData () {
      this.lineStationName = ''
      this.page = {
        pageIndex: 1,
        pageSize: 10
      }
      this.getLineList()
    },
    // 获取所有线别
    async getAllLine () {
      const data = { lineName: '', lineType: '', pageIndex: 1, pageSize: 1000 }
      const res = await this.$api.getLineList(data)
      this.lineList = res.data.list
    },
    // 获取制程信息
    async getProcess () {
      const data = {
        segCode: '',
        pageIndex: 1,
        pageSize: 1000
      }
      const res = await this.$api.getAllProcessList(data)
      this.processList = res.data.list
    },
    // 获取打印机信息
    async getPrinter (mPomLineStationId) {
      this.mPomLineStationId = mPomLineStationId
      const res = await this.$api.getPrinterByLineStationId({ mPomLineStationId })
      if (res.code === '200') {
        this.printerData = res.data
        this.showPrinterDialog = true
      } else {
        this.printerData = []
      }
    },
    showChoiceDialog () {
      this.choiceDialog = true
    },
    // 获取所有打印机
    async getPrinterList () {
      const data = {
        keyWord: '',
        pageIndex: 1,
        pageSize: 1000
      }
      let res = await this.$api.getPrinters(data)
      this.printerList = res.data.list
    },
    // 关联打印机
    async associatedPrinter () {
      const { mComPrinterId, mPomLineStationId } = this
      const data = { mComLinestationPrinterPrinterid: mComPrinterId, mComLinestationPrinterLinestationid: mPomLineStationId }
      const res = await this.$api.associatedPrinter(data)
      if (res.code === '200') {
        this.$message.success(res.msg)
        this.choiceDialog = false
        this.getPrinter(mPomLineStationId)
      } else {
        this.$message.error(res.msg)
      }
    },
    selectPrinter (selection) {
      this.relationPrinters = []
      selection.forEach(item => {
        this.relationPrinters.push(item.mComLinestationPrinterId)
      })
    },
    // 删除关联打印机
    async delAssociatedPrinter () {
      const { relationPrinters } = this
      const len = relationPrinters.length
      if (len > 0) {
        const isConfirm = await this.$myPrompt.confirm('确定删除选中的打印机吗？')
        if (isConfirm) {
          const res = await this.$api.deletePrinterAndStation(relationPrinters)
          const { code, msg } = res
          if (code === '200') {
            this.$message.success(msg)
            this.getPrinter(this.mPomLineStationId)
          } else {
            this.$message.error(msg)
          }
        }
      } else {
        this.$message.warning('请选择需要删除的关联打印机！')
      }
    },
    // 设置默认打印机
    async setDefaultPrinter () {
      const { relationPrinters, mPomLineStationId } = this
      const len = relationPrinters.length
      if (len === 1) {
        const isConfirm = await this.$myPrompt.confirm('确定设置选中的为默认打印机吗？')
        if (isConfirm) {
          const data = {
            mComLinestationPrinterId: relationPrinters[0],
            mComLinestationPrinterLinestationid: mPomLineStationId
          }
          let res = await this.$api.setDefaultPrinter(data)
          let { code, msg } = res
          if (code === '200') {
            this.$message.success(msg)
            this.getPrinter(mPomLineStationId)
          } else {
            this.$message.error(msg)
          }
        }
      } else {
        this.$message.warning('默认打印机只能设置一个！')
      }
    },
    // 打开新增/编辑线别工站弹框
    handleLine (row) {
      const keys = Object.keys(this.lineStationForm)
      if (row) {
        this.isEdit = true
        this.mPomLineStationId = row.mPomLineStationId
        this.lineStationForm = this.$global.filterForm(row, keys)
      } else {
        this.isEdit = false
        keys.forEach(key => {
          this.lineStationForm[key] = ''
        })
      }
      this.showDialog = true
    },
    // 删除线别工站
    async deleteLines (id) {
      let ids = id ? [id] : this.selectedList
      if (ids.length > 0) {
        let result = await this.$myPrompt.confirm('确定删除当前选择的线别工站吗？')
        if (result) {
          let res = await this.$api.deleteLineStationById(ids)
          let { code, msg } = res
          if (code === '200') {
            this.$message.success(msg)
            this.getLineList()
          } else {
            this.$message.error(msg)
          }
        }
      } else {
        this.$message.warning('请选择需要删除的线别工站！')
      }
    },
    // 提交表单
    submitForm () {
      const vm = this
      vm.$refs['lineStationForm'].validate(async valid => {
        if (valid) {
          let { isEdit, sendData } = vm
          let res = isEdit ? await this.$api.updateLineStationById(sendData) : await this.$api.insertLineStation(sendData)
          let { msg, code } = res
          if (code === '200') {
            this.$message.success(msg)
            this.showDialog = false
            this.getLineList()
          } else {
            this.$message.error(msg)
          }
        }
      })
    }
  },
  created () {
    this.getLineList()
    this.getAllLine()
    this.getProcess()
    this.getPrinterList()
  }
}
</script>
