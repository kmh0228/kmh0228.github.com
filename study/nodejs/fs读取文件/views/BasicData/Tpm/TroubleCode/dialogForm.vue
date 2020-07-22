<template>
  <el-form :model="dialogForm"  ref="dialogForm" label-position="left" label-width="150px" class="el-row mes-form-rule" :rules="rules" size="mini">
    <el-form-item label="工厂" prop="officeCode" class="el-col el-col-11" size="mini">
      <cascader-select v-model="dialogForm.officeCode" style="width:100%" dataType="1"></cascader-select>
    </el-form-item>
    <el-form-item label="工种" prop="workKind" class="el-col el-col-11 el-col-offset-1" size="mini">
      <dict-select v-model="dialogForm.workKind" dictType="WORK_KIND" style="width:100%;" selectKey="dictCode"></dict-select>
    </el-form-item>
    <el-form-item label="报警类型名称" prop="malmTypeId" class="el-col el-col-11" size="mini">
      <el-select v-model="dialogForm.malmTypeId" style="width:100%">
        <el-option v-for="(option,i) in alarmTypeList" :key="i"  :label="option.typeName" :value="option.mAlmTypeId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="设备类别名称" prop="mMomResourceTypeId" class="el-col el-col-11 el-col-offset-1">
      <el-select  placeholder="请选择设备类别名称" v-model.trim="dialogForm.mMomResourceTypeId" size="mini" style="width:100%" >
        <el-option v-for="(option,i) in equipmentCategoryList" :key="i"  :label="option.typeName" :value="option.mMomResourceTypeId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="故障代码" prop="failCode" class="el-col el-col-11 " size="mini">
      <el-input v-model="dialogForm.failCode" placeholder="请输入故障代码" ></el-input>
    </el-form-item>
    <el-form-item label="标准工时" prop="standardTime" class="el-col el-col-11  el-col-offset-1" size="mini" >
      <el-input v-model="dialogForm.standardTime" placeholder="请输入标准点检时长" @blur="checkTime"></el-input>
    </el-form-item>
    <el-form-item label="响应时间（分）" prop="responseTimeoutLength" class="el-col el-col-11 " size="mini">
      <el-input v-model="dialogForm.responseTimeoutLength" placeholder="请输入响应时间" ></el-input>
    </el-form-item>
    <el-form-item label="一级报警超时（分）" prop="firstLevelTimeoutLength" class="el-col el-col-11  el-col-offset-1" size="mini" >
      <el-input v-model="dialogForm.firstLevelTimeoutLength" placeholder="请输入一级报警超时" ></el-input>
    </el-form-item>
    <el-form-item label="二级报警超时（分）" prop="secondLevelTimeoutLength" class="el-col el-col-11 " size="mini">
      <el-input v-model="dialogForm.secondLevelTimeoutLength" placeholder="请输入二级报警超时" @blur="checkLevelTime(2)"></el-input>
    </el-form-item>
    <el-form-item label="三级报警超时（分）" prop="thirdLevelTimeoutLength" class="el-col el-col-11  el-col-offset-1" size="mini" >
      <el-input v-model="dialogForm.thirdLevelTimeoutLength" placeholder="请输入三级报警超时" @blur="checkLevelTime(3)"></el-input>
    </el-form-item>
     <el-form-item label="报警等级" prop="alarmLevel" class="el-col el-col-11 " size="mini">
      <dict-select v-model="dialogForm.alarmLevel" dictType="ALARM_LEVEL" selectKey="dictCode"></dict-select>
    </el-form-item>
    <el-form-item label="是否超时上报" prop="isTimeoutReport" class="el-col el-col-11 el-col-offset-1" size="mini" >
      <el-checkbox v-model="dialogForm.isTimeoutReport"></el-checkbox>
    </el-form-item>
     <el-form-item label="故障描述" prop="failName" class="el-col el-col-23" size="mini">
      <el-input v-model="dialogForm.failName" type="textarea"  placeholder="请输入故障描述" ></el-input>
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
        workKind: '',
        malmTypeId: '',
        mMomResourceTypeId: '',
        failCode: '',
        standardTime: '',
        responseTimeoutLength: '',
        firstLevelTimeoutLength: '',
        secondLevelTimeoutLength: '',
        thirdLevelTimeoutLength: '',
        isTimeoutReport: '',
        alarmLevel: '',
        failName: ''
      },
      rules: {
        officeCode: [{ required: true, message: '请选择工厂' }],
        workKind: [{ required: true, message: '请输入工种' }],
        malmTypeId: [{ required: true, message: '请选择报警类型' }],
        mMomResourceTypeId: [{ required: true, message: '请选择设备名称' }],
        failCode: [{ required: true, message: '请输入故障代码' }],
        standardTime: [{ required: true, message: '请输入标准工时' }],
        alarmLevel: [{ required: true, message: '请选择报警等级' }],
        failName: [{ required: true, message: '请输入故障描述' }],
        responseTimeoutLength: [{ required: true, message: '请输入响应时间' }],
        firstLevelTimeoutLength: [{ required: true, message: '请输入一级报警超时' }],
        secondLevelTimeoutLength: [{ required: true, message: '请输入二级报警超时' }],
        thirdLevelTimeoutLength: [{ required: true, message: '请输入三级报警超时' }],
        isTimeoutReport: [{ required: true, message: '请选择是否超时上报' }]
      },
      equipmentCategoryList: [],
      alarmTypeList: []
    }
  },
  props: {
    isEdit: Boolean,
    cannel: Function,
    getTableData: Function
  },
  methods: {
    saveDeliveryList () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let { firstLevelTimeoutLength, secondLevelTimeoutLength, thirdLevelTimeoutLength } = this.dialogForm
          if (Number(firstLevelTimeoutLength) < Number(secondLevelTimeoutLength) && Number(secondLevelTimeoutLength) < Number(thirdLevelTimeoutLength)) {
            let { dialogForm } = this
            let res = this.isEdit ? await this.$api.modifyFailcode(dialogForm) : await this.$api.saveFailcode(dialogForm)
            this.$myPrompt.handleMsg(res, () => {
              this.$emit('cannel')
              this.$emit('getTableData')
            })
          } else {
            this.$message.warning('报警超时填写有误，请重新填写')
          }
        }
      })
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
    },
    // 获取所有报警类型
    async getAlarmType () {
      const data = {
        officeCode: '',
        mAlmTypeId: '',
        pageSize: 1000,
        pageIndex: 1
      }
      let res = await this.$api.getAlarmType(data)
      if (res.code === '200') {
        this.alarmTypeList = res.data.list
      } else {
        this.alarmTypeList = []
      }
    },
    checkTime () {
      let arr = Number(this.dialogForm.standardTime)
      if (arr > 0) {

      } else {
        this.$message.warning('请输入大于0的数字')
        this.dialogForm.standardTime = ''
      }
    },
    // 确定报警时间
    checkLevelTime (type) {
      let { firstLevelTimeoutLength, secondLevelTimeoutLength, thirdLevelTimeoutLength } = this.dialogForm
      if (type === 2 && firstLevelTimeoutLength && secondLevelTimeoutLength) {
        if (Number(firstLevelTimeoutLength) > Number(secondLevelTimeoutLength)) {
          this.$message.warning('第二次响应时间应该大于第一次！')
        }
      } else if (type === 3 && secondLevelTimeoutLength && thirdLevelTimeoutLength) {
        if (Number(secondLevelTimeoutLength) > Number(thirdLevelTimeoutLength)) {
          this.$message.warning('第三次响应时间应该大于第二次！')
        }
      }
    }
  },
  created () {
    this.getDeviceClassList()
    this.getAlarmType()
  }
}
</script>
