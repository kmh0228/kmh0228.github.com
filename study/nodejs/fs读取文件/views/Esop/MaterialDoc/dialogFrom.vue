<template>
  <el-form :model="dialogForm"  ref="dialogForm" label-position="left" label-width="120px" class="el-row mes-form-rule" :rules="rules" size="mini">
    <el-form-item label="文档编号" prop="mcomDocId" class="el-col el-col-24">
     <el-input v-model="dialogForm.mcomDocId"></el-input>
   </el-form-item>
   <el-form-item label="料号" prop="mcomMaterialId" class="el-col el-col-24">
     <el-input :disabled="true" v-model="materialNo"></el-input>
   </el-form-item>
   <el-form-item label="制程" prop="mcomProcessSegId" class="el-col el-col-24">
     <el-select v-model="dialogForm.mcomProcessSegId" style="width:100%">
       <el-option v-for="(option,i) in processModuleList" :key="i" :label="option.segCode" :value="option.mComProcessSegId"></el-option>
     </el-select>
   </el-form-item>
  <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveForm">保存</el-button>
        <el-button size="mini" @click="$emit('cancel')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      dialogForm: {
        mcomDocId: '',
        mcomMaterialId: '',
        mcomProcessSegId: ''
      },
      materialNo: '',
      processModuleList: [],
      rules: {
        mcomDocId: [{ required: true, message: '文档编号不能为空' }],
        mcomMaterialId: [{ required: true, message: '料号不能为空' }],
        mcomProcessSegId: [{ required: true, message: '制程不能为空' }]
      }
    }
  },
  props: {
    cancel: Function,
    onMaterialNo: String,
    onMaterialId: String
  },
  methods: {
    saveForm () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let { dialogForm } = this
          let res = await this.$api.savePartDocRel(dialogForm)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cancel')
          })
        }
      })
    },
    // 获取制程列表
    async getProcessTree () {
      const data = {
        pageIndex: 1,
        pageSize: 1000,
        segCode: ''
      }
      let res = await this.$api.getProcessTree(data)
      if (res.code === '200') {
        this.processModuleList = res.data.processTreeDtos
      }
    }
  },
  created () {
    this.getProcessTree()
    this.dialogForm.mcomMaterialId = this.onMaterialId
    this.materialNo = this.onMaterialNo
  }
}
</script>
