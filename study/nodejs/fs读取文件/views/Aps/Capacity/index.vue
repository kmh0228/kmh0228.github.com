<template>
  <div class="mes-main mes-work-order ">
    <h3 class="mes-main-title">{{$t('capacity_CapacMana')}}</h3>
      <el-row :gutter="20" class="mes-main-filte">
        <el-col :span="12">
          <el-input :placeholder="$t('common_PleasEnteQuerCo')" v-model="keyWord" style="width:40%" @keydown.enter.native="getResourceCapacityMainList">
          </el-input>
        </el-col>
      </el-row>
      <div class="mes-table">
        <el-row class="mes-table-handle">
          <el-col :span="12">
            <el-button size="mini" icon="el-icon-search" @click="getResourceCapacityMainList">{{$t('common_Inquire')}}</el-button>
            <span class="split-line">|</span>
            <el-button  size="mini" icon="el-icon-plus" @click="handleCapacity('')">{{$t('common_Add')}}</el-button>
            <span class="split-line">|</span>
            <el-button size="mini" icon="el-icon-delete-solid" @click="deleteCapacityBatchByMain('')" >{{$t('common_Delete')}}</el-button>
            <span class="split-line">|</span>
            <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">{{$t('common_Refresh')}}</el-button>
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
            <el-table-column prop="materialNo" sortable align="center" :label="$t('common_PorN')"></el-table-column>
            <el-table-column prop="resourceGroupCode" sortable align="center" :label="$t('capacity_ResouGrou')" ></el-table-column>
            <!-- <el-table-column prop="capacityUtilization" sortable align="center" :label="$t('common_Enable')" ></el-table-column>
            <el-table-column prop="lastEditor" sortable align="center" :label="$t('common_Creator')"></el-table-column>
            <el-table-column prop="lastEditedDt" sortable align="center" :label="$t('common_CreateTime')"></el-table-column> -->
            <el-table-column :label="$t('common_Operate')" align="center" width="120" >
              <template slot-scope="scope">
                <handle-button @click="handleCapacity(scope.row)" iconClass='el-icon-edit-outline' :placeholder="$t('common_Edit')"></handle-button>
                <handle-button @click="deleteCapacityBatchByMain(scope.row)" iconClass='el-icon-delete' :placeholder="$t('common_Del')" iconColor='#f56c6c'></handle-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
       <div class="mes-main-tabs" v-if="apsDetail">
        <el-tabs v-model="activeName" >
        <el-tab-pane :label="$t('capacity_ResouCapa')" name="capacityDetail">
           <div class="mes-table-content" >
            <el-table :data="detailData" size="mini" border highlight-current-row>
              <el-table-column type="index" :label="$t('common_Number')" align="center"></el-table-column>
              <el-table-column prop="resourceCode" sortable align="center" :label="$t('capacity_SchedResoCode')"></el-table-column>
              <el-table-column prop="resourcePriority" sortable align="center" :label="$t('capacity_prior')" ></el-table-column>
              <el-table-column prop="capacityType" sortable align="center" :label="$t('capacity_CapacType')" ></el-table-column>
              <el-table-column prop="capacity" sortable align="center" :label="$t('capacity_capac')"></el-table-column>
              <el-table-column prop="capacityUom" sortable align="center" :label="$t('capacity_CapacUnit')"></el-table-column>
              <el-table-column prop="leadTime" sortable align="center" :label="$t('capacity_BeforSettTime')"></el-table-column>
              <el-table-column prop="leadTimeUom" sortable align="center" :label="$t('capacity_SetTimeUnitBefo')"></el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        </el-tabs>
     </div>
     <el-dialog  :visible.sync="dialogVisible" :title="dialogTitle" class="handle-dialog" width="60vw">
       <el-scrollbar style="height:55vh;">
         <dialog-from  v-if="dialogVisible"  ref="dialog"  @cannel="cannel" :isEdit="isEdit" @getResourceCapacityMainList="getResourceCapacityMainList" @cannelDetail="cannelDetail"></dialog-from>
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
      selectList: [],
      apsDetail: false,
      activeName: 'capacityDetail',
      isEdit: false,
      dialogVisible: false,
      detailData: [],
      materialNo: '',
      version: ''
    }
  },
  computed: {
    editDisabled () {
      return this.selectList.length !== 1
    },
    dialogTitle () {
      return this.isEdit ? this.$t('capacity_EditCapa') : this.$t('capacity_NewCapa')
    }
  },
  methods: {
    handleCurrentChange (index) {
      this.page.pageIndex = index
    },
    handleSizeChange (size) {
      this.page.pageSize = size
    },
    indexMethod (index) {
      let { pageSize, pageIndex } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    async cellClick (row, column, cell, event) {
      this.apsDetail = true
      let mComMaterialId = row.mComMaterialId
      let mPsmResourceGroupId = row.mPsmResourceGroupId
      let data = Object.assign({ mComMaterialId, mPsmResourceGroupId })
      let res = await this.$api.getResourceCapacityList(data)
      if (res.code === '200') {
        this.detailData = res.data.list
      } else {
        this.detailData = []
      }
    },
    selectionChange (selection) {
      this.selectList = []
      let obj
      selection.map(item => {
        obj = {
          mComMaterialId: item.mComMaterialId,
          mPsmResourceGroupId: item.mPsmResourceGroupId
        }
        this.selectList.push(obj)
      })
    },
    handleCapacity (row) {
      this.dialogVisible = true
      if (row) {
        this.isEdit = true
        this.$nextTick(() => {
          this.$refs.dialog.dialogFrom.mComMaterialId = row.mComMaterialId
          this.$refs.dialog.dialogFrom.mPsmResourceGroupId = row.mPsmResourceGroupId
          this.$refs.dialog.materialNo = row.materialNo
          this.$refs.dialog.version = row.version
        })
      } else {
        this.isEdit = false
      }
    },
    // 获取主表信息
    async getResourceCapacityMainList () {
      let { keyWord, page } = this
      let data = Object.assign({ keyWord }, page)
      let res = await this.$api.getResourceCapacityMainList(data)
      if (res.code === '200') {
        this.tableData = res.data.list
        this.total = res.data.totalNum
      } else {
        this.tableData = []
        this.total = 0
      }
    },
    refreshPage () {
      this.keyWord = ''
      this.page.pageIndex = 1
      this.page.pageSize = 10
      this.getResourceCapacityMainList()
    },
    // 删除表信息
    async deleteCapacityBatchByMain (row) {
      let ids = []
      if (row) {
        ids.push({
          mComMaterialId: row.mComMaterialId,
          mPsmResourceGroupId: row.mPsmResourceGroupId
        })
      } else {
        ids = this.selectList
      }
      let len = ids.length
      if (len > 0) {
        let confirm = await this.$myPrompt.confirm(this.$t('capacity_AreYouSureSeleInfo'))
        if (confirm) {
          let res = await this.$api.deleteCapacityBatchByMain(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.getResourceCapacityMainList()
          })
        }
      } else {
        this.$message.warning(this.$t('common_PleasSeleInfoDe'))
      }
    },
    cannelDetail () {
      this.apsDetail = false
    },
    cannel () {
      this.dialogVisible = false
    }
  },
  components: {
    dialogFrom
  },
  created () {
    this.getResourceCapacityMainList()
  }

}
</script>
