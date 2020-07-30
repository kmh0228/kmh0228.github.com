<template>
 <el-form :model="dialogForm"  ref="dialogForm" label-position="left" label-width="120px" class="el-row mes-form-rule" :rules="rules" size="mini">
   <el-form-item :label="$t('docType_DocumType')" prop="docType" class="el-col el-col-24">
     <el-input v-model="dialogForm.docType"></el-input>
   </el-form-item>
   <el-form-item :label="$t('common_Description')" class="el-col el-col-24">
     <el-input v-model="dialogForm.typeDesc"></el-input>
   </el-form-item>
   <el-form-item :label="$t('docType_DocumSuff')" class="el-col el-col-24">
     <!-- <el-input v-model="dialogForm.suffix"></el-input> -->
     <el-select style="width:100%" v-model="suffixList" multiple :placeholder="$t('common_PleasSele')">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>

   </el-form-item>
   <!-- <el-form-item :label="$t('docType_DocumNumbRule')" class="el-col el-col-24">
     <el-input  v-model="dialogForm.mSeqName"></el-input>
   </el-form-item> -->
   <el-form-item :label="$t('docType_BrowsTool')" class="el-col el-col-24">
      <el-input v-model="dialogForm.browseTool"></el-input>
   </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveForm">{{$t('common_save')}}</el-button>
        <el-button size="mini" @click="$emit('cancel')">{{$t('common_cancel')}}</el-button>
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
      suffixList: []
    }
  },
  computed: {
    rules () {
      return {
        docType: [{ required: true, message: this.$t('docType_DocumTypeCannBeEmpt') }]
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
