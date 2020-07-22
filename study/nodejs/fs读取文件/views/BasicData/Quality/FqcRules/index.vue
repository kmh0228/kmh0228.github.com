<template>

<div class="mes-main mes-work-order">
  <h3 class="mes-main-title">FQC规则维护</h3>
  <el-row :gutter="20" class="mes-main-filte">
    <el-col :span="12">
      <el-select style="35%" size="mini" clearable placeholder="请选择产品系列">
        <el-option v-for="(option,i) in machineList" :key="i"></el-option>
      </el-select>
      <el-select style="35%" size="mini"   clearable placeholder="请选择稽核项目">
            <el-option v-for="(option,i) in auditList" :key="i"></el-option>
      </el-select>
    </el-col>
  </el-row>
  <div class="mes-table">
    <el-row class="mes-table-handle">
      <el-col :span="12">
          <el-button size="mini" @click="handleFQC(true)">编辑</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" @click="handleFQC(false)" >新增</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" >删除</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" >刷新</el-button>
      </el-col>
       <el-col :span="12">
           <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper, ->" :total="total" :current-page="page.pageIndex"
            @current-change="handleCurrentChange" @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
    </el-row>
    <div class="mes-table-content">
      <el-table :data="tableData" border size="mini">
        <el-table-column type="index" label="序号" align="center" :index="indexMethod"></el-table-column>
        <el-table-column prop="machine" label="产品系列" align="center" sortable></el-table-column>
        <el-table-column prop="enginery" label="机能" align="center" sortable></el-table-column>
        <el-table-column prop="auditItem" label="稽核项目" align="center" sortable></el-table-column>
        <el-table-column prop="projectContent" label="项目内容" align="center" sortable></el-table-column>
        <el-table-column prop="checkFrequency" label="点检频率" align="center" sortable></el-table-column>
        <el-table-column prop="founder" label="创建人" align="center" sortable></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" sortable></el-table-column>
        <el-table-column prop="finalEditor" label="最后编辑人" align="center" sortable></el-table-column>
        <el-table-column prop="lastEditTime" label="最后编辑时间" align="center" sortable></el-table-column>
      </el-table>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" class="handle-dialog" >
      <dialog-form v-if="dialogVisible" ref="dialog" @cannel="cannel" :isEdit="isEdit"></dialog-form>
    </el-dialog>
  </div>
</div>

</template>

<script>
import paging from '@/mixins/paging'
import dialogForm from './dialogForm'
export default {
  mixins: [paging],
  data () {
    return {
      tableData: [
        {
          machine: 'Type-C',
          enginery: 'Type-C-A',
          auditItem: 'qweww',
          projectContent: 'materil',
          checkFrequency: '50HZ',
          founder: 'user08',
          createTime: '2019-06-20 09:14:48',
          finalEditor: '',
          lastEditTime: ''
        }
      ],
      machineList: [],
      auditList: [],
      dialogVisible: false,
      isEdit: false
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? '编辑FQC规则维护' : '新增FQC规则维护'
    }
  },
  methods: {
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleFQC (isEdit) {
      this.isEdit = isEdit
      this.dialogVisible = true
    },
    cannel () {
      this.dialogVisible = false
    }
  },
  components: {
    dialogForm
  }

}
</script>
