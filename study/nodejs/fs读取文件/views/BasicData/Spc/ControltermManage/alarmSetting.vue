<template>
  <div>
    <div class="alarm-table" v-if="alarmType ==='table'">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-input style="width:35%;" v-model="receiver" :placeholder="$t('controltermM_InputReceSear')" suffix-icon="el-icon-search" @keydown.enter.native="getSpcAlarmSettingList"></el-input>
          <el-button @click="$emit('changeAlarmType','form')">{{$t('common_Add')}}</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" border highlight-current-row @current-change="handleCurrentChange" style="margin:1.5vh 0;">
        <el-table-column width="50">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.checked"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="stReceiver1" :label="$t('controltermM_FirstClasPoliRece')" align="center">
          <template slot-scope="props">
            <p v-for="(item,i) in props.row.stReceiver1" :key="i">{{ item }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="stEscalDura1" :label="$t('controltermM_UntreTimeLimiLeve2') + '(H)'" align="center"></el-table-column>
        <el-table-column prop="ndReceiver2" :label="$t('controltermM_SeconPoliRece')" align="center">
          <template slot-scope="props">
            <p v-for="(item,i) in props.row.ndReceiver2" :key="i">{{ item }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" :label="$t('common_remarks')" align="center"></el-table-column>
      </el-table>
      <div style="text-align:center;">
        <el-button type="primary" @click="saveSpcAlertId">{{$t('common_ok')}}</el-button>
        <el-button @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
      </div>
    </div>
    <div class="alarm-form" v-if="alarmType==='form'">
      <el-row class="alarm-user">
        <el-col :span="9" class="alarm-user-item">
          <div class="alarm-user-card">
            <el-card shadow="never">
              <div slot="header" class="clearfix">
                <span>{{$t('controltermM_FirstLeveAlarRe')}}</span>
              </div>
              <div style="height:150px;padding:10px;">
                <el-scrollbar style="height:100%;">
                  <el-checkbox-group  v-model="stReceiver1">
                    <el-checkbox style="margin-bottom:10px;" v-for="person in receiverOne" :label="person.workNo" :key="person.userCode">{{ person.userName }}({{ person.workNo }})</el-checkbox>
                  </el-checkbox-group>
                </el-scrollbar>
              </div>
            </el-card>
            <div class="alarm-user-handle">
              <div style="margin-bottom:10px;">
                <el-button type="primary" icon="el-icon-arrow-left" circle @click="moveUserToReceiver('receiverOne')"></el-button>
              </div>
              <div>
                <el-button type="primary" icon="el-icon-arrow-right" circle @click="removeReceiver(stReceiver1,this.$t('controltermM_classA'))"></el-button>
              </div>
            </div>
          </div>
          <el-checkbox-group v-model="mode1" @change="modeChange1">
            <el-checkbox v-for="mode in modeList" :label="mode" :key="mode">{{ mode }}</el-checkbox>
          </el-checkbox-group>
        </el-col>
        <el-col :span="6" class="alarm-user-item">
          <div class="alarm-user-card">
            <el-card shadow="never" style="width:100%;">
              <div slot="header" class="clearfix">
                <span>{{$t('controltermM_AllCall')}}</span>
              </div>
              <div style="height:150px;padding:10px;">
                <el-scrollbar style="height:100%;">
                  <el-checkbox-group  v-model="allReceiver">
                    <el-checkbox style="margin-bottom:10px;" v-for="person in personList" :label="person.workNo" :key="person.userCode">{{ person.userName }}({{ person.workNo }})</el-checkbox>
                  </el-checkbox-group>
                </el-scrollbar>
              </div>
            </el-card>
          </div>
        </el-col>
        <el-col :span="9" class="alarm-user-item">
          <div class="alarm-user-card">
            <div class="alarm-user-handle">
              <div style="margin-bottom:10px;">
                <el-button type="primary" icon="el-icon-arrow-right" @click="moveUserToReceiver('receiverTwo')" circle></el-button>
              </div>
              <div>
                <el-button type="primary" icon="el-icon-arrow-left" @click="removeReceiver(ndReceiver2,this.$t('controltermM_seconLeve'))" circle></el-button>
              </div>
            </div>
            <el-card shadow="never" style="width:80%;">
              <div slot="header" class="clearfix">
                <span>{{$t('controltermM_SeconLeveAlarRece')}}</span>
              </div>
              <div style="height:150px;padding:10px;">
                <el-scrollbar style="height:100%;">
                  <el-checkbox-group  v-model="ndReceiver2">
                    <el-checkbox style="margin-bottom:10px;" v-for="person in receiverTwo" :label="person.workNo" :key="person.userCode">{{ person.userName }}({{ person.workNo }})</el-checkbox>
                  </el-checkbox-group>
                </el-scrollbar>
              </div>
            </el-card>
          </div>
          <el-checkbox-group v-model="mode2" style="margin-left:20%;" @change="modeChange2">
            <el-checkbox v-for="mode in modeList" :label="mode" :key="mode">{{ mode }}</el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
      <el-form :model="alarmForm" label-position="top" class="el-row alarm-form-wrap">
        <el-form-item :label="$t('controltermM_FirstLeveAlar')" class="el-col el-col-11">
          {{$t('controltermM_excee')}}<el-input v-model="alarmForm.stEscalDura1" style="width:45px;margin-left:5px;"></el-input>
          {{ alarmForm.stEscalDuraUom1 + $t('controltermM_IfNotHandSecoLeve') }}
        </el-form-item>
        <el-form-item :label="$t('controltermM_SeconAlar')" class="el-col el-col-12 el-col-offset-1">
          {{$t('controltermM_RepeaRemi')}} <el-checkbox v-model="alarmForm.isAlertRepeat"></el-checkbox>
          &emsp;{{$t('controltermM_MaximNumbRepe')}}<el-input v-model="alarmForm.repeatTimes" style="width:45px;margin-left:5px;"></el-input>
          &emsp;{{$t('controltermM_InterTime')}}<el-input v-model="alarmForm.repeatDura" style="width:45px;margin-left:5px;"></el-input> H
        </el-form-item>
        <el-form-item :label="$t('common_remarks')" class="el-col el-col-23">
         <el-input type="textarea" v-model="alarmForm.remarks"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:center;">
        <el-button type="primary" @click="saveAlarmInfo">{{$t('common_ok')}}</el-button>
        <el-button @click="$emit('changeAlarmType','table')">{{$t('common_retur')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      receiver: '',
      modeList: [this.$t('controltermM_mail'), this.$t('controltermM_shortMess'), 'APP'],
      mode1: [],
      mode2: [],
      tableData: [],
      personList: [],
      allReceiver: [],
      receiverOne: [],
      receiverTwo: [],
      stReceiver1: [],
      ndReceiver2: [],
      alarmForm: {
        stReceiver1: [],
        stRecvMode1: '',
        stEscalDura1: '12',
        ndReceiver2: [],
        ndRecvMode2: '',
        stEscalDuraUom1: 'H',
        isAlertRepeat: true,
        repeatDura: '3',
        repeatDuraUom: 'H',
        repeatTimes: '3',
        remarks: ''
      }
    }
  },
  props: {
    alarmType: String,
    dialogForm: Object
  },
  methods: {
    handleCurrentChange (row) {
      const { tableData } = this
      if (row) {
        tableData.forEach(item => {
          item.checked = row.mSpcAlert === item.mSpcAlert
        })
      } else {
        tableData.forEach(item => {
          item.checked = false
        })
      }
    },
    saveSpcAlertId () {
      let mSpcAlert = null
      this.tableData.forEach(item => {
        if (item.checked) {
          mSpcAlert = item.mSpcAlert
        }
      })
      if (mSpcAlert) {
        this.dialogForm.mSpcAlertId = mSpcAlert
        this.$emit('cannel')
      } else {
        this.$message.warning(this.$t('controltermM_selecAlarSettFirs'))
      }
    },
    async getSpcAlarmSettingList () {
      const { receiver, dialogForm } = this
      const res = await this.$api.getSpcAlarmSettingList({ receiver })
      const { code, data } = res
      if (code === '200') {
        data.forEach(item => {
          item.checked = item.mSpcAlert === dialogForm.mSpcAlertId
        })
        this.tableData = data
      } else {
        this.tableData = []
      }
    },
    async getPersonList () {
      const res = await this.$api.getPersonList()
      if (res.code === '200') {
        this.personList = res.data
      } else {
        this.personList = []
      }
    },
    moveUserToReceiver (key) {
      const { allReceiver, personList } = this
      if (allReceiver.length > 0) {
        const currentList = []
        this[key].forEach(item => {
          currentList.push(item.workNo)
        })
        personList.forEach(person => {
          allReceiver.forEach(userCode => {
            if (userCode === person.workNo) {
              if (currentList.indexOf(userCode) === -1) {
                this[key].push(person)
              }
            }
          })
        })
      } else {
        this.$message.warning(this.$t('controltermM_selecPersWhoPoliFirs'))
      }
    },
    removeReceiver (list, type) {
      if (list.length > 0) {
        if (type === this.$t('controltermM_classA')) {
          const len = this.receiverOne.length - 1
          for (let i = len; i >= 0; i--) {
            list.forEach((userCode, index) => {
              if (userCode === this.receiverOne[i].workNo) {
                this.receiverOne.splice(i, 1)
                list.splice(index, 1)
              }
            })
          }
        } else if (type === this.$t('controltermM_seconLeve')) {
          const len = this.receiverTwo.length - 1
          for (let i = len; i >= 0; i--) {
            list.forEach((userCode, index) => {
              if (userCode === this.receiverTwo[i].workNo) {
                this.receiverTwo.splice(i, 1)
                list.splice(index, 1)
              }
            })
          }
        }
      } else {
        this.$message.warning(type + this.$t('controltermM_NoPersHasReceList'))
      }
    },
    modeChange1 (valueList) {
      const value = valueList.join(',')
      this.alarmForm.stRecvMode1 = value
    },
    modeChange2 (valueList) {
      const value = valueList.join(',')
      this.alarmForm.ndRecvMode2 = value
    },
    async saveAlarmInfo () {
      const { receiverOne, receiverTwo, alarmForm } = this
      alarmForm.stReceiver1 = []
      alarmForm.ndReceiver2 = []
      if (receiverOne.length > 0 && receiverTwo.length > 0) {
        this.receiverOne.forEach(item => {
          alarmForm.stReceiver1.push(item.workNo)
        })
        this.receiverTwo.forEach(item => {
          alarmForm.ndReceiver2.push(item.workNo)
        })
        const res = await this.$api.addSpcAlarmSetting(alarmForm)
        this.$myPrompt.handleMsg(res, () => {
          this.getSpcAlarmSettingList()
          this.$emit('changeAlarmType', 'table')
        })
      } else {
        this.$message.warning(this.$t('controltermM_addALeveFirs'))
      }
    }
  },
  created () {
    this.getSpcAlarmSettingList()
    this.getPersonList()
  }
}
</script>

<style lang="scss">
.alarm-form {
  .alarm-user {
    margin-bottom: 15px;
    .alarm-user-item {
      .alarm-user-card {
        display: flex;
        .el-card {
          width: 80%;
          margin-bottom: 10px;
          .el-card__body {
            padding: 0;
          }
        }
        .alarm-user-handle {
          flex: 1;
          text-align: center;
          display: flex;
          flex-direction: column;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }

  .alarm-form-wrap {
    .el-form-item {
      .el-form-item__label {
        font-weight: bold;
        font-size: 16px;
      }
    }
  }
}
</style>
