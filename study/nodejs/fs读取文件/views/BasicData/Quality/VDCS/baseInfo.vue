<template>
  <div class="vdcs-baseInfo">
    <el-form :model="infoData" ref="infoData" :rules="rules"   label-width="180px" label-position="left" class="el-row mes-form-rule"  style="margin-top:1.5vh"  size="mini">
      <el-form-item label="验收单号" prop="inspectNo" class="el-col el-col-11">
        <el-select
          v-model="infoData.inspectNo"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="getBatchNo"
          :loading="selectLoading"
          @change="getIqcInfoByGrNo"
          v-if="isEdit">
          <el-option
            v-for="item in inspectNoList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <span  v-else>{{infoData.inspectNo}}</span>
      </el-form-item>
      <el-form-item label="订单号" prop="poNo" class="el-col el-col-11 el-col-offset-1">
        <el-input  v-model="infoData.poNo" v-if="isEdit"></el-input>
        <span v-else>{{infoData.poNo}}</span>
      </el-form-item>
      <el-form-item label="发生日期" prop="vdcsDate" class="el-col el-col-11">
        <el-date-picker  v-model="infoData.vdcsDate" type="date" :editable="false"  style="width:100%" value-format="yyyy-MM-dd HH:mm:ss" v-if="isEdit"> </el-date-picker>
        <span v-else>{{infoData.vdcsDate}}</span>
      </el-form-item>
      <el-form-item label="料号" prop="partNo" class="el-col el-col-11 el-col-offset-1">
        <material-select  v-model="infoData.partNo" :materialNoVersion="infoData.sipVer ? `${infoData.partNoVn}:${infoData.sipVer}` : infoData.partNoVn" style="width:100%" @change="getProductName" v-if="isEdit"></material-select>
        <span v-else>{{infoData.sipVer ? `${infoData.partNoVn}:${infoData.sipVer}` : infoData.partNoVn}}</span>
      </el-form-item>
      <el-form-item label="厂商" prop="vendor" class="el-col el-col-11">
        <mes-select v-model="infoData.vendor" method="getVendors" labelKey="mWmsVendorName" valueKey="mWmsVendorId" v-if="isEdit"></mes-select>
        <span v-else>{{infoData.vendorVn}}</span>
      </el-form-item>
      <el-form-item label="交货批号" prop="lotNo" class="el-col el-col-11 el-col-offset-1">
        <el-input v-model="infoData.lotNo" v-if="isEdit"></el-input>
        <span v-else>{{infoData.lotNo}}</span>
      </el-form-item>
      <el-form-item label="交货数量" prop="qty" class="el-col el-col-11">
        <el-input  v-model="infoData.qty" v-if="isEdit"></el-input>
        <span v-else>{{infoData.qty}}</span>
      </el-form-item>
      <el-form-item label="抽样数" prop="sampleQty" class="el-col el-col-11 el-col-offset-1">
        <el-input v-model="infoData.sampleQty" v-if="isEdit"></el-input>
        <span v-else>{{infoData.sampleQty}}</span>
      </el-form-item>
      <el-form-item label="不良数" prop="failQty" class="el-col el-col-11 ">
        <el-input v-model="infoData.failQty" v-if="isEdit"></el-input>
        <span v-else>{{infoData.failQty}}</span>
      </el-form-item>
      <el-form-item label="特采单号" prop="waiveNo" class="el-col el-col-11 el-col-offset-1">
        <el-input  v-model="infoData.waiveNo" v-if="isEdit"></el-input>
        <span v-else>{{infoData.waiveNo}}</span>
      </el-form-item>
      <el-form-item label="品管确认" prop="qcConfirm" class="el-col el-col-11">
        <!-- <mes-select v-model="infoData.qcConfirm" method="getPersonList" labelKey="userName" valueKey="userCode" v-if="isEdit"></mes-select> -->
        <el-select  v-model="infoData.qcConfirm" :filterable="true" :clearable="true" style="width: 100%;"  v-if="isEdit">
          <el-option v-for="(option,i) in userList" :key="i" :label="option.userName" :value="option.userCode"></el-option>
        </el-select>
        <span v-else>{{infoData.qcConfirmVn}}</span>
      </el-form-item>
      <el-form-item label="采购确认" prop="pcConfirm" class="el-col el-col-11 el-col-offset-1">
        <!-- <mes-select v-model="infoData.pcConfirm" method="getPersonList" labelKey="userName" valueKey="userCode" v-if="isEdit"></mes-select> -->
        <el-select  v-model="infoData.pcConfirm" :filterable="true" :clearable="true" style="width: 100%;"  v-if="isEdit">
          <el-option v-for="(option,i) in userList" :key="i" :label="option.userName" :value="option.userCode"></el-option>
        </el-select>
        <span v-else>{{infoData.pcConfirmVn}}</span>
      </el-form-item>
      <el-form-item label="发现地点" prop="place" class="el-col el-col-11">
        <dict-select v-model="infoData.place" dictType="VDCS_FIND_LOCATION"  selectKey="dictCode" v-if="isEdit"></dict-select>
        <span v-else>{{infoData.placeVn}}</span>
      </el-form-item>
      <el-form-item label="是否重大异常" prop="isBigFail" class="el-col el-col-11 el-col-offset-1">
        <el-radio-group v-model="infoData.isBigFail" v-if="isEdit">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
        <span v-else>{{infoData.isBigFail ? '是' : '否'}}</span>
      </el-form-item>
      <el-form-item label="缺点描述" prop="failDesc" class="el-col el-col-23">
        <el-input type="textarea" :rows="3" v-model="infoData.failDesc" v-if="isEdit"></el-input>
        <span v-else>{{infoData.failDesc}}</span>
      </el-form-item>
      <el-form-item label="是否加严检验" prop="isTighten" class="el-col el-col-11">
        <el-radio-group v-model="infoData.isTighten" v-if="isEdit">
         <el-radio :label="1">是</el-radio>
         <el-radio :label="0">否</el-radio>
        </el-radio-group>
        <span v-else>{{infoData.isBigFail ? '是' : '否'}}</span>
      </el-form-item>
      <el-form-item label="回复正常检验时机" prop="returnNormal" class="el-col el-col-11 el-col-offset-1">
        <el-input v-model="infoData.returnNormal" v-if="isEdit"></el-input>
        <span v-else>{{infoData.returnNormal}}</span>
      </el-form-item>
      <el-form-item label="是否需要厂商回复对策" prop="isVendorReply" class="el-col el-col-11">
        <el-radio-group v-model="infoData.isVendorReply" v-if="isEdit">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
        <span v-else>{{infoData.isBigFail ? '是' : '否'}}</span>
      </el-form-item>
       <el-form-item label="厂商回复日期" prop="replyDate" class="el-col el-col-11 el-col-offset-1">
        <el-date-picker  v-model="infoData.replyDate" type="date" :editable="false"  style="width:100%" value-format="yyyy-MM-dd HH:mm:ss" v-if="isEdit"> </el-date-picker>
        <span v-else>{{infoData.replyDate}}</span>
      </el-form-item>
      <el-form-item label="不良品寄出日期" prop="sendDate" class="el-col el-col-11">
        <el-date-picker  v-model="infoData.sendDate" type="date" :editable="false"  style="width:100%" value-format="yyyy-MM-dd HH:mm:ss" v-if="isEdit"> </el-date-picker>
        <span v-else>{{infoData.sendDate}}</span>
      </el-form-item>
      <el-form-item label="已交货不良品处理方式" prop="handleMethod" class="el-col el-col-11 el-col-offset-1">
        <dict-select v-model="infoData.handleMethod" dictType="VDCS_Defect_Handle"  selectKey="dictCode" v-if="isEdit"></dict-select>
        <span v-else>{{infoData.handleMethodVn}}</span>
      </el-form-item>
      <el-form-item label="备注" prop="baseComment" class="el-col el-col-23">
        <el-input type="textarea" :rows="3" v-model="infoData.baseComment" v-if="isEdit"></el-input>
        <span v-else>{{infoData.baseComment}}</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import materialSelect from '@/components/Module/materialSelect/materialSelect'
