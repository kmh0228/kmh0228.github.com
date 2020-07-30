<template>
  <div class="" v-loading="loading">
    <div class="buttonBox">
       <el-button size="mini" icon="el-icon-edit" @click="isEdit = true" v-if="!isEdit">{{$t('common_Edit')}}</el-button>
        <el-button size="mini" icon="el-icon-plus" @click="addTable" v-if="isEdit">{{$t('harmfulR_NewLine')}}</el-button>
        <span class="split-line" v-if="isEdit">|</span>
         <el-button size="mini" v-if="isEdit" :loading="saveLoading"  @click="saveTable">{{$t('common_save')}}</el-button>
        <span class="split-line" v-if="isEdit">|</span>
        <el-button size="mini" icon="el-icon-delete-solid" v-if="isEdit" @click="deletetableData(selectIds)">{{$t('common_Delete')}}</el-button>
    </div>
    <div class="tableBox" style="margin-top:10px">
       <el-table :data="tableData" style="width: 100%"  border @selection-change="selectionChange">
        <el-table-column type="selection" width="50" fixed="left"></el-table-column>
        <el-table-column type="index" :label="$t('common_Number')" align="center" :index="1" fixed="left"></el-table-column>
        <el-table-column  prop="defectiveItem" :label="$t('harmfulR_Disad')" sortable align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.defectiveItem" v-if="isEdit"></el-input>
            <span  v-else >
              {{scope.row.defectiveItem}}
            </span>
            </template>
        </el-table-column>
        <el-table-column prop="controlWaterLevel" :label="$t('harmfulR_ContrWateLeve')" sortable align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.controlWaterLevel" v-if="isEdit"></el-input>
            <span  v-else >
              {{scope.row.controlWaterLevel}}
            </span>
            </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      isEdit: false,
      saveLoading: false,
      loading: false,
      tableData: [],
      selectIds: []
    }
  },
  props: {
    mmomEqpDefectiveItemId: {
      type: String
    }
  },
  watch: {
    mmomEqpDefectiveItemId (val) {
      this.getDetailList(val)
    }
  },
  methods: {
    selectionChange (val) {
      this.selectIds = val.map(item => item.rowId)
    },
    async deletetableData (ids) {
      this.tableData = this.tableData.filter(item => ids.indexOf(item.rowId) === -1)
    },
    async getDetailList (id) {
      this.loading = true
      let res = await this.$api.getDetailList({ mmomEqpDefectiveItemId: id })
      if (res.code === '200') {
        this.loading = false
        this.tableData = res.data && res.data.map(item => {
          item.rowId = item.mmomEqpDefectiveItemDId
          return item
        })
      }
    },
    addTable () {
      this.tableData.push({
        rowId: new Date().getTime(),
        defectiveItem: '',
        controlWaterLevel: '',
        mmomEqpDefectiveItemDId: ''
      })
    },
    async saveTable () {
      let errorItem = this.tableData.find(item => !item.defectiveItem.trim() || !item.controlWaterLevel.trim())
      if (errorItem) {
        this.$message.warning(this.$t('harmfulR_ContrWateLeveBeEmpt'))
        return false
      }
      this.saveLoading = true
      let res = await this.$api.saveDetailList({ mmomEqpDefectiveItemId: this.mmomEqpDefectiveItemId, defectiveItemDetailList: this.tableData })
      if (res.code === '200') {
        this.$message.success(this.$t('harmfulR_SaveSucc'))
        this.isEdit = false
        this.saveLoading = false
        this.getDetailList(this.mmomEqpDefectiveItemId)
      }
    }
  },
  created () {
  }
}

</script>
