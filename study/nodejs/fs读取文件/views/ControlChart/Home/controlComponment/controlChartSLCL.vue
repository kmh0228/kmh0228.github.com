<template>
  <el-form :model="controlChartFromSC" ref="controlChartFromSC" label-position="left"  label-width="120px" class="el-row mes-form-rule" :rules="rules" size="mini">
    <span>规格线</span>
    <el-form-item label-width="0"  class="el-col el-col-24">
      <el-divider></el-divider>
    </el-form-item>
    <el-form-item label="USL"  class="el-col el-col-7">
      <el-input  v-model="controlChartFromSC.usl" style="width:100%"  disabled ></el-input>
    </el-form-item>
    <el-form-item label="SL" class="el-col el-col-7 el-col-offset-1">
     <el-input  v-model="controlChartFromSC.sl" style="width:100%"  disabled></el-input>
    </el-form-item>
    <el-form-item label="LSL" class="el-col el-col-7 el-col-offset-1">
      <el-input  v-model="controlChartFromSC.lsl" style="width:100%"  disabled></el-input>
    </el-form-item>
    <span style="margin-top:15px" class="el-col el-col-24">控制线</span>
    <el-form-item label-width="0" class="el-col el-col-24">
      <el-divider></el-divider>
    </el-form-item>
    <el-form-item :label="chartType1+'-UCL'"  class="el-col el-col-7">
      <el-input  v-model="controlChartFromSC.ucl1" style="width:100%"  disabled ></el-input>
    </el-form-item>
    <el-form-item :label="chartType1+'-CL'" class="el-col el-col-7 el-col-offset-1">
     <el-input  v-model="controlChartFromSC.cl1" style="width:100%"  disabled></el-input>
    </el-form-item>
    <el-form-item :label="chartType1+'-LCL'" class="el-col el-col-7 el-col-offset-1">
      <el-input  v-model="controlChartFromSC.lcl1" style="width:100%"  disabled></el-input>
    </el-form-item>
    <el-form-item :label="chartType2+'-UCL'"  class="el-col el-col-7">
      <el-input  v-model="controlChartFromSC.ucl2" style="width:100%"  disabled ></el-input>
    </el-form-item>
    <el-form-item :label="chartType2+'-CL'"  class="el-col el-col-7 el-col-offset-1">
     <el-input  v-model="controlChartFromSC.cl2" style="width:100%"  disabled></el-input>
    </el-form-item>
    <el-form-item :label="chartType2+'-LCL'" class="el-col el-col-7 el-col-offset-1">
      <el-input  v-model="controlChartFromSC.lcl2" style="width:100%"  disabled></el-input>
    </el-form-item>
     <el-form-item label="σ(within)"  class="el-col el-col-7">
      <el-input  v-model="controlChartFromSC.within" style="width:100%"  disabled ></el-input>
    </el-form-item>
    <el-form-item label="σ(overall)" class="el-col el-col-7 el-col-offset-1">
     <el-input  v-model="controlChartFromSC.overall" style="width:100%"  disabled></el-input>
    </el-form-item>
    <span style="margin-top:15px" class="el-col el-col-24">CpK分析</span>
    <el-form-item label-width="0" class="el-col el-col-24">
      <el-divider></el-divider>
    </el-form-item>
    <el-form-item label="Ca"  class="el-col el-col-7">
      <el-input  v-model="controlChartFromSC.ca" style="width:100%"  disabled ></el-input>
    </el-form-item>
    <el-form-item label="Cp" class="el-col el-col-7 el-col-offset-1">
     <el-input  v-model="controlChartFromSC.cp" style="width:100%"  disabled></el-input>
    </el-form-item>
    <el-form-item label="CpK" class="el-col el-col-7 el-col-offset-1">
      <el-input  v-model="controlChartFromSC.cpk" style="width:100%"  disabled></el-input>
    </el-form-item>
    <el-form-item label="CpK等级"  class="el-col el-col-7">
      <el-input  v-model="controlChartFromSC.cpkLevel" style="width:100%"  disabled ></el-input>
    </el-form-item>
    <el-form-item label="Pp" class="el-col el-col-7 el-col-offset-1">
     <el-input  v-model="controlChartFromSC.pp" style="width:100%"  disabled></el-input>
    </el-form-item>
    <el-form-item label="Ppk" class="el-col el-col-7 el-col-offset-1">
      <el-input  v-model="controlChartFromSC.ppk" style="width:100%"  disabled></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      controlChartFromSC: {
        usl: '',
        sl: '',
        lsl: '',
        ucl1: '',
        cl1: '',
        lcl1: '',
        ucl2: '',
        cl2: '',
        lcl2: '',
        overall: '',
        within: '',
        ca: '',
        cp: '',
        cpk: '',
        cpkLevel: '',
        pp: '',
        ppk: ''
      },
      chartType1: '',
      chartType2: '',
      rules: {

      }
    }
  },
  methods: {}
}
</script>
