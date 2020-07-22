<template>
  <el-form :model="form" ref="form" :rules="rules" label-width="120px" label-position="left" class="el-row mes-form-rule">
    <el-form-item label="所属部门" prop="organizeid" class="el-col el-col-24">
      <el-select v-model.trim="form.organizeid" size="mini" style="width:100%;">
        <el-option v-for="(option,i) in deptList" :key="i" :label="option.department" :value="option.officeCode"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="文档类型" prop="mComDoctypeId" class="el-col el-col-24">
      <el-select v-model.trim="form.mComDoctypeId" size="mini" style="width:100%;">
        <el-option v-for="(option,i) in docTypeList" :key="i" :label="option.docType" :value="option.mComDoctypeId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="文件" class="el-col el-col-24">
      <el-upload ref="upload" action="" :on-change="uploadChange" :on-remove="uploadRemove" :file-list="fileList" :auto-upload="false">
        <el-button slot="trigger" size="mini" type="primary">选择文件</el-button>
      </el-upload>
    </el-form-item>
    <el-form-item label="文档编号" prop="docNo" class="el-col el-col-24">
      <el-row class="mes-form-item">
        <el-col :lg="{span:15}" :xl="{span:18}">
          <el-input v-model="form.docNo" placeholder="请生成文档编号" size="mini" :disabled="isEdit"></el-input>
        </el-col>
        <el-col :lg="{span:8,offset:1}" :xl="{span:5,offset:1}">
          <el-button :disabled="isEdit" type="primary" plain size="mini" style="width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"  @click="createDocNo">自动生成</el-button>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="文档名称" prop="docName" class="el-col el-col-24">
      <el-input v-model="form.docName" size="mini"></el-input>
    </el-form-item>
    <el-form-item label="版本" prop="version" class="el-col el-col-11">
      <el-input v-model="form.version" size="mini"></el-input>
    </el-form-item>
    <el-form-item label="是否加密" class="el-col el-col-11 el-col-offset-2">
      <el-radio v-model="form.isEncrypt" :label="true">是</el-radio>
      <el-radio v-model="form.isEncrypt" :label="false">否</el-radio>
    </el-form-item>
    <el-form-item label="描述" prop="docDesc" class="el-col el-col-24">
      <el-input type="textarea" v-model="form.docDesc" size="mini"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveEsopDoc">保存</el-button>
      <el-button size="mini" @click="$emit('cannel')">取消</el-button>
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
      fileList: [],
      rules: {
        organizeid: [{ required: true, message: '请选择所属部门' }],
        mComDoctypeId: [{ required: true, message: '请选择文档类型' }],
        docNo: [{ required: true, message: '文档编号不能为空' }],
        docName: [{ required: true, message: '文档名称不能为空' }],
        version: [{ required: true, message: '版本不能为空' }]
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
