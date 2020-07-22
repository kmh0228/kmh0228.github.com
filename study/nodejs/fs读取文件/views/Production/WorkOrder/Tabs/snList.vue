<template>
  <el-table :data="snList" border size="mini">
    <el-table-column type="index" label="序号" align="center"></el-table-column>
    <el-table-column label="SSN" align="center" prop="SSN"></el-table-column>
    <el-table-column label="当前工站名称" align="center" prop="stationName"></el-table-column>
    <el-table-column label="当前工站状态" align="center" prop="stationStatus"></el-table-column>
  </el-table>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: {
    useType: {
      type: Number
    },
    snList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
  }
}
</script>
