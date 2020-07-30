<template>
  <div class="mes-main mes-work-order mes-handle">
    <div class="mes-main-header_bg"></div>
    <div class="mes-handle-content">
      <el-row :gutter="15">
        <el-col :span="24">
          <el-button type="primary" plain size="mini" @click="saveWorkTemplate">{{$t('common_save')}}</el-button>
          <el-button type="primary" plain size="mini" @click="closeCurrentPage">{{$t('common_close')}}</el-button>
        </el-col>
      </el-row>
      <div class="mes-main-tabs" style="margin-top:10px;">
         <tabs :useType="useType" ref="tabs" :wrokMasterId="wrokMasterId"></tabs>
      </div>
    </div>
  </div>
</template>

<script>
import tabs from './tabs/tabs'
export default {
  data () {
    return {
      wrokMasterId: null
    }
  },
  props: {
    useType: {
      type: Number
    }
  },
  methods: {
    saveWorkTemplate () {
      this.$refs.tabs.saveCurrentPage()
    },
    closeCurrentPage () {
      let title = this.$route.meta.title
      let data = { title, url: '/BasicData/Craft/WorkingTemplate' }
      this.$store.dispatch('closeCurrentPage', data)
    }
  },
  components: {
    tabs
  },
  created () {
    if (this.useType === 2) {
      this.wrokMasterId = this.$route.query.WorkMasterId
    }
  }
}
</script>
