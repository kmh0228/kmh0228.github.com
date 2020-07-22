<template>
<div class="mes-main mes-main-common">
  <base-index type="update" :vdcsId="vdcsId" :status="status"></base-index>
</div>
</template>

<script>
import BaseIndex from './baseIndex'

export default {
  data () {
    return {
      vdcsId: '',
      status: ''
    }
  },
  methods: {

  },
  components: {
    BaseIndex
  },
  created () {
    this.vdcsId = this.$route.query.vdcsId
    this.status = this.$route.query.status
  }

}
</script>

<style lang="scss">
</style>
