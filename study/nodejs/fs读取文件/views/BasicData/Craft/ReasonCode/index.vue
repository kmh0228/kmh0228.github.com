<template>
  <div class="mes-main mes-work-order mes-material">
    <h3 class="mes-main-title">原因代码管理</h3>
    <el-row :gutter="20" style="padding:1vh 0;">
      <el-col :span="12">
        <!-- <el-select style="width:35%;" size="mini" v-model="defectReasonCodeType" filterable placeholder="原因代码类型" @change="getAllDefectReason">
           <el-option label="全部" value=""></el-option>
          <el-option v-for="(option,i) in defectReasonTypeList" :key="i" :label="option.DICT_NAME" :value="option.M_DATA_DICT_ID"></el-option>
        </el-select> -->
        <dict-select style="width:35%;" v-model="defectReasonCodeType" dictType="DEFECT_CODE_TYPE" clearable placeholder="原因代码类型" @change="getAllDefectReason"></dict-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-input placeholder="请输入原因代码" v-model.trim="keywords" size="mini" style="width:40%;float:right;" @keydown.enter.native="getAllDefectReason">
        </el-input>
      </el-col>
    </el-row>
    <div class="mes-material-handle mes-table-handle">
      <div class="mes-btn-group">
        <el-button size="mini" icon="el-icon-search" @click="getAllDefectReason">查询</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-plus"  @click="handleReasonCode('')">新增</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-rank" @click="openMoveDialog">移动</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-refresh"  @click="getAllDefectReason">刷新</el-button>
      </div>
      <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
        layout="total,sizes, prev, pager, next, jumper, ->" :total="total"
        @current-change="handleCurrentChange" @size-change="handleSizeChange">
      </el-pagination>
    </div>
    <div class="mes-table table-tree">
      <el-table :data="defectReasonList" ref="refTable" @row-click="rowClick" @header-click="defectReasonPid='';isLeaf=false" :row-class-name="rowClassName" :cell-class-name="cellClassName">
         <el-table-column type="index" label="序号" :index="indexMethod" width="50" align="center"></el-table-column>
        <el-table-column type="expand" width="50">
          <template slot-scope="props">
            <tableTree v-if="props.row.child && props.row.child.length>0" :treeData="props.row.child" :rowClick="rowClick" :formatter="formatter" :handleRow="handleReasonCode" :deleteRow="delReasoCode" :columnList="columnList" :rowClassName="rowClassName" :cellClassName="cellClassName"></tableTree>
          </template>
        </el-table-column>
        <el-table-column sortable v-for="(col,i) in columnList" :key="i" :label="col.label" :prop="col.key" :width="col.width?col.width:''" :formatter="formatter"></el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <handle-button @click="handleReasonCode(scope.row)" iconClass='el-icon-edit-outline' tipText="编辑"></handle-button>
            <handle-button @click="delReasoCode(scope.row)" iconClass='el-icon-delete' tipText="删除" iconColor='#f56c6c'></handle-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
     <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" class="handle-dialog" width="600px">
       <dialog-form v-if="dialogVisible" ref="dialog" @cannel="cannel" @getAllDefectReason="getAllDefectReason" :defectReasonTypeList="defectReasonTypeList" :defectReasonOptions="defectReasonOptions" :defectReasonPid="defectReasonPid" :isEdit="isEdit"></dialog-form>
    </el-dialog>
    <el-dialog title="请选择移动至" :visible.sync="moveDialog" class="handle-dialog" width="500px">
      <el-cascader v-model="parentDefectReasonPid" expand-trigger="hover" change-on-select :show-all-levels="false" style="width:100%" size="mini" :options="defectReasonOptions" :props="cascaderProps">
      </el-cascader>
      <div class="dialog-footer">
        <el-button type="primary" size="mini" @click="moveNode">确定</el-button>
        <el-button plain size="mini" @click="moveDialog=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tableTree from '@/components/Module/TableTree/tableTree'
