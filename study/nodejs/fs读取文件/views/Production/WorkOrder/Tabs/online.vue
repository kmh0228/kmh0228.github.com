<template>
  <el-form :model="online" ref="onlineForm" :rules="rules" label-width="30%" label-position="left" class="el-row work-order-info">
    <el-form-item label="路由" prop="WORKFLOW_SPEC_ID" class="el-col el-col-12">
      <p v-if="useType === 0">{{ online.WORKFLOW_SPEC_NAME }}</p>
      <el-select v-else v-model="online.WORKFLOW_SPEC_ID" placeholder="请选择路由" filterable clearable size="mini" class="mes-form-item">
        <el-option v-for="(list,i) in routeList" :key="i" :label="list.workflowName" :value="list.mWorkflowSpecId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="线别" prop="LINE_ID" class="el-col el-col-12">
      <p v-if="useType === 0">{{ online.LINE_NAME }}</p>
      <!-- <mes-select v-else v-model="online.LINE_ID" method="getShipOrder" valueKey="tpomShipOrderId" labelKey="docNo"></mes-select> -->
      <el-select v-else v-model="online.LINE_ID " placeholder="请选择线别" filterable clearable size="mini" class="mes-form-item">
        <el-option v-for="(list,i) in lineList" :key="i" :label="list.lineName" :value="list.mPomLineId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="班别" prop="SHIFT_ID" class="el-col el-col-12">
      <p v-if="useType === 0">{{ online.SHIFT_NAME }}</p>
      <el-select v-else v-model="online.SHIFT_ID " placeholder="请选择班别" filterable clearable size="mini" class="mes-form-item">
        <el-option v-for="(list,i) in shiftList" :key="i" :label="list.shiftName" :value="list.mPomShiftId"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      routeList: [],
      lineList: [],
      shiftList: []
    }
  },
  props: {
    useType: {
      type: Number
    },
    online: {
      type: Object
    }
  },
  computed: {
    rules () {
      if (this.useType === 0) {
        return {}
      } else {
        return {
          WORKFLOW_SPEC_ID: [{ required: true, message: '请选择路由', trigger: 'blur' }],
          LINE_ID: [{ required: true, message: '请选择线别', trigger: 'blur' }],
          SHIFT_ID: [{ required: true, message: '请选择班别', trigger: 'blur' }]
        }
      }
    }
  },
  methods: {
    async getRouteList () {
      let res = await this.$api.getRouters({ workflowName: '' })
      this.routeList = res.data
    },
    async getLineList () {
      const data = {
        lineName: '',
        lineType: '',
        pageIndex: 1,
        pageSize: 10000
      }
      let res = await this.$api.getLineList(data)
      this.lineList = res.data.list
    },
    async getShiftList () {
      const data = {
        shiftName: '',
        pageIndex: 1,
        pageSize: 1000
      }
      let res = await this.$api.getShiftList(data)
      this.shiftList = res.data.list
    },
    // 保存工单上线维护
    async saveWorkOrder () {
      const vm = this
      if (!vm.online.JOB_ORDER_ID) {
        return vm.$message.warning('请先保存工单基本信息')
      }
      vm.$refs['onlineForm'].validate(async valid => {
        if (valid) {
          let res = await vm.$api.createJobOrderOnline(vm.online)
          let { code, msg } = res
          if (code === '200') {
            vm.$message.success(msg)
          } else {
            vm.$message.error(msg)
          }
        }
      })
    },
    refresWorkOrder () {
    }
  },
  created () {
    // 查看页面不获取下拉框选项
    if (this.useType !== 0) {
      this.getRouteList()
      this.getLineList()
      this.getShiftList()
    }
  }
}
</script>
