<template>
  <el-form :model="detailForm"  ref="detailForm" label-position="left" label-width="140px" class="el-row mes-form-rule" :rules="rules" size="mini">
    <el-form-item label="保养内容" prop="maintainContent" class="el-col el-col-11" size="mini">
      <el-input v-model="detailForm.maintainContent" style="width:100%" ></el-input>
    </el-form-item>
    <el-form-item label="保养方法" prop="maintainMethod" class="el-col el-col-11 el-col-offset-1" size="mini">
      <el-input v-model="detailForm.maintainMethod" dictType="WORK_KIND" style="width:100%;"></el-input>
    </el-form-item>
    <el-form-item label="标准时长" prop="standardTime" class="el-col el-col-11" size="mini">
      <el-input  v-model="detailForm.standardTime" ></el-input>
    </el-form-item>
    <el-form-item  label="上传附件"  class="el-col el-col-23" v-if="!detailForm.attachment">
      <el-upload
        style="text-align:center"  :before-upload="beforeUpload" drag action="">
        <mes-icon icon="excel-icon" size="67px" style="display:inline-block;margin:40px 0 16px;" v-if="fileName"></mes-icon>
        <i class="el-icon-upload" v-else></i>
        <p v-if="fileName">{{ fileName }}</p>
         <div class="el-upload__text" v-else>
          拖动文件至此处，<em>点击上传</em>
        </div>
      </el-upload>
    </el-form-item>
   <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveDetailInsecptionList">保存</el-button>
      <el-button size="mini" @click="$emit('detailDialogCannel')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      detailForm: {
        maintainContent: '',
        maintainMethod: '',
        standardTime: '',
        attachment: ''
      },
      rules: {
        // item: [{ required: true, message: '请输入点检方式' }],
        // detail: [{ required: true, message: '请输入点检内容' }],
        // method: [{ required: true, message: '请输入点检方法' }],
        // status: [{ required: true, message: '请选择设备状态' }]
      },
      fileName: '',
      fileData: ''

    }
  },
  props: {
    detailDialogCannel: Function,
    isDetailEdit: Boolean,
    mMomMaintainitemId: String
  },
  methods: {
    saveDetailInsecptionList () {
      this.$refs.detailForm.validate(async valid => {
        if (valid) {
          const { detailForm, fileData, mMomMaintainitemId, isDetailEdit } = this
          const formData = new FormData()
          for (let i in detailForm) {
            formData.append(i, detailForm[i])
          }
          formData.append('mMomMaintainitemId', mMomMaintainitemId)
          formData.append('file', fileData)
          // fileList.forEach(file => {
          //   formData.append('files', file.raw)
          // })
          const res = isDetailEdit ? await this.$api.modifyMaintainDetail(formData) : await this.$api.savemMintainDetail(formData)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('detailDialogCannel')
            this.$emit('getMainitemDetailTable', mMomMaintainitemId)
          })
        }
      })
    },
    beforeUpload (file) {
      this.fileName = file.name
      this.fileData = file
      return false
    },
    checkValue () {
      let { lowerValue, upperValue } = this.detailForm
      if (lowerValue > upperValue) {
        this.$message.warning('下限值不能超过上限值')
      }
    }

  }

}
</script>
