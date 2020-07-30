<template>
  <div class="mes-main mes-work-order ">
     <h3 class="mes-main-title">{{$t('calendar_ProduCale')}}</h3>
        <el-row :gutter="20" class="mes-main-filte">
        <el-col :span="12">
           <el-date-picker style="width:60%"  v-model="timeList"  type="daterange"  :range-separator="$t('common_to')"  start-:placeholder="$t('common_StartDate')"  end-:placeholder="$t('common_EndDate')"></el-date-picker>
            <el-tooltip class="item" effect="dark"  placement="top-start">
              <div slot="content">{{$t('calendar_startTimeMustBeMond')}}<br> {{$t('calendar_endTimeMustBeSund')}}<br/>{{$t('calendar_AndSpanShouNatuMont')}}</div>
              <span style="color:#c3c3c3;font-size:20px;margin-left:0.3vw"><i class="fa fa-question-circle" aria-hidden="true"></i></span>
            </el-tooltip>
         </el-col>
         <el-col :span="12" >
          <el-select v-model="resourceChoice" style="width:40%;float:right">
            <el-option v-for="(option,i) in resourceList" :key="i" :value="option.mPsmResourceId" :label="option.resourceCode"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <div class="mes-table">
        <el-row class="mes-table-handle">
          <el-col :span="12">
            <el-button size="mini" icon="el-icon-search" @click="findData">{{$t('common_Inquire')}}</el-button>
            <span class="split-line">|</span>
            <el-button size="mini" icon="el-icon-plus"  @click="editCalendar">{{$t('common_Edit')}}</el-button>
            <span class="split-line">|</span>
            <el-button size="mini" icon="el-icon-upload2" @click="isUpload = true">{{$t('common_Impor')}}</el-button>
          </el-col>
        </el-row>
      </div>
      <el-calendar  :range="rangeArray" >
        <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
        <template
          slot="dateCell"
          slot-scope="{date, data}"
          >
          <div :class="data.isSelected ? 'is-selected' : ''">
            <p > {{ data.day.split('-').slice(1).join('-') }}</p>
            <p :class="getTextByDate(data.day)===$t('calendar_notConf') ? 'noCalendarText':'calendarText'"><span v-if="getTextByDate(data.day)!==$t('calendar_notConf')">{{$t('calendar_ProduTime')}}</span>{{ getTextByDate(data.day) }}<span v-if="getTextByDate(data.day)!==$t('calendar_notConf')">H</span></p>
            <p v-if="getTextByDate(data.day)!==$t('calendar_notConf')"  class="noProduct">{{$t('calendar_NonProdTime')}}: {{ getNoProduct(data.day) }} H</p>
          </div>
        </template>
      </el-calendar>
       <el-dialog :visible.sync="isUpload" :title="$t('calendar_selecProdCaleFileImpo')" class="handle-dialog"  width="30vw">
        <el-upload
        style="text-align:center"  :before-upload="beforeUpload" drag action="">
        <mes-icon icon="excel-icon" size="67px" style="display:inline-block;margin:40px 0 16px;" v-if="fileName"></mes-icon>
        <i class="el-icon-upload" v-else></i>
        <p v-if="fileName">{{ fileName }}</p>
         <div class="el-upload__text" v-else>
          {{$t('common_DragFileHere')}}<em>{{$t('common_ClickUplo')}}</em> {{$t('common_or')}}
          <em><a href="static/download/Calendar.xls" style="color:#3B6F9A;text-decoration:none;" :download="$t('calendar_ProduCaleTemp') + '.xls'" @click="downloadTemplate">{{$t('common_TemplDown')}}</a></em>
        </div>
      </el-upload>
       <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="importOnline">{{$t('common_ok')}}</el-button>
        <el-button @click="closeUploadDialog">{{$t('common_cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      timeList: [],
      resourceData: [],
      resourceList: [],
      resourceChoice: '',
      rangeArray: [],
      isUpload: false,
      fileName: '',
      fileContent: ''
    }
  },
  computed: {
    ...mapGetters(['calendarTime', 'isResource'])
  },
  methods: {
    ...mapActions(['changecalendarTime', 'changeResource']),
    getTextByDate (date) {
      const { resourceData } = this
      const len = resourceData.length
      let value = ''
      for (let i = 0; i < len; i++) {
        if (resourceData[i].date === date) {
          value = resourceData[i].productionTimeLength ? resourceData[i].productionTimeLength : 0
        }
      }
      return value || this.$t('calendar_notConf')
    },
    getNoProduct (date) {
      const { resourceData } = this
      const len = resourceData.length
      let value = ''
      for (let i = 0; i < len; i++) {
        if (resourceData[i].date === date) {
          value = resourceData[i].nonProductionTimeLength ? resourceData[i].nonProductionTimeLength : 0
        }
      }
      return value
    },
    async getResourceList () {
      let data = {
        status: '',
        keyWord: '',
        pageSize: 1000,
        pageIndex: 1
      }
      let res = await this.$api.getResourceList(data)
      this.resourceList = res.data.list
      this.resourceChoice = this.resourceList[0].mPsmResourceId
      if (this.calendarTime.length < 1) {
        this.findData()
      }
    },
    editCalendar () {
      let { timeList, resourceChoice } = this
      if (timeList[0] && timeList[1]) {
        timeList[0] = this.$dayjs(timeList[0]).format('YYYY-MM-DD')
        timeList[1] = this.$dayjs(timeList[1]).format('YYYY-MM-DD')
        this.$router.replace(`Calendar/edit?begin=${timeList[0]}&end=${timeList[1]}`)
      }
      this.changecalendarTime(timeList)
      this.changeResource(resourceChoice)
    },
    // 取消组件本身的上传
    beforeUpload (file) {
      this.fileName = file.name
      // let fileReg = /\.(?:xls|xlsx)$/i
      // if (fileReg.test(fileName)) {
      //   this.fileName = fileName
      //   // 将文件转换成base64格式
      //   let reader = new FileReader()
      //   reader.readAsDataURL(file)
      //   reader.onloadend = e => {
      //     this.fileContent = e.target.result
      //   }
      this.fileContent = file
      return false
    },
    // 取消按钮停止上传
    downloadTemplate (event) {
      event.stopPropagation()
    },
    // 提交按钮 进行上传
    async importOnline () {
      let { fileContent } = this
      let file = new FormData()
      file.append('file', fileContent)
      if (file) {
        let res = await this.$api.importCalendar(file)
        this.$myPrompt.handleMsg(res, () => {
        })
      } else {
        this.$message.warning(this.$t('calendar_uploaFileBeImpo'))
      }
    },
    closeUploadDialog () {
      this.isUpload = false
      this.fileName = ''
      this.fileContent = ''
    },
    async findData () {
      if (this.resourceChoice) {
        let timeList = this.changTime(this.timeList[0], this.timeList[1])
        let beginDate = timeList[0]
        let endDate = timeList[1]
        this.rangeArray = timeList
        let mPsmResourceId = this.resourceChoice
        let data = Object.assign({ beginDate, endDate, mPsmResourceId })
        let res = await this.$api.getCalendar(data)
        this.resourceData = res.data
      } else {
        this.$message.warning(this.$t('calendar_selecResoNameFirs'))
      }
    },
    defaultmethods () {
      if (this.calendarTime.length > 1) {
        this.timeList = this.calendarTime
        this.resourceChoice = this.isResource
        if (this.timeList && this.resourceChoice) {
          this.findData()
        }
      }
    },
    getTime () {
      let sTime = this.$dayjs().startOf('month')
      let eTime = this.$dayjs().endOf('month')
      // let beginDate
      // let endDate
      // if (this.$dayjs(sTime).day() === 1) {
      //   beginDate = this.$dayjs(sTime).format('YYYY-MM-DD')
      // } else {
      //   beginDate = this.$dayjs(sTime).subtract(this.$dayjs(sTime).day() - 1, 'day')
      //   beginDate = this.$dayjs(beginDate).format('YYYY-MM-DD')
      // }
      // if (this.$dayjs(eTime).day() === 0) {
      //   endDate = this.$dayjs(eTime).format('YYYY-MM-DD')
      // } else {
      //   endDate = this.$dayjs(eTime).add(7 - this.$dayjs(eTime).day(), 'day')
      //   endDate = this.$dayjs(endDate).format('YYYY-MM-DD')
      // }
      this.timeList = this.changTime(sTime, eTime)
    },
    changTime (sTime, eTime) {
      let beginDate
      let endDate
      if (this.$dayjs(sTime).day() === 1) {
        beginDate = this.$dayjs(sTime).format('YYYY-MM-DD')
      } else {
        beginDate = this.$dayjs(sTime).subtract(this.$dayjs(sTime).day() - 1, 'day')
        beginDate = this.$dayjs(beginDate).format('YYYY-MM-DD')
      }
      if (this.$dayjs(eTime).day() === 0) {
        endDate = this.$dayjs(eTime).format('YYYY-MM-DD')
      } else {
        if (this.$dayjs(eTime).date() + 7 - this.$dayjs(eTime).day() < 28) {
          endDate = this.$dayjs(eTime).add(7 - this.$dayjs(eTime).day(), 'day')
        } else {
          endDate = this.$dayjs(eTime).subtract(this.$dayjs(eTime).day(), 'day')
        }
        endDate = this.$dayjs(endDate).format('YYYY-MM-DD')
      }
      return [beginDate, endDate]
    }
  },
  created () {
    this.getTime()
    this.defaultmethods()
    this.getResourceList()
  }
}
</script>

<style lang="scss">
.is-selected {
  color: #1989fa;
}
.calendarText {
  color: #66cd00;
  text-align: center;
  margin-top: 1vh;
}
.noCalendarText {
  color: #f56c6c;
  text-align: center;
  margin-top: 1vh;
}
.noProduct {
  color: #909399;
  text-align: center;
  margin-top: 0.5vh;
}
</style>
