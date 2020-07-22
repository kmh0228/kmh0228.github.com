<template>
  <div class="select-radio-group">
    <span class="select-radio-item" v-for="(option,i) in typeList" :key="i" @click="radioClick(option.value,i)" :class="activeIndex===i?'item-active':''">{{option.name}}</span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeIndex: null
    }
  },
  props: {
    value: {
      type: [Number, String],
      default: () => 0
    },
    typeList: {
      type: Array,
      default: () => [{
        name: '周',
        value: 0
      },
      {
        name: '月',
        value: 1
      },
      {
        name: '年',
        value: 2
      }]
    }
  },
  methods: {
    radioClick (val, index) {
      this.activeIndex = index
      this.$emit('input', val)
      this.$emit('change', val)
      this.$emit('radio-change', val)
    },
    setDefaultValue () {
      this.activeIndex = this.value || 0
    }
  },
  created () {
    this.setDefaultValue()
  }
}
</script>

<style lang="scss" scoped>
.select-radio-group {
  .select-radio-item {
    display: inline-block;
    cursor: pointer;
    color: #fff;
    padding: 0.5vw 2vh;
    background-color: #1a1d92;
    &:first-child {
      border-radius: 5px 0 0 5px;
    }
    &:last-child {
      border-radius: 0 5px 5px 0;
    }
  }
  .item-active {
    background-color: #353fef !important;
  }
}
</style>
