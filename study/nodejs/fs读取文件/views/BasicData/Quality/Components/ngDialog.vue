<template>
  <el-form :model="ngDialogForm"  ref="ngDialogForm" label-position="left" label-width="100px" class="el-row mes-form-rule" :rules="rules" size="mini">
    <el-form-item label="不良数" prop="failQty"  class="el-col el-col-11" size="mini">
      <el-input v-model.number="ngDialogForm.failQty"></el-input>
    </el-form-item>
    <el-form-item label="不良代码类型" prop="failType" class="el-col el-col-11 el-col-offset-1" size="mini">
      <dict-select v-model="ngDialogForm.failType" dictType="DEFECT_CODE_TYPE"></dict-select>
    </el-form-item>
    <el-form-item label="不良代码种类" prop="failCategory" class="el-col el-col-11" size="mini">
      <!-- <mes-select v-model="ngDialogForm.failCategory" labelKey="defectName" valueKey="mQomDefectId" method="getAllDefectCode"></mes-select> -->
      <el-select  v-model="ngDialogForm.failCategory" style="width:100%">
        <el-option v-for="(option,i) in defectCodeList" :key="i" :label="option.defectName" :value="option.mQomDefectId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="不良描述" prop="failDesc" class="el-col el-col-23" size="mini">
      <el-input  type="textarea" :rows="2"  placeholder="请输入内容" v-model="ngDialogForm.failDesc"></el-input>
    </el-form-item>
    <el-form-item label="异常清单" prop="failType" class="el-col el-col-11" size="mini">
      <el-radio v-model="docType" label="ABNORMAL" > <el-input v-model="abnormalNo" :disabled="true"></el-input></el-radio>
    </el-form-item>
    <el-form-item label="PDCS" prop="typeCode" class="el-col el-col-11 el-col-offset-1" size="mini">
      <el-radio v-model="docType" label="PDCS" ><el-input v-model="pdcsNo" :disabled="true"></el-input></el-radio>
    </el-form-item>
    <el-form-item label="描述" class="el-col el-col-23" size="mini">
      <el-input  type="textarea"  :rows="2"  placeholder="请输入内容" v-model="ngDialogForm.ngDesc"></el-input>
    </el-form-item>
    <el-form-item label="图片上传" class="el-col el-col-23" size="mini">
      <el-upload action="" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-change="uploadChange" :on-remove="handleRemove" :file-list="fileList" :before-uploads="beforeAvatarUpload" :auto-upload="false">
        <i slot="default" class="el-icon-plus"></i>
        <div slot="file" slot-scope="{file}">
          <img class="el-upload-list__item-thumbnail"  :src="file.url" />
           <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
              <i class="el-icon-zoom-in"></i>
            </span>
            <span class="el-upload-list__item-delete"  @click="handleRemove(file)">
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </div>
      </el-upload>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveData('DRAFT')">保存</el-button>
      <el-button size="mini" @click="$emit('cannel')">取消</el-button>
    </el-form-item>
    <el-dialog :visible.sync="dialogVisible"  append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      docType: 'PDCS',
      ngDialogForm: {
        id: '',
        failQty: '',
        failType: '',
        failCategory: '',
        failDesc: '',
        ngDesc: ''
      },
      abnormalNo: '',
      pdcsNo: '',
      rules: {

      },
      defectCodeList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      fileIds: ''
    }
  },
  props: {
    detailId: {
      type: String,
      default: ''
    },
    cannel: Function
  },
  methods: {
    handleRemove (file) {
      let id = file.id
      this.fileList.forEach((item, index) => {
        if (id === item.id) {
          this.fileList.splice(index, 1)
        }
      })
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    uploadChange (file, fileList) {
      this.fileList.push(file)
    },
    beforeAvatarUpload (file) {
      return false
    },
    async getDefectCodes () {
      const data = {
        defectCodeType: '',
        keywords: '',
        queryLevel: 1,
        pageIndex: 1,
        pageSize: 1000
      }
      let res = await this.$api.getAllDefectCode(data)
      if (res.code === '200') {
        this.defectCodeList = res.data.list
      }
    },
    saveData (docStatus) {
      this.$refs.ngDialogForm.validate(async valid => {
        if (valid) {
          const { fileList, ngDialogForm, docType, fileIds } = this
          const formData = new FormData()
          let inspectId = this.detailId || ''
          for (let i in ngDialogForm) {
            formData.append(i, ngDialogForm[i])
          }
          formData.append('inspectId', inspectId)
          formData.append('docType', docType)
          formData.append('docStatus', docStatus)
          formData.append('defectImage', fileIds)
          fileList.forEach(file => {
            if (file.raw) {
              formData.append('files', file.raw)
            }
            if (file.id) {
              formData.append('imageIds', file.id)
            }
          })
          const res = await this.$api.saveExcepNg(formData)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
          })
        }
      })
    },
    async setData () {
      let inspectId = this.detailId || ''
      const res = await this.$api.getExcepByItemId({ inspectId })
      if (res.code === '200' && res.data) {
        for (let i in this.ngDialogForm) {
          this.ngDialogForm[i] = res.data[i]
        }
        this.docType = res.data.docType
        res.data.docType === 'ABNORMAL' ? this.abnormalNo = res.data.docNo : this.pdcsNo = res.data.docNo
        if (res.data.defectImage) {
          this.fileIds = res.data.defectImage
          let { fileIds } = this
          const result = await this.$api.getNgFileDatas({ fileIds })
          if (result.code === '200' && result.data.length > 0) {
            result.data.forEach(item => {
              let obj = {
                id: item.id,
                name: item.fileName,
                url: item.fileFullPath
              }
              this.fileList.push(obj)
            })
          }
        }
      }
    }
  },
  created () {
    this.getDefectCodes()
    this.setData()
  }
}

</script>
