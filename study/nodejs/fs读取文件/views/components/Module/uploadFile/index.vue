<template>
  <div>
    <el-upload
      class="upload-file"
      ref="upload"
      action
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-upload="beforeAvatarUpload"
      :on-exceed="handleExceed"
      :file-list="uploadFileArr"
      :accept="fileType"
      :auto-upload="false"
      :on-change="fileChange"
      :disabled="disabled"
      :multiple="multiple"
      :limit="limit"
    >
      <el-button
        :disabled="disabled"
        :loading="buttonLoading"
        slot="trigger"
        size="small"
        type="primary"
        v-show="showButton"
      >{{buttonText || $t('component_UploaFile')}}</el-button>
      <div
        slot="tip"
        class="el-upload__tip"
        v-if="tipShow && fileType && fileType !== '*'"
      >{{$t('component_UploaOnly')}}{{this.fileType}}{{$t('component_FileAndNoMoreThan')}}{{this.fileSize}}MB</div>
    </el-upload>
    <a href id="downloadUploadFile" download style="visibility: hidden;"></a>
  </div>
</template>
<script>

export default {
  data () {
    return {
      buttonLoading: false,
      uploadFileArr: []
    }
  },
  props: {
    defaultFileArr: {
      type: Array,
      required: true
    },
    fileType: {
      type: String,
      default: '.xlsx,.xls,.xlsm'
    },
    fileSize: {
      type: Number,
      default: 2
    },
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 1
    },
    tipShow: {
      type: Boolean,
      default: true
    },
    showButton: {
      type: Boolean,
      default: true
    },
    buttonText: {
      type: String
    }
  },
  computed: {
  },
  watch: {
    defaultFileArr (n, o) {
      if (JSON.stringify(n) === JSON.stringify(o)) return false
      this.uploadFileArr = JSON.parse(JSON.stringify(this.defaultFileArr))
    }
  },
  methods: {
    handleRemove (file, fileList) {
      this.uploadFileArr = fileList
    },
    handlePreview (file) {
      let download = this.$el.querySelector('#downloadUploadFile')
      download.download = file.name
      download.href = file.url
      download.click()
    },
    beforeAvatarUpload (file) {
      if (file.size / 1024 / 1024 > this.fileSize) {
        this.$message.error(this.$t('component_UploaFileSizeCannExce') + this.fileSize + 'MB!')
        return false
      }
      return true
    },
    handleExceed (files, fileList) {
      this.$message.warning(this.$t('component_CurreRestSele') + this.limit + this.$t('component_FilesSeleThisTime') + files.length + this.$t('component_FilesSele') + (files.length + fileList.length) + this.$t('component_Files'))
    },
    fileChange (file, fileList) {
      this.uploadFileArr = fileList
    },
    getFileData () {
      return this.uploadFileArr
    }
  },
  mounted () {
    // console.log(window)
  },
  created () {
    this.uploadFileArr = JSON.parse(JSON.stringify(this.defaultFileArr))
  }
}
</script>
<style lang="scss"></style>
