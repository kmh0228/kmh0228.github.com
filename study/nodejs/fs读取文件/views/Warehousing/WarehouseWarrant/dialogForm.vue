 <template>
<el-form :model="dialogForm" ref="dialogForm" :rules="rules"   label-width="120px" label-position="left" class="el-row mes-form-rule" >
  <el-form-item label="入库单号" prop="mWmsEntrylistNo" class="el-col el-col-24">
       <el-input v-model.trim="dialogForm.mWmsEntrylistNo" placeholder="请输入入库单号" size="mini"></el-input>
  </el-form-item>
  <el-form-item label="入库方式" prop="mWmsEntrylistTypeId" class="el-col el-col-24">
    <dict-select v-model="dialogForm.mWmsEntrylistTypeId" clearable dictType="ENTRY_STROAGE_WAY" selectKey="dictCode"></dict-select>
  </el-form-item>
  <el-form-item label="入库库房" prop="mWmsEntrylistWharehouseid" class="el-col el-col-24">
    <el-select v-model="dialogForm.mWmsEntrylistWharehouseid" filterable placeholder="请选择入库库房" style="width:100%">
      <el-option v-for="(option,i) in mWmsEntryWarehouseidList" :key="i" :label="option.mWmsWarehouseCode" :value="option.mWmsWarehouseId"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="紧急程度" prop="mWmsEntrylistLevelId" class="el-col el-col-24">
    <dict-select v-model="dialogForm.mWmsEntrylistLevelId" dictType="EMERGENCY_TYPE"  placeholder="请选择紧急程度" selectKey="dictCode"></dict-select>
  </el-form-item>
  <el-form-item label="供应商" prop="mWmsEntrylistVenderid" class="el-col el-col-24" >
    <el-select v-model="dialogForm.mWmsEntrylistVenderid" filterable placeholder="请选择供应商" style="width:100%">
      <el-option v-for="(option,i) in mWmsEntrylistVendList" :key="i" :label="option.mWmsVendorName" :value="option.mWmsVendorId"></el-option>
    </el-select>
  </el-form-item>
   <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveEntrylist">保存</el-button>
      <el-button size="mini" @click="$emit('cannel')">取消</el-button>
    </el-form-item>
</el-form>
</template>

<script>
export default {
  data () {
    return {
      dialogForm: {
        mWmsEntrylistNo: '',
        mWmsEntrylistTypeId: '',
        mWmsEntrylistWharehouseid: '',
        mWmsEntrylistLevelId: '',
        mWmsEntrylistVenderid: ''
      },
      searchForm: {
        pageIndex: 1,
        pageSize: 1000,
        keywords: ''
      },
      // 供应商查询条件
      searchVendors: {
        pageIndex: 1,
        pageSize: 1000,
        mWmsVendorCode: ''
      },
      rules: {
        mWmsEntrylistNo: [{ required: true, message: '入库单号不能为空' }],
        mWmsEntrylistTypeId: [{ required: true, message: '请选择入库方式' }],
        mWmsEntrylistWharehouseid: [{ required: true, message: '请选择入库库房' }],
        mWmsEntrylistLevelId: [{ required: true, message: '请选择紧急程度' }],
        mWmsEntrylistVenderid: [{ required: true, message: '请选择供应商' }]
      },
      mWmsEntryWarehouseidList: [],
      mWmsEntrylistVendList: []
    }
  },
  props: {
    isEdit: Boolean,
    getInboundOrder: Function,
    cannel: Function
  },
  methods: {
    async getWarehouses () {
      let { searchForm } = this
      let data = Object.assign(searchForm)
      let res = await this.$api.getWarehouses(data)
      this.mWmsEntryWarehouseidList = res.data.list
    },
    // 查询供应商
    async getVendors () {
      let data = Object.assign(this.searchVendors)
      let res = await this.$api.getVendors(data)
      this.mWmsEntrylistVendList = res.data.list
    },
    saveEntrylist () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let data = Object.assign(this.dialogForm)
          let res = this.isEdit ? await this.$api.editInboundOrder(data) : await this.$api.addInboundOrder(data)
          let { code, msg } = res
          if (code === '200') {
            this.$emit('getInboundOrder')
            this.$emit('cannel')
            this.$message.success(msg)
          } else {
            this.$message.error(msg)
          }
        }
      })
    }
  },
  created () {
    this.getWarehouses()
    this.getVendors()
  }
}
</script>
