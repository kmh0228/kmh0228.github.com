<template>
  <el-form :model="info" ref="infoForm" :rules="rules" label-width="30%" label-position="left" class="el-row work-order-info mes-form-rule">
    <el-form-item label="工单号" prop="docNo" class="el-col el-col-12" >
      <el-row class="mes-form-item" v-show="useType === 1">
        <el-col :lg="{span:13}" :xl="{span:16}">
          <el-input v-model="info.docNo" placeholder="请生成工单号" size="mini"></el-input>
        </el-col>
        <el-col :lg="{span:10,offset:1}" :xl="{span:7,offset:1}">
          <el-button type="primary" plain size="mini" style="width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" @click="createWrokOrderNum">按规则生成工单号</el-button>
        </el-col>
      </el-row>
       <p v-if="useType !== 1">{{ info.docNo }}</p>
    </el-form-item>
    <el-form-item label="料号" prop="mComMaterialId" class="el-col el-col-12">
      <p v-if="useType === 0">{{ materialNoVersion }}</p>
       <material-select v-else v-model="info.mComMaterialId" @change="materialChange" class="mes-form-item"></material-select>
    </el-form-item>
    <el-form-item label="工单类型" v-if="useType !== 0" prop="jobType" class="el-col el-col-12">
      <dict-select v-model="info.jobType" dictType="WORK_ORDER_TYPE" clearable style="width:90%"></dict-select>
    </el-form-item>
    <el-form-item label="需求数量" prop="requestQty" class="el-col el-col-12">
      <p v-if="useType === 0">{{ info.requestQty }}</p>
      <el-input v-else class="mes-form-item" size="mini" v-model.trim="info.requestQty"></el-input>
    </el-form-item>
    <el-form-item label="SN来源" prop="tPomJobOrderSntype" class="el-col el-col-12">
      <div slot="label" style="display:inline-block;">
        <span>SN来源</span>
        <help-tips content="SN来源为导入的工单需通过导入EXCEL文件生成SN，SN来源为展开的则在上线时根据编码规则自动拆分为SN" placement="right" />
      </div>
      <p v-if="useType === 0">{{ info.tPomJobOrderSntype }}</p>
      <el-select v-else v-model="info.tPomJobOrderSntype" placeholder="请选择SN来源" size="mini" class="mes-form-item">
        <el-option label="展开" value="展开"></el-option>
        <el-option label="导入" value="导入"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="完成数量" v-if="useType === 0" class="el-col el-col-12">
      <p>{{ info.outputQty }}</p>
    </el-form-item>
    <el-form-item label="状态" v-if="useType === 0" class="el-col el-col-12">
      <p>{{ info.docStatusName }}</p>
    </el-form-item>
    <el-form-item label="已上线数量" v-if="useType === 0" class="el-col el-col-12">
      <p>{{ info.onLineNum }}</p>
    </el-form-item>
    <el-form-item :label="useType === 0?'开始日期':'预计开始日期'" prop="schStartDt" class="el-col el-col-12">
      <p v-if="useType === 0">{{ info.schStartDt }}</p>
      <el-date-picker v-else type="datetime" placeholder="选择日期" v-model="info.schStartDt" class="mes-form-item" size="mini"
      value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" :default-time="startDefaultTime"></el-date-picker>
    </el-form-item>
    <el-form-item :label="useType === 0?'结束日期':'预计结束日期'" prop="schClosedDt" class="el-col el-col-12">
      <p v-if="useType === 0">{{ info.schClosedDt }}</p>
      <el-date-picker v-else type="datetime" placeholder="选择日期" v-model="info.schClosedDt" class="mes-form-item" size="mini"
      value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" default-time="12:00:00"></el-date-picker>
    </el-form-item>
    <el-form-item label="创建人" class="el-col el-col-12">
      <p v-if="useType === 0" class="mes-tabs-item_click">{{ info. creator }}</p>
      <el-input v-else disabled v-model="info.creator" class="mes-form-item" size="mini"></el-input>
    </el-form-item>
    <el-form-item label="创建时间" class="el-col el-col-12">
      <p v-if="useType === 0">{{ info.createdDt }}</p>
      <el-input v-else disabled v-model="info.createdDt" class="mes-form-item" size="mini"></el-input>
    </el-form-item>
    <el-form-item label="最后更新人" class="el-col el-col-12">
      <p v-if="useType === 0" class="mes-tabs-item_click">{{ info.lastEditor }}</p>
      <el-input v-else v-model="info.lastEditor" disabled  class="mes-form-item" size="mini"></el-input>
    </el-form-item>
    <el-form-item label="最后更新时间" class="el-col el-col-12">
      <p v-if="useType === 0">{{ info.lastEditedDt }}</p>
      <el-input v-else disabled class="mes-form-item" v-model="info.lastEditedDt" size="mini"></el-input>
    </el-form-item>
    <el-form-item label="预计出货日期" class="el-col el-col-12">
     <p v-if="useType === 0">{{ info.estDeliveryDt }}</p>
      <el-date-picker v-else type="datetime" placeholder="选择日期" v-model="info.estDeliveryDt" class="mes-form-item" size="mini"
      value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" :default-time="startDefaultTime"></el-date-picker>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapActions } from 'vuex'
