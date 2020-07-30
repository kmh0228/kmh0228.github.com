<template>
  <div>
    <el-form :model="userForm"  ref="userForm" label-position="left" label-width="150px" class="el-row mes-form-rule" :rules="userRules" size="mini" v-if="userAlarm" @submit.native.prevent>
      <el-form-item :label="$t('andonHome_enterJobNumb')" class="el-col el-col-24">
        <el-input v-model="userForm.cardId" @keydown.enter.native="deteminePerson"></el-input>
      </el-form-item>
      <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
        <el-button type="primary" size="mini" @click="deteminePerson">{{$t('common_ok')}}</el-button>
        <el-button size="mini" @click="$emit('cannelAlarm')">{{$t('common_cancel')}}</el-button>
      </el-form-item>
    </el-form>
    <el-form :model="alarmTypeForm" ref="alarmTypeForm" label-position="left" label-width="210px" class="el-row mes-form-rule" :rules="alarmRules" size="mini" v-else>
      <el-form-item :label="$t('andonHome_enterAlarCodeAlarQues')" class="el-col el-col-23">
        <el-input v-model="alarmTypeForm.failCode" :placeholder="$t('andonHome_FilteAlarProb')" @keydown.enter.native="getAlarmData"></el-input>
      </el-form-item>
      <!-- form-item要给一个栅格布局  不然会盖住上面的输入框 -->
      <el-form-item label-width="120px" :label="$t('andonHome_AlarmProb')" class="el-row el-col el-col-24">
        <el-radio-group  v-model="almCodeId" size="medium" style="width:100%">
          <el-radio border v-for="(option,i) in alarmList" :key="i" :label="option.mMomFailcodeId" class="el-col el-col-7" style="margin:7px" size="medium">{{option.failCode}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('common_remarks') + ' :'" label-width="120px" class="el-col el-col-23">
        <el-input v-model="alarmTypeForm.remark" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
        <el-button type="primary" size="mini" @click="saveAndonAlarm">{{$t('common_ok')}}</el-button>
        <el-button size="mini" @click="$emit('cannelAlarm')">{{$t('common_cancel')}}</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
export default {
  data () {
    return {
      userForm: {
        cardId: ''
      },
      userRules: {
        cardId: [{ required: true, message: this.$t('andonHome_inputUserID') }]
      },
      alarmTypeForm: {
        failCode: '',
        remark: ''
      },
      alarmRules: {

      },
      alarmList: [],
      userAlarm: true,
      almCodeId: '',
      creator: ''
    }
  },
  watch: {
    // alarmTypeForm: {
    //   handler (val) {
    //     this.getAlarmData()
    //   },
    //   deep: true
    // }
    'alarmTypeForm.failCode' () {
      this.getAlarmData()
    }
  },
  props: {
    cannelAlarm: Function,
    mAlmTypeId: String,
    mPomLineId: String,
    getAlarmType: Function
  },
  methods: {
    deteminePerson () {
      this.$refs.userForm.validate(async valid => {
        if (valid) {
          let { cardId } = this.userForm
          let res = await this.$api.getEmployeeByCardId({ cardId })
          if (res.data) {
            this.userAlarm = false
            this.creator = cardId
          } else {
            this.$message.warning(this.$t('andonHome_emploNumbDoesNotExis'))
          }
        }
      })
    },
    // 获取全部报警问题
    async getAlarmData () {
      let { failCode } = this.alarmTypeForm
      let data = {
        officeCode: '',
        failCode: failCode,
        pageIndex: 1,
        pageSize: 1000
      }
      let res = await this.$api.findFailcodeList(data)
      if (res.code === '200') {
        this.alarmList = res.data.list
      } else {
        this.alarmList = []
      }
    },
    async saveAndonAlarm () {
      let { creator, almCodeId, mAlmTypeId, mPomLineId } = this
      let { remark } = this.alarmTypeForm
      const data = Object.assign({ creator, almCodeId, remark, mAlmTypeId, mPomLineId })
      let res = await this.$api.saveAndonAlarm(data)
      this.$myPrompt.handleMsg(res, () => {
        this.$emit('cannelAlarm')
        this.$emit('getAlarmType')
      })
    }
  },
  created () {
    this.getAlarmData()
  }
}
</script>
