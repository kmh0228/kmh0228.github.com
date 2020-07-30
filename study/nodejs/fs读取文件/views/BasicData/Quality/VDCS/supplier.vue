<template>
  <div>
    <el-form :model="infoData" ref="infoData" :rules="rules"   label-width="220px" label-position="left" class="el-row mes-form-rule"  style="margin-top:1.5vh"  size="mini">
      <el-form-item :label="$t('VDCS_ManufacturerOpinion')" prop="vendorIdea" class="el-col el-col-11">
        <dict-select v-model="infoData.vendorIdea" dictType="VDCS_Response"  selectKey="dictCode" v-if="isEdit"></dict-select>
        <span v-else>{{infoData.vendorIdeaVn}}</span>
      </el-form-item>
      <el-form-item label="" prop="vendorIdeaAdd" class="el-col el-col-12" label-width="10px">
        <el-input :placeholder="$t('VDCS_OtherCommentsSupplement')" v-model="infoData.vendorIdeaAdd" v-if="isEdit"></el-input>
         <span v-else>{{infoData.vendorIdeaAdd}}</span>
      </el-form-item>
      <el-form-item :label="$t('VDCS_QualityAbnormalityInventory')" prop="stockQty" class="el-col el-col-11">
        <el-input v-model="infoData.stockQty" v-if="isEdit"></el-input>
         <span v-else>{{infoData.stockQty}}</span>
      </el-form-item>
      <el-form-item :label="$t('VDCS_RootCauseAnalysis')" prop="basicReason" class="el-col el-col-23">
        <el-input type="textarea" :rows="3" v-model="infoData.basicReason" v-if="isEdit"></el-input>
         <span v-else>{{infoData.basicReason}}</span>
      </el-form-item>
      <el-form-item :label="$t('VDCS_TemporaryCountermeasures')" prop="tempWay" class="el-col el-col-23">
        <el-input type="textarea" :rows="3" v-model="infoData.tempWay" v-if="isEdit"></el-input>
         <span v-else>{{infoData.tempWay}}</span>
      </el-form-item>
      <el-form-item :label="$t('VDCS_Long_termCountermeasures')" prop="longWay" class="el-col el-col-23">
        <el-input type="textarea" :rows="3" v-model="infoData.longWay" v-if="isEdit"></el-input>
         <span v-else>{{infoData.longWay}}</span>
      </el-form-item>
      <el-form-item :label="$t('common_enclo')" prop="vendorAttach" class="el-col el-col-23">
        <upload-file ref="uploadFile" :limit="10" :defaultFileArr="infoData.fileDatalist ? infoData.fileDatalist : []" :disabled="!isEdit"></upload-file>
      </el-form-item>
      <el-form-item :label="$t('VDCS_Handling')" prop="vendorOperator" class="el-col el-col-11">
        <el-select  v-model="infoData.vendorOperator" :filterable="true" :clearable="true" style="width: 100%;"  v-if="isEdit">
          <el-option v-for="(option,i) in userList" :key="i" :label="option.userName" :value="option.userCode"></el-option>
        </el-select>
         <span v-else>{{infoData.vendorOperatorVn}}</span>
      </el-form-item>
      <el-form-item :label="$t('VDCS_Review')" prop="vendorConfirmer" class="el-col el-col-11 el-col-offset-1">
        <el-select  v-model="infoData.vendorConfirmer" :filterable="true" :clearable="true" style="width: 100%;"  v-if="isEdit">
          <el-option v-for="(option,i) in userList" :key="i" :label="option.userName" :value="option.userCode"></el-option>
        </el-select>
         <span v-else>{{infoData.vendorConfirmerVn}}</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import uploadFile from '@/components/Module/uploadFile'
export default {
  data () {
    return {
      infoData: {
        vendorIdea: '',
        vendorIdeaVn: '',
        vendorIdeaAdd: '',
        stockQty: '',
        basicReason: '',
        tempWay: '',
        longWay: '',
        fileDatalist: '',
        vendorOperator: '',
        vendorOperatorVn: '',
        vendorConfirmer: '',
        vendorConfirmerVn: ''
      }
    }
  },
  computed: {
    rules () {
      return {
        vendorIdea: [{ required: true, message: this.$t('VDCS_PleaseInputTheManufacturerOpinions') }],
        vendorIdeaAdd: [{ required: true, message: this.$t('VDCS_PleaseInputOtherCommentsToSupplement') }],
        stockQty: [{ pattern: /^\d+$/, required: true, message: this.$t('VDCS_PleaseInputNonNegativeInteger') }],
        basicReason: [{ required: true, message: this.$t('VDCS_PleaseInputRootCauseAnalysis') }],
        tempWay: [{ required: true, message: this.$t('VDCS_PleaseInputTemporaryCountermeasures') }],
        longWay: [{ required: true, message: this.$t('VDCS_PleaseInputLong_termCountermeasures') }],
        vendorOperator: [{ required: true, message: this.$t('VDCS_PleaseSelectHandle') }],
        vendorConfirmer: [{ required: true, message: this.$t('VDCS_PleaseSelectAudit') }]
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
    // 获取表单数据
    getData () {
      let files = this.$refs.uploadFile.getFileData()
      this.infoData.files = files.filter(item => item.raw).map(item => item.raw)
      this.infoData.attachIds = files.filter(item => !item.raw).map(item => item.id)
      return this.infoData
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
    uploadFile
  },
  created () {
    this.formData && this.setForm(this.formData)
  }

}
</script>

<style lang="scss">
</style>
