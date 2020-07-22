<template>
  <el-form :model="dialogForm"  ref="dialogForm" label-position="left" label-width="140px" class="el-row mes-form-rule" :rules="rules" size="mini">
    <el-form-item label="工厂" prop="officeCode" class="el-col el-col-11" size="mini">
      <cascader-select v-model="dialogForm.officeCode" style="width:100%" dataType="1"></cascader-select>
    </el-form-item>
    <el-form-item label="工种" prop="workKindId" class="el-col el-col-11 el-col-offset-1" size="mini">
      <dict-select v-model="dialogForm.workKindId" dictType="WORK_KIND" style="width:100%;" selectKey="dictCode"></dict-select>
    </el-form-item>
    <el-form-item label="设备类别" prop="mMomResourceTypeId" class="el-col el-col-11">
      <el-select  placeholder="请选择设备类别" v-model.trim="dialogForm.mMomResourceTypeId" size="mini" style="width:100%" >
        <el-option v-for="(option,i) in equipmentCategoryList" :key="i"  :label="option.typeName" :value="option.mMomResourceTypeId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="生产次数" prop="productionTimes" class="el-col el-col-11 el-col-offset-1" size="mini">
      <el-input v-model.number="dialogForm.productionTimes"></el-input>
    </el-form-item>
    <el-form-item label="保养频率" prop="maintainFrequency" class="el-col el-col-11" size="mini">
      <dict-select v-model="dialogForm.maintainFrequency" dictType="MAINTAIN_FREQUENCY" ></dict-select>
    </el-form-item>
    <el-form-item label="保养日期" prop="maintainDate" class="el-col el-col-11 el-col-offset-1" size="mini">
      <el-date-picker  v-model="dialogForm.maintainDate"  type="date" placeholder="选择日期时间" style="width:100%" value-format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
    </el-form-item>
    <el-form-item label="是否停机" prop="isDowmtime" class="el-col el-col-11">
      <el-checkbox v-model="dialogForm.isDowmtime"></el-checkbox>
    </el-form-item>
    <el-form-item label="计划工时" prop="planWorktime" class="el-col el-col-11 el-col-offset-1" size="mini">
      <el-input v-model.number="dialogForm.planWorktime"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
    <el-button type="primary" size="mini" @click="saveInsecptionList">保存</el-button>
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
        workKindId: '',
        mMomResourceTypeId: '',
        productionTimes: '',
        planWorktime: '',
        maintainFrequency: '',
        maintainDate: '',
        isDowmtime: ''
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      checked: '',
      rules: {
        mMomResourceTypeId: [{ required: true, message: '请选择设备类别' }],
        workKindId: [{ required: true, message: '请选择工种' }],
        maintainFrequency: [{ required: true, message: '请选择保养频率' }]
      },
      equipmentCategoryList: [],
      dateDisabeld: false,
      isSelectDateType: true,
      standardTimeDisabeld: false
    }
  },
  computed: {

  },
  props: {
    isEdit: Boolean,
    cannel: Function,
    getMainitemTable: Function
  },
  methods: {
    saveInsecptionList () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let { dialogForm, isEdit } = this
          const res = isEdit ? await this.$api.modifyMaintainitem(dialogForm) : await this.$api.saveMaintainitem(dialogForm)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getMainitemTable')
          })
        }
      })
    },
    // 查询所有设备类别
    async getDeviceClassList () {
      const params = {
        officeCode: '',
        pageSize: 1000,
        pageIndex: 1
      }
      const res = await this.$api.getNoChoiceDeviceList(params)
      const { code, data } = res
      if (code === '200') {
        this.equipmentCategoryList = data.list
      } else {
        this.equipmentCategoryList = []
      }
    }
  },
  created () {
    this.getDeviceClassList()
  }

}
</script>
