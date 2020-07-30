<template>
  <el-form :model="iqcTypeForm" ref="dialogForm" label-width="120px" label-position="left" class="el-row mes-form-rule">
    <el-form-item :label="$t('common_InspeCate')" class="el-col el-col-24" >
      <el-checkbox-group v-model="checkedInspect">
        <el-checkbox v-for="option in inspectTypes"  :label="$t(option.value)"  :key="option">{{option.label}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveForm">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannelType')">{{$t('common_cancel')}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      checkedInspect: [],
      inspectTypes: [
        {
          label: 'feedRules_Feed',
          value: 'iqc'
        },
        {
          label: 'feedRules_FirstInsp',
          value: 'fai'
        },
        {
          label: 'feedRules_tour',
          value: 'tour'
        },
        {
          label: 'feedRules_Wareh',
          value: 'fqc'
        },
        {
          label: 'feedRules_InvenRech',
          value: 'ric'
        }
      ],
      iqcTypeForm: {
        iqc: false,
        fai: false,
        tour: false,
        fqc: false,
        ric: false
      }
    }
  },
  props: {
    cannelType: {
      type: Function
    },
    findItemList: {
      type: Function
    },
    sqcSelectList: {
      type: Array
    }
  },
  methods: {
    saveForm () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let { checkedInspect, iqcTypeForm, sqcSelectList } = this
          iqcTypeForm.iqc = false
          iqcTypeForm.fai = false
          iqcTypeForm.tour = false
          iqcTypeForm.fqc = false
          iqcTypeForm.ric = false
          let array = checkedInspect
          array.map(item => {
            iqcTypeForm[item] = true
          })
          let mqomSipItemId = sqcSelectList
          let data = Object.assign(iqcTypeForm, { mqomSipItemId })
          let res = await this.$api.updItemReType(data)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannelType')
            this.$emit('findItemList')
          })
        }
      })
    }
  }
}
</script>
