<template>
  <board @change="change"  bTitle="制程设备分析">
    <el-row class="equipment-analysis">
      <el-col :span="14" class="run-state">
        <v-title title="设备运行状态" titleHight="10%"></v-title>
        <div class="info-header">
          <ul>
            <li>
            <p>设备总数 :</p>
            <p class="total-num">{{deviceRunningStatus.totalCount}}</p>
            </li>
            <li>
              <p>正常数量 :</p>
              <p class="handle-num">{{deviceRunningStatus.normalCount}}</p>
            </li>
            <li>
              <p>故障数量 :</p>
              <p class="handle-processing">{{deviceRunningStatus.faultCount}}</p>
            </li>
            <li>
              <p>停用数量 :</p>
              <p class="no-handle">{{deviceRunningStatus.stopCount}}</p>
            </li>
          </ul>
        </div>
          <el-scrollbar style="height: 85%;width: 99%;">
            <el-row>
              <div class="device-item" v-for="(option,i) in deviceInfo" :key="i">
                <el-col :span="4" class="item-label">
                  <span>{{option.name}} :</span>
                </el-col>
                <el-col :span="20" class="item-content">
                  <el-tooltip v-for="(item,j) in option.children" :key="j" effect="dark" :content="item.code" placement="top">
                   <span :class="spanClass(item.status)" >{{item.code}}</span>
                  </el-tooltip>
                </el-col>
              </div>
            </el-row>
          </el-scrollbar>
      </el-col>
      <el-col :span="10" class="fault-history split-line">
        <v-title title="设备故障履历" titleHight="10%"></v-title>
        <ul style="height:10%">
          <li>
              <p>总数 :</p>
              <p class="total-num">{{failureHistory.totalCount}}</p>
            </li>
            <li>
              <p>已完成 :</p>
              <p class="handle-num">{{failureHistory.finishedCount}}</p>
            </li>
            <li>
              <p>未开始 :</p>
              <p class="no-handle">{{failureHistory.notStartedCount}}</p>
            </li>
            <li>
              <p>处理中 :</p>
              <p class="handle-processing">{{failureHistory.processingCount}}</p>
            </li>
             <li>
              <p>待确认 :</p>
              <p class="handle-confirm">{{failureHistory.toBeConfirmedCount}}</p>
            </li>
        </ul>
        <el-table :data="tableData" class="visual-table" stripe style="height:80%;padding-top:1vh" :cell-class-name="cell">
          <el-table-column prop="resourceName" label="故障设备" align="center"></el-table-column>
          <el-table-column prop="failDescription" label="故障描述" align="center" width="100px" show-overflow-tooltip></el-table-column>
          <el-table-column prop="failTime" label="故障时长(min)" width="120px" align="center"></el-table-column>
          <el-table-column prop="alarmTime" label="报警时间" align="center"></el-table-column>
          <el-table-column prop="userName" label="责任人" align="center"></el-table-column>
          <!-- <el-table-column label="状态" align="center"></el-table-column>
           <template slot-scope="scope">
             <span>{{scope.status}}</span>
           </template>
        </el-table> -->
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <span :class="tableStatus(scope.row.status)">{{scope.row.status}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="11" class="complete-num" style="border-top: 0.4vh solid #0f0c2d">
        <v-title title="维修抢单排行"></v-title>
        <rank-bar id="rank_Bar" :type="errorType" :data="errorData" :height="errorHeight" :rankSum="rankSum" style="height:85%" ></rank-bar>
      </el-col>
      <el-col :span="13" class="complete-rate split-line" style="border-top: 0.4vh solid #0f0c2d">
        <v-title title="点检完成率"></v-title>
        <achievent-rate id="achievent-rate" style="height:85%" :lineData="spotCheckCompletionRate"></achievent-rate>
      </el-col>
    </el-row>

  </board>
</template>

<script>
import board from '../board'
import achieventRate from './achieventRate'
import rankBar from '../Componment/rankBar'

export default {
  data () {
    return {
      errorData: [],
      errorType: [],
      rankSum: 0,
      tableData: [
        {
          id: '23',
          name: 'qwe'
        },
        {
          id: '123',
          name: 'wer'
        }
      ],
      resourceType: '',
      deviceRunningStatus: {},
      failureHistory: {},
      repairRank: [],
      spotCheckCompletionRate: [],
      deviceInfo: [],
      garbList: []
    }
  },
  computed: {
    errorHeight () {
      return (this.errorData.length + 1) / 6 * 90 + '%'
    }
  },
  methods: {
    change () {

    },
    spanClass (status) {
      if (status === '停用') {
        return 'span-error'
      } else if (status === '故障') {
        return 'span-warning '
      } else {
        return ''
      }
    },
    // 获取制程设备信息
    async getDeviceData () {
      let date = '' || this.$route.query.date
      const res = await this.$api.getDeviceData({ date })
      if (res.code === '200') {
        for (let i in res.data) {
          this[i] = res.data[i]
        }
        this.deviceInfo = this.deviceRunningStatus.deviceInfo
        this.tableData = this.failureHistory.historyInfo
        this.repairRank.repairPeopleRank.sort((a, b) => { return a.value - b.value })
        this.repairRank.repairPeopleRank.forEach(item => {
          this.errorData.push(item.value)
          this.errorType.push(item.name)
        })
        this.rankSum = this.repairRank.totalCount
      }
    },
    cell ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 5) {
        if (row.status === '待确认') {
          return 'cell-confirm'
        }
      }
    },
    tableStatus (status) {
      if (status === '待确认') {
        return 'cell-confirm'
      } else if (status === '处理中') {
        return 'cell-processing'
      } else if (status === '未开始') {
        return 'cell-nohandle'
      } else if (status === '已完成') {
        return 'cell-handle'
      }
    }
  },
  created () {
    this.getDeviceData()
  },
  components: {
    board, achieventRate, rankBar
  }
}
</script>

