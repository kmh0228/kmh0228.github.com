<template>
    <el-form :model="dialogForm"  ref="dialogForm" label-position="left" label-width="120px" class="el-row mes-form-rule" :rules="rules" size="mini">
      <el-form-item :label="chartType1+'-UCL'"  class="el-col el-col-24">
        <el-input  v-model="dialogForm.ucl1" style="width:100%"   ></el-input>
      </el-form-item>
      <el-form-item :label="chartType1+'-CL'" class="el-col el-col-24">
      <el-input  v-model="dialogForm.cl1" style="width:100%"  ></el-input>
      </el-form-item>
      <el-form-item :label="chartType1+'-LCL'" class="el-col el-col-24">
        <el-input  v-model="dialogForm.lcl1" style="width:100%"  ></el-input>
      </el-form-item>
      <el-form-item :label="chartType1+'σ'" class="el-col el-col-24">
        <el-input  v-model="dialogForm.σ1" style="width:100%"  ></el-input>
      </el-form-item>
      <el-form-item :label="chartType2+'-UCL'"  class="el-col el-col-24">
        <el-input  v-model="dialogForm.ucl2" style="width:100%"   ></el-input>
      </el-form-item>
      <el-form-item :label="chartType2+'-CL'"  class="el-col el-col-24">
      <el-input  v-model="dialogForm.cl2" style="width:100%"  ></el-input>
      </el-form-item>
      <el-form-item :label="chartType2+'-LCL'" class="el-col el-col-24">
        <el-input  v-model="dialogForm.lcl2" style="width:100%"  ></el-input>
      </el-form-item>
      <el-form-item :label="chartType2+'σ'" class="el-col el-col-24">
        <el-input  v-model="dialogForm.σ2" style="width:100%"  ></el-input>
      </el-form-item>
      <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
       <el-button type="primary" size="mini" @click="savecontrol">{{$t('common_save')}}</el-button>
       <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
      </el-form-item>
    </el-form>
</template>

<script>
export default {
  data () {
    return {
      dialogForm: {
        ucl1: '',
        cl1: '',
        lcl1: '',
        σ1: '',
        mSpcControlItemChartId1: '',
        mSpcControlItemChartId2: '',
        ucl2: '',
        cl2: '',
        lcl2: '',
        σ2: ''
      },
      rules: {

      },
      chartType1: '',
      chartType2: ''

    }
  },
  props: {
    cannel: Function,
    tSpcControlItemId: String,
    setDefaultId: Function
  },
  methods: {
    async savecontrol () {
      let { dialogForm, chartType1, chartType2, tSpcControlItemId } = this
      let obj1 = {
        chartType: chartType1,
        mSpcControlItemChartId: dialogForm.mSpcControlItemChartId1,
        ucl: dialogForm.ucl1,
        cl: dialogForm.cl1,
        lcl: dialogForm.lcl1,
        sigma: dialogForm.σ1 || ''
      }
      let chartList = [].concat(obj1)
      let obj2 = {
        chartType: chartType2,
        mSpcControlItemChartId: dialogForm.mSpcControlItemChartId2,
        ucl: dialogForm.ucl2,
        cl: dialogForm.cl2,
        lcl: dialogForm.lcl2,
        sigma: dialogForm.σ2 || ''
      }
      chartList.push(obj2)
      const data = Object.assign({ tSpcControlItemId, chartList })
      let res = await this.$api.toControlItem(data)
      this.$myPrompt.handleMsg(res, () => {
        this.$emit('cannel')
        this.$emit('setDefaultId')
      })
    }
  }
}
</script>
