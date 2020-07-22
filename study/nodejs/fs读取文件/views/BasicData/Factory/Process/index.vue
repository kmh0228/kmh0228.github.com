<template>
  <div class="mes-main mes-work-order mes-material">
    <h3 class="mes-main-title">{{$t('process_process')}}</h3>
    <el-row :gutter="20" style="padding:1vh 0;">
      <el-col :span="12">
        <el-select style="width:35%;" size="mini" v-model="ProcessModuleType" filterable :placeholder="$t('process_process')" @change="getProcessTree">
           <el-option :label="$t('common_all')" value=""></el-option>
          <el-option v-for="(option,i) in processModuleTypeList" :key="i" :label="option " :value="option "></el-option>
        </el-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-input :placeholder="$t('process_placeInput')" v-model.trim="segCode" size="mini" style="width:40%;float:right;" @keydown.enter.native="getProcessTree">
        </el-input>
      </el-col>
    </el-row>
    <div class="mes-material-handle mes-table-handle">
      <div class="mes-btn-group">
        <el-button size="mini" icon="el-icon-search" @click="getProcessTree">{{$t('common_Inquire')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-plus" @click="handleProcessModule('')">{{$t('common_Add')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-rank" @click="openMoveDialog">{{$t('common_move')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-refresh" @click="getProcessTree">{{$t('common_Refresh')}}</el-button>
      </div>
      <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
        layout="total,sizes, prev, pager, next, jumper, ->" :total="total"
        @current-change="handleCurrentChange" @size-change="handleSizeChange">
      </el-pagination>
    </div>
    <div class="mes-table table-tree">
      <el-table :data="processModuleList" ref="refTable" @row-click="rowClick" @header-click="mComProcessSegPId='';isLeaf=false" :row-class-name="rowClassName" :cell-class-name="cellClassName">
        <el-table-column type="index" :label="$t('common_Number')" :index="indexMethod" width="50" align="center"></el-table-column>
        <el-table-column type="expand" width="50">
          <template slot-scope="props">
            <tableTree v-if="props.row.child && props.row.child.length>0" :treeData="props.row.child" :rowClick="rowClick" :formatter="formatter" :handleRow="handleProcessModule" :deleteRow="deleteProcessTree" :columnList="columnList" :rowClassName="rowClassName" :cellClassName="cellClassName"></tableTree>
          </template>
        </el-table-column>
        <el-table-column v-for="(col,i) in columnList" :key="i" sortable :label="$t(col.label)" :prop="col.key" :width="col.width?col.width:''" :min-width="col.minWidth?col.minWidth:col.width" :formatter="formatter"></el-table-column>
        <el-table-column :label="$t('common_Operate')" width="120" align="center" fixed="right">
          <template slot-scope="scope">
            <i class="el-icon-edit-outline mes-table-handle-icon" @click.stop="handleProcessModule(scope.row)"></i>
            <i class="el-icon-delete mes-table-handle-icon" style="color:#F56C6C;" @click.stop="deleteProcessTree(scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
     <el-dialog :title="$t(dialogTitle)" :visible.sync="dialogVisible" class="handle-dialog" width="600px">
       <dialog-form v-if="dialogVisible" ref="dialog" @cannel="cannel" @getProcessTree="getProcessTree" :processModuleTypeList="processModuleTypeList" :processOptions="processOptions" :mComProcessSegPId="mComProcessSegPId" :isEdit="isEdit"></dialog-form>
    </el-dialog>
    <el-dialog :title="$t('process_placeMoveTo')" :visible.sync="moveDialog" class="handle-dialog" width="500px">
      <el-cascader v-model="processParentId" expand-trigger="hover" change-on-select :show-all-levels="false" style="width:100%" size="mini" :options="processOptions" :props="cascaderProps">
      </el-cascader>
      <div class="dialog-footer">
        <el-button type="primary" size="mini" @click="moveNode">{{$t('common_ok')}}</el-button>
        <el-button plain size="mini" @click="moveDialog=false">{{$t('common_cancel')}}</el-button>
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
      queryLevel: 1,
      ProcessModuleType: '',
      processModuleTypeList: [],
      segCode: '',
      processModuleList: [],
      columnList: [
        {
          label: 'process_processCode',
          key: 'segCode',
          width: '400'
        }, {
          label: 'common_Factory',
          key: 'officeName',
          width: '120'
        }, {
          label: 'process_processName',
          key: 'segName',
          width: '200'
        }, {
          label: 'process_stationType',
          key: 'dictName',
          width: '120'
        }, {
          label: 'process_containsNodes',
          key: 'isLeaf',
          width: '150'
        }, {
          label: 'process_needToRece',
          key: 'movein',
          width: '150'
        }, {
          label: 'process_processDesc',
          key: 'segDesc',
          minWidth: '220'
        }
      ],
      dialogVisible: false,
      moveDialog: false,
      mComProcessSegPId: '',
      processParentId: [],
      processSegPList: [],
      isLeaf: false,
      total: 0,
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      isEdit: false,
      cascaderProps: {
        label: 'segCode',
        value: 'mComProcessSegId',
        children: 'children'
      }
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? 'process_processEidtInfo' : 'process_processAddInfo'
    },
    processOptions () {
      const arr = JSON.parse(JSON.stringify(this.processSegPList))
      this.$global.convertOptions(arr, 'child')
      return arr
    }
  },
  methods: {
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getProcessTree()
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getProcessTree()
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    rowClick (row, column, event) {
      this.$refs.refTable.toggleRowExpansion(row)
      this.mComProcessSegPId = row.mComProcessSegId
      this.isLeaf = row.isLeaf
    },
    formatter (row, column, cellValue, index) {
      const { property } = column
      let result
      if (property === 'isLeaf') {
        result = this.$t(cellValue === '0' ? 'common_No' : 'common_Yes')
      } else if (property === 'movein') {
        result = this.$t(cellValue === '1' ? 'common_Yes' : 'common_No')
      } else {
        result = cellValue
      }
      return result
    },
    rowClassName ({ row, rowIndex }) {
      return this.mComProcessSegPId === row.mComProcessSegId ? 'expand-active' : ''
    },
    // 无下一级的时候隐藏class
    cellClassName ({ row, column, rowIndex, columnIndex }) {
      let type = column.type
      return row.child && row.child.length > 0 && type === 'expand' ? '' : 'expand-hidden'
    },
    // 打开节点弹出框
    openMoveDialog () {
      let { mComProcessSegPId } = this
      if (mComProcessSegPId) {
        this.processParentId = []
        this.moveDialog = true
      } else {
        this.$message.warning(this.$t('process_selectMoveNode'))
      }
    },
    // 移动节点
    async moveNode () {
      let id = this.mComProcessSegPId
      let index = this.processParentId.length - 1
      let mComProcessSegPId = this.processParentId[index]
      if (id !== mComProcessSegPId) {
        let list = [id]
        let data = { mComProcessSegPId, list }
        let res = await this.$api.moveProcess(data)
        if (res.code === '200') {
          this.$message.success(res.msg)
          this.getProcessTree()
          this.getProcessTreeWithoutLeaf()
          this.moveDialog = false
        } else {
          this.$message.error(res.msg)
        }
      } else {
        this.$message.warning(this.$t('process_dontSelectSelf'))
      }
    },
    // 获取制程列表
    async getProcessTree () {
      let { segCode, queryLevel } = this
      this.getProcessTreeWithoutLeaf()
      let data = Object.assign({ segCode, queryLevel }, this.page)
      let res = await this.$api.getProcessTree(data)
      if (res.code === '200') {
        this.processModuleList = res.data.processTreeDtos
        this.total = res.data.count
      }
    },
    // 获取可以有节点的制程表
    async getProcessTreeWithoutLeaf () {
      let res = await this.$api.getProcessTreeWithoutLeaf()
      const { code, data } = res
      if (code === '200') {
        this.processSegPList = data
      }
      this.mComProcessSegPId = ''
    },
    handleProcessModule (row) {
      if (row) {
        this.dialogVisible = true
        this.isEdit = true
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialog.dialogForm)
          this.$refs.dialog.dialogForm = this.$global.filterForm(row, keys)
          this.$refs.dialog.dialogForm.mComProcessSegId = row.mComProcessSegId
        })
      } else {
        // if (this.isLeaf === '1') {
        //   this.$message.warning('当前节点不允许添加子节点，请先修改或者重新选择！')
        // } else {
        //   this.dialogVisible = true
        //   this.isEdit = false
        // }
        this.dialogVisible = true
        this.isEdit = false
      }
    },
    async deleteProcessTree (row) {
      let confirmRes = await this.$myPrompt.confirm(this.$t('process_processDelInfo'))
      if (confirmRes) {
        let { mComProcessSegId } = row
        let res = await this.$api.deleteProcessTree([mComProcessSegId])
        let { code, msg } = res
        if (code === '200') {
          this.getProcessTree()
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
    this.getProcessTree()
  }
}
</script>
