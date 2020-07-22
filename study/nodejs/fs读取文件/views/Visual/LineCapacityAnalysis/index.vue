<template>
  <board   bTitle="线别产能分析">
    <el-row class="capacity-analysis-item">
      <el-col :span="16" class="analysis-num">
        <ul style="height:65%; margin-top: 5vh;display:flex">
          <li class="analysis-num-content">
            <p >实际数量</p>
            <p class="num-normal">{{actualCount}}</p>
          </li>
          <li class="analysis-num-content num-border">
            <p>计划数量</p>
            <p class="num-normal">{{planCount}}</p>
          </li>
          <li class="analysis-num-content num-border">
            <p>差异数量</p>
            <p :class="differenceQuantity>0?'num-normal':'num-error'">{{differenceQuantity}}</p>
          </li>
        </ul>
      </el-col>
      <el-col :span="8" class="analysis-rate split-line">
        <div style="height:85%">
          <achive-rate id="achiveRateLine" :rate="rate" ></achive-rate>
        </div>
        <p style="text-align: center;color: #c3c4ca;">当日达成率</p>
      </el-col>
      <el-col :span="24" class="analysis-capaity" style="border-top: 0.4vh solid #0f0c2d">
        <v-title title="月度产能" titleHight="10%"></v-title>
        <select-radio v-model="dateType" :typeList="typeList" @change="radiochange"  style="margin-left:20px"></select-radio>
        <day-capacity id="daycapaityLine" style="height:85%" :capacityData="productivityTrendChart"  :dateList="dateList"></day-capacity>
      </el-col>
    </el-row>
  </board>
</template>

<script>
import board from '../board'
import achiveRate from './achiveRate'
import selectRadio from '../Componment/selectRadio'
import dayCapacity from './dayCapacity'

export default {
  data () {
    return {
      dateType: 0,
      actualCount: '',
      planCount: '',
      todayCompletionRate: '',
      productivityTrendChart: {},
      typeList: [{
        name: '周',
        value: 0
      },
      {
        name: '月',
        value: 1
      }],
      dateList: [],
      rate: 0
    }
  },
  computed: {
    differenceQuantity () {
      let { actualCount, planCount } = this
      return actualCount - planCount
    }
  },
  methods: {
    radiochange () {
      this.getVisualProductivity()
    },
    // 补上一个时间的数组
    createDateList () {
      let { dateType, date } = this
      this.dateList = []
      if (dateType === 0) {
        for (let i = 0; i < 12; i++) {
          this.dateList.unshift(this.$moment(date).subtract(i, 'days').format('YYYY-MM-DD'))
        }
      } else if (dateType === 1) {
        for (let i = 0; i < 12; i++) {
          const num = this.$moment(date).subtract(11 - i, 'weeks').isoWeek()
          const week = num < 10 ? `0${num}周` : `${num}周`
          this.dateList.push(week)
        }
      } else if (dateType === 2) {
        for (let i = 0; i < 12; i++) {
          this.dateList.unshift(this.$moment(date).subtract(i, 'months').format('YYYY/MM'))
        }
      }
    },
    // 获取数据
    async getVisualProductivity () {
      const lineId = this.$route.query.line
      let { dateType, date } = this
      const data = Object.assign({ dateType, lineId, date })
      let res = await this.$api.getVisualProductivity(data)
      this.createDateList()
      if (res.code === '200') {
        for (let i in res.data) {
          this[i] = res.data[i]
        }
        this.rate = Number(this.todayCompletionRate)
      } else {
        this.planCount = 0
        this.actualCount = 0
        this.rate = 0
        this.productivityTrendChart = {}
      }
    }
  },
  components: {
    board, achiveRate, selectRadio, dayCapacity
  },
  created () {
    this.date = '' || this.$route.query.date
    this.getVisualProductivity()
  }
}
</script>

<style lang="scss" scoped>
.capacity-analysis-item {
  height: 100%;
  width: 100%;

  .split-line {
    border-left: 0.15vw solid #14092d;
  }

  .analysis-num {
    height: 35%;

    .analysis-num-content {
      flex: 1;
      height: 100%;

      p {
        font-size: 1.3vw;
        color: #c3c4ca;
        line-height: 5vh;
        text-align: center;
      }

      .num-normal {
        font-size: 2.5vw;
        margin-top: 3vh;
        color: #40fff9;
      }

      .num-error {
        font-size: 2.5vw;
        margin-top: 3vh;
        color: #ff3273;
      }
    }

    .num-border {
      border-left: 1px solid #000;
    }
  }

  .analysis-rate {
    height: 35%;
  }

  .analysis-capaity {
    height: 65%;
  }
}
</style>
