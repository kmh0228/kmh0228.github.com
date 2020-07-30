<template>
<div class="mes-table">
    <el-table :data="historyRecord" border size="mini">
      <el-table-column type="index" :label="$t('common_Number')" align="center"></el-table-column>
      <el-table-column prop="department" sortable :label="$t('common_Department')" align="center"></el-table-column>
      <el-table-column prop="itemCode" sortable :label="$t('common_ContrName')" align="center"></el-table-column>
      <el-table-column prop="mPomLineId" sortable :label="$t('common_Line')" align="center"></el-table-column>
      <el-table-column prop="mSpcMeasurementInstrumentId"  sortable :label="$t('common_MeasuInst')" align="center"></el-table-column>
      <el-table-column prop="samples" sortable :label="$t('controlLine_NumbeSamp')" align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      historyRecord: []
    }
  },
  methods: {}
}
</script>
