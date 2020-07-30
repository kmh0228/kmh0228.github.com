<template>
  <el-form :model="dialogForm"  ref="dialogForm" label-position="left" label-width="120px" class="el-row mes-form-rule" :rules="rules" size="mini">
    <!-- <el-form-item :label="$t('common_Factory')" prop="officeCode" class="el-col el-col-11">
      <cascader-select v-model="dialogForm.officeCode" style="width:100%" size="mini" dataType="1"></cascader-select>
    </el-form-item> -->
    <el-form-item :label="$t('common_Department')" prop="officeCode" class="el-col el-col-11">
      <cascader-select v-model="dialogForm.officeCode" type="2" style="width:100%" size="mini" :placeholder="$t('common_PleasSeleDepa')"></cascader-select>
    </el-form-item>
     <el-form-item :label="$t('common_RespoLeve')" prop="mMomHierarchyId" class="el-col el-col-11  el-col-offset-1">
      <el-select style="width:100%" size="mini" clearable :placeholder="$t('equipment_selecRespLeve')"  v-model="dialogForm.mMomHierarchyId" >
        <el-option v-for="(option,i) in hierarchyList" :key="i" :label="option.hierarchyCode" :value="option.mMomHierarchyId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('common_EquipCode')" prop="resourceCode" class="el-col el-col-11">
      <el-input v-model="dialogForm.resourceCode" :placeholder="$t('equipment_enterDeviCode')" size="mini"></el-input>
    </el-form-item>
     <el-form-item :label="$t('common_EquipName')" prop="resourceName" class="el-col el-col-11  el-col-offset-1">
      <el-input v-model="dialogForm.resourceName" :placeholder="$t('equipment_enterDeviName')" size="mini"></el-input>
    </el-form-item>
     <el-form-item :label="$t('common_EquipCateName')" prop="mMomResourceTypeId" class="el-col el-col-11 ">
      <el-select  :placeholder="$t('equipment_selecDeviCateName')" v-model.trim="dialogForm.mMomResourceTypeId" size="mini" style="width:100%" >
        <el-option v-for="(option,i) in equipmentCategoryList" :key="i"  :label="option.typeName" :value="option.mMomResourceTypeId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('common_Line')" prop="lineId" class="el-col el-col-11 el-col-offset-1">
      <el-select style="width:100%" size="mini" clearable :placeholder="$t('common_PleasSeleLineTy')"  v-model="dialogForm.lineId" >
        <el-option v-for="(option,i) in lineList" :key="i" :label="option.lineName" :value="option.mPomLineId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('equipment_EquipStat')" prop="status" class="el-col el-col-11" size="mini">
      <dict-select v-model="dialogForm.status" dictType="RESOURCE_STATUS" selectKey="dictCode"></dict-select>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
    <el-button type="primary" size="mini" @click="saveDeliveryList">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
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
        officeCode: [{ required: true, message: this.$t('common_PleasSeleDepa') }],
        mMomHierarchyId: [{ required: true, message: this.$t('equipment_selecRespLeve') }],
        resourceCode: [{ required: true, message: this.$t('equipment_enterDeviCode') }],
        resourceName: [{ required: true, message: this.$t('equipment_enterDeviName') }],
        mMomResourceTypeId: [{ required: true, message: this.$t('equipment_selecDeviCateName') }],
        status: [{ required: true, message: this.$t('equipment_selecDeviStat') }]
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
