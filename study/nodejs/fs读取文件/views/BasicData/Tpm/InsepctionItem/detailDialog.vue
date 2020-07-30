<template>
  <el-form :model="detailForm"  ref="detailForm" label-position="left" label-width="140px" class="el-row mes-form-rule" :rules="rules" size="mini">
    <el-form-item :label="$t('inspecItem_SpotChecMode')" prop="item" class="el-col el-col-11" size="mini">
      <el-input v-model="detailForm.item" style="width:100%" ></el-input>
    </el-form-item>
    <el-form-item :label="$t('inspecItem_SpotChecCont')" prop="detail" class="el-col el-col-11 el-col-offset-1" size="mini">
      <el-input v-model="detailForm.detail" dictType="WORK_KIND" style="width:100%;"></el-input>
    </el-form-item>
     <el-form-item :label="$t('inspecItem_SpotChecMeth')" prop="method" class="el-col el-col-11" size="mini">
      <el-input v-model="detailForm.method" style="width:100%" ></el-input>
    </el-form-item>
    <el-form-item :label="$t('inspecItem_EquipStat')" prop="status" class="el-col el-col-11 el-col-offset-1" size="mini">
      <dict-select v-model="detailForm.status" dictType="RESOURCE_STATUS" selectKey="dictCode"></dict-select>
    </el-form-item>
    <el-form-item :label="$t('inspecItem_LowerLimi')" prop="lowerValue" class="el-col el-col-11" size="mini">
      <el-input v-model.number="detailForm.lowerValue" style="width:100%" ></el-input>
    </el-form-item>
    <el-form-item :label="$t('inspecItem_UpperLimi')" prop="upperValue" class="el-col el-col-11 el-col-offset-1" size="mini">
      <el-input v-model.number="detailForm.upperValue" dictType="WORK_KIND" style="width:100%;" @blur="checkValue"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_remarks')" prop="remark" class="el-col el-col-11" size="mini">
      <el-input v-model="detailForm.remark" style="width:100%" ></el-input>
    </el-form-item>
   <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveDetailInsecptionList">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('detailDialogCannel')">{{$t('common_cancel')}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      detailForm: {
        item: '',
        detail: '',
        method: '',
        status: '',
        lowerValue: '',
        upperValue: '',
        remark: ''
      },
      rules: {
        item: [{ required: true, message: this.$t('inspecItem_inputSpotChecMethT') }],
        detail: [{ required: true, message: this.$t('inspecItem_inputSpotChecCont') }],
        method: [{ required: true, message: this.$t('inspecItem_inputSpotChecMeth') }],
        status: [{ required: true, message: this.$t('inspecItem_selecDeviStat') }]
      }

    }
  },
  props: {
    detailDialogCannel: Function,
    isDetailEdit: Boolean,
    mMomCheckitemId: String,
    findCheckitemDetailList: Function
  },
  methods: {
    saveDetailInsecptionList () {
      this.$refs.detailForm.validate(async valid => {
        if (valid) {
          let { detailForm, isDetailEdit, mMomCheckitemId } = this
          //  Object.assign  会合并到第一个对象上面去
          const data = Object.assign({ mMomCheckitemId }, detailForm)
          let res = isDetailEdit ? await this.$api.modifyCheckitemDetail(detailForm) : await this.$api.saveCheckitemDetail(data)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('detailDialogCannel')
            this.$emit('findCheckitemDetailList')
          })
        }
      })
    },
    checkValue () {
      let { lowerValue, upperValue } = this.detailForm
      if (lowerValue > upperValue) {
        this.$message.warning(this.$t('inspecItem_lowerLimiValuLimiValu'))
      }
    }

  }

}
</script>
