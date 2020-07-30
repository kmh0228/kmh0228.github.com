<template>
  <el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="120px" label-position="left" class="el-row mes-form-rule" :isEdit="isEdit">
  <el-form-item :label="$t('common_Department')" prop="officeName" class="el-col el-col-11">
    <el-input v-model.trim="dialogForm.officeName" :disabled="true" size="mini"></el-input>
  </el-form-item>
  <el-form-item :label="$t('common_ContrChar')" prop="controlChartType" class="el-col el-col-11 el-col-offset-1">
    <el-input v-model.trim="dialogForm.controlChartType" :disabled="true" size="mini"></el-input>
  </el-form-item>
  <el-form-item :label="$t('common_ContrName')" prop="itemCode" class="el-col el-col-11">
    <el-input v-model.trim="dialogForm.itemCode" :disabled="true" size="mini"></el-input>
  </el-form-item>
  <el-form-item :label="$t('measureMD_ContrPhas')" prop="itemStatus" class="el-col el-col-11 el-col-offset-1">
    <el-input v-model.trim="dialogForm.itemStatus" :disabled="true" size="mini"></el-input>
  </el-form-item>
  <el-form-item :label="$t('common_ContrDesc')" prop="stationCode" class="el-col el-col-11">
    <el-input v-model.trim="dialogForm.stationCode" :disabled="true" size="mini"></el-input>
  </el-form-item>
  <el-form-item :label="$t('measureMD_SubgrCont')" prop="subgroupSize" class="el-col el-col-11 el-col-offset-1">
    <el-input v-model.trim="dialogForm.subgroupSize" :disabled="true" size="mini"></el-input>
  </el-form-item>
  <el-form-item :label="$t('common_PorN')" prop="materialNo" class="el-col el-col-11">
    <el-input v-model.trim="dialogForm.materialNo" :disabled="true" size="mini"></el-input>
  </el-form-item>
  <el-form-item :label="$t('measureMD_NumbeSubg')" prop="subgroupCount" class="el-col el-col-11 el-col-offset-1">
    <el-input v-model.trim="dialogForm.subgroupSize" :disabled="true" size="mini"></el-input>
  </el-form-item>
  <el-form-item :label="$t('common_ItemNoRev')" prop="materialRev" class="el-col el-col-11">
    <el-input v-model.trim="dialogForm.materialRev" :disabled="true" size="mini"></el-input>
  </el-form-item>
  <el-form-item label="Cpk目标值" prop="cpkTarget" class="el-col el-col-11 el-col-offset-1">
    <el-input v-model.trim="dialogForm.cpkTarget" :disabled="true" size="mini"></el-input>
  </el-form-item>
  <el-form-item :label="$t('common_ProduSeries')" prop="materialfamilyCode" class="el-col el-col-11">
    <el-input v-model.trim="dialogForm.materialfamilyCode" :disabled="true" size="mini"></el-input>
  </el-form-item>
  <el-form-item label="USL" prop="usl" class="el-col el-col-11 el-col-offset-1">
    <el-input v-model.trim="dialogForm.usl" :disabled="true" size="mini"></el-input>
  </el-form-item>
  <el-form-item label="测量站/实验室" prop="stationCode" class="el-col el-col-11">
    <el-input v-model.trim="dialogForm.stationCode" :disabled="true" size="mini"></el-input>
  </el-form-item>
  <el-form-item label="SL" prop="sl" class="el-col el-col-11 el-col-offset-1">
    <el-input v-model.trim="dialogForm.sl" :disabled="true" size="mini"></el-input>
  </el-form-item>
  <el-form-item :label="$t('common_MeasuInst')" prop="instrumentName" class="el-col el-col-11">
    <el-input v-model.trim="dialogForm.instrumentName" :disabled="true" size="mini"></el-input>
  </el-form-item>
   <el-form-item label="LSL" prop="lsl" class="el-col el-col-11 el-col-offset-1">
    <el-input v-model.trim="dialogForm.lsl" :disabled="true" size="mini"></el-input>
  </el-form-item>
  <el-form-item :label="$t('common_Line')" prop="lineCode" class="el-col el-col-11">
    <el-input v-model.trim="dialogForm.lineCode" :disabled="true" size="mini"></el-input>
  </el-form-item>
  <el-form-item :label="$t('common_MouldHoleNumb')" prop="moldCavityNo" class="el-col el-col-11 el-col-offset-1">
    <el-input v-model.trim="dialogForm.moldCavityNo" :disabled="true" size="mini"></el-input>
  </el-form-item>

  <el-form-item :label="$t('measureMD_DataEntr')" prop="stationCode" class="el-col el-col-24">
  </el-form-item>
  <el-form-item :label="$t('measureMD_DateMeas')" prop="measurementDt" class="el-col el-col-11">
   <el-date-picker  v-model.trim="dialogForm.measurementDt" type="datetime"  :placeholder="$t('common_SelecDate')" style="width:100%" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>
  </el-form-item>
  <div class="mes-table-content">
        <el-table :data="enterData" border size="mini" highlight-current-row>
          <el-table-column type="index" :label="$t('measureMD_SamplNumb')" align="center"></el-table-column>
          <el-table-column prop="value" :label="$t('measureMD_SamplValu')" align="center">
            <template slot-scope="scope">
              <el-input type="number" v-model="scope.row.value" size="mini"></el-input>
            </template>
          </el-table-column>
        </el-table>
   </div>
  <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="$emit('confirm')">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('confirmAndClear')">{{$t('measureMD_SaveAndContNextGrou')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
  </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      dialogForm: {
        tSpcControlItemId: '',
        stationCode: '',
        officeName: '',
        itemCode: '',
        materialNo: '',
        materialRev: '',
        materialfamilyCode: '',
        moldCavityNo: '',
        lineCode: '',
        instrumentName: '',
        controlChartType: '',
        itemStatus: '',
        usl: '',
        cpkTarget: '',
        sl: '',
        lsl: '',
        subgroupSize: '',
        measurementDt: ''
      }
    }
  },
  props: {
    isEdit: {
      type: Boolean
    },
    getTableData: {
      type: Function
    }
  },
  computed: {
    rules () {
      return {
        measurementDt: [{ required: true, message: this.$t('measureMD_MeasuDateCannBeEmpt') }]
      }
    },
    enterData () {
      let data = []
      for (let i = 1; i <= this.dialogForm.subgroupSize; i++) {
        data.push({ value: '' })
      }
      return data
    }
  },
  methods: {
  }
}
</script>
