<template>
<el-form :model="dialogFrom" ref="dialogFrom" label-position="left"  label-width="120px" class="el-row mes-form-rule" :rules="rules">
  <el-form-item  label-width="280px"  :label="$t('APSResorce_One') + ' . ' + $t('common_essenInfo')" class="el-col el-col-24"></el-form-item>
  <el-form-item :label="$t('APSResorce_SchedReso') + ':'" prop="resourceCode" class="el-col el-col-11">
    <el-input :disabled="isEdit" v-model="dialogFrom.resourceCode"></el-input>
  </el-form-item>
  <el-form-item :label="$t('common_Description')" class="el-col el-col-24">
    <el-input  v-model="dialogFrom.resourceDesc"  type="textarea" :rows="2" :placeholder="$t('common_PleasEnteCont')"></el-input>
  </el-form-item>
    <el-form-item label-width="280px" :label="$t('APSResorce_Two') + ' . ' + $t('APSResorce_CapacInfo')" class="el-col el-col-23"></el-form-item>
    <el-form-item  :label="$t('APSResorce_UtiliRate')" prop="capacityUtilization" class="el-col el-col-11">
      <div slot="label" style="display:inline-block;">
        <span>{{$t('APSResorce_UtiliRate')}}</span>
        <help-tips :content="$t('APSResorce_resouUtilRateWorkOrde')" />
      </div>
      <el-input v-model.number="dialogFrom.capacityUtilization" :placeholder="$t('common_pleasEnteANumb')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_Status')" class="el-col el-col-11 el-col-offset-1">
      <dict-select v-model="dialogFrom.status" dictType="RESOURCE_STATUS"  selectKey="dictCode"></dict-select>
    </el-form-item>
      <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveForm">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
    </el-form-item>
</el-form>
</template>

<script>
export default {
  data () {
    return {
      dialogFrom: {
        resourceCode: '',
        resourceDesc: '',
        status: this.isEdit ? '' : 'NORMAL',
        capacityUtilization: '',
        mPsmResourceId: ''
      },
      rules: {
        resourceCode: [{ required: true, message: this.$t('common_PleasEnteItemNu') }],
        capacityUtilization: [{ required: true, message: this.$t('APSResorce_enterUtilRate') }]

      }
    }
  },
  props: {
    cannel: Function,
    isEdit: Boolean,
    getResourceList: Function
  },
  methods: {
    saveForm () {
      this.$refs.dialogFrom.validate(async valid => {
        if (valid) {
          let { dialogFrom } = this
          let res = await this.$api.saveApsResource(dialogFrom)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getResourceList')
          })
        }
      })
    }
  }

}
</script>
