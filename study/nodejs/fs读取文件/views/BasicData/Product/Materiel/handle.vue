<template>
  <div class="mes-main mes-work-order mes-handle">
    <div class="mes-main-header_bg"></div>
    <div class="mes-handle-content">
      <el-row :gutter="15">
        <el-col :span="24">
          <el-button type="primary" plain size="mini" @click="saveMaterials">{{$t('common_save')}}</el-button>
          <el-button type="primary" plain size="mini" @click="closeCurrentPage">{{$t('common_close')}}</el-button>
        </el-col>
      </el-row>
      <div class="mes-main-tabs" style="margin-top:10px;">
        <material-tabs :useType="useType" ref="tabs" :mComMaterialId="mComMaterialId"></material-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import materialTabs from './Tabs/tabs'
export default {
  data () {
    return {
      mComMaterialId: null
    }
  },
  props: {
    useType: {
      type: Number
    }
  },
  methods: {
    saveMaterials () {
      this.$refs.tabs.saveCurrentPage()
    },
    closeCurrentPage () {
      let title = this.$route.meta.title
      let data = { title, url: '/BasicData/Product/Materiel' }
      this.$store.dispatch('closeCurrentPage', data)
    }
  },
  components: {
    materialTabs
  },
  created () {
    if (this.useType === 2) {
      this.mComMaterialId = this.$route.query.MaterialId
    }
  }
}
</script>
