<template>
  <el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="100px" label-position="left" class="el-row mes-form-rule">
    <el-form-item label="X-Bar-UCL:" class="el-col el-col-5">
      <el-input v-model.trim="dialogForm.xBarUCL" size="mini" style="width:100%;" />
    </el-form-item>
    <el-form-item label="X-Bar-CL:" class="el-col el-col-5 el-col-offset-1">
      <el-input v-model.trim="dialogForm.xBarCL" size="mini" style="width:100%;" />
    </el-form-item>
    <el-form-item label="X-Bar-LCL:" class="el-col el-col-5 el-col-offset-1">
      <el-input v-model.trim="dialogForm.xBarLCL" size="mini" style="width:100%;" />
    </el-form-item>
    <el-form-item label="X-Bar-Sigma:" class="el-col el-col-5 el-col-offset-1">
      <el-input v-model.trim="dialogForm.xBarSigma" size="mini" style="width:100%;" />
    </el-form-item>
    <el-form-item label="R-UCL:" class="el-col el-col-5">
      <el-input v-model.trim="dialogForm.rUCL" size="mini" style="width:100%;" />
    </el-form-item>
    <el-form-item label="R-CL:" class="el-col el-col-5 el-col-offset-1">
      <el-input v-model.trim="dialogForm.rCL" size="mini" style="width:100%;" />
    </el-form-item>
    <el-form-item label="R-LCL:" class="el-col el-col-5 el-col-offset-1">
      <el-input v-model.trim="dialogForm.rLCL" size="mini" style="width:100%;" />
    </el-form-item>
    <el-form-item label="R-Sigma:" class="el-col el-col-5 el-col-offset-1">
      <el-input v-model.trim="dialogForm.rSigma" size="mini" style="width:100%;" />
    </el-form-item>
    <!-- <el-form-item :label="$t('common_Description')" prop="description" class="el-col el-col-23">
      <el-input type="textarea" v-model="dialogForm.description"></el-input>
    </el-form-item> -->
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" @click="saveData">{{$t('common_save')}}</el-button>
      <el-button @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      dialogForm: {
        xBarUCL: '',
        xBarCL: '',
        xBarLCL: '',
        xBarSigma: '',
        xBarId: '',
        rUCL: '',
        rCL: '',
        rLCL: '',
        rSigma: '',
        rId: '',
        description: ''
      },
      rules: {}
    }
  },
  props: {
    cannel: Function,
    tSpcControlItemId: String
  },
  methods: {
    async  setDefaultData () {
      let { tSpcControlItemId } = this
      if (tSpcControlItemId) {
        let data = {
          tSpcControlItemId: tSpcControlItemId,
          type: 0
        }
        let res = await this.$api.getDetailsAndHistory(data)
        if (res.code === '200') {
          res.data.forEach(item => {
            if (item.chartType === 'XBar') {
              this.dialogForm.xBarUCL = item.ucl
              this.dialogForm.xBarCL = item.cl
              this.dialogForm.xBarLCL = item.lcl
              this.dialogForm.xBarSigma = item.sigma
              this.dialogForm.xBarId = item.mSpcControlItemChartId
            } else if (item.chartType === 'R') {
              this.dialogForm.rUCL = item.ucl
              this.dialogForm.rCL = item.cl
              this.dialogForm.rLCL = item.lcl
              this.dialogForm.rSigma = item.sigma
              this.dialogForm.rId = item.mSpcControlItemChartId
            }
          })
        }
      }
    },
    async saveData () {
      let { dialogForm, tSpcControlItemId } = this
      let chartList = [
        {
          mSpcControlItemChartId: dialogForm.xBarId,
          chartType: 'XBar',
          cl: dialogForm.xBarCL,
          lcl: dialogForm.xBarLCL,
          sigma: dialogForm.xBarSigma,
          ucl: dialogForm.xBarUCL
        },
        {
          mSpcControlItemChartId: dialogForm.xBarId,
          chartType: 'R',
          cl: dialogForm.rCL,
          lcl: dialogForm.rLCL,
          sigma: dialogForm.rSigma,
          ucl: dialogForm.rUCL
        }
      ]
      const data = Object.assign({ chartList, tSpcControlItemId })
      const res = await this.$api.ControlLineUpdate(data)
      this.$myPrompt.handleMsg(res, () => {
        this.$emit('cannel')
      })
    }
  },
  created () {
    this.setDefaultData()
  }
}
</script>
