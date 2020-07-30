<template>
  <i :class="className">
    <img :src="src" style="dispaly:block;" :style="{width:size}"/>
  </i>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: {
    icon: {
      type: String
    },
    className: {
      type: String,
      default () {
        return ''
      }
    },
    size: {
      type: String,
      default () {
        return '0.8vw'
      }
    },
    suffix: {
      type: String,
      default () {
        return 'png'
      }
    }
  },
  computed: {
    src () {
      let { icon, suffix } = this
      if (suffix === 'png') {
        return `static/icon/${icon}.${suffix}`
      } else if (suffix === 'svg') {
        return `static/svg/${icon}.${suffix}`
      }
    }
  },
  methods: {
  }
}
</script>
