<template>
  <el-table :data="snList" border size="mini">
    <el-table-column type="index" :label="$t('common_Number')" align="center"></el-table-column>
    <el-table-column label="SSN" align="center" prop="SSN"></el-table-column>
    <el-table-column :label="$t('WorkOrder_CurreStatName')" align="center" prop="stationName"></el-table-column>
    <el-table-column :label="$t('WorkOrder_CurreStatStat')" align="center" prop="stationStatus"></el-table-column>
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
