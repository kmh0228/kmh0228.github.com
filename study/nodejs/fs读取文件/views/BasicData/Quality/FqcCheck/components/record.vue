<template>
  <el-tabs v-model="activeName">
    <el-tab-pane :label="$t('common_InspeRecord')" name='record'>
      <el-table :data="iqcTestDetailDtoList" border>
        <el-table-column prop="sortNo" :label="$t('common_item')" align="center"></el-table-column>
        <el-table-column :label="$t('common_InspeItem')" prop="inspectItem" align="center" ></el-table-column>
        <el-table-column :label="$t('common_InspeCont')" prop="inspectContent" align="center"></el-table-column>
        <el-table-column :label="$t('common_MapLoca')" prop="" align="center"></el-table-column>
        <el-table-column :label="$t('fqcCheck_upperLimi')" prop="" align="center"></el-table-column>
        <el-table-column :label="$t('fqcCheck_lowerLimi')" prop="" align="center"></el-table-column>
        <el-table-column :label="$t('common_Unit')" prop="specUom" align="center"></el-table-column>
        <el-table-column :label="$t('fqcCheck_TestNumb')" prop="specUom" align="center"></el-table-column>
        <el-table-column :label="$t('fqcCheck_testResu')" align="center">
          <template slot-scope="prop">
            <el-input size="mini" v-model.trim="prop.row.inspectInfo"></el-input>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common_JudgmResu')" align="center">
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
      statusList: ['OK', 'NG', this.$t('common_blank')]
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
