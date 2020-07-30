<template>
  <div class="vdcs-baseInfo">
    <el-form :model="infoData" ref="infoData" :rules="rules"   label-width="220px" label-position="left" class="el-row mes-form-rule"  style="margin-top:1.5vh"  size="mini">
      <el-form-item :label="$t('VDCS_AcceptanceNo')" prop="inspectNo" class="el-col el-col-11">
        <el-select
          v-model="infoData.inspectNo"
          filterable
          remote
          reserve-keyword
          :placeholder="$t('common_PleasEnteKeyWor')"
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
      <el-form-item :label="$t('VDCS_OrderNo')" prop="poNo" class="el-col el-col-11 el-col-offset-1">
        <el-input  v-model="infoData.poNo" v-if="isEdit"></el-input>
        <span v-else>{{infoData.poNo}}</span>
      </el-form-item>
      <el-form-item :label="$t('VDCS_OccurrenceDate')" prop="vdcsDate" class="el-col el-col-11">
        <el-date-picker  v-model="infoData.vdcsDate" type="date" :editable="false"  style="width:100%" value-format="yyyy-MM-dd HH:mm:ss" v-if="isEdit"> </el-date-picker>
        <span v-else>{{infoData.vdcsDate}}</span>
      </el-form-item>
      <el-form-item :label="$t('common_PorN')" prop="partNo" class="el-col el-col-11 el-col-offset-1">
        <material-select  v-model="infoData.partNo" :materialNoVersion="infoData.sipVer ? `${infoData.partNoVn}:${infoData.sipVer}` : infoData.partNoVn" style="width:100%" @change="getProductName" v-if="isEdit"></material-select>
        <span v-else>{{infoData.sipVer ? `${infoData.partNoVn}:${infoData.sipVer}` : infoData.partNoVn}}</span>
      </el-form-item>
      <el-form-item :label="$t('VDCS_Manufacturer')" prop="vendor" class="el-col el-col-11">
        <mes-select v-model="infoData.vendor" method="getVendors" labelKey="mWmsVendorName" valueKey="mWmsVendorId" v-if="isEdit"></mes-select>
        <span v-else>{{infoData.vendorVn}}</span>
      </el-form-item>
      <el-form-item :label="$t('VDCS_DeliveryBatchNumber')" prop="lotNo" class="el-col el-col-11 el-col-offset-1">
        <el-input v-model="infoData.lotNo" v-if="isEdit"></el-input>
        <span v-else>{{infoData.lotNo}}</span>
      </el-form-item>
      <el-form-item :label="$t('VDCS_DeliveryQuantity')" prop="qty" class="el-col el-col-11">
        <el-input  v-model="infoData.qty" v-if="isEdit"></el-input>
        <span v-else>{{infoData.qty}}</span>
      </el-form-item>
      <el-form-item :label="$t('VDCS_SamplingNumber')" prop="sampleQty" class="el-col el-col-11 el-col-offset-1">
        <el-input v-model="infoData.sampleQty" v-if="isEdit"></el-input>
        <span v-else>{{infoData.sampleQty}}</span>
      </el-form-item>
      <el-form-item :label="$t('common_NumbeDefe')" prop="failQty" class="el-col el-col-11 ">
        <el-input v-model="infoData.failQty" v-if="isEdit"></el-input>
        <span v-else>{{infoData.failQty}}</span>
      </el-form-item>
      <el-form-item :label="$t('VDCS_SpecialPurchaseOrderNumber')" prop="waiveNo" class="el-col el-col-11 el-col-offset-1">
        <el-input  v-model="infoData.waiveNo" v-if="isEdit"></el-input>
        <span v-else>{{infoData.waiveNo}}</span>
      </el-form-item>
      <el-form-item :label="$t('VDCS_QualityControlConfirmation')" prop="qcConfirm" class="el-col el-col-11">
        <!-- <mes-select v-model="infoData.qcConfirm" method="getPersonList" labelKey="userName" valueKey="userCode" v-if="isEdit"></mes-select> -->
        <el-select  v-model="infoData.qcConfirm" :filterable="true" :clearable="true" style="width: 100%;"  v-if="isEdit">
          <el-option v-for="(option,i) in userList" :key="i" :label="option.userName" :value="option.userCode"></el-option>
        </el-select>
        <span v-else>{{infoData.qcConfirmVn}}</span>
      </el-form-item>
      <el-form-item :label="$t('VDCS_PurchaseConfirmation')" prop="pcConfirm" class="el-col el-col-11 el-col-offset-1">
        <!-- <mes-select v-model="infoData.pcConfirm" method="getPersonList" labelKey="userName" valueKey="userCode" v-if="isEdit"></mes-select> -->
        <el-select  v-model="infoData.pcConfirm" :filterable="true" :clearable="true" style="width: 100%;"  v-if="isEdit">
          <el-option v-for="(option,i) in userList" :key="i" :label="option.userName" :value="option.userCode"></el-option>
        </el-select>
        <span v-else>{{infoData.pcConfirmVn}}</span>
      </el-form-item>
      <el-form-item :label="$t('VDCS_FoundLocation')" prop="place" class="el-col el-col-11">
        <dict-select v-model="infoData.place" dictType="VDCS_FIND_LOCATION"  selectKey="dictCode" v-if="isEdit"></dict-select>
        <span v-else>{{infoData.placeVn}}</span>
      </el-form-item>
      <el-form-item :label="$t('VDCS_WhetherThereIsSignificantAbnormality')" prop="isBigFail" class="el-col el-col-11 el-col-offset-1">
        <el-radio-group v-model="infoData.isBigFail" v-if="isEdit">
          <el-radio :label="1">{{$t('common_Yes')}}</el-radio>
          <el-radio :label="0">{{$t('common_No')}}</el-radio>
        </el-radio-group>
        <span v-else>{{infoData.isBigFail ? $t('common_Yes') : $t('common_No')}}</span>
      </el-form-item>
      <el-form-item :label="$t('VDCS_DefectDescription')" prop="failDesc" class="el-col el-col-23">
        <el-input type="textarea" :rows="3" v-model="infoData.failDesc" v-if="isEdit"></el-input>
        <span v-else>{{infoData.failDesc}}</span>
      </el-form-item>
      <el-form-item :label="$t('VDCS_WhetherStrictInspectionIsRequired')" prop="isTighten" class="el-col el-col-11">
        <el-radio-group v-model="infoData.isTighten" v-if="isEdit">
         <el-radio :label="1">{{$t('common_Yes')}}</el-radio>
         <el-radio :label="0">{{$t('common_No')}}</el-radio>
        </el-radio-group>
        <span v-else>{{infoData.isBigFail ? $t('common_Yes') : $t('common_No')}}</span>
      </el-form-item>
      <el-form-item :label="$t('VDCS_TimeToReturnToNormalInspection')" prop="returnNormal" class="el-col el-col-11 el-col-offset-1">
        <el-input v-model="infoData.returnNormal" v-if="isEdit"></el-input>
        <span v-else>{{infoData.returnNormal}}</span>
      </el-form-item>
      <el-form-item :label="$t('VDCS_WhetherManufacturer')" prop="isVendorReply" class="el-col el-col-11">
        <el-radio-group v-model="infoData.isVendorReply" v-if="isEdit">
          <el-radio :label="1">{{$t('common_Yes')}}</el-radio>
          <el-radio :label="0">{{$t('common_No')}}</el-radio>
        </el-radio-group>
        <span v-else>{{infoData.isBigFail ? $t('common_Yes') : $t('common_No')}}</span>
      </el-form-item>
       <el-form-item :label="$t('VDCS_ManufacturerReplyDate')" prop="replyDate" class="el-col el-col-11 el-col-offset-1">
        <el-date-picker  v-model="infoData.replyDate" type="date" :editable="false"  style="width:100%" value-format="yyyy-MM-dd HH:mm:ss" v-if="isEdit"> </el-date-picker>
        <span v-else>{{infoData.replyDate}}</span>
      </el-form-item>
      <el-row style="display: inline-block;width: 100%;">
        <el-form-item :label="$t('VDCS_DeliveryDateOfDefectiveProducts')" prop="sendDate" class="el-col el-col-11">
          <el-date-picker  v-model="infoData.sendDate" type="date" :editable="false"  style="width:100%" value-format="yyyy-MM-dd HH:mm:ss" v-if="isEdit"> </el-date-picker>
          <span v-else>{{infoData.sendDate}}</span>
        </el-form-item>
        <el-form-item :label="$t('VDCS_DeliveredNoGoodProductProcessingMethod')" prop="handleMethod" class="el-col el-col-11 el-col-offset-1">
          <dict-select v-model="infoData.handleMethod" dictType="VDCS_Defect_Handle"  selectKey="dictCode" v-if="isEdit"></dict-select>
          <span v-else>{{infoData.handleMethodVn}}</span>
        </el-form-item>
      </el-row>
      <el-form-item :label="$t('common_remarks')" prop="baseComment" class="el-col el-col-23">
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
  computed: {
    rules () {
      return {
        inspectNo: [{ required: true, message: this.$t('VDCS_PleaseSelectAcceptanceNumber') }],
        poNo: [{ required: true, message: this.$t('VDCS_PleaseInputOrderNumber') }],
        vdcsDate: [{ required: true, message: this.$t('VDCS_PleaseSelectOccurrenceDate') }],
        partNo: [{ required: true, message: this.$t('common_PleasEnteItemNu') }],
        vendor: [{ required: true, message: this.$t('VDCS_PleaseInputManufacturer') }],
        lotNo: [{ required: true, message: this.$t('VDCS_PleaseInputDeliveryBatchNumber') }],
        qty: [{ pattern: /^\d+$/, required: true, message: this.$t('VDCS_PleaseInputNonNegativeInteger') }],
        sampleQty: [{ pattern: /^\d+$/, required: true, message: this.$t('VDCS_PleaseInputNonNegativeInteger') }],
        failQty: [{ pattern: /^\d+$/, required: true, message: this.$t('VDCS_PleaseInputNonNegativeInteger') }],
        waiveNo: [{ required: true, message: this.$t('VDCS_PleaseInputSpecialPurchaseOrderNumber') }],
        qcConfirm: [{ required: true, message: this.$t('VDCS_PleaseInputQualityControlConfirmation') }],
        pcConfirm: [{ required: true, message: this.$t('VDCS_PleaseInputPurchaseConfirmation') }],
        place: [{ required: true, message: this.$t('VDCS_PleaseInputLocationOfDiscovery') }],
        isBigFail: [{ required: true, message: this.$t('VDCS_PleaseSelectWhetherMajorException') }],
        failDesc: [{ required: true, message: this.$t('VDCS_PleaseInputDefectDescription') }],
        isTighten: [{ required: true, message: this.$t('VDCS_PleaseSelectWhetherStrictInspection') }],
        returnNormal: [{ required: true, message: this.$t('VDCS_PleaseInputBackReturnToNormalInspectionTime') }],
        isVendorReply: [{ required: true, message: this.$t('VDCS_PleaseSelectWhetherTheManufacturerReplyCountermeasures') }],
        replyDate: [{ required: true, message: this.$t('VDCS_PleaseSelectTheManufacturerReplyDate') }],
        sendDate: [{ required: true, message: this.$t('VDCS_PleaseSelectTheDeliveryDateOfDefectiveProducts') }],
        handleMethod: [{ required: true, message: this.$t('VDCS_PleaseEnterTheHandlingMethodOfDeliveredDefectiveProducts') }],
        baseComment: [{ required: true, message: this.$t('VDCS_PleaseEnterRemarks') }]
      }
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
