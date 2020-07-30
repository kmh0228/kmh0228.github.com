<template>
  <div v-loading="loading">
    <div class="buttonBox">
       <el-button size="mini" icon="el-icon-edit" @click="isEdit = true" v-if="!isEdit">{{$t('common_Edit')}}</el-button>
        <el-button size="mini" icon="el-icon-plus" @click="addTable" v-if="isEdit">{{$t('productCondM_NewLine')}}</el-button>
        <span class="split-line" v-if="isEdit">|</span>
         <el-button size="mini" v-if="isEdit" :loading="saveLoading"  @click="saveTable">{{$t('common_save')}}</el-button>
        <span class="split-line" v-if="isEdit">|</span>
        <el-button size="mini" icon="el-icon-delete-solid" v-if="isEdit" @click="deletetableData(selectIds)">{{$t('common_Delete')}}</el-button>
    </div>
    <div class="tableBox" style="margin-top:10px">
       <el-table :data="tableData" style="width: 100%"  border @selection-change="selectionChange">
        <el-table-column type="selection" width="50" fixed="left"></el-table-column>
        <el-table-column type="index"  width="60" :label="$t('common_Number')" align="center" :index="1" fixed="left"></el-table-column>
        <el-table-column  prop="conditionItem" :label="$t('productCondM_SetProj')" sortable align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.conditionItem" v-if="isEdit"></el-input>
            <span  v-else >
              {{scope.row.conditionItem}}
            </span>
            </template>
        </el-table-column>
        <el-table-column prop="conditionItemEng" :label="$t('productCondM_EngliName')" sortable align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.conditionItemEng" v-if="isEdit"></el-input>
            <span  v-else >
              {{scope.row.conditionItemEng}}
            </span>
            </template>
        </el-table-column>
        <el-table-column prop="setUnit" :label="$t('common_Unit')" sortable align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.setUnit" v-if="isEdit"></el-input>
            <span  v-else >
              {{scope.row.setUnit}}
            </span>
            </template>
        </el-table-column>
        <el-table-column prop="setValue" :label="$t('productCondM_SettiValu')" sortable align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.setValue" v-if="isEdit"></el-input>
            <span  v-else >
              {{scope.row.setValue}}
            </span>
            </template>
        </el-table-column>
        <el-table-column prop="upperDeviation" :label="$t('productCondM_UpperTole')" sortable align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.upperDeviation" v-if="isEdit"></el-input>
            <span  v-else >
              {{scope.row.upperDeviation}}
            </span>
            </template>
        </el-table-column>
         <el-table-column prop="lowerDeviation" :label="$t('productCondM_LowerTole')" sortable align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.lowerDeviation" v-if="isEdit"></el-input>
            <span  v-else >
              {{scope.row.lowerDeviation}}
            </span>
            </template>
        </el-table-column>
         <el-table-column prop="recordDescD" :label="$t('common_remarks')" sortable align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.recordDescD" v-if="isEdit"></el-input>
            <span  v-else >
              {{scope.row.recordDescD}}
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
    mmomEqpConditionrecordId: {
      type: String,
      default: ''
    }
  },
  watch: {
    mmomEqpConditionrecordId (val) {
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
      let res = await this.$api.getConditionRecordDetailList({ mmomEqpConditionrecordId: id })
      if (res.code === '200') {
        this.loading = false
        let list = res.data ? res.data : []
        this.tableData = list.map(item => {
          item.rowId = item.mmomEqpConditionrecordId
          return item
        })
      }
    },
    addTable () {
      this.tableData.push({
        rowId: new Date().getTime(),
        conditionItem: '',
        conditionItemEng: '',
        setUnit: '',
        setValue: '',
        upperDeviation: '',
        lowerDeviation: '',
        recordDescD: ''
      })
    },
    async saveTable () {
      let errorItem = this.tableData.find(item => !item.conditionItem.trim() || !item.conditionItemEng.trim() || !item.setUnit.trim() || !item.setValue.trim() || !item.upperDeviation.trim() || !item.lowerDeviation.trim())
      if (errorItem) {
        this.$message.warning('设定项目、英文名、单位、设定值、上公差、下公差不能为空')
        return false
      }
      let reg = /^\d+(\.\d+)?$/
      let obj = this.tableData.find(item => !reg.test(item.setValue) || !reg.test(item.upperDeviation) || !reg.test(item.lowerDeviation))
      if (obj) {
        this.$message.warning('设定值、上公差、下公差只能是数字')
        return false
      }
      this.saveLoading = true
      let res = await this.$api.saveConditionRecordDetailList({ mmomEqpConditionrecordId: this.mmomEqpConditionrecordId, conditionRecordDetailList: this.tableData })
      if (res.code === '200') {
        this.$message.success(this.$t('productCondM_SaveSucc'))
        this.isEdit = false
        this.saveLoading = false
        this.getDetailList(this.mmomEqpConditionrecordId)
      }
    }
  },
  created () {
  }
}

</script>
