<template>
 <el-form :model="dialogForm"  ref="dialogForm" label-position="left" label-width="120px" class="el-row mes-form-rule" :rules="rules" size="mini">
   <el-form-item label="文档类型" prop="docType" class="el-col el-col-24">
     <el-input v-model="dialogForm.docType"></el-input>
   </el-form-item>
   <el-form-item label="描述" class="el-col el-col-24">
     <el-input v-model="dialogForm.typeDesc"></el-input>
   </el-form-item>
   <el-form-item label="文档后缀" class="el-col el-col-24">
     <!-- <el-input v-model="dialogForm.suffix"></el-input> -->
     <el-select style="width:100%" v-model="suffixList" multiple placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>

   </el-form-item>
   <!-- <el-form-item label="文档编号规则" class="el-col el-col-24">
     <el-input  v-model="dialogForm.mSeqName"></el-input>
   </el-form-item> -->
   <el-form-item label="浏览工具" class="el-col el-col-24">
      <el-input v-model="dialogForm.browseTool"></el-input>
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
      options: [{
        value: 'PDF',
        label: 'PDF'
      }, {
        value: 'Excel',
        label: 'Excel'
      }, {
        value: 'Word',
        label: 'Word'
      }, {
        value: 'PPT',
        label: 'PPT'
      }, {
        value: 'JPG',
        label: 'JPG'
      }, {
        value: 'mp4',
        label: 'mp4'
      }],
      dialogForm: {
        docType: '',
        typeDesc: '',
        suffix: '',
        // mSeqName: '',
        browseTool: '',
        mComDoctypeId: ''
      },
      suffixList: [],
      rules: {
        docType: [{ required: true, message: '文档类型不能为空' }]
      }
    }
  },
  props: {
    cancel: Function,
    isEdit: Boolean,
    getTableData: Function
  },
  methods: {
    saveForm () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let { dialogForm, suffixList } = this
          let arr = suffixList
          let str = ''
          arr.forEach((item, i) => {
            str = i === 0 ? str + item : str + ';' + item
          })
          dialogForm.suffix = str
          let res = await this.$api.insertOrUpdateDoctype(dialogForm)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cancel')
            this.$emit('getTableData')
          })
        }
      })
    }
  }

}
</script>
