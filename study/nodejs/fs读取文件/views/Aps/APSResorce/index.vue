<template>
<div class="mes-main mes-work-order ">
  <h3 class="mes-main-title">{{$t('APSResorce_SchedResoMana')}}</h3>
   <el-row :gutter="20" class="mes-main-filte">
    <el-col :span="12">
      <dict-select style="width:35%;"  v-model="searchForm.status"  dictType="RESOURCE_STATUS" @change="getResourceList" selectKey="dictCode" clearable></dict-select>
    </el-col>
    <el-col :span="12">
      <el-input :placeholder="$t('common_PleasEnteQuerCo')" v-model="searchForm.keyWord" style="float:right;width:40%" @keydown.enter.native="getResourceList" clearable>
      </el-input>
    </el-col>
  </el-row>
  <div class="mes-table">
    <el-row class="mes-table-handle">
      <el-col :span="12">
        <el-button size="mini" icon="el-icon-search" @click="getResourceList">{{$t('common_Inquire')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-plus"  @click="handleApsResource('')">{{$t('common_Add')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-delete-solid" @click="deleteResourceBatch('')">{{$t('common_Delete')}}</el-button>
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
        <el-table-column prop="resourceCode" sortable align="center" :label="$t('APSResorce_SchedResoCode')"></el-table-column>
        <el-table-column prop="status" sortable align="center" :label="$t('APSResorce_ResouStat')" ></el-table-column>
        <el-table-column prop="resourceDesc" sortable align="center" :label="$t('APSResorce_ResouDesc')" ></el-table-column>
        <el-table-column prop="capacityUtilization" sortable align="center" :label="$t('APSResorce_ResouUtil')" :formatter="valueFormatter"></el-table-column>
        <el-table-column prop="lastEditor" sortable align="center" :label="$t('APSResorce_LastModiBy')"></el-table-column>
        <el-table-column prop="lastEditedDt" sortable align="center" :label="$t('common_LastModiTime')"></el-table-column>
        <el-table-column :label="$t('common_Operate')" align="center" width="120" >
          <template slot-scope="scope">
            <handle-button @click="handleApsResource(scope.row)" iconClass='el-icon-edit-outline' :placeholder="$t('common_Edit')"></handle-button>
            <handle-button @click="deleteResourceBatch(scope.row.mPsmResourceId)" iconClass='el-icon-delete' :placeholder="$t('common_Del')" iconColor='#f56c6c'></handle-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
     <div class="mes-main-tabs" v-if="apsDetail">
        <el-tabs v-model="activeName" >
        <el-tab-pane :label="$t('APSResorce_SchedResoDeta')" name="apsResourceDetail">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span>{{$t('common_BasicInfo')}}</span>
            </div>
            <el-form :model="infoForm" label-position="left"  label-width="120px" class="el-row mes-form-rule aps-from" style="font-size:18px">
              <el-form-item :label="$t('APSResorce_SchedReso')+' :'" class="el-col el-col-11">
                {{infoForm.resourceCode}}
              </el-form-item>
              <el-form-item :label="$t('common_Description')+' :'" class="el-col el-col-11 el-col-offset-1">
                {{infoForm.resourceDesc}}
              </el-form-item>
               <el-form-item :label="$t('common_Creator')+' :'" class="el-col el-col-11">
                {{infoForm.creator}}
              </el-form-item>
              <el-form-item :label="$t('common_CreateTime')+' :'" class="el-col el-col-11 el-col-offset-1">
                {{infoForm.createdDt}}
              </el-form-item>
               <el-form-item :label="$t('APSResorce_LastModiBy')+' :'" class="el-col el-col-11">
                {{infoForm.lastEditor}}
              </el-form-item>
              <el-form-item :label="$t('common_LastModiTime')+' :'" class="el-col el-col-11 el-col-offset-1">
                {{infoForm.lastEditedDt}}
              </el-form-item>
            </el-form>
          </el-card>
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span>{{$t('APSResorce_SchedInfo')}}</span>
            </div>
            <el-form :model="infoForm" label-position="left"  label-width="120px" class="el-row mes-form-rule" style="font-size:18px">
              <el-form-item :label="$t('APSResorce_UtiliRate')+' :'" class="el-col el-col-11">
                {{infoForm.capacityUtilization}}
              </el-form-item>
              <el-form-item :label="$t('common_Status')+' :'" class="el-col el-col-11 el-col-offset-1">
                <el-tag :type="tagType" v-if="infoForm.status"> {{infoForm.status}}</el-tag>
               </el-form-item>
            </el-form>
          </el-card>
        </el-tab-pane>
        </el-tabs>
     </div>
      <el-dialog  :visible.sync="dialogVisible" :title="dialogTitle" class="handle-dialog" width="50vw">
          <dialog-from  v-if="dialogVisible"  ref="dialog"  @cannel="cannel" :isEdit="isEdit" @getResourceList="getResourceList"></dialog-from>
      </el-dialog>
</div>

</template>

<script>
import dialogFrom from './dialogFrom'
export default {
  data () {
    return {
      searchForm: {
        status: '',
        keyWord: ''
      },
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
      tableData: [],
      apsDetail: false,
      activeName: 'apsResourceDetail',
      infoForm: {
        data: '123',
        status: this.$t('APSResorce_fault')

      },
      dialogVisible: false,
      isEdit: false,
      selectList: []
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? this.$t('APSResorce_EditProdSche') : this.$t('APSResorce_NewProdSche')
    },
    tagType () {
      let type = this.infoForm.status
      if (type === this.$t('APSResorce_norma')) {
        return 'success'
      } else if (type === this.$t('APSResorce_fault')) {
        return 'warning'
      } else if (type === this.$t('APSResorce_OutServ')) {
        return 'danger'
      } else {
        return ''
      }
    },
    editDisabled () {
      return this.selectList.length !== 1
    }
  },
  methods: {
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getResourceList()
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getResourceList()
    },
    indexMethod (index) {
      let { pageSize, pageIndex } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    cellClick (row, column, cell, event) {
      this.apsDetail = true
      this.infoForm = row
      this.infoForm.capacityUtilization = parseInt(row.capacityUtilization).toFixed(2)
    },
    selectionChange (selection) {
      this.selectList = []
      selection.map(item => {
        this.selectList.push(item.mPsmResourceId)
      })
    },
    valueFormatter (row, column, cellValue, index) {
      return cellValue ? parseInt(cellValue).toFixed(2) : ''
    },
    handleApsResource (row) {
      this.dialogVisible = true
      if (row) {
        this.isEdit = true
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialog.dialogFrom)
          this.$refs.dialog.dialogFrom = this.$global.filterForm(row, keys)
          this.$refs.dialog.dialogFrom.mPsmResourceId = row.mPsmResourceId
        })
      } else {
        this.isEdit = false
      }
    },
    // 获取表数据
    async getResourceList () {
      let { searchForm, page } = this
      let data = Object.assign(searchForm, page)
      let res = await this.$api.getResourceList(data)
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
      for (let i in this.searchForm) {
        this.searchForm[i] = ''
      }
      this.page = {
        pageIndex: 1,
        pageSize: 10
      }
      this.getResourceList()
    },
    // 删除表数据
    async deleteResourceBatch (id) {
      let ids = id ? [id] : this.selectList
      let len = ids.length
      if (len > 0) {
        const confirm = await this.$myPrompt.confirm(this.$t('APSResorce_AreYouSureSeleValu') + '?')
        if (confirm) {
          let res = await this.$api.deleteResourceBatch(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.getResourceList()
          })
        }
      } else {
        this.$message.warning(this.$t('common_PleasSeleInfoDe'))
      }
    },
    cannel () {
      this.dialogVisible = false
    }
  },
  created () {
    this.getResourceList()
  },
  components: {
    dialogFrom
  }

}
</script>
