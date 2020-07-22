<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">设备类别管理</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <cascader-select v-model="officeCode" style="width:40%" dataType="1"></cascader-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-input placeholder="请输入设备类别代码" v-model.trim="typeCode" size="mini" style="width:40%;float:right;" @keydown.enter.native="getDeviceClassList">
          <i slot="suffix" class="el-input__icon" @click="getDeviceClassList"></i>
        </el-input>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="11">
          <el-button size="mini" icon="el-icon-search" @click="getDeviceClassList">查询</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="handleDeviceClass('')">新增</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deleteDeviceClass('')">批量删除</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="getDeviceClassList">刷新</el-button>
          <!-- <span class="split-line">|</span>
          <el-button size="mini">刷新</el-button> -->
        </el-col>
        <el-col :span="13">
          <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper, ->" :total="total" :current-page="page.pageIndex"
            @current-change="handleCurrentChange" @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
      </el-row>
      <!-- 设备类别列表 -->
      <div class="mes-table-content">
        <el-table :data="tableData" border highlight-current-row size="mini" @selection-change="tableSelectionChange">
          <el-table-column type="selection" width="50" align="center"></el-table-column>
          <el-table-column type="index" label="序号" align="center" :index="indexMethod"></el-table-column>
          <el-table-column prop="officeName" sortable label="工厂" align="center"></el-table-column>
          <el-table-column prop="typeCode" sortable label="设备类别代码" align="center"></el-table-column>
          <el-table-column prop="typeName" sortable label="设备类别名称" align="center"></el-table-column>
          <el-table-column prop="description" sortable label="描述" align="center"></el-table-column>
          <el-table-column prop="creator" sortable label="创建人" align="center"></el-table-column>
          <el-table-column prop="createTime" sortable label="创建时间" align="center"></el-table-column>
          <el-table-column label="操作" width="120" align="center">
            <template slot-scope="scope">
              <handle-button iconClass='el-icon-edit-outline' tipText="编辑" @click="handleDeviceClass(scope.row)"></handle-button>
              <handle-button iconClass='el-icon-delete' tipText="删除" iconColor='#f56c6c'  @click="deleteDeviceClass(scope.row.mMomResourceTypeId)"></handle-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 新增/编辑设备类别表单 -->
      <el-dialog :visible.sync="dialogVisible" :title="dialogTitle"  width="600px" class="handle-dialog">
        <dialog-form  v-if="dialogVisible" ref="dialog" @cannel="dialogVisible = false" :isEdit="isEdit" @getDeviceClassList="getDeviceClassList"></dialog-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import dialogForm from './dialogForm'
export default {
  data () {
    return {
      queryLevel: 1,
      officeCode: '',
      typeCode: '',
      total: 0,
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      selectList: [],
      isEdit: false,
      dialogVisible: false
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? '编辑设备类别' : '新增设备类别'
    }
  },
  methods: {
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getDeviceClassList()
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getDeviceClassList()
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    tableSelectionChange (selection) {
      this.selectList = []
      selection.forEach(item => {
        this.selectList.push(item.mMomResourceTypeId)
      })
    },
    // 查询所有设备类别
    async getDeviceClassList () {
      const { officeCode, typeCode, page, queryLevel } = this
      const params = Object.assign({ officeCode, typeCode, queryLevel }, page)
      const res = await this.$api.getDeviceClassList(params)
      const { code, data } = res
      if (code === '200') {
        this.tableData = data.list
        this.total = data.totalNum
      } else {
        this.tableData = []
        this.total = 0
      }
    },
    handleDeviceClass (row) {
      if (row) {
        this.isEdit = true
        this.dialogVisible = true
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialog.dialogForm)
          this.$refs.dialog.dialogForm = this.$global.filterForm(row, keys)
          this.$refs.dialog.dialogForm.mMomResourceTypeId = row.mMomResourceTypeId
        })
      } else {
        this.isEdit = false
        this.dialogVisible = true
      }
    },
    // 删除/批量删除
    async deleteDeviceClass (id) {
      const ids = id ? [id] : this.selectList
      if (ids.length > 0) {
        const confirm = await this.$myPrompt.confirm('确定删除当前选中的设备类别吗？')
        if (confirm) {
          const res = await this.$api.deleteDeviceClass(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.getDeviceClassList()
          })
        }
      } else {
        this.$message.warning('请先选择需要删除的设备类别！')
      }
    }
  },
  created () {
    this.getDeviceClassList()
  },
  components: { dialogForm }
}
</script>
