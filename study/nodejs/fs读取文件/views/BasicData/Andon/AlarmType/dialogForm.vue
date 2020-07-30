<template>
 <el-form :model="dialogForm"  ref="dialogForm" label-position="left" label-width="150px" class="el-row mes-form-rule" :rules="rules" size="mini">
    <el-form-item :label="$t('common_Factory')" prop="officeCode" class="el-col el-col-11" size="mini">
      <cascader-select v-model="dialogForm.officeCode" style="width:100%" dataType="1"></cascader-select>
    </el-form-item>
    <el-form-item :label="$t('alarmType_AlarmTypeCode')" prop="typeCode" class="el-col el-col-11 el-col-offset-1" size="mini">
      <el-input v-model="dialogForm.typeCode"></el-input>
    </el-form-item>
    <el-form-item :label="$t('alarmType_AlarmTypeName')" prop="typeName" class="el-col el-col-11" size="mini">
      <el-input v-model="dialogForm.typeName"></el-input>
    </el-form-item>
    <el-form-item :label="$t('alarmType_RespoTimeRepoGrou')" prop="responseTimeoutGroupId" class="el-col el-col-11 el-col-offset-1" size="mini" >
      <div slot="label">
        <span>{{$t('alarmType_RespoTimeRepoGrou')}}</span>
        <help-tips :content="$t('alarmType_useTimeoutPush')" />
      </div>
      <el-select v-model="dialogForm.responseTimeoutGroupId" @focus="getAlarmGroup('')" style="width:100%">
        <el-option v-for="(option,i) in alarmGroupList" :key="i" :label="option.groupName" :value="option.mAlmGroupId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('alarmType_Level1OverRepoGrou')" prop="firstLevelTimeoutGroupId" class="el-col el-col-11" size="mini">
      <el-select v-model="dialogForm.firstLevelTimeoutGroupId" @focus="getAlarmGroupafter" style="width:100%">
        <el-option v-for="(option,i) in alarmGroupList" :key="i" :label="option.groupName" :value="option.mAlmGroupId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('alarmType_Level2OverRepoGrou')" prop="secondLevelTimeoutGroupId" class="el-col el-col-11 el-col-offset-1" size="mini">
      <el-select v-model="dialogForm.secondLevelTimeoutGroupId" @focus="getAlarmGroupafter" style="width:100%">
        <el-option v-for="(option,i) in alarmGroupList" :key="i" :label="option.groupName" :value="option.mAlmGroupId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('alarmType_ThreeLeveOverRepoGrou')" prop="thirdLevelTimeoutGroupId" class="el-col el-col-11 " size="mini">
      <el-select v-model="dialogForm.thirdLevelTimeoutGroupId" @focus="getAlarmGroupafter" style="width:100%">
        <el-option v-for="(option,i) in alarmGroupList" :key="i" :label="option.groupName" :value="option.mAlmGroupId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('common_remarks')" prop="remark" class="el-col el-col-23" size="mini">
      <el-input type="textarea" v-model="dialogForm.remark"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveDataList">{{$t('common_save')}}</el-button>
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
        typeCode: '',
        typeName: '',
        remark: '',
        responseTimeoutGroupId: '',
        firstLevelTimeoutGroupId: '',
        secondLevelTimeoutGroupId: '',
        thirdLevelTimeoutGroupId: ''
      },
      alarmGroupList: []
    }
  },
  computed: {
    rules () {
      return {
        officeCode: [{ required: true, message: this.$t('common_PleasSeleFact') }],
        typeCode: [{ required: true, message: this.$t('alarmType_inputAlarTypeCode') }],
        typeName: [{ required: true, message: this.$t('alarmType_enterAlarTypeName') }]
      }
    }
  },
  props: {
    isEdit: Boolean,
    cannel: Function,
    getTableData: Function
  },
  methods: {
    saveDataList () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let { dialogForm } = this
          let res = this.isEdit ? await this.$api.updateAlarmType(dialogForm) : await this.$api.insertAlarmType(dialogForm)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getTableData')
          })
        }
      })
    },
    // 获取群组
    async getAlarmGroup (officeCode) {
      officeCode = officeCode || this.dialogForm.officeCode
      if (officeCode) {
        const data = {
          officeCode: officeCode,
          pageIndex: 1,
          pageSize: 1000
        }
        let res = await this.$api.getAndonGroupList(data)
        if (res.code === '200') {
          this.alarmGroupList = res.data.list
        } else {
          this.alarmGroupList = []
        }
      } else {
        this.$message.warning(this.$t('alarmType_selecFactFirs'))
      }
    },
    getAlarmGroupafter () {
      if (this.alarmGroupList.length < 1) {
        this.$message.warning(this.$t('alarmType_selecRespTimeGrouFirs'))
      }
    }
  },
  created () {
  },
  mounted () {

  }

}
</script>
