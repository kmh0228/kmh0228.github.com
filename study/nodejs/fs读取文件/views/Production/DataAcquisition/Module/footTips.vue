<template>
  <div class="mes-workstation-footmsg" v-if="option.show">
    <el-alert :title="option.title" :type="option.tipsType" show-icon></el-alert>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: {
    option: {
      type: Object
    },
    duration: {
      type: Number,
      default () {
        return 3000
      }
    }
  },
  methods: {
    autoCloseTips () {
      let vm = this
      setTimeout(() => {
        vm.option.show = false
      }, vm.duration)
    }
  },
  mounted () {
    this.autoCloseTips()
  }
}
</script>