<style lang="scss">
.equipment-analysis {
  height: 100%;

  .split-line {
    border-left: 0.15vw solid #14092d;
  }
  .run-state {
    height: 60%;
    .info-header {
      ul {
        margin-top: 5px;
        display: flex;
        li {
          flex: 1;
          justify-content: space-around;
          padding-left: 0.5vw;
          p {
            display: inline-block;
            color: #ffffff;
          }
          .total-num {
            font-size: 1.2vw;
            color: #40fff9;
          }
          .handle-num {
            font-size: 1.2vw;
            color: #71c671;
          }
          .no-handle {
            font-size: 1.2vw;
            color: #f65050;
          }
          .handle-processing {
            font-size: 1.2vw;
            color: #e6a23c;
          }
        }
      }
    }
  }
  .fault-history {
    height: 60%;
    ul {
      display: flex;
      li {
        flex: 1;
        justify-content: space-around;
        padding-left: 0.5vw;
        margin-top: 1vh;
        p {
          display: inline-block;
          color: #ffffff;
        }
        .total-num {
          font-size: 1.2vw;
          color: #40fff9;
        }
        .handle-num {
          font-size: 1.2vw;
          color: #71c671;
        }
        .no-handle {
          font-size: 1.2vw;
          color: #f65050;
        }
        .handle-processing {
          font-size: 1.2vw;
          color: #e6a23c;
        }

        .handle-confirm {
          font-size: 1.2vw;
          color: #fff;
        }
      }
    }
  }
  .complete-num {
    height: 40%;
  }
  .complete-rate {
    height: 40%;
  }
}

.cell-confirm {
  color: #fff;
}

.cell-processing {
  color: #e6a23c;
}

.cell-handle {
  color: #71c671;
}

.cell-nohandle {
  color: #f65050;
}

.device-item {
  overflow: hidden;
  margin-top: 15px;
  .item-label {
    span {
      display: inline-block;
      width: 100%;
      color: #ffffff;
      padding: 4px 0px;
      height: 2vh;
      text-align: center;
      margin: 3px;
      line-height: 2vh;
    }
  }
  .item-content {
    span {
      display: inline-block;
      width: 72px;
      color: #ffffff;
      padding: 4px 5px;
      height: 2vh;
      text-align: center;
      background: #71c671;
      border-radius: 8px;
      margin: 3px;
      line-height: 2vh;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
    }
    .span-error {
      background: #f65050;
    }

    .span-warning {
      background: #fdc402;
    }

    .span-info {
      background: #b3b3b3;
    }
  }
}
</style>
