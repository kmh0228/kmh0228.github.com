<template>
  <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="11">
          <el-button size="mini" icon="el-icon-finished" v-if="isSetting" :loading="saveLoading" @click="saveTenantPermission">{{$t('common_save')}}</el-button>
          <el-button size="mini" icon="el-icon-setting" v-else @click="isSetting = true">{{$t('dataAuthority_Config')}}</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" border :span-method="objSpanMethod">
        <el-table-column  prop="parenttitle" :label="$t('dataAuthority_Module')" align="center"></el-table-column>
        <el-table-column  prop="title" :label="$t('dataAuthority_Function')" align="center"></el-table-column>
        <el-table-column  prop="functionCode" :label="$t('dataAuthority_Marking')" align="center"></el-table-column>
        <el-table-column :label="$t('dataAuthority_Configuration')" align="center">
          <template slot-scope="scope">
            <el-radio-group v-model="scope.row.permissionLevel" :disabled="!isSetting">
              <el-radio :label="0">{{$t('dataAuthority_Tenant')}}</el-radio>
              <el-radio :label="1">{{$t('common_Factory')}}</el-radio>
              <el-radio :label="2">{{$t('common_Department')}}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
export default {
  data () {
    return {
      isSetting: false,
      saveLoading: false,
      tableData: []
    }
  },
  methods: {
    saveAuthority () {
      this.isSetting = false
    },
    objSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return row.rowspan ? { rowspan: row.rowspan, colspan: 1 } : { rowspan: 0, colspan: 0 }
      }
    },
    async getTenantPermission () {
      let res = await this.$api.getTenantPermission()
      if (res.code === '200') {
        this.tableData = []
        res.data && res.data.forEach(item => {
          item.children && item.children.forEach((childrenItem, i) => {
            let parentObj = {}
            parentObj['rowspan'] = i === 0 ? item.children.length : 0
            Object.keys(item).forEach(key => {
              if (key !== 'children') parentObj['parent' + key] = item[key]
            })
            this.tableData.push({ ...parentObj, ...childrenItem })
          })
        })
      }
    },
    async saveTenantPermission () {
      this.saveLoading = true
      let data = this.tableData.map(item => {
        return {
          menuCode: item.functionCode,
          menuName: item.title,
          permissionLevel: item.permissionLevel
        }
      })
      let res = await this.$api.saveTenantPermission({ itemList: data })
      if (res.code === '200') {
        this.saveLoading = false
        this.$message.success(this.$t('common_SavedSuccessfully'))
        this.isSetting = false
      }
    }
  },
  created () {
    this.getTenantPermission()
  }
}
</script>
