<template>
   <div class="mes-main mes-work-order">
    <div class="mes-main-title">安灯主页</div>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <cascader-select v-model="searchForm.officeCode" style="width:35%" dataType="1" ></cascader-select>
        <el-select style="margin-left:10px" size="mini" clearable placeholder="请选择线别"  v-model="searchForm.mPomLineId">
          <el-option v-for="(option,i) in lineList" :key="i" :label="option.lineName" :value="option.mPomLineId" @change="getAlarmType"></el-option>
        </el-select>
        <el-button style="margin-left:10px" size="mini" icon="el-icon-search" @click="getAlarmType">查询</el-button>
      </el-col>
      <!-- <el-col :span="12">
        <el-select style="float:right;width:35%" size="mini" clearable placeholder="请选择线别"  v-model="searchForm.mPomLineId">
          <el-option v-for="(option,i) in lineList" :key="i" :label="option.lineName" :value="option.mPomLineId" @change="getAlarmType"></el-option>
        </el-select>
      </el-col> -->
    </el-row>
    <div class="image-swiper" @mouseenter="buttonVisible = true" @mouseleave="buttonVisible = false">
      <el-row :gutter="30" class="mes-main-filte move-button" style="padding:1vh 3vw 2vh" >
      <el-button class="move-button-right" v-show="isButtonVisible"  @click="pageTurn('next')"><i class="el-icon-arrow-right"></i></el-button>
      <el-button class="move-button-left"  v-show="isButtonVisible"  @click="pageTurn('back')"><i class="el-icon-arrow-left"></i></el-button>
      <el-col :span="4" v-for="(option,i) in imgList" :key="i" style="position:relative;margin:1.5vh 0">
        <el-badge :value="option.notClosedAlarmCount" class="item swiper-badge" style="width:100%" :type="badgeType(option)" :hidden="badgeHidden(option.notClosedAlarmCount)">
        <div class="seedy-content">
          <div class="icon-swipper">
            <i>
              <img :src="'static/svg/'+option.imgurl+'.svg'" alt="" style="width: 4vw;cursor: pointer;" @click="handleClick(option)">
            </i>
          </div>
          <span class="seedy-span" :style="'color:'+spanColor(option)">{{option.typeName}}</span>
        </div>
        </el-badge>
      </el-col>
    </el-row>
    </div>
     <div class="mes-table">
      <el-table :data="AlarmTypeList" border highlight-current-row size="mini"  @cell-click="cellClick">
        <el-table-column type="index" label="序号" align="center" ></el-table-column>
        <el-table-column prop="typeName" sortable label="报警类型" align="center" show-overflow-tooltip label-class-name="mes-table-label" class-name="mes-table-click"></el-table-column>
        <el-table-column prop="todayAlarmCount" sortable label="当天报警数量" align="center" show-overflow-tooltip label-class-name="mes-table-label" class-name="mes-table-click"></el-table-column>
        <el-table-column prop="closedAlarmCount" sortable label="已关闭报警数量" align="center"></el-table-column>
        <el-table-column prop="pendingAlarmCount" sortable label="待响应报警数量" align="center"></el-table-column>
        <el-table-column prop="tobeClosedAlarmCount" sortable label="待关闭报警数量" align="center"></el-table-column>
        <el-table-column prop="pendingOvertimeAlarmCount" sortable label="待响应报警超时" align="center"></el-table-column>
        <el-table-column prop="finishOvertimeAlarmCount" sortable label="待完成报警超时" align="center"></el-table-column>
      </el-table>
    </div>
    <el-dialog  :visible.sync="dialogVisible" :title="dialogTitle"  width="700px" class="handle-dialog">
      <dialog-from  v-if="dialogVisible" ref="dialog"  @cannelAlarm="cannelAlarm" :mAlmTypeId="mAlmTypeId" :mPomLineId="mPomLineId" @getAlarmType="getAlarmType"></dialog-from>
    </el-dialog>
    <el-dialog :visible.sync="handleDialog" :title="handleDialogTitle" :width="dialogWidth" class="handle-dialog">
      <handle-dialog v-if="handleDialog" ref="handleDialog" @handleDialogWidth="handleDialogWidth" :mAlmTypeId="mAlmTypeId" :mPomLineId="mPomLineId" @cannelHandleDialog="cannelHandleDialog" @getAlarmType="getAlarmType"></handle-dialog>
    </el-dialog>
  </div>
