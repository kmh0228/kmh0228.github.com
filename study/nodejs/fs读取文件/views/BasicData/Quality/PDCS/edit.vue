<template>
<div class="mes-main mes-main-common">
  <!-- details -->
  <base-index type="update" :pdcsId="pdcsId" :status="status"></base-index>
</div>
</template>

<script>
import BaseIndex from './baseIndex'

export default {
  data () {
    return {
      pdcsId: '',
      status: ''
    }
  },
  methods: {

  },
  components: {
    BaseIndex
  },
  created () {
    this.pdcsId = this.$route.query.pdcsId
    this.status = this.$route.query.status
  }

}
</script>

<style lang="scss">
</style>
