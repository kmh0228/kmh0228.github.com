<template>
  <el-form :model="dialogForm"  ref="dialogForm" label-position="left" label-width="150px" class="el-row mes-form-rule" :rules="rules" size="mini">
    <el-form-item :label="$t('common_Factory')" prop="officeCode" class="el-col el-col-11" size="mini">
      <cascader-select v-model="dialogForm.officeCode" style="width:100%" dataType="1"></cascader-select>
    </el-form-item>
    <el-form-item :label="$t('common_TypeWork')" prop="workKind" class="el-col el-col-11 el-col-offset-1" size="mini">
      <dict-select v-model="dialogForm.workKind" dictType="WORK_KIND" style="width:100%;" selectKey="dictCode"></dict-select>
    </el-form-item>
    <el-form-item :label="$t('troubleCode_AlarmTypeName')" prop="malmTypeId" class="el-col el-col-11" size="mini">
      <el-select v-model="dialogForm.malmTypeId" style="width:100%">
        <el-option v-for="(option,i) in alarmTypeList" :key="i"  :label="option.typeName" :value="option.mAlmTypeId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('common_EquipCateName')" prop="mMomResourceTypeId" class="el-col el-col-11 el-col-offset-1">
      <el-select  :placeholder="$t('troubleCode_selecDeviCateName')" v-model.trim="dialogForm.mMomResourceTypeId" size="mini" style="width:100%" >
        <el-option v-for="(option,i) in equipmentCategoryList" :key="i"  :label="option.typeName" :value="option.mMomResourceTypeId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('troubleCode_FaultCode')" prop="failCode" class="el-col el-col-11 " size="mini">
      <el-input v-model="dialogForm.failCode" :placeholder="$t('troubleCode_enterFaulCode')" ></el-input>
    </el-form-item>
    <el-form-item :label="$t('troubleCode_StandWorkHour')" prop="standardTime" class="el-col el-col-11  el-col-offset-1" size="mini" >
      <el-input v-model="dialogForm.standardTime" :placeholder="$t('troubleCode_inputStanSpotChecDura')" @blur="checkTime"></el-input>
    </el-form-item>
    <el-form-item :label="$t('troubleCode_respoTimeM')" prop="responseTimeoutLength" class="el-col el-col-11 " size="mini">
      <el-input v-model="dialogForm.responseTimeoutLength" :placeholder="$t('troubleCode_enterRespTime')" ></el-input>
    </el-form-item>
    <el-form-item :label="$t('troubleCode_Level1AlarTimeM')" prop="firstLevelTimeoutLength" class="el-col el-col-11  el-col-offset-1" size="mini" >
      <el-input v-model="dialogForm.firstLevelTimeoutLength" :placeholder="$t('troubleCode_inputLeve1AlarTime')" ></el-input>
    </el-form-item>
    <el-form-item :label="$t('troubleCode_Level2AlarTimeM')" prop="secondLevelTimeoutLength" class="el-col el-col-11 " size="mini">
      <el-input v-model="dialogForm.secondLevelTimeoutLength" :placeholder="$t('troubleCode_inputLeve2AlarTime')" @blur="checkLevelTime(2)"></el-input>
    </el-form-item>
    <el-form-item :label="$t('troubleCode_Level3AlarTimeM')" prop="thirdLevelTimeoutLength" class="el-col el-col-11  el-col-offset-1" size="mini" >
      <el-input v-model="dialogForm.thirdLevelTimeoutLength" :placeholder="$t('troubleCode_inputLeve3AlarTime')" @blur="checkLevelTime(3)"></el-input>
    </el-form-item>
     <el-form-item :label="$t('troubleCode_AlarmLeve')" prop="alarmLevel" class="el-col el-col-11 " size="mini">
      <dict-select v-model="dialogForm.alarmLevel" dictType="ALARM_LEVEL" selectKey="dictCode"></dict-select>
    </el-form-item>
    <el-form-item :label="$t('troubleCode_WhethRepoOver')" prop="isTimeoutReport" class="el-col el-col-11 el-col-offset-1" size="mini" >
      <el-checkbox v-model="dialogForm.isTimeoutReport"></el-checkbox>
    </el-form-item>
     <el-form-item :label="$t('troubleCode_FaultDesc')" prop="failName" class="el-col el-col-23" size="mini">
      <el-input v-model="dialogForm.failName" type="textarea"  :placeholder="$t('troubleCode_enterFaulDesc')" ></el-input>
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
        officeCode: [{ required: true, message: this.$t('common_PleasSeleFact') }],
        workKind: [{ required: true, message: this.$t('troubleCode_inputTypeWork') }],
        malmTypeId: [{ required: true, message: this.$t('troubleCode_selecAlarType') }],
        mMomResourceTypeId: [{ required: true, message: this.$t('troubleCode_selecDeviName') }],
        failCode: [{ required: true, message: this.$t('troubleCode_enterFaulCode') }],
        standardTime: [{ required: true, message: this.$t('troubleCode_enterStanWorkHour') }],
        alarmLevel: [{ required: true, message: this.$t('troubleCode_selecAlarLeve') }],
        failName: [{ required: true, message: this.$t('troubleCode_enterFaulDesc') }],
        responseTimeoutLength: [{ required: true, message: this.$t('troubleCode_enterRespTime') }],
        firstLevelTimeoutLength: [{ required: true, message: this.$t('troubleCode_inputLeve1AlarTime') }],
        secondLevelTimeoutLength: [{ required: true, message: this.$t('troubleCode_inputLeve2AlarTime') }],
        thirdLevelTimeoutLength: [{ required: true, message: this.$t('troubleCode_inputLeve3AlarTime') }],
        isTimeoutReport: [{ required: true, message: this.$t('troubleCode_selecWhetRepoOver') }]
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
            this.$message.warning(this.$t('troubleCode_ErrorInFillInAgai'))
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
        this.$message.warning(this.$t('troubleCode_enterGreaThan0'))
        this.dialogForm.standardTime = ''
      }
    },
    // 确定报警时间
    checkLevelTime (type) {
      let { firstLevelTimeoutLength, secondLevelTimeoutLength, thirdLevelTimeoutLength } = this.dialogForm
      if (type === 2 && firstLevelTimeoutLength && secondLevelTimeoutLength) {
        if (Number(firstLevelTimeoutLength) > Number(secondLevelTimeoutLength)) {
          this.$message.warning(this.$t('troubleCode_seconRespTimeFirsTime'))
        }
      } else if (type === 3 && secondLevelTimeoutLength && thirdLevelTimeoutLength) {
        if (Number(secondLevelTimeoutLength) > Number(thirdLevelTimeoutLength)) {
          this.$message.warning(this.$t('troubleCode_thirdRespTimeSecoTime'))
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
