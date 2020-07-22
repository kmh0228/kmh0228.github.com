<template>
  <div class="mes-table">
    <el-table border :data="categoryData.classVmList">
      <el-table-column type="index" :label="$t('common_Number')" width="50" align="center">
        <template slot-scope="prop">
          <p>{{ prop.$index + 1 }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="classCode" :label="$t('material_cateCode')" align="center"></el-table-column>
      <el-table-column prop="className" :label="$t('material_cateName')" align="center"></el-table-column>
      <el-table-column prop="assemblyType" :label="$t('material_assemblyType')" align="center"></el-table-column>
      <el-table-column prop="assemblyRelationship" :label="$t('material_assemblyRela')" align="center"></el-table-column>
      <el-table-column prop="hierarchyScope" :label="$t('material_levelRange')" align="center"></el-table-column>
      <el-table-column prop="classDesc" :label="$t('material_typeDesc')" align="center"></el-table-column>
      <el-table-column prop="location" :label="$t('material_position')" align="center"></el-table-column>
      <el-table-column :label="$t('common_Operate')" width="60" align="center" v-if="useType!==0">
        <template slot-scope="scope">
          <el-button type="text" size="mini" style="color:#F56C6C;font-size:0.8vw;" icon="el-icon-delete" @click="deleteRows(scope.$index)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    useType: {
      type: Number
    },
    categoryData: {
      type: Object
    }
  },
  methods: {
    deleteRows (index) {
      this.categoryData.classVmList.splice(index, 1)
    },
    async saveMaterial () {
      let { mComMaterialId } = this.categoryData
      if (mComMaterialId) {
        let res = await this.$api.saveMaterialClass(this.categoryData)
        let { code, msg } = res
        if (code === '200') {
          this.$message.success(msg)
        } else {
          this.$message.error(msg)
        }
      } else {
        this.$message.warning(this.$t('material_pleaseSaveInfo'))
      }
    }
  }
}
</script>