import materialSelect from '@/components/Module/materialSelect/materialSelect'
export default {
  data () {
    return {
      materialList: [],
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() < Date.now() - 24 * 3600 * 1000
        }
      },
      materialColumns: [{
        key: 'materialNo',
        label: '料号'
      }, {
        key: 'materialName',
        label: '物料名称'
      }, {
        key: 'version',
        label: '版次'
      }, {
        key: 'mComMaterialtypeCode',
        label: '物料类型'
      }],
      materialSearch: {
        materialNo: '',
        materialType: ''
      }
    }
  },
  props: {
    useType: Number,
    info: Object,
    materialNoVersion: String
  },
  computed: {
    rules () {
      const startDtRule = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请选择预计开始日期'))
        } else {
          let nowTimestamp = this.$dayjs().valueOf()
          let selectTimestamp = this.$dayjs(value).valueOf()
          if (selectTimestamp < nowTimestamp - 60 * 1000) {
            callback(new Error('预计开始时间不能小于当前时间'))
            // callback()
          } else {
            callback()
          }
        }
      }
      const endDtRule = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请选择预计结束日期'))
        } else {
          let startDt = this.info.schStartDt
          let startTimestamp = this.$dayjs(startDt).valueOf()
          let selectTimestamp = this.$dayjs(value).valueOf()
          if (selectTimestamp < startTimestamp) {
            callback(new Error('预计结束时间不能小于预计开始时间'))
            // callback()
          } else {
            callback()
          }
        }
      }
      const requestQtyRule = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入需求数量'))
        } else {
          if (/^[1-9][0-9]*$/.test(value)) {
            callback()
          } else {
            callback(new Error('需求数量必须为正整数'))
          }
        }
      }
      if (this.useType === 0) {
        return {}
      } else if (this.useType === 1) {
        return {
          docNo: [{ required: true, message: '请生成工单号' }],
          mComMaterialId: [{ required: true, message: '请选择料号' }],
          jobType: [{ required: true, message: '请选择工单类型' }],
          requestQty: [{ required: true, validator: requestQtyRule, trigger: 'blur' }],
          tPomJobOrderSntype: [{ required: true, message: '请选择SN来源' }],
          schStartDt: [{ required: true, validator: startDtRule, trigger: 'blur' }],
          schClosedDt: [{ required: true, validator: endDtRule, trigger: 'blur' }]
        }
      } else if (this.useType === 2) {
        return {
          mComMaterialId: [{ required: true, message: '请选择料号' }],
          jobType: [{ required: true, message: '请选择工单类型' }],
          tPomJobOrderSntype: [{ required: true, message: '请选择SN来源' }],
          requestQty: [{ required: true, validator: requestQtyRule, trigger: 'blur' }],
          schStartDt: [{ required: true, validator: startDtRule, trigger: 'blur' }],
          schClosedDt: [{ required: true, validator: endDtRule, trigger: 'blur' }]
        }
      }
    },
    startDefaultTime () {
      return this.$dayjs().add(1, 'm').format('HH:mm:ss')
    }
  },
  methods: {
    ...mapActions(['changeRefreshOrder']),
    // 按规则生成工单号
    async createWrokOrderNum () {
      let res = await this.$api.getJobOrderNo('workOrder', 1)
      this.info.docNo = res.data
    },
    async materialChange (id) {
      const res = await this.$api.getMaterialAttribute(id)
      const { code, data } = res
      if (code === '200') {
        const workFlowId = data.mComMaterialPropWorkflowid || ''
        this.$emit('setWorkFlowId', workFlowId)
      } else {
        this.$emit('setWorkFlowId', '')
      }
    },
    // 保存基本信息
    saveWorkOrder () {
      const vm = this
      vm.$refs['infoForm'].validate(async valid => {
        if (valid) {
          let keys = ['docNo', 'mComMaterialId', 'requestQty', 'jobType', 'schStartDt', 'tPomJobOrderSntype', 'schClosedDt', 'creator', 'tPomJobOrderId', 'estDeliveryDt']
          let sendData = vm.$global.filterForm(vm.info, keys)
          let res = !sendData.tPomJobOrderId ? await vm.$api.createJobOrders(sendData) : await vm.$api.updJobOrders(sendData)
          let { code, data, msg } = res
          if (code === '200') {
            if (data) {
              this.$emit('set-workorder-id', data)
            }
            this.changeRefreshOrder(true)
            this.$message.success(msg)
          } else {
            this.$message.error(msg)
          }
        }
      })
    },
    refresWorkOrder () {
      this.$refs.infoForm.resetFields()
    }
  },
  created () {
    // if (this.useType !== 0) {
    //   this.getWorkOrderTypeList()
    // }
  },
  components: {
    materialSelect
  }
}
</script>