</template>

<script>
import dialogFrom from './dialogFrom'
import handleDialog from './handleDialog'
export default {
  data () {
    return {
      searchForm: {
        officeCode: '',
        mPomLineId: ''
      },
      lineList: '',
      alarmList: [],
      buttonVisible: false,
      AlarmTypeList: [],
      partList: [],
      imgurl: 'andon-security',
      imgList: [],
      activeIndex: 0,
      isMax: false,
      dialogVisible: false,
      handleDialog: false,
      mAlmTypeId: '',
      mPomLineId: '',
      dialogWidth: '700px',
      dialogTitlePart: ''
    }
  },
  computed: {
    isButtonVisible () {
      let { imgList } = this
      return imgList.length > 0 ? this.buttonVisible : false
    },
    dialogTitle () {
      return '报警'
    },
    handleDialogTitle () {
      return this.dialogTitlePart + '报警类型处理'
    }
  },
  methods: {
    handleDialogWidth (val) {
      val === 2 ? this.dialogWidth = '1000px' : this.dialogWidth = '700px'
    },
    badgeHidden (option) {
      return option < 1
    },
    badgeType (option) {
      return option.notClosedAlarmCount > 0 ? option.pendingAlarmCount > 0 ? 'danger' : 'warning' : 'primary'
    },
    spanColor (option) {
      return option.notClosedAlarmCount > 0 ? option.pendingAlarmCount > 0 ? '#FF4500' : '#FFD700' : '#409EFF'
    },
    // 获取线别列表
    async getLineData () {
      let data = { lineName: '', lineType: '', pageIndex: 1, pageSize: 1000 }
      let res = await this.$api.getLineList(data)
      if (res.code === '200') {
        this.lineList = res.data.list
      } else {
        this.lineList = []
      }
    },
    // 获取报警类型
    async getAlarmType () {
      let { searchForm } = this
      if (searchForm.officeCode && searchForm.mPomLineId) {
        let res = await this.$api.findAndonHomeList(searchForm)
        if (res.code === '200') {
          this.mPomLineId = searchForm.mPomLineId
          this.AlarmTypeList = res.data
          this.partList = this.AlarmTypeList.slice(0, 6)
          this.getPartList()
        } else {
          this.AlarmTypeList = []
        }
      } else {
        this.$message.warning('请先选择线别和工厂')
      }
    },
    handleClick (option) {
      if (option.notClosedAlarmCount > 0) {
        this.dialogTitlePart = option.typeName
        this.handleDialog = true
        this.mAlmTypeId = option.mAlmTypeId
      } else {
        this.$message.warning('该报警类型没有要处理的异常！')
      }
    },
    cellClick (row, column, cell, event) {
      const { property } = column
      if (property === 'typeName') {
        this.dialogVisible = true
        this.mAlmTypeId = row.mAlmTypeId
      } else if (property === 'todayAlarmCount') {
        let { mPomLineId } = this.searchForm
        let sDate = this.$dayjs().format('YYYY-MM-DD 00:00:00')
        let eDate = this.$dayjs().add(1, 'day').format('YYYY-MM-DD 00:00:00')
        this.$router.replace(`/AndonReport/InformationQuery?mPomLineId=${mPomLineId}&sDate=${sDate}&eDate=${eDate}`)
      }
    },
    pageTurn (to) {
      let len = this.AlarmTypeList.length
      if (to === 'next') {
        this.activeIndex += 1
        if (this.activeIndex * 6 >= len) {
          len === 6 ? this.$message.warning('当前只有一页') : this.$message.warning('当前是最后一页')
          this.activeIndex = this.activeIndex - 1
        } else {
          this.partList = this.AlarmTypeList.slice(this.activeIndex * 6, (this.activeIndex * 6) + 6)
          this.getPartList()
        }
      } else if (to === 'back') {
        this.activeIndex -= 1
        if (this.activeIndex < 0) {
          len === 6 ? this.$message.warning('当前只有一页') : this.$message.warning('当前是第一页')
          this.activeIndex = 0
        } else {
          this.partList = this.activeIndex === 0 ? this.AlarmTypeList.slice(0, 6) : this.AlarmTypeList.slice(this.activeIndex * 6, (this.activeIndex * 6) + 6)
          this.getPartList()
        }
      }
    },
    // 截取数组的一部分
    getPartList () {
      this.imgList = []
      let dataList = []
      let obj = {}
      let keyList = ['mAlmTypeId', 'notClosedAlarmCount', 'typeName', 'pendingAlarmCount']
      this.partList.forEach(item => {
        obj = this.$global.filterForm(item, keyList)
        if (obj.typeName === '安全') {
          obj.imgurl = 'andon-security'
        } else if (obj.typeName === '质量') {
          obj.imgurl = 'andon-quality'
        } else if (obj.typeName === '设备') {
          obj.imgurl = 'andon-equipment'
        } else if (obj.typeName === '工艺') {
          obj.imgurl = 'andon-craft'
        } else if (obj.typeName === '技术') {
          obj.imgurl = 'andon-technology'
        } else if (obj.typeName === '物料') {
          obj.imgurl = 'andon-material'
        } else {
          obj.imgurl = 'andon-alarmDefault'
        }
        dataList.push(obj)
      })
      this.imgList = dataList
    },
    cannelAlarm () {
      this.dialogVisible = false
    },
    cannelHandleDialog () {
      this.handleDialog = false
    }
  },
  created () {
    this.getLineData()
  },
  components: {
    dialogFrom, handleDialog
  }
}
</script>

