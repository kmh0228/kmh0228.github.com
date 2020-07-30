<template>
  <div class="mes-main mes-work-order mes-material">
    <h3 class="mes-main-title">{{$t('reasonCode_ReasoCodeMana')}}</h3>
    <el-row :gutter="20" style="padding:1vh 0;">
      <el-col :span="12">
        <!-- <el-select style="width:35%;" size="mini" v-model="defectReasonCodeType" filterable placeholder="原因代码类型" @change="getAllDefectReason">
           <el-option label="全部" value=""></el-option>
          <el-option v-for="(option,i) in defectReasonTypeList" :key="i" :label="option.DICT_NAME" :value="option.M_DATA_DICT_ID"></el-option>
        </el-select> -->
        <dict-select style="width:35%;" v-model="defectReasonCodeType" dictType="DEFECT_CODE_TYPE" clearable :placeholder="$t('reasonCode_ReasoCodeType')" @change="getAllDefectReason"></dict-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-input :placeholder="$t('reasonCode_PleasEnteReasCo')" v-model.trim="keywords" size="mini" style="width:40%;float:right;" @keydown.enter.native="getAllDefectReason">
        </el-input>
      </el-col>
    </el-row>
    <div class="mes-material-handle mes-table-handle">
      <div class="mes-btn-group">
        <el-button size="mini" icon="el-icon-search" @click="getAllDefectReason">{{$t('common_Inquire')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-plus"  @click="handleReasonCode('')">{{$t('common_Add')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-rank" @click="openMoveDialog">{{$t('common_move')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-refresh"  @click="getAllDefectReason">{{$t('common_Refresh')}}</el-button>
      </div>
      <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
        layout="total,sizes, prev, pager, next, jumper, ->" :total="total"
        @current-change="handleCurrentChange" @size-change="handleSizeChange">
      </el-pagination>
    </div>
    <div class="mes-table table-tree">
      <el-table :data="defectReasonList" ref="refTable" @row-click="rowClick" @header-click="defectReasonPid='';isLeaf=false" :row-class-name="rowClassName" :cell-class-name="cellClassName">
         <el-table-column type="index" :label="$t('common_Number')" :index="indexMethod" width="50" align="center"></el-table-column>
        <el-table-column type="expand" width="50">
          <template slot-scope="props">
            <tableTree v-if="props.row.child && props.row.child.length>0" :treeData="props.row.child" :rowClick="rowClick" :formatter="formatter" :handleRow="handleReasonCode" :deleteRow="delReasoCode" :columnList="columnList" :rowClassName="rowClassName" :cellClassName="cellClassName"></tableTree>
          </template>
        </el-table-column>
        <el-table-column sortable v-for="(col,i) in columnList" :key="i" :label="$t(col.label)" :prop="col.key" :width="col.width?col.width:''" :formatter="formatter"></el-table-column>
        <el-table-column :label="$t('common_Operate')" width="120" align="center">
          <template slot-scope="scope">
            <handle-button @click="handleReasonCode(scope.row)" iconClass='el-icon-edit-outline' :tipText="$t('common_Edit')"></handle-button>
            <handle-button @click="delReasoCode(scope.row)" iconClass='el-icon-delete' :tipText="$t('common_Del')" iconColor='#f56c6c'></handle-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
     <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" class="handle-dialog" width="600px">
       <dialog-form v-if="dialogVisible" ref="dialog" @cannel="cannel" @getAllDefectReason="getAllDefectReason" :defectReasonTypeList="defectReasonTypeList" :defectReasonOptions="defectReasonOptions" :defectReasonPid="defectReasonPid" :isEdit="isEdit"></dialog-form>
    </el-dialog>
    <el-dialog :title="$t('reasonCode_PleasSeleMove')" :visible.sync="moveDialog" class="handle-dialog" width="500px">
      <el-cascader v-model="parentDefectReasonPid" expand-trigger="hover" change-on-select :show-all-levels="false" style="width:100%" size="mini" :options="defectReasonOptions" :props="cascaderProps">
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
      defectReasonCodeType: '',
      defectReasonTypeList: [],
      keywords: '',
      queryLevel: 1,
      defectReasonList: [],
      columnList: [
        {
          label: 'reasonCode_ReasoCode',
          key: 'defectReasonCode',
          width: '400'
        }, {
          label: 'reasonCode_CauseName',
          key: 'defectReasonName'
        }, {
          label: 'reasonCode_CauseDesc',
          key: 'defectReasonDesc'
        }, {
          label: 'reasonCode_IsItALeafNode',
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
      return this.isEdit ? this.reasonCode_EditReasCode : this.reasonCode_NewReasCode
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
        return cellValue ? this.$t('common_Yes') : this.$t('common_No')
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
        this.$message.warning(this.$t('reasonCode_PleasSeleNodeBe'))
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
        this.$message.warning(this.$t('reasonCode_DoNotSeleNodeIt'))
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
          let keys = Object.keys(this.$refs.dialog.dialogForm)
          this.$refs.dialog.dialogForm = this.$global.filterForm(row, keys)
          this.$refs.dialog.dialogForm.mQomDefectReasonId = row.mQomDefectReasonId
        })
      } else {
        if (this.isLeaf) {
          this.$message.warning(this.$t('reasonCode_TheCurrNodeIsNo'))
        } else {
          this.dialogVisible = true
          this.isEdit = false
        }
      }
    },
    async delReasoCode (row) {
      let confirmRes = await this.$myPrompt.confirm(this.$t('reasonCode_DeletCurrReasCo'))
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
