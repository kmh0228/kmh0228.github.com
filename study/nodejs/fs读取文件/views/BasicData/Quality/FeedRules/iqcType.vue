<template>
  <el-form :model="iqcTypeForm" ref="dialogForm" label-width="120px" label-position="left" class="el-row mes-form-rule">
    <el-form-item label="检验类别" class="el-col el-col-24" >
      <el-checkbox-group v-model="checkedInspect">
        <el-checkbox v-for="option in inspectTypes"  :label="option.value"  :key="option">{{option.label}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveForm">保存</el-button>
      <el-button size="mini" @click="$emit('cannelType')">取消</el-button>
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
          label: '进料',
          value: 'iqc'
        },
        {
          label: '首检',
          value: 'fai'
        },
        {
          label: '巡回',
          value: 'tour'
        },
        {
          label: '入库',
          value: 'fqc'
        },
        {
          label: '库存重检',
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
