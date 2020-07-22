<template>
  <el-tabs v-model="activeName" >
    <el-tab-pane label="不良类别" name="type">
      <el-button size="mini" @click="addDefectList">新增</el-button>
      <el-table :data="tQomIqcDefectVmList" size="mini" border style="margin-top:1.5vh">
        <el-table-column type="index" label="序号" align="center"> </el-table-column>
        <el-table-column label="不良名称" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.mQomDefectId" filterable size="mini" style="width:100%">
              <el-option v-for="(option,i) in defectCodeList" :key="i" :label="option.defectName" :value="option.mQomDefectId" @click.native="scope.row.remark=option.defectDesc || ''"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" align="center"></el-table-column>
        <el-table-column label="数量" align="center">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.defectQty"  size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="80">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" size="mini" ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'type',
      tQomIqcDefectVmList: [],
      defectCodeList: []
    }
  },
  // props: {
  //   tQomIqcDefectVmList: {
  //     type: Array,
  //     default: () => []
  //   }
  // },
  methods: {
    addDefectList () {
      this.tQomIqcDefectVmList.push({
        defectCode: '',
        remark: '',
        defectQty: '',
        mQomDefectId: ''
      })
    },
    async getDefectList () {
      const res = await this.$api.getRepairBadCodes()
      if (res.code === '200') {
        this.defectCodeList = res.data
      } else {
        this.defectCodeList = []
      }
    }
  },
  created () {
    this.getDefectList()
  }
}
</script>
