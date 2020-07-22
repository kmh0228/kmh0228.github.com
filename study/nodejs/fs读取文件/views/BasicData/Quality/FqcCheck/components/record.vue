<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="检验记录" name='record'>
      <el-table :data="iqcTestDetailDtoList" border>
        <el-table-column prop="sortNo" label="项次" align="center"></el-table-column>
        <el-table-column label="检验项目" prop="inspectItem" align="center" ></el-table-column>
        <el-table-column label="检验内容" prop="inspectContent" align="center"></el-table-column>
        <el-table-column label="图位" prop="" align="center"></el-table-column>
        <el-table-column label="上限" prop="" align="center"></el-table-column>
        <el-table-column label="下限" prop="" align="center"></el-table-column>
        <el-table-column label="单位" prop="specUom" align="center"></el-table-column>
        <el-table-column label="测试编号" prop="specUom" align="center"></el-table-column>
        <el-table-column label="测试结果" align="center">
          <template slot-scope="prop">
            <el-input size="mini" v-model.trim="prop.row.inspectInfo"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="判定结果" align="center">
          <template slot-scope="prop">
            <el-select size="mini" v-model.trim="prop.row.inspectResult">
              <el-option v-for="(option,i) in statusList" :key="i" :label="option" :value="option"></el-option>
            </el-select>
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
      activeName: 'record',
      statusList: ['OK', 'NG', '空白']
    }
  },
  props: {
    iqcTestDetailDtoList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {},
  created () {
    console.log(this.iqcTestDetailDtoList, 1)
  },
  mounted () {
    console.log(this.iqcTestDetailDtoList, 2)
  }
}
</script>
