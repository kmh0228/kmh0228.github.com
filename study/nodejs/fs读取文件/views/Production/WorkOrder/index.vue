<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">工单管理</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <dict-select style="width:35%;" placeholder="工单状态" v-model="orderStatus" dictType="WORK_ORDER_STATUS" clearable @change="changeOrderStatus"></dict-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-input placeholder="请输入工单号" v-model.trim="keyWord" size="mini" style="width:40%;float:right;" @keydown.enter.native="searchWorkOrder"></el-input>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="11">
          <el-button size="mini" icon="el-icon-search" @click="searchWorkOrder">查询</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="workOrderHandle('')">新增</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="delJobOrders('')" :disabled="deleteBtnDisabled">批量删除</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-data-line" @click="workOrderOnline" :disabled="onlineBtnDisabled">上线</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">刷新</el-button>
          <span class="split-line">|</span>
          <el-dropdown>
            <el-button size="mini">操作<i class="el-icon-arrow-down el-icon--right"></i></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="jobBooking">报工上传</el-dropdown-item>
              <el-dropdown-item @click.native="downDialog = true">工单下载</el-dropdown-item>
              <el-dropdown-item @click.native="openSplitDialig">工单拆分</el-dropdown-item>
              <el-dropdown-item>导出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col :span="13">
          <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="slot, sizes, prev, pager, next, jumper, ->" :total="total" :current-page="page.pageIndex"
            @current-change="handleCurrentChange" @size-change="handleSizeChange">
          </el-pagination>
          <span class="page-total">共{{ pageTotal }}页</span>
        </el-col>
      </el-row>
      <!-- 工单列表 -->
      <div class="mes-table-content">
        <el-table :data="tableData" border highlight-current-row @current-change="tableCurrentChange" @selection-change="tableSelectChange"  @cell-click="cellClick" size="mini">
          <el-table-column type="selection" width="50" align="center" fixed="left"></el-table-column>
          <el-table-column type="index" label="序号" align="center" :index="indexMethod" fixed="left"></el-table-column>
          <el-table-column prop="DOC_NO" sortable label="工单号" label-class-name="mes-table-label" class-name="mes-table-click" align="center"></el-table-column>
          <el-table-column sortable label="料号" align="center">
            <template slot-scope="props">
              <span>{{ props.row.MATERIAL_NO}}{{ props.row.VERSION? `:${props.row.VERSION}` : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="REQUEST_QTY" sortable width="100" label="需求数量" align="center"></el-table-column>
          <el-table-column prop="T_POM_JOB_ORDER_SNTYPE" sortable label="SN来源" align="center" width="100"></el-table-column>
          <el-table-column prop="SCH_START_DT" sortable label="计划开始日期" show-overflow-tooltip :formatter="formatterDate" align="center"></el-table-column>
          <el-table-column prop="SCH_CLOSED_DT" sortable label="计划结束日期" show-overflow-tooltip :formatter="formatterDate" align="center"></el-table-column>
          <el-table-column prop="DOC_STATUS_NAME" sortable label="工单状态" :filters="fileterArray" width="130" :filter-method="filterTag" align="center" filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-tag :type="setTagColor(scope.row.DOC_STATUS_NAME)" size="mini">{{scope.row.DOC_STATUS_NAME }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="120" fixed="right">
            <template slot-scope="scope">
              <handle-button @click="workOrderHandle(scope.row)" iconClass='el-icon-edit-outline' tipText="编辑"></handle-button>
              <handle-button @click="delJobOrders(scope.row.T_POM_JOB_ORDER_ID)" iconClass='el-icon-delete' tipText="删除" iconColor='#f56c6c'></handle-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 工单详情 -->
    <div class="mes-main-tabs" v-if="showTas">
      <work-order-tabs :useType="0" :workOrderId="pickWorkOrder" ref="tabs"></work-order-tabs>
    </div>
    <!-- 导入SN上线 -->
    <el-dialog title="请选择需要导入的SN文件" :visible.sync="importDialog" width="600px" @close="closeUploadDialog" class="handle-dialog">
      <el-upload action="" drag style="text-align:center;" :before-upload="beforeUpload">
        <mes-icon icon="excel-icon" size="67px" style="display:inline-block;margin:40px 0 16px;" v-if="fileName"></mes-icon>
        <i class="el-icon-upload" v-else></i>
        <p v-if="fileName">{{ fileName }}</p>
        <div class="el-upload__text" v-else>
          拖动文件至此处，<em>点击上传</em> 或
          <em><a href="static/download/exportSSN.xlsx" style="color:#3B6F9A;text-decoration:none;" download="导入SSN模版.xlsx" @click="downloadSSNTemplate">模版下载</a></em>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="importOnline">确 定</el-button>
        <el-button @click="closeUploadDialog">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 展开SN上线 -->
    <el-dialog title="工单SN展开" :visible.sync="uploadDialog" width="850px" top="10vh" class="handle-dialog mes-table">
      <div class="dialog-btn-group">
        <el-button size="mini" @click="simulateExpandSn">模拟展开</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" @click="unfoldOnline">确定</el-button>
      </div>
      <el-form :model="uploadForm" ref="uploadForm" label-width="30%" label-position="left" class="el-row work-order-info">
        <el-form-item label="工单号" class="el-col el-col-12" >
          <p>{{ uploadForm.DOC_NO }}</p>
        </el-form-item>
        <el-form-item label="料号" class="el-col el-col-12" >
          <p>{{ uploadForm.MATERIAL_NO }}:{{ uploadForm.VERSION }}</p>
        </el-form-item>
        <el-form-item label="需求数量" class="el-col el-col-12" >
          <p>{{ uploadForm.REQUEST_QTY }}</p>
        </el-form-item>
        <el-form-item label="已展开数量" class="el-col el-col-12" >
          <p>{{ uploadForm.onLineNum }}</p>
        </el-form-item>
        <el-form-item label="本次展开数量" class="el-col el-col-12" >
          <el-input v-model="uploadForm.num" size="mini" disabled style="width:90%;"></el-input>
        </el-form-item>
      </el-form>
      <el-table :data="uploadSnList">
        <el-table-column type="index" label="序号" align="center" :index="uploadIndexMethod"></el-table-column>
        <el-table-column label="SN" align="center" prop="SN"></el-table-column>
          <el-table-column label="料号" align="center" prop="mNo">
            <template>
              <span>{{ uploadForm.MATERIAL_NO }}:{{ uploadForm.VERSION }}</span>
            </template>
          </el-table-column>
      </el-table>
      <el-row style="text-align:center;padding:1vh 0 0;">
        <el-pagination @size-change="snHandleSizeChange" @current-change="snHandleCurrentChange" :current-page="snPage.pageIndex"
        :page-size="snPage.pageSize" layout="total, prev, pager, next, jumper" :total="snTotal" background>
        </el-pagination>
      </el-row>
    </el-dialog>
     <!-- 下载工单 -->
    <el-dialog title="工单的下载" :visible.sync="downDialog" width="600px" class="handle-dialog">
      <el-form class="el-row mes-search-form" label-width="25%" label-position="left" >
          <el-form-item label="请选择日期范围" class="el-col el-col-24">
            <el-date-picker v-model="downloadTime" type="daterange"  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" :picker-options="pickerOptions"></el-date-picker>
          </el-form-item>
          <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
         <el-button type="primary" @click="gorder" >确 定</el-button>
        <el-button @click="downDialog = false">取 消</el-button>
      </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 工单拆分 -->
    <el-dialog title="工单SN展开" :visible.sync="splitDialog" width="1000px" top="8vh" class="handle-dialog mes-table">
      <div class="dialog-btn-group">
        <el-button size="mini" @click="splitJobOrder">模拟拆分</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" @click="saveChildJobOrder">确定</el-button>
      </div>
      <el-form :model="splitForm" ref="splitForm" :rules="spitRules" label-width="30%" label-position="left" class="el-row work-order-info">
        <el-form-item label="工单号" class="el-col el-col-12" >
          <p>{{ splitForm.docNo }}</p>
        </el-form-item>
        <el-form-item label="料号" class="el-col el-col-12" >
          <p>{{ splitForm.materialNo }}:{{ splitForm.version }}</p>
        </el-form-item>
        <el-form-item label="需求数量" class="el-col el-col-12" >
          <p>{{ splitForm.requestQty }}</p>
        </el-form-item>
        <el-form-item label="本次拆分数量" prop="splitQty" class="el-col el-col-12" >
         <el-input v-model.number="splitForm.splitQty" size="mini" style="width:90%;"></el-input>
        </el-form-item>
        <el-form-item label="子工单数量" prop="childOrderCount" class="el-col el-col-12" >
          <el-input v-model.number="splitForm.childOrderCount" size="mini" style="width:90%;"></el-input>
        </el-form-item>
        <el-form-item label="计划开始日期" class="el-col el-col-12" prop="schStartDt">
          <el-date-picker type="datetime" placeholder="选择日期" v-model="splitForm.schStartDt" style="width:90%;" size="mini"
            value-format="yyyy-MM-dd HH:mm:ss" :picker-options="splitPickerOptions" :default-time="startDefaultTime"></el-date-picker>
        </el-form-item>
        <el-form-item label="计划结束日期" class="el-col el-col-12" prop="schClosedDt">
          <el-date-picker type="datetime" placeholder="选择日期" v-model="splitForm.schClosedDt" style="width:90%;" size="mini"
            value-format="yyyy-MM-dd HH:mm:ss" :picker-options="splitPickerOptions" default-time="12:00:00"></el-date-picker>
        </el-form-item>
      </el-form>
      <el-table :data="splitOrderList">
        <el-table-column type="index" label="序号" align="center" :index="uploadIndexMethod"></el-table-column>
        <el-table-column label="工单号" prop="docNo" align="center"></el-table-column>
        <el-table-column label="父工单号" align="center">
          <template>
            <span>{{ splitForm.docNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="料号" align="center" prop="mNo">
          <template>
            <span>{{ splitForm.materialNo }}:{{ splitForm.version }}</span>
          </template>
        </el-table-column>
        <el-table-column label="需求数量" prop="requestQty" align="center"></el-table-column>
        <el-table-column label="预计开始日期" align="center" prop="mNo">
          <template>
            <span>{{ splitForm.schStartDt }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预计结束日期" align="center" prop="mNo">
          <template>
            <span>{{ splitForm.schClosedDt }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-row style="text-align:center;padding:1vh 0 0;">
        <el-pagination @size-change="splitHandleSizeChange" @current-change="splitHandleCurrentChange" :current-page="splitPage.pageIndex"
        :page-size="splitPage.pageSize" layout="total, prev, pager, next, jumper" :total="splitTotal" background>
        </el-pagination>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import workOrderTabs from './Tabs/tabs'
export default {
  data () {
    const startDtRule = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择预计开始日期'))
      } else {
        let nowTimestamp = this.$dayjs().valueOf()
        let selectTimestamp = this.$dayjs(value).valueOf()
        if (selectTimestamp < nowTimestamp - 60 * 1000) {
          callback(new Error('预计开始时间不能小于当前时间'))
        } else {
          callback()
        }
      }
    }
    const endDtRule = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择预计结束日期'))
      } else {
        let startDt = this.splitForm.schStartDt
        let startTimestamp = this.$dayjs(startDt).valueOf()
        let selectTimestamp = this.$dayjs(value).valueOf()
        if (selectTimestamp < startTimestamp) {
          callback(new Error('预计结束时间不能小于预计开始时间'))
        } else {
          callback()
        }
      }
    }
    const splitOrderQtyRule = (rule, value, callback) => {
      if (!value) {
        callback(new Error('工单拆分数量不能为空'))
      } else {
        const { requestQty } = this.splitForm
        if (requestQty < value) {
          callback(new Error('工单拆分数量不得超出需求数量'))
        } else {
          callback()
        }
      }
    }
    const splitCountRule = (rule, value, callback) => {
      if (!value) {
        callback(new Error('子工单数量不能为空'))
      } else {
        const { splitQty } = this.splitForm
        if (splitQty < value) {
          callback(new Error('子工单数量不得超出工单拆分数量'))
        } else {
          callback()
        }
      }
    }
    return {
      fileterArray: [{ text: '新建', value: '新建' }, { text: '已上线', value: '已上线' }],
      orderStatus: '',
      keyWord: '',
      total: 0,
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      sortDes: '',
      pickWorkOrder: null,
      tableData: [],
      ids: [],
      editBtnDisabled: false,
      onlineBtnDisabled: false,
      deleteBtnDisabled: false,
      importDialog: false,
      uploadDialog: false,
      fileName: '',
      fileContent: '',
      uploadForm: {
        num: 0
      },
      createdSnList: [],
      uploadSnList: [],
      snPage: {
        pageIndex: 1,
        pageSize: 10
      },
      snTotal: 0,
      downDialog: false,
      downloadTime: [],
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() > Date.now() - 24 * 3600 * 1000
        },
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      splitDialog: false,
      splitForm: {},
      splitPickerOptions: {
        disabledDate: time => {
          return time.getTime() < Date.now() - 24 * 3600 * 1000
        }
      },
      createdOrderList: [],
      splitOrderList: [],
      splitPage: {
        pageIndex: 1,
        pageSize: 10
      },
      spitRules: {
        splitQty: [{ required: true, validator: splitOrderQtyRule, trigger: 'blur' }],
        childOrderCount: [{ required: true, validator: splitCountRule, trigger: 'blur' }],
        schStartDt: [{ required: true, validator: startDtRule, trigger: 'blur' }],
        schClosedDt: [{ required: true, validator: endDtRule, trigger: 'blur' }]
      },
      splitTotal: 0,
      selectRows: []
    }
  },
  computed: {
    ...mapState(['isRefreshOrder']),
    pageTotal () {
      return this.total ? Math.ceil(this.total / this.page.pageSize) : 0
    },
    showTas () {
      return !!this.pickWorkOrder
    },
    startDefaultTime () {
      return this.$dayjs().add(2, 'm').format('HH:mm:ss')
    }
  },
  watch: {
    orderStatus (val) {
      if (val === 'WORK_ORDER_STUATUS3') {
        this.editBtnDisabled = false
        // this.onlineBtnDisabled = true
        this.deleteBtnDisabled = true
      } else if (val === 'WORK_ORDER_STUATUS2') {
        this.editBtnDisabled = true
        // this.onlineBtnDisabled = true
        this.deleteBtnDisabled = true
      } else {
        this.editBtnDisabled = false
        this.onlineBtnDisabled = false
        this.deleteBtnDisabled = false
      }
    },
    uploadDialog (val) {
      if (!val) {
        this.uploadSnList = []
        this.createdSnList = []
        this.snTotal = 0
      }
    },
    downDialog (val) {
      this.downloadTime = []
    },
    splitDialog (val) {
      if (!val) {
        this.splitOrderList = []
        this.createdOrderList = []
        this.splitTotal = 0
      }
    }
  },
  methods: {
    ...mapActions(['changeRefreshOrder']),
    setTagColor (status) {
      if (status === '新建') {
        return ''
      } else if (status === '已上线') {
        return 'success'
      } else if (status === '进行中') {
        return 'warning'
      } else {
        return 'danger'
      }
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getWorkOrderList()
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getWorkOrderList()
    },
    changeOrderStatus (val) {
      this.orderStatus = val
      this.getWorkOrderList()
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    filterTag (value, row) {
      return row.DOC_STATUS_NAME === value
    },
    // 刷新页面
    refreshPage () {
      this.page.pageIndex = 1
      this.page.pageSize = 10
      this.pickWorkOrder = ''
      this.getWorkOrderList()
    },
    cellClick (row, column, cell, event) {
      let { property } = column
      if (property === 'DOC_NO') {
        let workOrderStatus = row['DOC_STATUS_NAME']
        if (workOrderStatus) {
          if (workOrderStatus === '新建') {
            let workOrderId = row['T_POM_JOB_ORDER_ID']
            this.$router.push(`/Production/WorkOrder/Edit?Work_Order=${workOrderId}`)
          } else {
            this.$message.warning(`${workOrderStatus}工单无法进行编辑！`)
          }
        } else {
          this.$message.error(`当前工单状态有误，无法进行编辑！`)
        }
      }
    },
    /**
     * 新增/编辑工单信息
     * @param row 行内信息
     */
    workOrderHandle (row) {
      if (row) {
        const statusName = row.DOC_STATUS_NAME
        if (statusName === '新建') {
          const orderId = row.T_POM_JOB_ORDER_ID
          this.$router.push(`/Production/WorkOrder/Edit?Work_Order=${orderId}`)
        } else {
          this.$message.warning(`${statusName}工单无法进行编辑！`)
        }
      } else {
        this.$router.push('/Production/WorkOrder/Add')
      }
    },
    // 表格选中列数据，并赋值pickWorkOrder，编辑使用
    tableCurrentChange (val) {
      if (val) {
        let { T_POM_JOB_ORDER_ID } = val
        this.pickWorkOrder = T_POM_JOB_ORDER_ID
      }
    },
    tableSelectChange (selection) {
      this.ids = []
      this.selectRows = selection
      let statusArr = []
      selection.forEach(row => {
        let { DOC_STATUS_NAME, T_POM_JOB_ORDER_ID } = row
        statusArr.push(DOC_STATUS_NAME)
        this.ids.push(T_POM_JOB_ORDER_ID)
      })
      if (statusArr.indexOf('已上线') !== -1) {
        this.deleteBtnDisabled = true
      } else if (statusArr.indexOf('进行中') !== -1) {
        this.deleteBtnDisabled = true
      } else {
        this.deleteBtnDisabled = false
      }
      if (this.ids.length > 1) {
        this.editBtnDisabled = true
      } else {
        if (statusArr.indexOf('新建') === -1) {
          this.editBtnDisabled = true
        } else {
          this.editBtnDisabled = false
        }
      }
    },
    formatterDate (row, column, ceellValue) {
      return ceellValue ? this.$dayjs(ceellValue).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    // 获取工单数据列表
    async getWorkOrderList () {
      let { orderStatus, keyWord, sortDes } = this
      let data = Object.assign({ orderStatus, keyWord, sortDes }, this.page)
      let res = await this.$api.getJobOrdersByArg(data)
      this.total = res.data.total_num
      this.tableData = res.data.list
    },
    searchWorkOrder () {
      this.getWorkOrderList()
    },
    // 下载导入SSN模版
    downloadSSNTemplate (event) {
      event.stopPropagation()
    },
    // 下载工单
    async gorder () {
      const { downloadTime } = this
      if (downloadTime && downloadTime.length > 0) {
        let LowerDate = this.$dayjs(downloadTime[0]).format('YYYY-MM-DDTHH:mm:ss') + 'Z'
        let UpperDate = this.$dayjs(downloadTime[1]).format('YYYY-MM-DDTHH:mm:ss') + 'Z'
        let data = Object.assign({ LowerDate, UpperDate })
        let res = await this.$api.downOrderBySAP(data)
        this.$myPrompt.handleMsg(res, () => {
          this.downDialog = false
          this.getWorkOrderList()
        })
      } else {
        this.$message.warning('请先选择日期范围！')
      }
    },
    // 工单上线
    async workOrderOnline () {
      let { ids, tableData } = this
      let len = ids.length
      if (len === 1) {
        const selectObj = tableData.filter(item => {
          return item.T_POM_JOB_ORDER_ID === ids[0]
        })[0]
        let tPomJobOrderSntype = selectObj.T_POM_JOB_ORDER_SNTYPE
        if (tPomJobOrderSntype === '展开') {
          this.uploadForm = selectObj
          const requestQty = selectObj.REQUEST_QTY
          const onLineNum = selectObj.onLineNum || 0
          this.uploadForm.num = requestQty - onLineNum
          this.uploadDialog = true
        } else {
          this.importDialog = true
        }
      } else {
        this.$message.warning('请选择一条需要上线的工单！')
      }
    },
    // 上传文件 (并验证文件类型是否是excel)
    beforeUpload (file) {
      let fileName = file.name
      let fileReg = /\.(?:xls|xlsx)$/i
      if (fileReg.test(fileName)) {
        this.fileName = fileName
        // 将文件转换成base64格式
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = e => {
          this.fileContent = e.target.result
        }
      } else {
        this.$message.warning('文件类型必须是excel格式!')
      }
      return false
    },
    // 模拟展开SN
    async simulateExpandSn () {
      const num = this.uploadForm.num
      if (num > 0) {
        let data = {
          materialId: this.uploadForm.M_COM_MATERIAL_ID,
          orderId: this.uploadForm.T_POM_JOB_ORDER_ID,
          num
        }
        if (this.uploadSnList.length === 0) {
          let res = await this.$api.simulateExpandSn(data)
          let { code, msg } = res
          if (code === '200') {
            this.snTotal = num
            this.createdSnList = res.data
            this.snPage.pageIndex = 1
            this.uploadSnList = this.createdSnList.slice(0, 10)
          } else {
            this.$message.error(msg)
          }
        } else {
          let isConfirm = await this.$myPrompt.confirm('确定清除SN列表，重新生成SN吗？')
          if (isConfirm) {
            let res = await this.$api.simulateExpandSn(data)
            let { code, msg } = res
            if (code === '200') {
              this.snTotal = num
              this.createdSnList = res.data
              this.snPage.pageIndex = 1
              this.uploadSnList = this.createdSnList.slice(0, 10)
            } else {
              this.$message.error(msg)
            }
          }
        }
      } else {
        this.$message.warning('当前工单SN数量已到达需求数量！')
      }
    },
    // 展开上线
    async unfoldOnline () {
      const { uploadForm, createdSnList } = this
      const len = createdSnList.length
      if (len > 0) {
        const data = []
        createdSnList.map(item => {
          data.push({
            materialId: uploadForm.M_COM_MATERIAL_ID,
            orderId: uploadForm.T_POM_JOB_ORDER_ID,
            SN: item.SN
          })
        })
        const res = await this.$api.unfoldSnOnline(data)
        const { code, msg } = res
        if (code === '200') {
          this.$message.success(msg)
          // 工单上线成功，刷新表格
          this.getWorkOrderList()
          this.uploadDialog = false
        } else {
          this.$message.error(msg)
        }
      } else {
        this.$message.warning('请先模拟展开SN!')
      }
    },
    // 导入SN上线
    async importOnline () {
      let { fileContent } = this
      if (fileContent) {
        let orderId = this.ids[0]
        let res = await this.$api.importSnOnline({ orderId, fileContent })
        if (res.code === '200') {
          this.closeUploadDialog()
          // 工单上线成功，刷新表格
          this.getWorkOrderList()
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      } else {
        this.$message.warning('请上传需要导入的SN文件！')
      }
    },
    // 删除工单
    async delJobOrders (id) {
      let ids = id ? [id] : this.ids
      let len = ids.length
      if (len > 0) {
        let isConfirm = await this.$myPrompt.confirm('确定删除选中的工单吗？')
        if (isConfirm) {
          let res = await this.$api.delJobOrders(ids)
          let { code, msg } = res
          if (code === '200') {
            if ((this.total - len) % this.page.pageSize === 0) {
              this.page.pageIndex = this.page.pageIndex === 1 ? 1 : this.page.pageIndex - 1
            }
            this.getWorkOrderList()
            this.pickWorkOrder = null
            this.$message.success(msg)
          } else {
            this.$message.error(msg)
          }
        }
      } else {
        this.$message.warning('请选择需要删除的工单！')
      }
    },
    uploadIndexMethod (index) {
      let { pageIndex, pageSize } = this.snPage
      return pageSize * (pageIndex - 1) + index + 1
    },
    snHandleSizeChange (size) {
      this.snPage.pageSize = size
    },
    snHandleCurrentChange (index) {
      this.snPage.pageIndex = index
      let { pageSize } = this.snPage
      let startIndex = (index - 1) * pageSize
      let endIndex = startIndex + pageSize
      this.uploadSnList = this.createdSnList.slice(startIndex, endIndex)
    },
    closeUploadDialog () {
      this.importDialog = false
      this.fileName = ''
      this.fileContent = ''
    },
    // 工单拆分
    splitHandleSizeChange (size) {
      this.splitPage.pageSize = size
    },
    // 报工上传
    async jobBooking () {
      const { selectRows } = this
      const len = selectRows.length
      if (len > 0) {
        const statusArr = []
        selectRows.map(item => {
          statusArr.push(item.DOC_STATUS_NAME)
        })
        if (statusArr.indexOf('新建') !== -1) {
          this.$message.warning('所选工单中存在新建工单，无法报工上传，请重新选择！')
        } else {
          this.$message.success('报工上传成功！')
          this.getWorkOrderList()
        }
      } else {
        this.$message.warning('请先选择需要报工的工单！')
      }
    },
    splitHandleCurrentChange (index) {
      this.splitPage.pageIndex = index
      let { pageSize } = this.splitPage
      let startIndex = (index - 1) * pageSize
      let endIndex = startIndex + pageSize
      this.splitOrderList = this.createdOrderList.slice(startIndex, endIndex)
    },
    openSplitDialig () {
      let { ids, tableData } = this
      let len = ids.length
      if (len === 1) {
        const selectObj = tableData.filter(item => {
          return item.T_POM_JOB_ORDER_ID === ids[0]
        })[0]
        const orderStatus = selectObj.DOC_STATUS_NAME
        if (orderStatus === '新建') {
          this.splitForm = {
            tPomJobOrderId: selectObj.T_POM_JOB_ORDER_ID,
            docNo: selectObj.DOC_NO,
            materialNo: selectObj.MATERIAL_NO,
            version: selectObj.VERSION,
            requestQty: selectObj.REQUEST_QTY
          }
          this.splitDialog = true
        } else {
          this.$message.warning(`${orderStatus}工单无法进行拆分，请重新选择!`)
        }
      } else {
        this.$message.warning('请选择一条需要拆分的工单！')
      }
    },
    splitJobOrder () {
      this.$refs.splitForm.validate(async valid => {
        if (valid) {
          const { tPomJobOrderId, childOrderCount, splitQty } = this.splitForm
          const data = { tPomJobOrderId, childOrderCount, splitQty }
          const res = await this.$api.jobOrderSplit(data)
          if (res.code === '200') {
            this.splitTotal = childOrderCount
            this.createdOrderList = res.data
            this.splitPage.pageIndex = 1
            this.splitOrderList = this.createdOrderList.slice(0, 10)
          } else {
            this.$message.error(res.msg)
          }
        }
      })
    },
    async saveChildJobOrder () {
      const { createdOrderList, splitForm } = this
      if (createdOrderList.length > 0) {
        const parentJobOrderId = splitForm.tPomJobOrderId
        const { schStartDt, schClosedDt } = splitForm
        const list = []
        createdOrderList.map(item => {
          list.push({
            childJobOrder: item.docNo,
            requestQty: item.requestQty,
            parentJobOrderId,
            schStartDt,
            schClosedDt
          })
        })
        const res = await this.$api.saveChildJobOrder(list)
        this.$myPrompt.handleMsg(res, () => {
          this.splitDialog = false
          this.getWorkOrderList()
        })
      } else {
        this.$message.error('请先模拟展开子工单！')
      }
    }
  },
  components: {
    workOrderTabs
  },
  created () {
    this.getWorkOrderList()
  },
  activated () {
    if (this.isRefreshOrder) {
      this.refreshPage()
      this.changeRefreshOrder(false)
    }
  }
}
</script>
