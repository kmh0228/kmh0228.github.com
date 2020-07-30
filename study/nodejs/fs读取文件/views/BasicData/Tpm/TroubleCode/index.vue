<template>
  <div class="mes-main mes-work-order">
  <div class="mes-main-title">{{$t('troubleCode_FaultCodeMana')}}</div>
  <el-row :gutter="20" class="mes-main-filte">
    <el-col :span="12">
      <cascader-select v-model="searchForm.officeCode" style="width:40%" dataType="1"></cascader-select>
    </el-col>
    <el-col :span="12">
      <el-input :placeholder="$t('troubleCode_enterFaulCode')" v-model.trim="searchForm.failCode" size="mini" style="width:40%;float:right" @keydown.enter.native="getTableData">
         <i slot="suffix" class="el-input__icon"  @click="getTableData"></i>
      </el-input>
    </el-col>
  </el-row>
  <div class="mes-table">
    <el-row class="mes-table-handle">
      <el-col :span="12">
        <el-button size="mini" icon="el-icon-search" @click="getTableData">{{$t('common_Inquire')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-plus" @click="handletable('')">{{$t('common_Add')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-delete-solid" @click="deleteTable('')">{{$t('common_Delete')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-refresh" @click="getTableData">{{$t('common_Refresh')}}</el-button>
      </el-col>
      <el-col :span="12">
        <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper, ->" :total="total"
           @current-change="handleCurrentChange"   @size-change="handleSizeChange">
        </el-pagination>
      </el-col>
    </el-row>
    <div class="mes-table-content">
      <el-table :data="tableData" border highlight-current-row size="mini"  @selection-change="tableSelectionChange">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column type="index" :label="$t('common_Number')" align="center" fixed="left" :index="indexMethod"></el-table-column>
        <el-table-column prop="officeName" sortable :label="$t('common_Factory')" fixed align="center"></el-table-column>
        <el-table-column prop="malmTypeName" sortable width="120" :label="$t('troubleCode_AlarmTypeName')" align="center"></el-table-column>
        <el-table-column prop="dictWorkKind" sortable :label="$t('common_TypeWork')" align="center"></el-table-column>
        <el-table-column prop="typeName" sortable width="120" :label="$t('common_EquipCateName')" align="center"></el-table-column>
        <el-table-column prop="failCode" sortable width="100" :label="$t('troubleCode_FaultCode')" align="center"></el-table-column>
        <el-table-column prop="failName" sortable width="100" :label="$t('troubleCode_FaultDesc')" align="center"></el-table-column>
        <el-table-column prop="standardTime" sortable width="100" :label="$t('troubleCode_StandWorkHour')" align="center"></el-table-column>
        <el-table-column prop="responseTimeoutLength" sortable width="100" :label="$t('troubleCode_respoTime')" align="center"></el-table-column>
        <el-table-column prop="firstLevelTimeoutLength" sortable width="120" :label="$t('troubleCode_Level1AlarTime')" align="center"></el-table-column>
        <el-table-column prop="secondLevelTimeoutLength" sortable width="120" :label="$t('troubleCode_Level2AlarTime')" align="center"></el-table-column>
        <el-table-column prop="thirdLevelTimeoutLength" sortable width="120" :label="$t('troubleCode_Level3AlarTime')" align="center"></el-table-column>
        <el-table-column prop="isTimeoutReport" sortable width="120" :label="$t('troubleCode_WhethRepoOver')" align="center" :formatter="dataFormatter"></el-table-column>
        <el-table-column prop="dictAlarmLevel" sortable width="100" :label="$t('troubleCode_AlarmLeve')" align="center"></el-table-column>
        <el-table-column prop="creator" sortable width="100" :label="$t('common_Creator')" align="center"></el-table-column>
        <el-table-column prop="createdDt" sortable width="100" :label="$t('common_CreateTime')" align="center"></el-table-column>
        <el-table-column :label="$t('common_Operate')" align="center" width="120" fixed="right">
          <template slot-scope="scope">
            <handle-button @click="handletable(scope.row)" iconClass='el-icon-edit-outline' :placeholder="$t('common_Edit')"></handle-button>
            <handle-button @click="deleteTable(scope.row.mMomFailcodeId)" iconClass='el-icon-delete' :placeholder="$t('common_Del')" iconColor='#f56c6c'></handle-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <el-dialog :visible.sync="dialogVisible" :title="dialogTitle"  width="1000px" class="handle-dialog">
    <dialog-form v-if="dialogVisible" ref="dialog" @cannel="cannel" :isEdit="isEdit" @getTableData="getTableData" ></dialog-form>
  </el-dialog>
</div>
</template>

<script>
import dialogForm from './dialogForm'
export default {
  data () {
    return {
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
      isEdit: false,
      tableData: [],
      dialogVisible: false,
      searchForm: {
        officeCode: '',
        failCode: '',
        queryLevel: 1
      },
      selectList: []
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? this.$t('troubleCode_EditFaulCode') : this.$t('troubleCode_NewFaulCode')
    },
    deleteDisabled () {
      let len = this.selectList.length
      return len === 0
    }
  },
  methods: {

    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getTableData()
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getTableData()
    },
    tableSelectionChange (selection) {
      this.selectList = []
      selection.map(item => {
        this.selectList.push(item.mMomFailcodeId)
      })
    },
    dataFormatter (row, column, cellValue, index) {
      return cellValue ? this.$t('common_Yes') : this.$t('common_No')
    },
    async getTableData () {
      let { searchForm, page } = this
      let data = Object.assign(searchForm, page)
      let res = await this.$api.findFailcodeList(data)
      if (res.code === '200') {
        this.tableData = res.data.list
        this.total = res.data.totalNum
      }
    },
    handletable (selectObj) {
      if (selectObj) {
        this.isEdit = true
        this.dialogVisible = true
        let mMomFailcodeId = selectObj.mMomFailcodeId
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialog.dialogForm)
          this.$refs.dialog.dialogForm = this.$global.filterForm(selectObj, keys)
          this.$refs.dialog.dialogForm.mMomFailcodeId = mMomFailcodeId
        })
      } else {
        this.isEdit = false
        this.dialogVisible = true
      }
    },
    async deleteTable (mMomFailcodeId) {
      let { selectList } = this
      const ids = mMomFailcodeId ? [mMomFailcodeId] : selectList
      if (ids.length > 0) {
        const confirm = await this.$myPrompt.confirm(this.$t('troubleCode_AreYouSureLeveInfo'))
        if (confirm) {
          if (mMomFailcodeId) {
            selectList = [mMomFailcodeId]
          }
          let res = await this.$api.deleteFailcode(selectList)
          this.$myPrompt.handleMsg(res, () => {
            this.getTableData()
          })
        }
      } else {
        this.$message.warning(this.$t('troubleCode_selecRespLeveBeDele'))
      }
    },
    cannel () {
      this.dialogVisible = false
    }
  },
  components: {
    dialogForm
  },
  created () {
    this.getTableData()
  }
}
</script>
