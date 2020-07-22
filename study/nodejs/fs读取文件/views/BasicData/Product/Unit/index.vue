<template>
  <div class="mes-main mes-work-order">
    <div class="mes-main-title">物料单位</div>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-input placeholder="编码" v-model.trim="code" size="mini" style="width:40%" @keydown.enter.native="$refs.tableList.queryList(true)"></el-input>
        <el-input placeholder="名称" v-model.trim="name" size="mini" style="width:40%" @keydown.enter.native="$refs.tableList.queryList(true)"></el-input>
      </el-col>
    </el-row>
    <div>
      <table-list ref="tableList" :tableData="tableData" :tableOption="option" :queryListApi="getMaterialUomList" :total="total">
        <div slot="buttonBox">
          <el-button size="mini" icon="el-icon-search" @click="$refs.tableList.queryList(true)">查询</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="showPop">新增</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deletetableData($refs.tableList.getSelectData().map(item => item.mComUomId))">批量删除</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">刷新</el-button>
        </div>
      </table-list>
    </div>
    <!-- 新增弹窗 -->
    <el-dialog
      :title="addForm.mComUomId ? '编辑物料单位' : '新增物料单位' "
      :visible.sync="addVisible"
      width="600px">
      <el-form class="el-row" ref="addForm" :model="addForm" :rules="rules" label-width="70px" label-position="left">
        <el-form-item label="编码"  prop="uomCode" class="el-col el-col-11 ">
          <el-input  v-model="addForm.uomCode"></el-input>
        </el-form-item>
        <el-form-item label="名称"  prop="uomName" class="el-col el-col-11 el-col-offset-1">
          <el-input v-model="addForm.uomName"></el-input>
        </el-form-item>
        <el-form-item label="类型"  prop="uomCategory" class="el-col el-col-11 ">
          <dict-select v-model="addForm.uomCategory" dictType="UOM_TYPE"  selectKey="dictCode"></dict-select>
        </el-form-item>
        <el-form-item label="精度"  prop="standardPrecision" class="el-col el-col-11 el-col-offset-1">
          <el-input v-model="addForm.standardPrecision"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveMaterialUom" :loading="saveLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TableList from '@/components/Module/TableList'
import { tableOption } from './tableOption'
export default {
  data () {
    return {
      code: '',
      name: '',
      addVisible: false,
      saveLoading: false,
      total: 0,
      option: tableOption(this),
      tableData: [],
      addForm: {
        mComUomId: '',
        uomCode: '',
        uomName: '',
        uomCategory: '',
        standardPrecision: ''
      },
      rules: {
        uomCode: [{ required: true, message: '编码不能为空' }],
        uomName: [{ required: true, message: '名称不能为空' }],
        uomCategory: [{ required: true, message: '类型不能为空' }],
        standardPrecision: [{ required: true, pattern: /^[0-9]$/, message: '请输入0~9整数' }]
      }
    }
  },
  computed: {
  },
  methods: {
    // 刷新数据，重新查询
    refreshPage () {
      this.code = ''
      this.name = ''
      this.$refs.tableList.queryList(true)
    },
    showPop () {
      this.addForm = {
        mComUomId: '',
        uomCode: '',
        uomName: '',
        uomCategory: '',
        standardPrecision: ''
      }
      this.$refs.addForm && this.$refs.addForm.resetFields()
      this.addVisible = true
    },
    async getMaterialUomList (page) {
      let res = await this.$api.getMaterialUomList({ ...page, uomCode: this.code, uomName: this.name })
      if (res.code === '200') {
        this.total = res.data.totalNum
        this.tableData = res.data.list
      } else {
        this.total = 0
        this.tableData = []
      }
    },
    async saveMaterialUom () {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          this.saveLoading = true
          let res = await this.$api.saveMaterialUom({ ...this.addForm })
          this.saveLoading = false
          if (res.code === '200') {
            this.addVisible = false
            this.$message.success('保存成功')
            this.$refs.tableList.queryList(true)
          }
        }
      })
    },
    async deletetableData (ids) {
      const len = ids.length
      if (len > 0) {
        const confirmRes = await this.$myPrompt.confirm('确定删除当前选中的物料单位吗?')
        if (confirmRes) {
          const res = await this.$api.delMaterialUom(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.$refs.tableList.queryList()
          })
        }
      } else {
        this.$message.warning('请先选择需要删除的物料单位！')
      }
    }
  },
  components: {
    TableList
  },
  created () {

  }
}
</script>