<style lang="scss" >
.icon-swipper {
  margin: 2vh 0;
}

.seedy-content {
  background-color: #fff;
  padding: 3vh 1vw;
  -webkit-box-shadow: 0 3px 29px 0 rgba(59, 74, 116, 0.1);
  box-shadow: 0 3px 29px 0 rgba(59, 74, 116, 0.1);
  border-radius: 8px;
  text-align: center;
  font-size: 1vw;
  .seedy-span {
    font-size: 25px;
    font-weight: 600;
  }
}

.box-radius {
  position: absolute;
  right: 0;
  width: 50px;
  height: 50px;
  -webkit-border-radius: 25px;
  -moz-border-radius: 25px;
  -o-border-radius: 25px;
  border-radius: 25px;
  background-color: #ff4500;
  color: #fff;
  font-size: 3vh;
  span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.image-swiper {
  .move-button-left {
    position: absolute;
    left: 0;
    margin-left: 10px;
    top: 50%;
    transform: translate(0px, -23px);
    border-radius: 50%;
    width: 45px;
    height: 45px;
    font-size: 20px;
    background-color: #f5f7fa;
  }

  .move-button-right {
    position: absolute;
    right: 0%;
    margin-right: 10px;
    top: 50%;
    transform: translate(0px, -23px);
    border-radius: 50%;
    width: 45px;
    height: 45px;
    font-size: 20px;
    background-color: #f5f7fa;
  }
}

.swiper-badge {
  .el-badge__content {
    border-radius: 50%;
    color: #fff;
    font-size: 3.5vw;
    height: 3.5vw;
    width: 3.5vw;
    line-height: 3.5vw;
    padding: 0;
    text-align: center;
  }
  .el-badge__content.is-fixed {
    transform: translate(50%, -30%);
  }
  .el-badge__content--danger {
    background-color: #ff4500;
  }

  .el-badge__content--warning {
    background-color: #ffd700;
  }
}
</style>
