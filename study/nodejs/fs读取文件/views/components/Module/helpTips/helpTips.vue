<template>
  <el-tooltip class="mes-help-tips" effect="dark" :content="content" :placement="placement">
    <div>
      <i class="el-icon-question"></i>
    </div>
  </el-tooltip>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    placement: {
      type: String,
      default: 'top'
    },
    content: {
      type: String,
      required: true
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.mes-help-tips {
  display: inline-block;
  text-align: center;
  font-size: 16px;
  color: #e6a23c;
  cursor: pointer;
}
</style>
