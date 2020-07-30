<template>
  <el-table :data="templateParams.paramsList" border size="mini">
    <el-table-column type="index" :label="$t('common_Number')"  :index="indexMethod" align="center"></el-table-column>
    <el-table-column :label="$t('workingTemp_ParamName')" prop="paramName" align="center"></el-table-column>
    <el-table-column :label="$t('workingTemp_ParamValu')" prop="paramValue" align="center"></el-table-column>
    <el-table-column :label="$t('workingTemp_UnitMeas')" prop="mComUomId" align="center"></el-table-column>
    <el-table-column :label="$t('common_Description')" prop="paramDesc" align="center"></el-table-column>
    <el-table-column :label="$t('common_Enable')" align="center" width="100">
      <template slot-scope="prop">
        <el-checkbox v-model="prop.row.isInvalid" true-label="0" false-label="1"  :disabled="useType===0"></el-checkbox>
      </template>
    </el-table-column>
    <el-table-column :label="$t('common_Operate')" width="100" align="center" v-if="useType!==0">
      <template slot-scope="scope">
        <el-button type="text" size="mini" style="font-size:0.8vw;" icon="el-icon-edit" @click="parameterHandle(scope.$index)"></el-button>
        <el-button type="text" size="mini" style="color:#F56C6C;font-size:0.8vw;" icon="el-icon-delete" @click="deleteCurrentRow(scope.$index)"></el-button>
      </template>
    </el-table-column>
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
    templateParams: {
      type: Object
    },
    parameterHandle: {
      type: Function
    }
  },
  methods: {
    indexMethod (index) {
      return index + 1
    },
    deleteCurrentRow (index) {
      this.templateParams.paramsList.splice(index, 1)
    },
    async saveWorkTemplate () {
      let { mPomWorkMasterId } = this.templateParams
      if (mPomWorkMasterId) {
        let res = await this.$api.saveTemplateParams(this.templateParams)
        let { code, msg } = res
        if (code === '200') {
          this.$message.success(msg)
        } else {
          this.$message.error(msg)
        }
      } else {
        this.$message.warning(this.$t('workingTemp_PleasSaveBasiIn'))
      }
    }
  }
}
</script>
