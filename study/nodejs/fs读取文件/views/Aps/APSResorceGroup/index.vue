<template>
<div class="mes-main mes-work-order ">
  <h3 class="mes-main-title">{{$t('apsResGroup_SchedResoGrouMana')}}</h3>
   <el-row :gutter="20" class="mes-main-filte">
    <el-col >
      <el-input :placeholder="$t('common_PleasEnteQuerCo')" style="width:20%;" v-model="keyWord" @keydown.enter.native="getResourceGroupList">
      </el-input>
    </el-col>
  </el-row>
   <div class="mes-table">
    <el-row class="mes-table-handle">
      <el-col :span="12">
        <el-button size="mini" icon="el-icon-search" @click="getResourceGroupList">{{$t('common_Inquire')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-plus"  @click="handleApsResourceGroup('')">{{$t('common_Add')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-delete-solid" @click="deleteResourceGroupBatch('')">{{$t('common_Delete')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-refresh"  @click="refreshData">{{$t('common_Refresh')}}</el-button>
      </el-col>
      <el-col :span="12">
         <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper, ->" :total="total"
            @current-change="handleCurrentChange" @size-change="handleSizeChange">
          </el-pagination>
      </el-col>
    </el-row>
    <div class="mes-table-content" >
      <el-table :data="tableData" size="mini" border highlight-current-row @cell-click="cellClick" @selection-change="selectionChange">
        <el-table-column type="selection" ></el-table-column>
        <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod"></el-table-column>
        <el-table-column prop="resourceGroupCode" sortable align="center" :label="$t('apsResGroup_SchedResoCode')"></el-table-column>
        <el-table-column prop="invalid" sortable align="center" :label="$t('common_Enable')"  >
          <template slot-scope="scope">
            <el-tag :type="setTagColor(scope.row.invalid)" size="mini">{{scope.row.invalid | formaterInvalid}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastEditor" sortable align="center" :label="$t('apsResGroup_LastModiBy')"></el-table-column>
        <el-table-column prop="lastEditedDt" sortable align="center" :label="$t('common_LastModiTime')"></el-table-column>
        <el-table-column :label="$t('common_Operate')" align="center" width="120" >
          <template slot-scope="scope">
            <handle-button @click="handleApsResourceGroup(scope.row)" iconClass='el-icon-edit-outline' :placeholder="$t('common_Edit')"></handle-button>
            <handle-button @click="deleteResourceGroupBatch(scope.row.mPsmResourceGroupId)" iconClass='el-icon-delete' :placeholder="$t('common_Del')" iconColor='#f56c6c'></handle-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
     <div class="mes-main-tabs" v-if="apsDetail">
        <el-tabs v-model="activeName" >
        <el-tab-pane :label="$t('apsResGroup_SchedResoDeta')" name="apsGroupDetail">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span>{{$t('common_BasicInfo')}}</span>
            </div>
            <el-form :model="infoForm" label-position="left"  label-width="120px" class="el-row mes-form-rule aps-from" style="font-size:18px">
              <el-form-item :label="$t('apsResGroup_SchedResoCode') + ' :'" class="el-col el-col-11">
                {{infoForm.resourceGroupCode}}
              </el-form-item>
              <el-form-item :label="$t('common_Description') + ' :'" class="el-col el-col-11 el-col-offset-1">
                {{infoForm.resourceGroupDesc}}
              </el-form-item>
               <el-form-item :label="$t('common_Creator') + ' :'" class="el-col el-col-11">
                {{infoForm.creator}}
              </el-form-item>
              <el-form-item :label="$t('common_CreateTime') + ' :'" class="el-col el-col-11 el-col-offset-1">
                {{infoForm.createdDt}}
              </el-form-item>
               <el-form-item :label="$t('apsResGroup_LastModiBy') + ' :'" class="el-col el-col-11">
                {{infoForm.lastEditor}}
              </el-form-item>
              <el-form-item :label="$t('common_LastModiTime') + ' :'" class="el-col el-col-11 el-col-offset-1">
                {{infoForm.lastEditedDt}}
              </el-form-item>
              <el-form-item :label="$t('common_Enable') + ' :'" class="el-col el-col-11">
                <el-tag :type="tagType"> {{infoForm.invalid | formaterInvalid}}</el-tag>
              </el-form-item>
            </el-form>
          </el-card>
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span>{{$t('apsResGroup_ListSeleReso')}}</span>
            </div>
             <div class="mes-table-content" >
              <el-table :data="resourceTable" size="mini" border >
                <el-table-column type="index" :label="$t('common_Number')" align="center"></el-table-column>
                <el-table-column prop="resourceCode"  align="center" :label="$t('apsResGroup_SchedResoCode')"></el-table-column>
                <el-table-column prop="resourcePriority" sortable align="center" :label="$t('apsResGroup_prior')"></el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-tab-pane>
        </el-tabs>
     </div>
     <el-dialog  :visible.sync="dialogVisible" :title="dialogTitle" class="handle-dialog" width="1000px" >
       <el-scrollbar style="height:60vh;">
        <dialog-from ref="dialog"  v-if="dialogVisible" @cannel="cannel" :isEdit="isEdit" @getResourceGroupList="getResourceGroupList" :mPsmResourceGroupId="mPsmResourceGroupId"></dialog-from>
       </el-scrollbar>
     </el-dialog>
</div>

</template>

<script>
import dialogFrom from './dialogFrom'
export default {
  data () {
    return {
      keyWord: '',
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
      tableData: [],
      apsDetail: false,
      activeName: 'apsGroupDetail',
      infoForm: {},
      resourceTable: [],
      dialogVisible: false,
      isEdit: false,
      selectList: [],
      mPsmResourceGroupId: ''
    }
  },
  computed: {
    tagType () {
      return this.infoForm.invalid ? 'success' : 'danger'
    },
    dialogTitle () {
      return this.isEdit ? this.$t('apsResGroup_EditScheResoGrou') : this.$t('apsResGroup_NewScheResoGrou')
    },
    editDisabled () {
      return this.selectList.length !== 1
    }
  },
  methods: {
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getResourceGroupList()
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getResourceGroupList()
    },
    indexMethod (index) {
      let { pageSize, pageIndex } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    async cellClick (row, column, cell, event) {
      if (column.property) {
        this.apsDetail = true
        this.infoForm = row
        let mPsmResourceGroupId = row.mPsmResourceGroupId
        let res = await this.$api.getResourceGroupById({ mPsmResourceGroupId })
        this.resourceTable = res.data.list
      }
    },
    setTagColor (value) {
      return value ? 'success' : 'danger'
    },
    formatterValue (row, column, cellValue, index) {
      return cellValue ? this.$t('common_Yes') : this.$t('common_No')
    },
    selectionChange (selection) {
      this.selectList = []
      selection.map(item => {
        this.selectList.push(item.mPsmResourceGroupId)
      })
    },
    // 查询表数据
    async getResourceGroupList () {
      let { keyWord, page } = this
      let data = Object.assign({ keyWord }, page)
      let res = await this.$api.getResourceGroupList(data)
      if (res.code === '200') {
        this.total = res.data.totalNum
        this.tableData = res.data.list
      } else {
        this.total = 0
        this.tableData = []
      }
    },
    // 刷新数据，重新查询
    refreshData () {
      this.keyWord = ''
      this.page = {
        pageIndex: 1,
        pageSize: 10
      }
      this.getResourceGroupList()
    },
    // 删除资源
    async deleteResourceGroupBatch (id) {
      let ids = id ? [id] : this.selectList
      let len = ids.length
      if (len > 0) {
        const confirm = await this.$myPrompt.confirm(this.$t('apsResGroup_AreYouSureSeleInfo') + '?')
        if (confirm) {
          let res = await this.$api.deleteResourceGroupBatch(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.getResourceGroupList()
          })
        }
      } else {
        this.$message.warning(this.$t('common_PleasSeleInfoDe'))
      }
    },
    handleApsResourceGroup (row) {
      this.mPsmResourceGroupId = row.mPsmResourceGroupId
      this.dialogVisible = true
      if (row) {
        this.isEdit = true
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialog.dialogForm)
          this.$refs.dialog.dialogForm = this.$global.filterForm(row, keys)
        })
      } else {
        this.isEdit = false
      }
    },
    cannel () {
      this.dialogVisible = false
    }
  },
  components: {
    dialogFrom
  },
  created () {
    this.getResourceGroupList()
  }

}
</script>
