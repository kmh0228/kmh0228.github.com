<template>
  <el-cascader :placeholder="placeholder || $t('common_PleasSeleFact')" v-model="valueList" :disabled="disabled" :options="officeList" :props="props" clearable @change="change"></el-cascader>
</template>

<script>

export default {
  data () {
    return {
      valueList: [],
      officeList: [],
      props: {
        label: 'officeName',
        value: 'officeCode'
      }
    }
  },
  props: {
    value: String,
    type: {
      type: [String, Number],
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String
    }
  },
  watch: {
    value (val) {
      if (!val) {
        this.valueList = []
      }
    }

  },
  methods: {
    change (val) {
      this.$emit('input', val[val.length - 1] || '')
      this.$emit('change', val[val.length - 1] || '')
    },
    setValueList (officeList, value, level) {
      let index = level - 1
      const valueList = officeList.children ? officeList.children : officeList
      const len = valueList.length
      for (let i = 0; i < len; i++) {
        const list = valueList[i]
        if (index === 0) {
          if (list.officeCode === value) {
            return officeList
          }
        } else {
          return this.setValueList(list, value, index)
        }
      }
    },
    async getOfficeList () {
      const { type } = this
      const res = await this.$api.getOfficeList({ type })
      const { code, data } = res
      if (code === '200') {
        this.officeList = data
        const { value } = this
        if (value) {
          const level = this.getCascaderNodes()
          this.valueList.unshift(value)
          for (let i = level; i > 1; i--) {
            const childVuale = this.valueList[0]
            const currentValue = this.setValueList(data, childVuale, i).officeCode
            this.valueList.unshift(currentValue)
          }
        }
      } else {
        this.officeList = []
      }
    },
    getCascaderNodes () {
      const { officeList, type } = this
      if (officeList.length > 0) {
        return Number(type) === 1 ? officeList[0].extendS1 : officeList[0].extendS2
      }
    }
  },
  created () {
    this.getOfficeList()
  }
}
</script>
