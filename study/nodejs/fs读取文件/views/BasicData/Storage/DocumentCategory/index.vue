<template>
  <div class="mes-main mes-work-order">
    <div class="mes-main-title">单据小类</div>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-input placeholder="编码" v-model.trim="code" size="mini" style="width:40%" @keydown.enter.native="$refs.tableList.queryList(true)"></el-input>
        <el-input placeholder="名称" v-model.trim="name" size="mini" style="width:40%" @keydown.enter.native="$refs.tableList.queryList(true)"></el-input>
      </el-col>
    </el-row>
    <div>
      <table-list ref="tableList" :tableData="tableData" :tableOption="option"  :queryListApi="getSubCategory" :total="total">
        <div slot="buttonBox">
          <el-button size="mini" icon="el-icon-search" @click="$refs.tableList.queryList(true)">查询</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="showPop">新增</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deletetableData($refs.tableList.getSelectData().map(item => item.mWmsBillSubcategoryId))">批量删除</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">刷新</el-button>
          <el-button size="mini" icon="el-icon-set-up" @click="changeSubCategory($refs.tableList.getSelectData().map(item => item.mWmsBillSubcategoryId))">启用/禁用上传</el-button>
        </div>
      </table-list>
    </div>
    <!-- 新增弹窗 -->
    <el-dialog
      :title="addForm.mWmsBillSubcategoryId ? '编辑单据小类' : '新增单据小类' "
      :visible.sync="addVisible"
      width="600px">
      <el-form class="el-row" ref="addForm" :model="addForm" :rules="rules" label-width="80px" label-position="left">
        <el-form-item label="编码"  prop="code" class="el-col el-col-11 ">
          <el-input size="mini"  v-model="addForm.code"></el-input>
        </el-form-item>
        <el-form-item label="名称"  prop="name" class="el-col el-col-11 el-col-offset-1">
          <el-input size="mini" v-model="addForm.name"></el-input>
        </el-form-item>
         <el-form-item label="描述"  prop="description" class="el-col el-col-23">
          <el-input size="mini" v-model="addForm.description"></el-input>
        </el-form-item>
        <el-form-item label="是否上传"  prop="isUpload"  class="el-col el-col-11 ">
           <el-checkbox size="mini"  v-model="addForm.isUpload"></el-checkbox>
        </el-form-item>
        <el-form-item label="分类"  prop="functionType" class="el-col el-col-11 el-col-offset-1">
          <dict-select size="mini" v-model="addForm.functionType" dictType="WMS_FUNCTION_TYPE"  selectKey="dictCode"></dict-select>
        </el-form-item>
        <el-form-item label="状态"  prop="isInvalid" class="el-col el-col-11" v-show="!!addForm.mWmsBillSubcategoryId">
          <el-select size="mini"  v-model="addForm.isInvalid" style="width:100%">
            <el-option label="可用" value="1"></el-option>
            <el-option label="不可用" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateSubCategory" :loading="saveLoading">确 定</el-button>
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
        mWmsBillSubcategoryId: '',
        code: '',
        name: '',
        description: '',
        isUpload: true,
        functionType: '',
        isInvalid: '1'
      },
      rules: {
        code: [{ required: true, message: '编码不能为空' }],
        name: [{ required: true, message: '名称不能为空' }],
        description: [{ required: true, message: '描述不能为空' }]
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
        mWmsBillSubcategoryId: '',
        code: '',
        name: '',
        description: '',
        isUpload: true,
        functionType: '',
        isInvalid: '1'
      }
      this.$refs.addForm && this.$refs.addForm.resetFields()
      this.addVisible = true
    },
    async getSubCategory (page) {
      let res = await this.$api.getSubCategory({ ...page, code: this.code, name: this.name })
      if (res.code === '200') {
        this.total = res.data.totalNum
        this.tableData = res.data.list
      } else {
        this.total = 0
        this.tableData = []
      }
    },
    async updateSubCategory () {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          let obj = {
            ...this.addForm,
            isUpload: this.addForm.isUpload ? '1' : '0'
          }
          let res = obj.mWmsBillSubcategoryId ? await this.$api.updateSubCategory(obj) : await this.$api.insertSubCategory(obj)
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
        const confirmRes = await this.$myPrompt.confirm('确定删除当前选中的单据小类吗?')
        if (confirmRes) {
          const res = await this.$api.deleteSubCategory(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.$refs.tableList.queryList()
          })
        }
      } else {
        this.$message.warning('请先选择需要删除的单据小类！')
      }
    },
    async changeSubCategory (ids = []) {
      if (ids.length > 0) {
        const res = await this.$api.changeSubCategory(ids)
        if (res.code === '200') {
          this.$message.success('修改成功')
          this.$refs.tableList.queryList()
        }
      } else {
        this.$message.warning('请先选择需要改变上传的单据小类！')
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
