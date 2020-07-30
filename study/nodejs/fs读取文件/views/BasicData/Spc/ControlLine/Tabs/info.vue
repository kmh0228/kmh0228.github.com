<template>
  <div class="mes-table">
    <el-table :data="detailData" border size="mini">
      <el-table-column type="index" :label="$t('common_Number')" align="center"></el-table-column>
      <el-table-column prop="controlChart" sortable :label="$t('controlLine_ContrChar')" align="center"></el-table-column>
      <el-table-column prop="UCL" sortable label="UCL" align="center"></el-table-column>
      <el-table-column prop="CL" sortable label="CL" align="center"></el-table-column>
      <el-table-column prop="LCL" sortable label="LCL" align="center"></el-table-column>
      <el-table-column prop="detailed" sortable :label="$t('controlLine_DetaiDesc')" align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      detailData: [{}]
    }
  },
  methods: {}
}
</script>
