<template>
  <el-form :model="form" ref="form" :rules="rules" label-width="120px" label-position="left" class="el-row mes-form-rule">
    <el-form-item :label="$t('docList_Depar')" prop="organizeid" class="el-col el-col-24">
      <el-select v-model.trim="form.organizeid" size="mini" style="width:100%;">
        <el-option v-for="(option,i) in deptList" :key="i" :label="option.department" :value="option.officeCode"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('docList_DocumType')" prop="mComDoctypeId" class="el-col el-col-24">
      <el-select v-model.trim="form.mComDoctypeId" size="mini" style="width:100%;">
        <el-option v-for="(option,i) in docTypeList" :key="i" :label="option.docType" :value="option.mComDoctypeId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('docList_file')" class="el-col el-col-24">
      <el-upload ref="upload" action="" :on-change="uploadChange" :on-remove="uploadRemove" :file-list="fileList" :auto-upload="false">
        <el-button slot="trigger" size="mini" type="primary">{{$t('docList_SelecFile')}}</el-button>
      </el-upload>
    </el-form-item>
    <el-form-item :label="$t('common_DocumNumb')" prop="docNo" class="el-col el-col-24">
      <el-row class="mes-form-item">
        <el-col :lg="{span:15}" :xl="{span:18}">
          <el-input v-model="form.docNo" :placeholder="$t('docList_generDocuNumb')" size="mini" :disabled="isEdit"></el-input>
        </el-col>
        <el-col :lg="{span:8,offset:1}" :xl="{span:5,offset:1}">
          <el-button :disabled="isEdit" type="primary" plain size="mini" style="width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"  @click="createDocNo">{{$t('docList_AutomGene')}}</el-button>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item :label="$t('docList_DocumName')" prop="docName" class="el-col el-col-24">
      <el-input v-model="form.docName" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_editi')" prop="version" class="el-col el-col-11">
      <el-input v-model="form.version" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('docList_EncryOrNot')" class="el-col el-col-11 el-col-offset-2">
      <el-radio v-model="form.isEncrypt" :label="true">{{$t('common_Yes')}}</el-radio>
      <el-radio v-model="form.isEncrypt" :label="false">{{$t('common_No')}}</el-radio>
    </el-form-item>
    <el-form-item :label="$t('common_Description')" prop="docDesc" class="el-col el-col-24">
      <el-input type="textarea" v-model="form.docDesc" size="mini"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveEsopDoc">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      form: {
        organizeid: '',
        mComDoctypeId: '',
        docNo: '',
        docName: '',
        file: '',
        version: '',
        isEncrypt: true,
        docDesc: ''
      },
      fileList: []
    }
  },
  computed: {
    rules () {
      return {
        organizeid: [{ required: true, message: this.$t('docList_selecYourDepa') }],
        mComDoctypeId: [{ required: true, message: this.$t('docList_selecDocuType') }],
        docNo: [{ required: true, message: this.$t('docList_DocumNumbCannBeEmpt') }],
        docName: [{ required: true, message: this.$t('docList_documNameCannBeEmpt') }],
        version: [{ required: true, message: this.$t('docList_VersiCannBeEmpt') }]
      }
    }
  },
  props: {
    deptList: Array,
    docTypeList: Array,
    isEdit: Boolean
  },
  methods: {
    uploadChange (file, fileList) {
      this.fileList = []
      this.fileList.push(file)
      this.form.docName = file.name
      this.form.file = file.raw
    },
    uploadRemove (file, fileList) {
      this.form.docName = ''
      this.form.file = ''
    },
    async createDocNo () {
      const res = await this.$api.getJobOrderNo('DOCNO', 1)
      if (res.code === '200') {
        this.form.docNo = res.data
      } else {
        this.$message.error(res.msg)
      }
    },
    saveEsopDoc () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const { isEdit, form } = this
          const formData = new FormData()
          const keys = Object.keys(form)
          keys.forEach(key => {
            formData.append(key, form[key] === undefined ? '' : form[key])
          })
          const res = isEdit ? await this.$api.editEsopDocList(formData) : await this.$api.addEsopDocList(formData)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getEsopDocList')
          })
        }
      })
    }
  }
}
</script>
