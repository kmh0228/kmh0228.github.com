<template>
  <el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="120px" label-position="left" class="el-row mes-form-rule">
    <el-form-item label="仓库代码" prop="mWmsWarehouseBinWarehouseid" class="el-col el-col-11">
      <el-select v-model="dialogForm.mWmsWarehouseBinWarehouseid" size="mini" style="width:100%" @change="getArea(true)" filterable placeholder="请选择仓库代码">
        <el-option v-for="(option,i) in warehouseList" :key="i" :label="option.mWmsWarehouseCode" :value="option.mWmsWarehouseId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="区域代码" prop="mWmsWarehouseBinAreaid" class="el-col el-col-11 el-col-offset-1" >
       <el-select v-model="dialogForm.mWmsWarehouseBinAreaid" size="mini" style="width:100%" filterable placeholder="请选择区域代码">
        <el-option v-for="(option,i) in areaList" :key="i" :label="option.mWmsWarehouseAreaCode" :value="option.mWmsWarehouseAreaId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="储位编号" prop="mWmsWarehouseBinCode" class="el-col el-col-11 ">
      <el-input v-model.trim="dialogForm.mWmsWarehouseBinCode" size="mini" placeholder="请输入储位编号"></el-input>
    </el-form-item>
    <el-form-item label="储位名称" prop="mWmsWarehouseBinName" class="el-col el-col-11 el-col-offset-1">
      <el-input v-model.trim="dialogForm.mWmsWarehouseBinName" size="mini" placeholder="请输入储位名称"></el-input>
    </el-form-item>
     <el-form-item label="储位类型" prop="mWmsWarehouseBinType" class="el-col el-col-11 ">
      <el-select v-model="dialogForm.mWmsWarehouseBinType" size="mini" style="width:100%" filterable placeholder="请选择储位类型">
        <el-option v-for="(option,i) in typeList" :key="i" :label="option.label" :value="option.value" ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="储位使用情况" prop="mWmsWarehouseBinUse" class="el-col el-col-11 el-col-offset-1">
      <el-select v-model="dialogForm.mWmsWarehouseBinUse" size="mini" style="width:100%" filterable placeholder="请选择储位使用情况">
        <el-option v-for="(option,i) in useList" :key="i" :label="option.label" :value="option.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="是否允许混放" prop="mWmsWarehouseBinIsmix" class="el-col el-col-11 ">
      <el-checkbox v-model="dialogForm.mWmsWarehouseBinIsmix"></el-checkbox>
    </el-form-item>
    <el-form-item label="是否收货暂存" prop="receiveTemp" class="el-col el-col-11 el-col-offset-1">
      <el-checkbox v-model="dialogForm.receiveTemp"></el-checkbox>
    </el-form-item>
    <el-form-item label="是否拣货暂存" prop="pickTemp" class="el-col el-col-11 ">
      <el-checkbox v-model="dialogForm.pickTemp"></el-checkbox>
    </el-form-item>
     <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveForm">保存</el-button>
      <el-button size="mini" @click="$emit('cannel')">取消</el-button>
    </el-form-item>
  </el-form>

</template>

<script>
export default {
  data () {
    return {
      dialogForm: {
        mWmsWarehouseBinId: '',
        mWmsWarehouseBinWarehouseid: '',
        mWmsWarehouseBinAreaid: '',
        mWmsWarehouseBinCode: '',
        mWmsWarehouseBinName: '',
        mWmsWarehouseBinType: '',
        mWmsWarehouseBinUse: '',
        mWmsWarehouseBinIsmix: false,
        pickTemp: false,
        receiveTemp: false
      },
      warehouseList: [],
      areaList: [],
      shelfList: [],
      typeList: [
        {
          label: '实体',
          value: '实体'
        },
        {
          label: '虚拟',
          value: '虚拟'
        }
      ],
      useList: [
        {
          label: '使用中',
          value: '使用中'
        },
        {
          label: '废弃',
          value: '废弃'
        }
      ],
      rules: {
        mWmsWarehouseBinWarehouseid: [{ required: true, message: '仓库代码不能为空' }],
        mWmsWarehouseBinType: [{ required: true, message: '请选择储位类型' }],
        mWmsWarehouseBinAreaid: [{ required: true, message: '区域代码不能为空' }],
        mWmsWarehouseBinCode: [{ required: true, message: '储位编码不能为空' }],
        mWmsWarehouseBinName: [{ required: true, message: '储位名称不能为空' }]
      },
      page: {
        pageSize: 1000,
        pageIndex: 1
      }
    }
  },
  props: {
    getBin: {
      type: Function
    }
  },
  methods: {
    saveForm () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let res = this.dialogForm.mWmsWarehouseBinId ? await this.$api.editBin({ ...this.dialogForm }) : await this.$api.addBin({ ...this.dialogForm })
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('getBin')
            this.$emit('cannel')
          }, false)
        }
      })
    },
    async getWarehousr () {
      let keywords = ''
      let data = Object.assign({ keywords }, this.page)
      let res = await this.$api.getWarehouses(data)
      this.warehouseList = res.data.list
      this.getArea()
    },
    async getArea (flag) {
      if (flag) {
        this.mWmsWarehouseBinAreaid = ''
      }
      let { page } = this
      let mWmsWarehouseId = this.dialogForm.mWmsWarehouseBinWarehouseid
      let data = Object.assign({ mWmsWarehouseId }, page)
      let res = await this.$api.getArea(data)
      this.areaList = res.data.list
    }
  },
  created () {
    this.getWarehousr()
  }

}
</script>
