<template>
  <el-form :model="dialogForm"  ref="dialogForm" label-position="left" label-width="120px" class="el-row mes-form-rule" :rules="rules" size="mini">
    <!-- <el-form-item label="工厂" prop="officeCode" class="el-col el-col-11">
      <cascader-select v-model="dialogForm.officeCode" style="width:100%" size="mini" dataType="1"></cascader-select>
    </el-form-item> -->
    <el-form-item label="部门" prop="officeCode" class="el-col el-col-11">
      <cascader-select v-model="dialogForm.officeCode" type="2" style="width:100%" size="mini" placeholder="请选择部门"></cascader-select>
    </el-form-item>
     <el-form-item label="责任层级" prop="mMomHierarchyId" class="el-col el-col-11  el-col-offset-1">
      <el-select style="width:100%" size="mini" clearable placeholder="请选择责任层级"  v-model="dialogForm.mMomHierarchyId" >
        <el-option v-for="(option,i) in hierarchyList" :key="i" :label="option.hierarchyCode" :value="option.mMomHierarchyId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="设备代码" prop="resourceCode" class="el-col el-col-11">
      <el-input v-model="dialogForm.resourceCode" placeholder="请输入设备代码" size="mini"></el-input>
    </el-form-item>
     <el-form-item label="设备名称" prop="resourceName" class="el-col el-col-11  el-col-offset-1">
      <el-input v-model="dialogForm.resourceName" placeholder="请输入设备名称" size="mini"></el-input>
    </el-form-item>
     <el-form-item label="设备类别名称" prop="mMomResourceTypeId" class="el-col el-col-11 ">
      <el-select  placeholder="请选择设备类别名称" v-model.trim="dialogForm.mMomResourceTypeId" size="mini" style="width:100%" >
        <el-option v-for="(option,i) in equipmentCategoryList" :key="i"  :label="option.typeName" :value="option.mMomResourceTypeId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="线别" prop="lineId" class="el-col el-col-11 el-col-offset-1">
      <el-select style="width:100%" size="mini" clearable placeholder="请选择线别"  v-model="dialogForm.lineId" >
        <el-option v-for="(option,i) in lineList" :key="i" :label="option.lineName" :value="option.mPomLineId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="设备状态" prop="status" class="el-col el-col-11" size="mini">
      <dict-select v-model="dialogForm.status" dictType="RESOURCE_STATUS" selectKey="dictCode"></dict-select>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
    <el-button type="primary" size="mini" @click="saveDeliveryList">保存</el-button>
      <el-button size="mini" @click="$emit('cannel')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      dialogForm: {
        officeCode: '',
        mMomHierarchyId: '',
        resourceCode: '',
        resourceName: '',
        lineId: '',
        mMomResourceTypeId: '',
        status: ''
      },
      rules: {
        officeCode: [{ required: true, message: '请选择部门' }],
        mMomHierarchyId: [{ required: true, message: '请选择责任层级' }],
        resourceCode: [{ required: true, message: '请输入设备代码' }],
        resourceName: [{ required: true, message: '请输入设备名称' }],
        mMomResourceTypeId: [{ required: true, message: '请选择设备类别名称' }],
        status: [{ required: true, message: '请选择设备状态' }]
      },
      lineList: [],
      hierarchyList: [],
      equipmentCategoryList: []
    }
  },
  props: {
    isEdit: Boolean,
    cannel: Function
  },
  methods: {
    saveDeliveryList () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let { dialogForm } = this
          let res = this.isEdit ? await this.$api.modifyResource(dialogForm) : await this.$api.saveResource(dialogForm)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getTableData')
          })
        }
      })
    },
    // 获取线别列表
    async getLineList () {
      let data = { lineName: '', lineType: '', pageIndex: 1, pageSize: 1000 }
      let res = await this.$api.getLineList(data)
      if (res.code === '200') {
        this.lineList = res.data.list
      }
    },
    // 获取责任层级列表
    async findHierarchyList () {
      let data = { pageIndex: 1, pageSize: 1000 }
      let res = await this.$api.findHierarchyList(data)
      if (res.code === '200') {
        this.hierarchyList = res.data.list
      } else {
        this.hierarchyList = []
      }
    },
    // 查询所有设备类别
    async getDeviceClassList () {
      const params = {
        pageSize: 1000,
        pageIndex: 1
      }
      const res = await this.$api.getDeviceClassList(params)
      const { code, data } = res
      if (code === '200') {
        this.equipmentCategoryList = data.list
      } else {
        this.equipmentCategoryList = []
      }
    }
  },
  created () {
    this.getLineList()
    this.findHierarchyList()
    this.getDeviceClassList()
  }
}
</script>
