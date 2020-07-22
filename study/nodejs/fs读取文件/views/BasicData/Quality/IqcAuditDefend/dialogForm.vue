<template>
<el-form :model="dialogForm" ref="dialogForm" :rules="rules"  label-width="120px" label-position="left" class="el-row mes-form-rule">
  <el-form-item label="产品系列" class="el-col el-col-11">
    <el-select :disabled="isEdit" v-model="dialogForm.model" clearable placeholder="请选择产品系列" style="width:100%">
      <el-option v-for="(option,i) in machineList" :key="i" :label="option.mComMaterialfamilyCode" :value="option.mComMaterialfamilyId"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="生产单位" class="el-col el-col-11 el-col-offset-1">
    <el-select :disabled="isEdit" v-model="dialogForm.productionUnit" clearable placeholder="请选择机能" style="width:100%">
      <el-option v-for="(option,i) in productionUnitList" :key="i" :label="option.officeCode" :value="option.companyCode"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="稽核项目"  class="el-col el-col-11">
    <el-input  v-model="dialogForm.inspectItem"  placeholder="请输入稽核项目" ></el-input>
  </el-form-item>
  <el-form-item label="项次" class="el-col el-col-11 el-col-offset-1">
    <el-input size="mini" v-model="dialogForm.sortNo"  ></el-input>
  </el-form-item>
   <el-form-item label="稽核内容" class="el-col el-col-23">
   <el-input  type="textarea"  :rows="2"  placeholder="请输入内容"   v-model="dialogForm.inspectContent">></el-input></el-form-item>
   <el-form-item label="点检频率" class="el-col el-col-15">
    <el-input v-model="dialogForm.frequency" size="mini" style="width:45%"></el-input>
    <el-select style="width:40%;margin-left:25px"  v-model="dialogForm.frequencyUom" >
      <el-option v-for="(option,i) in frequencyUomList" :key="i" :label="option.label" :value="option.value"></el-option>
    </el-select>
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
        model: '',
        productionUnit: '',
        inspectItem: '',
        sortNo: '',
        inspectContent: '',
        frequency: '',
        frequencyUom: ''

      },
      machineList: [],
      productionUnitList: [],
      auditItemList: [],
      checkFrequencyList: [],
      frequencyUomList: [
        {
          label: '月',
          value: '月'
        },
        {
          label: '周',
          value: '周'
        },
        {
          label: '日',
          value: '日'
        }
      ],
      rules: {
        model: [{ required: true, message: '产品系列不能为空' }]

      }
    }
  },
  props: {
    cannel: {
      type: Function
    },
    findItemPage: {
      type: Function
    },
    isEdit: {
      type: String
    }
  },
  methods: {
    // 获取所有产品系列
    async getModelList () {
      let data = { mComMaterialfamilyCode: '', pageIndex: 1, pageSize: 2000 }
      let res = await this.$api.getMachine(data)
      this.machineList = res.data.list
    },
    // 获取生产单位
    async getProductionUnit () {
      let res = await this.$api.getProductionUnit()
      this.productionUnitList = res.data
    },
    saveForm () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let res = this.isEdit ? await this.$api.ipqcUpdateItem(this.dialogForm) : await this.$api.ipqcInsertItem(this.dialogForm)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('findItemPage')
          })
        }
      })
    }

  },
  created () {
    this.getModelList()
    this.getProductionUnit()
  }

}
</script>
