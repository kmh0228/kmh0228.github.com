<template>
  <div class="mes-main mes-work-order mes-material">
    <h3 class="mes-main-title">不良代码管理</h3>
    <el-row :gutter="20" style="padding:1vh 0;">
      <el-col :span="12">
        <!-- <el-select style="width:35%;" size="mini" v-model="defectCodeType" filterable placeholder="不良代码类型" @change="getDefectCodes">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(option,i) in defectCodeTypeList" :key="i" :label="option.DICT_NAME" :value="option.M_DATA_DICT_ID"></el-option>
        </el-select> -->
       <dict-select style="width:35%;" v-model="defectCodeType" dictType="DEFECT_CODE_TYPE" clearable  placeholder="不良代码类型" @change="getDefectCodes"></dict-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-input placeholder="请输入不良代码" v-model.trim="keywords" size="mini" style="width:40%;float:right;" @keydown.enter.native="getDefectCodes">
        </el-input>
      </el-col>
    </el-row>
    <div class="mes-material-handle mes-table-handle">
      <div class="mes-btn-group">
        <el-button size="mini" icon="el-icon-search" @click="getDefectCodes">查询</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-plus"  @click="handleDefectCode('')">新增</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-rank" @click="openMoveDialog">移动</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-refresh"  @click="getDefectCodes">刷新</el-button>
      </div>
      <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
        layout="total,sizes, prev, pager, next, jumper, ->" :total="total"
        @current-change="handleCurrentChange" @size-change="handleSizeChange">
      </el-pagination>
    </div>
    <div class="mes-table table-tree">
      <el-table :data="defectCodeList" ref="refTable" @header-click="defectPid='';isLeaf=false" @row-click="rowClick" :row-class-name="rowClassName" :cell-class-name="cellClassName">
        <el-table-column type="index" label="序号" :index="indexMethod" width="50" align="center"></el-table-column>
        <el-table-column type="expand" width="50">
          <template slot-scope="props">
            <tableTree v-if="props.row.child && props.row.child.length>0" :treeData="props.row.child" :rowClick="rowClick" :formatter="formatter" :handleRow="handleDefectCode" :deleteRow="delDefectCode" :columnList="columnList" :rowClassName="rowClassName" :cellClassName="cellClassName"></tableTree>
          </template>
        </el-table-column>
        <el-table-column sortable v-for="(col,i) in columnList" :key="i" :label="col.label" :prop="col.key" :width="col.width?col.width:''"  :formatter="formatter"></el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <handle-button @click="handleDefectCode(scope.row)" iconClass='el-icon-edit-outline' tipText="编辑"></handle-button>
            <handle-button @click="delDefectCode(scope.row)" iconClass='el-icon-delete' tipText="删除" iconColor='#f56c6c'></handle-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" class="handle-dialog" width="600px">
      <dialog-form v-if="dialogVisible" ref="dialog" @cannel="cannel" @getDefectCodes="getDefectCodes" :defectCodeOptions="defectCodeOptions" :defectPid="defectPid" :isEdit="isEdit"></dialog-form>
    </el-dialog>
    <el-dialog title="请选择移动至" :visible.sync="moveDialog" class="handle-dialog" width="500px">
      <el-cascader v-model="parentDefectPid" expand-trigger="hover" change-on-select :show-all-levels="false" style="width:100%" size="mini" :options="defectCodeOptions" :props="cascaderProps">
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
      defectCodeType: '',
      defectCodeTypeList: [],
      keywords: '',
      queryLevel: 1,
      defectCodeList: [],
      columnList: [
        {
          label: '不良代码',
          key: 'defectCode',
          width: '400'
        }, {
          label: '不良名称',
          key: 'defectName'
        }, {
          label: '描述',
          key: 'defectDesc'
        }, {
          label: '是否是叶子节点',
          key: 'isLeaf',
          width: '150'
        }
      ],
      total: 0,
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      isLeaf: false,
      defectPid: '',
      isEdit: false,
      dialogVisible: false,
      moveDialog: false,
      parentDefectPid: [],
      cascaderProps: {
        label: 'defectCode',
        value: 'mQomDefectId',
        children: 'children'
      }
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? '编辑不良代码' : '新增不良代码'
    },
    defectCodeOptions () {
      let arr = JSON.parse(JSON.stringify(this.defectCodeList))
      this.$global.convertOptions(arr, 'child')
      return arr
    }
  },
  methods: {
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getDefectCodes()
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getDefectCodes()
    },
    rowClick (row, column, event) {
      this.$refs.refTable.toggleRowExpansion(row)
      this.defectPid = row.mQomDefectId
      this.isLeaf = row.isLeaf
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    rowClassName ({ row, rowIndex }) {
      return this.defectPid === row.mQomDefectId ? 'expand-active' : ''
    },
    formatter (row, column, cellValue, index) {
      if (column.property === 'isLeaf') {
        return cellValue ? '是' : '否'
      } else {
        return cellValue
      }
    },
    // 移动节点
    openMoveDialog () {
      let { defectPid } = this
      if (defectPid) {
        this.moveDialog = true
      } else {
        this.$message.warning('请先选择需要移动的节点!')
      }
    },
    async moveNode () {
      let id = this.defectPid
      let index = this.parentDefectPid.length - 1
      let defectPid = index >= 0 ? this.parentDefectPid[index] : ''
      if (defectPid !== id) {
        let list = [id]
        let data = { defectPid, list }
        let res = await this.$api.moveDefectCode(data)
        if (res.code === '200') {
          this.$message.success(res.msg)
          this.getDefectCodes()
          this.moveDialog = false
        } else {
          this.$message.error(res.msg)
        }
      } else {
        this.$message.warning('请勿选择节点自身！')
      }
    },
    // 获取不良类型列表
    async getDefectTypes () {
      let res = await this.$api.getJobOrdersDict('DEFECT_CODE_TYPE')
      this.defectCodeTypeList = res.data
    },
    // 无下一级的时候隐藏class
    cellClassName ({ row, column, rowIndex, columnIndex }) {
      let type = column.type
      return row.child && row.child.length > 0 && type === 'expand' ? '' : 'expand-hidden'
    },
    async getDefectCodes () {
      let { defectCodeType, keywords, page, queryLevel } = this
      let data = Object.assign({ defectCodeType, keywords, queryLevel }, page)
      let res = await this.$api.getAllDefectCode(data)
      if (res.code === '200') {
        this.total = res.data.totalNum
        this.defectCodeList = res.data.list
      }
    },
    handleDefectCode (row) {
      if (row) {
        this.dialogVisible = true
        this.isEdit = true
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialog.dialogForm)
          this.$refs.dialog.dialogForm = this.$global.filterForm(row, keys)
          this.$refs.dialog.dialogForm.mQomDefectId = row.mQomDefectId
        })
      } else {
        // if (this.isLeaf) {
        //   this.$message.warning('当前节点不允许添加子节点，请先修改或者重新选择！')
        // } else {
        //   this.dialogVisible = true
        //   this.isEdit = false
        // }
        this.dialogVisible = true
        this.isEdit = false
      }
    },
    async delDefectCode (row) {
      let confirmRes = await this.$myPrompt.confirm('删除当前不良代码将会连同子节点一并删除，确定删除吗？')
      if (confirmRes) {
        let { mQomDefectId } = row
        let res = await this.$api.deleteDefectCode({ mQomDefectId })
        let { msg, code } = res
        if (code === '200') {
          this.getDefectCodes()
          this.mQomDefectId = ''
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
    this.getDefectTypes()
    this.getDefectCodes()
  }
}
</script>
