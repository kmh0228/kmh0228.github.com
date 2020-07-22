<template>
  <handle :useType="1"></handle>
</template>

<script>
import handle from './handle'
export default {
  data () {
    return {
    }
  },
  methods: {
    closeCurrentPage () {
      let menuTitle = this.$route.meta.title
      this.$emit('close-current-page', menuTitle)
    }
  },
  components: {
    handle
  }
}
</script>
