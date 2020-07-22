<template>
  <div class="mes-table">
    <el-table :data="detailData" border size="mini">
      <el-table-column type="index" label="序号" align="center"></el-table-column>
      <el-table-column prop="controlChart" sortable label="管制图" align="center"></el-table-column>
      <el-table-column prop="UCL" sortable label="UCL" align="center"></el-table-column>
      <el-table-column prop="CL" sortable label="CL" align="center"></el-table-column>
      <el-table-column prop="LCL" sortable label="LCL" align="center"></el-table-column>
      <el-table-column prop="detailed" sortable label="详细描述" align="center"></el-table-column>
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
