<template>
   <div class="mes-main mes-main-common">
    <div class="main-common-head" >
      <el-button type="primary" plain size="mini"  @click="saveData">{{$t('common_save')}}</el-button>
      <el-button type="primary" plain size="mini" @click="$router.replace('/Aps/Calendar')">{{$t('common_close')}}</el-button>
    </div>
    <div class="mes-main mes-work-order ">
     <h3 class="mes-main-title">{{$t('common_BasicInfo')}}</h3>
        <el-row :gutter="20" class="mes-main-filte">
        <el-col :span="12">
          <el-date-picker   type="daterange" v-model="dateList"  :range-separator="$t('common_to')"  start-:placeholder="$t('common_StartDate')"  end-:placeholder="$t('common_EndDate')" value-format="yyyy-MM-dd"></el-date-picker>
        </el-col>
         <el-col :span="12" >
           <div style="font-size:25px;float:right;margin:0 1vw">
             <i style="cursor:pointer" class="el-icon-edit-outline" @click="dialogVisible = true"></i>
           </div>
           <el-select v-model="onTemplate" style="width:40%;float:right" clearable :placeholder="$t('calendar_SelecModiNotAdd')" @change="ssss">
             <el-option v-for="(option,i) in templateList" :key="i" :label="option" :value="option"></el-option>
           </el-select>
        </el-col>
      </el-row>
      <div class="mes-table">
        <el-row class="mes-table-handle">
          <el-col :span="12">
            <el-button>{{$t('calendar_empty')}}</el-button>
          </el-col>
        </el-row>
        <table-component  ref="tableComponent"></table-component>
      </div>
      <div  class="checkBox_css">
        <el-checkbox style="float:left"  v-model="checkAll" @change="handleCheckAllChange">{{$t('calendar_EveryDay')}}</el-checkbox>
        <el-checkbox-group style="float:left;margin-left:1vw" v-model="checkboxGroup">
          <el-checkbox :disabled="checkAll" v-for="day in dayList" :label="day" :key="day">{{day}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="transfer">
         <el-transfer  v-model="value"   :data="allResourceData"  :props="{key:'mPsmResourceId',label:'resourceCode'}" :titles="[this.$t('calendar_resouList'), this.$t('calendar_ListSeleReso')]"></el-transfer>
      </div>
      <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" width="45vw" class="handle-dialog" >
        <dialog-from v-if="dialogVisible" @cannel="cannel" :onTemplate="onTemplate" @getAllTemplate="getAllTemplate" @getDeleteAfterTemplate="getDeleteAfterTemplate"></dialog-from>
      </el-dialog>
  </div>

    </div>
</template>

<script>
import dialogFrom from './dialogFrom.vue'
import tableComponent from './tableComponent'
export default {
  data () {
    return {
      value: [],
      onTemplate: '',
      templateList: [],
      dialogVisible: false,
      dayList: [this.$t('calendar_Monda'), this.$t('calendar_Tuesd'), this.$t('calendar_Wedne'), this.$t('calendar_Thurs'), this.$t('calendar_Frida'), this.$t('calendar_Satur'), this.$t('calendar_Sunda')],
      checkboxGroup: [this.$t('calendar_Monda'), this.$t('calendar_Tuesd'), this.$t('calendar_Wedne'), this.$t('calendar_Thurs'), this.$t('calendar_Frida'), this.$t('calendar_Satur'), this.$t('calendar_Sunda')],
      checkAll: true,
      dayStatus: {
        mon: true,
        tues: false,
        wed: false,
        thur: true,
        fri: false,
        sat: false,
        sun: false
      },
      allResourceData: [],
      dateList: []
    }
  },
  computed: {
    dialogTitle () {
      return this.onTemplate ? this.$t('calendar_EditSeleCaleTemp') : this.$t('calendar_NewCaleTemp')
    }
  },
  methods: {
    handleCheckAllChange (val) {
      this.checkboxGroup = val ? this.dayList : []
    },
    async getAllTemplate () {
      let res = await this.$api.getCalendarTemplateName()
      if (res.code === '200') {
        this.templateList = res.data
      }
    },
    async getDeleteAfterTemplate () {
      this.onTemplate = ''
    },
    async ssss () {
      if (this.onTemplate) {
        let templateName = this.onTemplate
        let res = await this.$api.getByTemplateName({ templateName })
        if (res.code === '200') {
          this.$refs.tableComponent.templateData = res.data
        }
      } else {
        this.$refs.tableComponent.templateData = []
      }
    },
    async  saveData () {
      if (this.$refs.tableComponent.isNumber) {
        if (this.$refs.tableComponent.workTime + this.$refs.tableComponent.noWorkTime > 24) {
          this.$message(this.$t('calendar_HoursPayAtteAlloTime'))
        } else {
          let { dayStatus, checkboxGroup, value } = this
          for (let i in dayStatus) {
            dayStatus[i] = false
          }
          let arr = checkboxGroup
          arr.forEach(item => {
            if (item === this.$t('calendar_Monda')) {
              dayStatus.mon = true
            } else if (item === this.$t('calendar_Tuesd')) {
              dayStatus.tues = true
            } else if (item === this.$t('calendar_Wedne')) {
              dayStatus.wed = true
            } else if (item === this.$t('calendar_Thurs')) {
              dayStatus.thur = true
            } else if (item === this.$t('calendar_Frida')) {
              dayStatus.fri = true
            } else if (item === this.$t('calendar_Satur')) {
              dayStatus.sat = true
            } else if (item === this.$t('calendar_Sunda')) {
              dayStatus.sun = true
            }
          })
          let mPsmResourceIds = value
          let items = this.$refs.tableComponent.templateData
          let beginDate = this.dateList[0]
          let endDate = this.dateList[1]
          let data = Object.assign({ items, mPsmResourceIds, beginDate, endDate }, dayStatus)
          let res = await this.$api.saveCalendar(data)
          this.$myPrompt.handleMsg(res, () => {
            this.$router.replace('/Aps/Calendar')
          })
        }
      } else {
        this.$message.warning(this.$t('calendar_handlErroTime'))
      }
    },
    // 获取资源列表
    async getResourceList () {
      let data = {
        status: '',
        keyWord: '',
        pageSize: 1000,
        pageIndex: 1
      }
      let res = await this.$api.getResourceList(data)
      this.allResourceData = res.data.list
    },
    getDefaultTime () {
      let begin = this.$route.query.begin
      let end = this.$route.query.end
      this.dateList = [begin, end]
    },
    cannel () {
      this.dialogVisible = false
    }
  },
  created () {
    this.getDefaultTime()
    this.getResourceList()
    this.getAllTemplate()
  },
  components: {
    dialogFrom, tableComponent
  }

}
</script>

<style lang="scss">
.transfer {
  margin: 6vh 0;
  .el-transfer-panel {
    width: 15vw;
  }
}
.checkBox_css {
  margin: 6vh 0;
  height: 2vh;
}
</style>