import dialogForm from './dialogForm'
export default {
  data () {
    return {
      defectReasonCodeType: '',
      defectReasonTypeList: [],
      keywords: '',
      queryLevel: 1,
      defectReasonList: [],
      columnList: [
        {
          label: '原因代码',
          key: 'defectReasonCode',
          width: '400'
        }, {
          label: '原因名称',
          key: 'defectReasonName'
        }, {
          label: '原因描述',
          key: 'defectReasonDesc'
        }, {
          label: '是否是叶子节点',
          key: 'isLeaf',
          width: '150'
        }
      ],
      dialogVisible: false,
      defectReasonPid: '',
      isLeaf: false,
      total: 0,
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      isEdit: false,
      moveDialog: false,
      parentDefectReasonPid: [],
      cascaderProps: {
        label: 'defectReasonCode',
        value: 'mQomDefectReasonId',
        children: 'children'
      }
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? '编辑原因代码' : '新增原因代码'
    },
    defectReasonOptions () {
      let arr = JSON.parse(JSON.stringify(this.defectReasonList))
      this.$global.convertOptions(arr, 'child')
      return arr
    }
  },
  methods: {
    handleSizeChange (size) {
      this.page.pageSize = size
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    rowClick (row, column, event) {
      this.$refs.refTable.toggleRowExpansion(row)
      this.defectReasonPid = row.mQomDefectReasonId
      this.isLeaf = row.isLeaf
    },
    formatter (row, column, cellValue, index) {
      if (column.property === 'isLeaf') {
        return cellValue ? '是' : '否'
      } else {
        return cellValue
      }
    },
    rowClassName ({ row, rowIndex }) {
      return this.defectReasonPid === row.mQomDefectReasonId ? 'expand-active' : ''
    },
    // 无下一级的时候隐藏class
    cellClassName ({ row, column, rowIndex, columnIndex }) {
      let type = column.type
      return row.child && row.child.length > 0 && type === 'expand' ? '' : 'expand-hidden'
    },
    // 获取不良原因类型列表
    async getDefectReasonTypes () {
      let res = await this.$api.getJobOrdersDict('DEFECT_CODE_TYPE')
      this.defectReasonTypeList = res.data
    },
    // 移动节点
    openMoveDialog () {
      let { defectReasonPid } = this
      if (defectReasonPid) {
        this.moveDialog = true
      } else {
        this.$message.warning('请先选择需要移动的节点!')
      }
    },
    async moveNode () {
      let id = this.defectReasonPid
      let index = this.parentDefectReasonPid.length - 1
      let defectReasonPid = this.parentDefectReasonPid[index]
      if (defectReasonPid !== id) {
        let list = [id]
        let data = { defectReasonPid, list }
        let res = await this.$api.moveDefectCode(data)
        if (res.code === '200') {
          this.$message.success(res.msg)
          this.getAllDefectReason()
          this.moveDialog = false
        } else {
          this.$message.error(res.msg)
        }
      } else {
        this.$message.warning('请勿选择节点自身！')
      }
    },
    async getAllDefectReason () {
      let { defectReasonCodeType, keywords, page, queryLevel } = this
      let data = Object.assign({ defectReasonCodeType, keywords, queryLevel }, page)
      let res = await this.$api.getDefectReasonCodes(data)
      this.total = res.data.totalNum
      this.defectReasonList = res.data.list
    },
    handleReasonCode (row) {
      if (row) {
        this.dialogVisible = true
        this.isEdit = true
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialog.dilogFrom)
          this.$refs.dialog.dilogFrom = this.$global.filterForm(row, keys)
          this.$refs.dialog.dilogFrom.mQomDefectReasonId = row.mQomDefectReasonId
        })
      } else {
        if (this.isLeaf) {
          this.$message.warning('当前节点不允许添加子节点，请先修改或者重新选择！')
        } else {
          this.dialogVisible = true
          this.isEdit = false
        }
      }
    },
    async delReasoCode (row) {
      let confirmRes = await this.$myPrompt.confirm('删除当前原因代码将会连同子节点一并删除，确定删除吗？')
      if (confirmRes) {
        let { mQomDefectReasonId } = row
        let res = await this.$api.deleteDefectReasonCode({ mQomDefectReasonId })
        let { msg, code } = res
        if (code === '200') {
          this.getAllDefectReason()
          this.defectReasonPid = ''
          this.isLeaf = false
          this.$message.success(msg)
        } else {
          this.$message.error(msg)
        }
      }
    },
    cannel () {
      this.dialogVisible = false
    }
  },
  components: {
    tableTree, dialogForm
  },
  created () {
    this.getDefectReasonTypes()
    this.getAllDefectReason()
  }
}
</script>
