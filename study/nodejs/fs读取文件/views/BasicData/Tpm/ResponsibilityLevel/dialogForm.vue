<template>
  <el-form :model="dialogForm"  ref="dialogForm" label-position="left" label-width="120px" class="el-row mes-form-rule" :rules="rules">
    <el-form-item :label="$t('common_Factory')" prop="officeCode" class="el-col el-col-24">
      <cascader-select v-model="dialogForm.officeCode" style="width:100%" dataType="1"></cascader-select>
    </el-form-item>
    <el-form-item :label="$t('responsibiLev_RespoLeveCode')" prop="hierarchyCode" class="el-col el-col-24">
      <el-input v-model="dialogForm.hierarchyCode" dictType="DELIVERY_TYPE" :placeholder="$t('responsibiLev_enterRespLeveCode')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('responsibiLev_RespoLeveName')" prop="hierarchyName" class="el-col el-col-24">
      <el-input v-model="dialogForm.hierarchyName" style="width:100%"   :placeholder="$t('responsibiLev_enterRespLeveName')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_Description')" prop="description" class="el-col el-col-24">
      <el-input type="textarea"  :rows="2" v-model="dialogForm.description"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
    <el-button type="primary" size="mini" @click="saveDeliveryList">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      dialogForm: {
        officeCode: '',
        hierarchyCode: '',
        hierarchyName: '',
        description: ''
      }
    }
  },
  computed: {
    rules () {
      return {
        officeCode: [{ required: true, message: this.$t('common_PleasSeleFact') }],
        hierarchyCode: [{ required: true, message: this.$t('responsibiLev_enterRespLeveCode') }],
        hierarchyName: [{ required: true, message: this.$t('responsibiLev_enterRespLeveName') }]
      }
    }
  },
  props: {
    isEdit: Boolean,
    cannel: Function,
    getTableData: Function
  },
  methods: {
    saveDeliveryList () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let { dialogForm } = this
          console.log(dialogForm)
          let res = this.isEdit ? await this.$api.modifyHierarchy(dialogForm) : await this.$api.saveHierarchy(dialogForm)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getTableData')
          })
        }
      })
    }
  }
}
</script>
