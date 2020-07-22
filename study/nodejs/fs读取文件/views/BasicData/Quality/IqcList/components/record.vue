<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="检验记录" name='record'>
      <el-table :data="iqcTestDetailDtoList" border>
        <el-table-column prop="sortNo" label="项次" align="center"></el-table-column>
        <el-table-column label="检验项目" prop="inspectItem" align="center" ></el-table-column>
        <el-table-column label="图位" prop="locationContent" align="center" ></el-table-column>
        <el-table-column label="检验内容" prop="inspectContent" align="center"></el-table-column>
        <el-table-column label="规格" prop="spec" align="center"></el-table-column>
        <el-table-column label="抽样数" prop="sampleQty" align="center">
          <template slot-scope="prop">
            <el-input size="mini" v-model.number="prop.row.sampleQty"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="单位" prop="specUom" align="center">
          <template slot-scope="prop">
            <el-input size="mini" v-model.trim="prop.row.specUom"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="检测工具" prop="inspectTool" align="center">
          <template slot-scope="prop">
            <el-input size="mini" v-model.trim="prop.row.inspectTool"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="检测结果" align="center">
          <template slot-scope="prop">
            <el-input size="mini" v-model.trim="prop.row.inspectInfo"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="判定结果" align="center">
          <template slot-scope="scope">
            <el-select size="mini" v-model.trim="scope.row.inspectResult">
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
      statusList: ['OK', 'NG', '空白'],
      activeName: 'record'
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
  methods: {

  }
}
</script>
