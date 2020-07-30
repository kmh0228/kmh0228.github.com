<template>
  <el-tooltip class="item" effect="dark" :content="tipText" :placement="tipPlacement">
    <i class="mes-table-handle-icon" :class="iconClass" :style="{color:iconColor}" @click.stop="$emit('click')"></i>
  </el-tooltip>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    iconClass: String,
    iconColor: String,
    tipText: String,
    tipPlacement: {
      type: String,
      default: 'top'
    }
  },
  methods: {}
}
</script>
