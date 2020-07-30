<template>
  <el-select v-model="dictId" :style="{width:width}" size="mini" :filterable="filterable" :placeholder="placeholder || $t('common_PleasSele')" :disabled="disabled" :clearable="clearable" @change="selectChange"  @clear="$emit('clear')">
    <el-option v-for="(option,i) in dictList" :key="i" :label="option.dictName" :value="option.dictCode" :disabled="disabledItem(option.dictName)" @click.native="optionClick(option)"></el-option>
  </el-select>
</template>

<script>
export default {
  data () {
    return {
      dictId: '',
      dictList: []
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
    dictType: {
      type: String,
      require: true
    },
    placeholder: {
      type: String
    },
    filterable: {
      type: Boolean,
      default () {
        return true
      }
    },
    selectKey: {
      type: String,
      default: 'mDataDictId'
    },
    clearable: Boolean,
    disabled: {
      type: Boolean,
      default: false
    },
    disabledItemList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  watch: {
    value (val) {
      this.dictId = val
    }
  },
  methods: {
    disabledItem (value) {
      return this.disabledItemList.indexOf(value) !== -1
    },
    async getDictList () {
      const { dictType, value } = this
      const page = {
        pageIndex: 1,
        pageSize: 100
      }
      const data = Object.assign({ dictType }, page)
      const res = await this.$api.getDictionaryDetail(data)
      if (res.code === '200') {
        this.dictList = res.data.list
      } else {
        this.dictList = []
      }
      if (value) {
        this.dictId = value
      }
    },
    selectChange (val) {
      this.$emit('input', val)
      this.$emit('change', val)
    },
    optionClick (option) {
      this.$emit('option-click', option)
    }
  },
  created () {
    this.getDictList()
  },
  mounted () {
    console.log('placeholder', this.placeholder)
  }
}
</script>
