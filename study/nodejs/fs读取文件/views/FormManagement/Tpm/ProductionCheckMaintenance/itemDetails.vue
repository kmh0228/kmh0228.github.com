<template>
  <div class="" v-loading="loading">
    <div class="buttonBox">
       <el-button size="mini" icon="el-icon-edit" @click="isEdit = true" v-if="!isEdit">编辑</el-button>
        <el-button size="mini" icon="el-icon-plus" @click="addTable" v-if="isEdit">新增行</el-button>
        <span class="split-line" v-if="isEdit">|</span>
         <el-button size="mini" v-if="isEdit" :loading="saveLoading"  @click="saveTable">保存</el-button>
        <span class="split-line" v-if="isEdit">|</span>
        <el-button size="mini" icon="el-icon-delete-solid" v-if="isEdit" @click="deletetableData(selectIds)">批量删除</el-button>
    </div>
    <div class="tableBox" style="margin-top:10px">
       <el-table :data="tableData" style="width: 100%"  border @selection-change="selectionChange">
        <el-table-column type="selection" width="50" fixed="left"></el-table-column>
        <el-table-column type="index" label="序号" align="center" :index="1" fixed="left"></el-table-column>
        <el-table-column  prop="stationName" label="工站名称" sortable align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.stationName" v-if="isEdit"></el-input>
            <span  v-else >
              {{scope.row.stationName}}
            </span>
            </template>
        </el-table-column>
        <el-table-column prop="eqpType" label="设备型号" sortable align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.eqpType" v-if="isEdit"></el-input>
            <span  v-else >
              {{scope.row.eqpType}}
            </span>
            </template>
        </el-table-column>
        <el-table-column prop="controlType" label="管制类别" sortable align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.controlType" v-if="isEdit"></el-input>
            <span  v-else >
              {{scope.row.controlType}}
            </span>
            </template>
        </el-table-column>
        <el-table-column prop="controlProject" label="管制项目" sortable align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.controlProject" v-if="isEdit"></el-input>
            <span  v-else >
              {{scope.row.controlProject}}
            </span>
            </template>
        </el-table-column>
        <el-table-column prop="setValue" label="设定值" sortable align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.setValue" v-if="isEdit"></el-input>
            <span  v-else >
              {{scope.row.setValue}}
            </span>
            </template>
        </el-table-column>
        <el-table-column prop="uom" label="单位" sortable align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.uom" v-if="isEdit"></el-input>
            <span  v-else >
              {{scope.row.uom}}
            </span>
            </template>
        </el-table-column>
        <el-table-column prop="checkReason" label="检查方法" sortable align="center">
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
        this.$message.warning('工站名称、设备型号、管制类别、管制项目、设定值、单位、检查方法不能为空')
        return false
      }
      let reg = /^\d+(\.\d+)?$/
      let obj = this.tableData.find(item => !reg.test(item.setValue))
      if (obj) {
        this.$message.warning('设定值只能是数字')
        return false
      }
      this.saveLoading = true
      let res = await this.$api.saveAutonomyCheckDetailList({ autonomyCheckId: this.autonomyCheckId, autonomyCheckDetailList: this.tableData })
      if (res.code === '200') {
        this.$message.success('保存成功！')
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
