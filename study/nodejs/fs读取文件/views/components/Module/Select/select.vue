<template>
  <el-select v-model="newValue" :style="style" :filterable="filterable" :clearable="clearable" :placeholder="placeholder || $t('common_PleasSele')" :disabled="disabled" @change="selectChange">
    <el-option v-for="(option,i) in optionList" :key="i" :label="option[labelKey]" :value="option[valueKey]" @click.native="optionClick(option)"></el-option>
  </el-select>
</template>

<script>
export default {
  data () {
    return {
      newValue: '',
      optionList: []
    }
  },
  props: {
    value: {
      type: [Number, String]
    },
    width: {
      type: String,
      default () {
        return '100%'
      }
    },
    labelKey: {
      type: String,
      required: true
    },
    valueKey: {
      type: String,
      required: true
    },
    params: {
      type: Object,
      default () {
        return {}
      }
    },
    method: {
      type: String,
      required: true
    },
    filterable: {
      type: Boolean,
      default: true
    },
    clearable: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String
    },
    isLinkage: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    style () {
      const { width } = this
      return { width }
    }
  },
  watch: {
    value (val) {
      this.newValue = val
    }
  },
  methods: {
    optionClick (option) {
      this.$emit('optionClick', option)
    },
    selectChange (val) {
      this.$emit('input', val)
      this.$emit('change', val)
    },
    async getOptions () {
      const { method, params } = this
      const res = await this.$api[method](params)
      const { code, data } = res
      if (code === '200') {
        this.optionList = Array.isArray(data) ? data : data.list
      } else {
        this.optionList = []
      }
    }
  },
  created () {
    const { isLinkage } = this
    if (!isLinkage) {
      this.getOptions()
    }
  }
}
</script>
