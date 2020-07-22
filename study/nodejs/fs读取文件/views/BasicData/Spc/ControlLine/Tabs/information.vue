<template>
<div class="mes-table">
    <el-table :data="historyRecord" border size="mini">
      <el-table-column type="index" label="序号" align="center"></el-table-column>
      <el-table-column prop="department" sortable label="部门" align="center"></el-table-column>
      <el-table-column prop="itemCode" sortable label="控制项名称" align="center"></el-table-column>
      <el-table-column prop="mPomLineId" sortable label="线别" align="center"></el-table-column>
      <el-table-column prop="mSpcMeasurementInstrumentId"  sortable label="测量仪器" align="center"></el-table-column>
      <el-table-column prop="samples" sortable label="样本数" align="center"></el-table-column>
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
