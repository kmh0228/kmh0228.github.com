<template>
<div class="mes-main mes-work-order ">
  <h3 class="mes-main-title">排产资源管理</h3>
   <el-row :gutter="20" class="mes-main-filte">
    <el-col :span="12">
      <dict-select style="width:35%;"  v-model="searchForm.status"  dictType="RESOURCE_STATUS" @change="getResourceList" selectKey="dictCode" clearable></dict-select>
    </el-col>
    <el-col :span="12">
      <el-input placeholder="请输入查询内容" v-model="searchForm.keyWord" style="float:right;width:40%" @keydown.enter.native="getResourceList" clearable>
      </el-input>
    </el-col>
  </el-row>
  <div class="mes-table">
    <el-row class="mes-table-handle">
      <el-col :span="12">
        <el-button size="mini" icon="el-icon-search" @click="getResourceList">查询</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-plus"  @click="handleApsResource('')">新增</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-delete-solid" @click="deleteResourceBatch('')">批量删除</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-refresh"  @click="refreshData">刷新</el-button>
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
        <el-table-column type="index" label="序号" align="center" :index="indexMethod"></el-table-column>
        <el-table-column prop="resourceCode" sortable align="center" label="排产资源代码"></el-table-column>
        <el-table-column prop="status" sortable align="center" label="资源状态" ></el-table-column>
        <el-table-column prop="resourceDesc" sortable align="center" label="资源描述" ></el-table-column>
        <el-table-column prop="capacityUtilization" sortable align="center" label="资源利用率" :formatter="valueFormatter"></el-table-column>
        <el-table-column prop="lastEditor" sortable align="center" label="最后修改人"></el-table-column>
        <el-table-column prop="lastEditedDt" sortable align="center" label="最后修改时间"></el-table-column>
        <el-table-column label="操作" align="center" width="120" >
          <template slot-scope="scope">
            <handle-button @click="handleApsResource(scope.row)" iconClass='el-icon-edit-outline' tipText="编辑"></handle-button>
            <handle-button @click="deleteResourceBatch(scope.row.mPsmResourceId)" iconClass='el-icon-delete' tipText="删除" iconColor='#f56c6c'></handle-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
     <div class="mes-main-tabs" v-if="apsDetail">
        <el-tabs v-model="activeName" >
        <el-tab-pane label="排产资源详情" name="apsResourceDetail">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span>基本资料</span>
            </div>
            <el-form :model="infoForm" label-position="left"  label-width="120px" class="el-row mes-form-rule aps-from" style="font-size:18px">
              <el-form-item label="排产资源码 :" class="el-col el-col-11">
                {{infoForm.resourceCode}}
              </el-form-item>
              <el-form-item label="描述 :" class="el-col el-col-11 el-col-offset-1">
                {{infoForm.resourceDesc}}
              </el-form-item>
               <el-form-item label="创建人 :" class="el-col el-col-11">
                {{infoForm.creator}}
              </el-form-item>
              <el-form-item label="创建时间 :" class="el-col el-col-11 el-col-offset-1">
                {{infoForm.createdDt}}
              </el-form-item>
               <el-form-item label="最后修改人 :" class="el-col el-col-11">
                {{infoForm.lastEditor}}
              </el-form-item>
              <el-form-item label="最后修改时间 :" class="el-col el-col-11 el-col-offset-1">
                {{infoForm.lastEditedDt}}
              </el-form-item>
            </el-form>
          </el-card>
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span>排产信息</span>
            </div>
            <el-form :model="infoForm" label-position="left"  label-width="120px" class="el-row mes-form-rule" style="font-size:18px">
              <el-form-item label="利用率 :" class="el-col el-col-11">
                {{infoForm.capacityUtilization}}
              </el-form-item>
              <el-form-item label="状态 :" class="el-col el-col-11 el-col-offset-1">
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
        status: '故障'

      },
      dialogVisible: false,
      isEdit: false,
      selectList: []
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? '编辑排产' : '新增排产'
    },
    tagType () {
      let type = this.infoForm.status
      if (type === '正常') {
        return 'success'
      } else if (type === '故障') {
        return 'warning'
      } else if (type === '停用') {
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
        const confirm = await this.$myPrompt.confirm('确定删除当前选中的值吗?')
        if (confirm) {
          let res = await this.$api.deleteResourceBatch(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.getResourceList()
          })
        }
      } else {
        this.$message.warning('请选择要删除的信息')
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