import mesSelect from '@/components/Module/Select/select'

export default {
  data () {
    return {
      inspectNoList: [],
      selectLoading: false,
      infoData: {
        inspectNo: '',
        poNo: '',
        vdcsDate: '',
        partNo: '',
        partNoVn: '',
        sipVer: '',
        vendor: '',
        vendorVn: '',
        lotNo: '',
        qty: '',
        sampleQty: '',
        failQty: '',
        waiveNo: '',
        qcConfirm: '',
        qcConfirmVn: '',
        pcConfirm: '',
        pcConfirmVn: '',
        place: '',
        placeVn: '',
        isBigFail: '',
        failDesc: '',
        isTighten: '',
        returnNormal: '',
        isVendorReply: '',
        replyDate: '',
        sendDate: '',
        handleMethod: '',
        handleMethodVn: '',
        baseComment: ''
      },
      rules: {
        inspectNo: [{ required: true, message: '请选择验收单号' }],
        poNo: [{ required: true, message: '请输入订单号' }],
        vdcsDate: [{ required: true, message: '请选择发生日期' }],
        partNo: [{ required: true, message: '请输入料号' }],
        vendor: [{ required: true, message: '请输入厂商' }],
        lotNo: [{ required: true, message: '请输入交货批号' }],
        qty: [{ pattern: /^\d+$/, required: true, message: '请输入非负整数' }],
        sampleQty: [{ pattern: /^\d+$/, required: true, message: '请输入非负整数' }],
        failQty: [{ pattern: /^\d+$/, required: true, message: '请输入非负整数' }],
        waiveNo: [{ required: true, message: '请输入特采单号' }],
        qcConfirm: [{ required: true, message: '请输入品管确认' }],
        pcConfirm: [{ required: true, message: '请输入采购确认' }],
        place: [{ required: true, message: '请输入发现地点' }],
        isBigFail: [{ required: true, message: '请选择是否重大异常' }],
        failDesc: [{ required: true, message: '请输入缺点描述' }],
        isTighten: [{ required: true, message: '请选择是否加严检验' }],
        returnNormal: [{ required: true, message: '请输入回复正常检验时机' }],
        isVendorReply: [{ required: true, message: '请选择是否需要厂商回复对策' }],
        replyDate: [{ required: true, message: '请选择厂商回复日期' }],
        sendDate: [{ required: true, message: '请选择不良品寄出日期' }],
        handleMethod: [{ required: true, message: '请输入已交货不良品处理方式' }],
        baseComment: [{ required: true, message: '请输入备注' }]
      }
    }
  },
  props: {
    isEdit: {
      type: Boolean,
      default: true
    },
    formData: {
      type: Object
    },
    userList: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    formData (n, o) {
      this.setForm(n)
    }
  },
  methods: {
    orderChange (option) {
      this.infoData.qty = option.REQUEST_QTY
      this.infoData.manufactueDate = this.$dayjs(option.SCH_START_DT).format('YYYY-MM-DD HH:mm:ss')
    },
    async getBatchNo (query) {
      let res = await this.$api.getBatchNo({ batchNo: query.trim() })
      if (res.code === '200') {
        this.inspectNoList = res.data && res.data.map(item => {
          return {
            value: item,
            label: item
          }
        })
      }
    },
    async getIqcInfoByGrNo () {
      let { inspectNo } = this.infoData
      let res = await this.$api.getIqcInfoByGrNo({ grNo: inspectNo })
      if (res.code === '200') {
        let { poNo, inspectDate, mComMaterialId, mComMaterialNo, vendorCode, lotNo, lotQty, sampleQty, defectQty, aod, sqe, sipVer } = res.data && res.data
        this.infoData.poNo = poNo || ''
        this.infoData.vdcsDate = inspectDate || ''
        this.infoData.partNo = mComMaterialId || ''
        this.infoData.partNoVn = mComMaterialNo || ''
        this.infoData.vendor = vendorCode || ''
        this.infoData.lotNo = lotNo || ''
        this.infoData.qty = lotQty ? parseInt(lotQty) : ''
        this.infoData.sampleQty = sampleQty ? parseInt(sampleQty) : ''
        this.infoData.failQty = defectQty ? parseInt(defectQty) : ''
        this.infoData.waiveNo = aod || ''
        this.infoData.qcConfirm = sqe || ''
        this.infoData.sipVer = sipVer || ''
      }
    },
    async getProductName () {
      let partId = this.infoData.partNo
      let res = await this.$api.getTypeAndNameByPartNo({ partId })
      if (res.code === '200') {
        this.infoData.partName = res.data.productName
      } else {
        this.infoData.partName = ''
      }
    },
    // 获取表单数据
    getData () {
      return JSON.parse(JSON.stringify(this.infoData))
    },
    // 数据验证
    checkData () {
      let flag = false
      this.$refs['infoData'].validate(valid => {
        if (valid) {
          flag = true
        }
      })
      return flag
    },
    // 重置表单
    resetFields () {
      this.$refs.infoData.resetFields()
    },
    // 设置表单数据
    setForm (data) {
      Object.keys(this.infoData).forEach(key => {
        this.infoData[key] = data[key] || data[key] === 0 ? data[key] : ''
      })
    }
  },
  components: {
    materialSelect,
    mesSelect
  },
  created () {
    this.formData && this.setForm(this.formData)
  }
}
</script>

<style lang="scss">
.vdcs-baseInfo {
  .el-select {
    width: 100%;
  }
  // .form-input-detail {
  //   display: block;
  //   width: 100%;
  //   text-overflow: ellipsis;
  //   white-space: nowrap;
  //   overflow: hidden;
  // }
}
</style>
