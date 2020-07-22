<template>
  <div class="mes-main mes-work-order mes-handle">
    <div class="mes-main-header_bg" :style="{color:stateStyle}">{{ worderOrderState }}</div>
    <div class="mes-handle-content">
      <el-row :gutter="15">
        <el-col :span="24">
          <el-button type="primary" plain size="mini" @click="saveWorkOrder">保存</el-button>
          <el-button type="primary" plain size="mini" @click="closeCurrentPage">关闭</el-button>
          <!-- <el-button type="primary" plain size="mini" @click="refreshWorkOrder">刷新</el-button>
          <el-button type="primary" plain size="mini" :disabled="worderOrderState === '已上线'">上线</el-button> -->
        </el-col>
      </el-row>
      <div class="mes-main-tabs" style="margin-top:10px;">
          <work-order-tabs :useType="useType" ref="tabs" :workOrderId="workOrderId" @set-workorder-status="setWorkOrderStatus"></work-order-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import workOrderTabs from './Tabs/tabs'
export default {
  data () {
    return {
      workOrderId: null,
      worderOrderState: ''
    }
  },
  computed: {
    stateStyle () {
      if (this.worderOrderState === '新建') {
        return '#3B6F9A'
      } else if (this.worderOrderState === '已上线') {
        return '#3ACE52'
      }
    }
  },
  props: {
    useType: {
      type: Number
    }
  },
  watch: {
    '$route' (to) {
      this.workOrderId = to.query.Work_Order ? to.query.Work_Order : null
    }
  },
  methods: {
    setWorkOrderStatus (state) {
      this.worderOrderState = state
    },
    saveWorkOrder () {
      this.$refs.tabs.saveCurrentPage()
    },
    refreshWorkOrder () {
      this.$refs.tabs.refresCurrentPage()
    },
    async closeCurrentPage () {
      let { isChange } = this.$refs.tabs
      if (isChange) {
        this.$confirm('当前页面信息发生变更, 是否保存?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.saveWorkOrder()
        }).catch(() => {
          this.$refs.tabs.isChange = false
        })
      } else {
        let title = this.$route.meta.title
        let data = { title, url: '/Production/WorkOrder' }
        this.$store.dispatch('closeCurrentPage', data)
      }
    }
  },
  components: {
    workOrderTabs
  },
  created () {
    if (this.useType === 2) {
      const route = this.$route
      let routeQuery = route.query
      this.workOrderId = routeQuery.Work_Order
    }
  }
}
</script>
