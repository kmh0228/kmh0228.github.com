<template>
  <el-tabs v-model="activeName">
    <el-tab-pane :label="$t('common_InspeRecord')" name='record'>
      <el-table :data="iqcTestDetailDtoList" border>
        <el-table-column prop="sortNo" :label="$t('common_item')" align="center"></el-table-column>
        <el-table-column :label="$t('common_InspeItem')" prop="inspectItem" align="center" ></el-table-column>
        <el-table-column :label="$t('common_MapLoca')" prop="locationContent" align="center" ></el-table-column>
        <el-table-column :label="$t('common_InspeCont')" prop="inspectContent" align="center"></el-table-column>
        <el-table-column :label="$t('common_Speci')" prop="spec" align="center"></el-table-column>
        <el-table-column :label="$t('IqcList_SamplingNumber')" prop="sampleQty" align="center">
          <template slot-scope="prop">
            <el-input size="mini" v-model.number="prop.row.sampleQty"></el-input>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common_Unit')" prop="specUom" align="center">
          <template slot-scope="prop">
            <el-input size="mini" v-model.trim="prop.row.specUom"></el-input>
          </template>
        </el-table-column>
        <el-table-column :label="$t('IqcList_TestingTools')" prop="inspectTool" align="center">
          <template slot-scope="prop">
            <el-input size="mini" v-model.trim="prop.row.inspectTool"></el-input>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common_detecResu')" align="center">
          <template slot-scope="prop">
            <el-input size="mini" v-model.trim="prop.row.inspectInfo"></el-input>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common_JudgmResu')" align="center">
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
      activeName: 'record'
    }
  },
  computed: {
    statusList () {
      return ['OK', 'NG', this.$t('common_blank')]
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
