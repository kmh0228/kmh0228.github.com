<template>
  <el-row class="mes-scan-area">
    <el-col :span="24">
      <el-alert :title="scanTips" type="warning" v-if="showScanTips" show-icon @close="showScanTips=false"></el-alert>
    </el-col>
    <el-col :span="24" class="scan-area-input">
      <el-input v-model.trim="code" ref="scanIpnut" :placeholder="$t('common_PleasScan')+scanType" size="medium" @keydown.enter.native="scanCode" :autofocus="true"></el-input>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data () {
    return {
      code: '',
      scanTips: '',
      showScanTips: false
    }
  },
  props: {
    scanType: {
      type: String,
      default: ''
    }
  },
  methods: {
    setScanTips (tips) {
      this.scanTips = tips
      this.showScanTips = !!tips
    },
    scanCode () {
      let { code, scanType } = this
      if (code) {
        this.$emit('scan-code', code)
        this.code = ''
        this.setScanTips()
      } else {
        let tips = `请先扫描${scanType}！`
        this.setScanTips(tips)
      }
    }
  },
  mounted () {
    this.$refs.scanIpnut.focus()
  }
}
</script>
