<template>
  <div>
    <el-form :model="userForm"  ref="userForm" label-position="left" label-width="100px" class="el-row mes-form-rule" :rules="userRules" size="mini" v-if="alarmFrom ===1" @submit.native.prevent>
      <el-form-item label="员工：" class="el-col el-col-18">
        <el-input style="width:70%" v-model="userForm.cardId" clearable @keydown.enter.native="checkAndonUser"></el-input>
        <el-button style="width:15%;float:right" @click="checkAndonUser">确认</el-button>
      </el-form-item>
      <el-form-item label="选中的人员"  class="el-col el-col-24 mes-table">
        <el-table :data="userTable" border>
          <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
          <el-table-column prop="employeeCardId" label="人员工号" align="center"></el-table-column>
          <el-table-column prop="employeeName" label="人员名字" align="center"></el-table-column>
          <el-table-column label="操作" width="120" align="center">
            <template slot-scope="scope">
              <handle-button iconClass='el-icon-delete' tipText="删除" iconColor="#f56c6c" @click="deleteAndonUser(scope.$index)" ></handle-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
       <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
        <el-button type="primary" size="mini" @click="nextStep">下一步</el-button>
        <el-button size="mini" @click="$emit('cannelHandleDialog')">取消</el-button>
      </el-form-item>
    </el-form>
    <div class="mes-table" v-else-if="alarmFrom ===2">
       <el-row class="mes-table-handle">
        <el-col :span="12" style="float:right">
          <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
              layout="total, sizes, prev, pager, next, jumper, ->" :total="total"
            @current-change="handleCurrentChange"   @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
      </el-row>
      <div class="mes-table-content">
        <el-table :data="alarmListTable" border>
         <el-table-column type="index" label="序号" align="center" :index="indexMethod"></el-table-column>
         <el-table-column prop="docNo" label="报警单号" align="center"></el-table-column>
         <el-table-column prop="almStatus" label="报警状态" align="center"></el-table-column>
         <el-table-column prop="typeName" label="报警类型" align="center"></el-table-column>
         <el-table-column prop="failName" label="报警代码" align="center"></el-table-column>ty
         <el-table-column prop="almLevel" label="严重等级" align="center"></el-table-column>
         <el-table-column prop="almIp" label="报警终端ip" align="center"></el-table-column>
         <el-table-column prop="createdDt" label="报警时间" align="center" :formatter="dateFormatter" ></el-table-column>
         <el-table-column prop="employeeName" label="报警人" align="center"></el-table-column>
         <el-table-column label="操作" width="120" align="center">
            <template slot-scope="scope">
              <span style="cursor: pointer;color:#409EFF" @click="nextHandleStep(scope.row)">{{handleMethod(scope.row.almStatus)}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="text-align:end;margin-top:20px"><el-button type="primary" @click="cannelPage">关闭页面</el-button></div>
    </div>
    <el-form :model="alarmResonForm" ref="alarmResonForm" label-position="left" label-width="210px" :rules="reasonRules" class="el-row mes-form-rule" size="mini"  v-else-if="alarmFrom ===3" @submit.native.prevent>
      <el-form-item label="请输入异常代码或者异常原因：" class="el-col el-col-23">
        <el-input v-model="failReason" placeholder="过滤异常选项" @keydown.enter.native="getReasonData"></el-input>
      </el-form-item>
      <!-- form-item要给一个栅格布局  不然会盖住上面的输入框 -->
      <el-form-item label-width="120px" label="异常原因：" prop="failReasonId" class="el-row el-col el-col-24">
        <el-radio-group  v-model="alarmResonForm.failReasonId" size="medium"  style="width:100%">
          <el-radio border v-for="(option,i) in reasonList" :key="i" :label="option.mMomFailreasonId" class="el-col el-col-7" style="margin:7px" size="medium">{{option.failReason}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注 :" label-width="120px" class="el-col el-col-23">
        <el-input v-model="alarmResonForm.remark" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
        <el-button type="primary" size="mini" @click="saveAndonReason">{{handleButton}}</el-button>
        <el-button size="mini" @click="backStep">上一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userForm: {
        cardId: ''
      },
      userRules: {},
      userTable: [],
      userIdList: [],
      alarmListTable: [],
      alarmFrom: 1,
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
      reasonList: [],
      failReason: '',
      alarmResonForm: {
        failReasonId: '',
        remark: ''
      },
      operateType: 0,
      mAlmAlarmlistId: '',
      reasonRules: {
        failReasonId: [{ required: true, message: '请选择异常原因' }]
      }
    }
  },
  props: {
    handleDialogWidth: Function,
    mAlmTypeId: String,
    mPomLineId: String,
    cannelHandleDialog: Function,
    getAlarmType: Function
  },
  computed: {
    handleButton () {
      return this.operateType === 1 ? '接警' : '关闭报警'
    }
  },
  methods: {
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getTableData()
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getTableData()
    },
    // valueFormatter (row, column, cellValue, index) {
    //   return cellValue === '0' ? '未处理' : '处理中'
    // },
    handleMethod (option) {
      return option === '未处理' ? '接警' : '关闭'
    },
    dateFormatter (row, column, cellValue, index) {
      return cellValue ? this.$dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    checkAndonUser () {
      this.$refs.userForm.validate(async valid => {
        if (valid) {
          let { cardId } = this.userForm
          if (this.userIdList.indexOf(cardId) === -1) {
            let res = await this.$api.getEmployeeByCardId({ cardId })
            if (res.data) {
              this.userTable.push(res.data)
              this.userIdList.push(res.data.employeeCardId)
              this.userForm.cardId = ''
            } else {
              this.$message.warning('该员工号不存在！')
            }
          } else {
            this.$message.warning('该员工已经被选中')
          }
        }
      })
    },
    deleteAndonUser (index) {
      this.userTable.splice(index, 1)
      this.userIdList.splice(index, 1)
    },
    nextStep () {
      let { userTable } = this
      const len = userTable.length
      if (len > 0) {
        this.alarmFrom = 2
        this.$emit('handleDialogWidth', 2)
        this.getAlarmList()
      } else {
        this.$message.warning('请先选中接警人员')
      }
    },
    // 获未关闭或待处理的报警列表
    async getAlarmList () {
      let { page, mAlmTypeId, mPomLineId } = this
      const data = Object.assign(page, { mAlmTypeId, mPomLineId })
      let res = await this.$api.getAlarmList(data)
      if (res.code === '200') {
        this.alarmListTable = res.data.list
        this.total = res.data.totalNum
      } else {
        this.alarmListTable = []
        this.total = 0
      }
    },
    nextHandleStep (option) {
      if (option.almStatus === '未处理') {
        this.operateType = 1
      } else {
        this.operateType = 2
      }
      this.alarmFrom = 3
      this.$emit('handleDialogWidth', 3)
      this.getReasonData()
      this.mAlmAlarmlistId = option.mAlmAlarmlistId
    },
    backStep () {
      this.alarmResonForm.failReasonId = ''
      this.alarmResonForm.remark = ''
      this.alarmFrom = 2
      this.$emit('handleDialogWidth', 2)
      this.getAlarmList()
    },
    cannelPage () {
      this.$emit('cannelHandleDialog')
      this.$emit('getAlarmType')
    },
    // 获取全部异常原因
    async getReasonData () {
      let failReason = this.failReason ? this.failReason : ''
      let data = {
        officeCode: '',
        failReason: failReason,
        pageIndex: 1,
        pageSize: 1000
      }
      let res = await this.$api.getTpmFailReasonList(data)
      if (res.code === '200') {
        this.reasonList = res.data.list
      } else {
        this.reasonList = []
      }
    },
    saveAndonReason () {
      this.$refs.alarmResonForm.validate(async valid => {
        if (valid) {
          let { userTable, mAlmAlarmlistId, operateType } = this
          let { failReasonId } = this.alarmResonForm
          let jobNumberList = []
          userTable.forEach(item => {
            jobNumberList.push(item.employeeCardId)
          })
          let mMomFailreasonId = failReasonId
          const data = Object.assign({ jobNumberList, mAlmAlarmlistId, mMomFailreasonId, operateType })
          const res = await this.$api.receiveOrCloseAlarm(data)
          this.$myPrompt.handleMsg(res, () => {
            this.backStep()
          })
        }
      })
    }
  },
  created () {
    this.$emit('handleDialogWidth', 1)
  }

}
</script>
