<template>
  <div class="" v-loading="loading">
    <div class="buttonBox">
       <el-button size="mini" icon="el-icon-edit" @click="isEdit = true" v-if="!isEdit">{{$t('common_Edit')}}</el-button>
        <el-button size="mini" icon="el-icon-plus" @click="addTable" v-if="isEdit">{{$t('productCheckM_NewLine')}}</el-button>
        <span class="split-line" v-if="isEdit">|</span>
         <el-button size="mini" v-if="isEdit" :loading="saveLoading"  @click="saveTable">{{$t('common_save')}}</el-button>
        <span class="split-line" v-if="isEdit">|</span>
        <el-button size="mini" icon="el-icon-delete-solid" v-if="isEdit" @click="deletetableData(selectIds)">{{$t('common_Delete')}}</el-button>
    </div>
    <div class="tableBox" style="margin-top:10px">
       <el-table :data="tableData" style="width: 100%"  border @selection-change="selectionChange">
        <el-table-column type="selection" width="50" fixed="left"></el-table-column>
        <el-table-column type="index" :label="$t('common_Number')" align="center" :index="1" fixed="left"></el-table-column>
        <el-table-column  prop="stationName" :label="$t('productCheckM_NameWorkStat')" sortable align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.stationName" v-if="isEdit"></el-input>
            <span  v-else >
              {{scope.row.stationName}}
            </span>
            </template>
        </el-table-column>
        <el-table-column prop="eqpType" :label="$t('productCheckM_EquipMode')" sortable align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.eqpType" v-if="isEdit"></el-input>
            <span  v-else >
              {{scope.row.eqpType}}
            </span>
            </template>
        </el-table-column>
        <el-table-column prop="controlType" :label="$t('productCheckM_ContrCate')" sortable align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.controlType" v-if="isEdit"></el-input>
            <span  v-else >
              {{scope.row.controlType}}
            </span>
            </template>
        </el-table-column>
        <el-table-column prop="controlProject" :label="$t('productCheckM_ContrItem')" sortable align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.controlProject" v-if="isEdit"></el-input>
            <span  v-else >
              {{scope.row.controlProject}}
            </span>
            </template>
        </el-table-column>
        <el-table-column prop="setValue" :label="$t('productCheckM_SettiValu')" sortable align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.setValue" v-if="isEdit"></el-input>
            <span  v-else >
              {{scope.row.setValue}}
            </span>
            </template>
        </el-table-column>
        <el-table-column prop="uom" :label="$t('common_Unit')" sortable align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.uom" v-if="isEdit"></el-input>
            <span  v-else >
              {{scope.row.uom}}
            </span>
            </template>
        </el-table-column>
        <el-table-column prop="checkReason" :label="$t('productCheckM_InspeMeth')" sortable align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.checkReason" v-if="isEdit"></el-input>
            <span  v-else >
              {{scope.row.checkReason}}
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
    autonomyCheckId: {
      type: String
    }
  },
  watch: {
    autonomyCheckId (val) {
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
      let res = await this.$api.getAutonomyCheckDetailList({ parentId: id })
      if (res.code === '200') {
        this.loading = false
        this.tableData = res.data && res.data.map(item => {
          item.rowId = item.autonomyCheckDId
          return item
        })
      }
    },
    addTable () {
      this.tableData.push({
        rowId: new Date().getTime(),
        stationName: '',
        eqpType: '',
        controlType: '',
        controlProject: '',
        setValue: '',
        uom: '',
        checkReason: ''
      })
    },
    async saveTable () {
      let errorItem = this.tableData.find(item => !item.stationName.trim() || !item.eqpType.trim() || !item.controlType.trim() || !item.controlProject.trim() || !item.setValue.trim() || !item.uom.trim() || !item.checkReason.trim())
      if (errorItem) {
        this.$message.warning(this.$t('productCheckM_CheckMethCannBeEmpt'))
        return false
      }
      let reg = /^\d+(\.\d+)?$/
      let obj = this.tableData.find(item => !reg.test(item.setValue))
      if (obj) {
        this.$message.warning(this.$t('productCheckM_settiValuCanANumb'))
        return false
      }
      this.saveLoading = true
      let res = await this.$api.saveAutonomyCheckDetailList({ autonomyCheckId: this.autonomyCheckId, autonomyCheckDetailList: this.tableData })
      if (res.code === '200') {
        this.$message.success(this.$t('productCheckM_SaveSucc'))
        this.isEdit = false
        this.saveLoading = false
        this.getDetailList(this.autonomyCheckId)
      }
    }
  },
  created () {
  }
}

</script>
