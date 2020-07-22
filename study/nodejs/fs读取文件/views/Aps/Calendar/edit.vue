<template>
   <div class="mes-main mes-main-common">
    <div class="main-common-head" >
      <el-button type="primary" plain size="mini"  @click="saveData">保存</el-button>
      <el-button type="primary" plain size="mini" @click="$router.replace('/Aps/Calendar')">关闭</el-button>
    </div>
    <div class="mes-main mes-work-order ">
     <h3 class="mes-main-title">基本资料</h3>
        <el-row :gutter="20" class="mes-main-filte">
        <el-col :span="12">
          <el-date-picker   type="daterange" v-model="dateList"  range-separator="至"  start-placeholder="开始日期"  end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
        </el-col>
         <el-col :span="12" >
           <div style="font-size:25px;float:right;margin:0 1vw">
             <i style="cursor:pointer" class="el-icon-edit-outline" @click="dialogVisible = true"></i>
           </div>
           <el-select v-model="onTemplate" style="width:40%;float:right" clearable placeholder="选中是修改，不选中是新增" @change="ssss">
             <el-option v-for="(option,i) in templateList" :key="i" :label="option" :value="option"></el-option>
           </el-select>
        </el-col>
      </el-row>
      <div class="mes-table">
        <el-row class="mes-table-handle">
          <el-col :span="12">
            <el-button>清空</el-button>
          </el-col>
        </el-row>
        <table-component  ref="tableComponent"></table-component>
      </div>
      <div  class="checkBox_css">
        <el-checkbox style="float:left"  v-model="checkAll" @change="handleCheckAllChange">每天</el-checkbox>
        <el-checkbox-group style="float:left;margin-left:1vw" v-model="checkboxGroup">
          <el-checkbox :disabled="checkAll" v-for="day in dayList" :label="day" :key="day">{{day}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="transfer">
         <el-transfer  v-model="value"   :data="allResourceData"  :props="{key:'mPsmResourceId',label:'resourceCode'}" :titles="['资源列表', '被选中的资源列表']"></el-transfer>
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
      dayList: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      checkboxGroup: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
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
      return this.onTemplate ? '编辑选中的日历模板' : '新增日历模板'
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
          this.$message('每天只有24小时，请注意分配时间')
        } else {
          let { dayStatus, checkboxGroup, value } = this
          for (let i in dayStatus) {
            dayStatus[i] = false
          }
          let arr = checkboxGroup
          arr.forEach(item => {
            if (item === '周一') {
              dayStatus.mon = true
            } else if (item === '周二') {
              dayStatus.tues = true
            } else if (item === '周三') {
              dayStatus.wed = true
            } else if (item === '周四') {
              dayStatus.thur = true
            } else if (item === '周五') {
              dayStatus.fri = true
            } else if (item === '周六') {
              dayStatus.sat = true
            } else if (item === '周日') {
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
        this.$message.warning('请处理错误时间')
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
