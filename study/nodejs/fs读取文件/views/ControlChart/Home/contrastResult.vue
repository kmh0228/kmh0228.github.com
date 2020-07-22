<template>
  <div>
    <el-row>
      <el-col v-for="(option,i) in datalist" :key="i" :span="24/len">
        <control-result :chartDataList="option" :listIndex="i" :allData="datalist" :hiddenButton="hiddenButton" :len="len"></control-result>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import controlResult from './control'
export default {
  data () {
    return {
      datalist: '',
      len: 0,
      hiddenButton: false
    }
  },
  methods: {
    async setDefaultData () {
      let ids = this.$route.query.ContrastResult
      const res = await this.$api.getQueryControlData(ids)
      this.datalist = res.data
      this.len = res.data.length > 4 ? 4 : res.data.length
    }
  },
  created () {
    this.setDefaultData()
  },
  components: {
    controlResult
  }
}
</script>
