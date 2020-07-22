<template>
  <div class="mes-table-content" >
      <el-table :data="templateData" size="mini" border>
        <el-table-column type="index" label="序号" align="center" ></el-table-column>
        <el-table-column prop=""  align="center" label="时间类型">
          <template slot-scope="scope">
            <el-select v-model="scope.row.workTimeType">
              <el-option v-for="(option,i) in workTimeTypeList" :key="i" :label="option.dictCode" :value="option.mDataDictId" @click.native="addisProduction(scope.$index,option.isProductionTime)"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column  align="center" label="开始时间" width="250">
            <template slot-scope="scope">
              <el-time-select v-model="scope.row.beginTime"  :picker-options="{ start: startTime(scope.$index),  step: '00:30',  end: '24:00'}" placeholder="选择时间" ></el-time-select>
            </template>
        </el-table-column>
        <el-table-column  align="center" label="时长">
          <template slot-scope="scope">
            <el-input v-model="scope.row.timeLength" @blur="checkNumber(scope.row.timeLength)"></el-input>
          </template>
        </el-table-column>
        <el-table-column  align="center" label="操作">
          <template slot-scope="scope">
            <i class="el-icon-delete" style="color:#f56c6c;font-size:20px" @click="deleteMachine(scope.$index)"></i>
          </template>
        </el-table-column>
      </el-table>
      <el-button style="margin-top:0.5vh" @click="addTableColumn">添加</el-button>
      <span style="float:right;line-height:3;margin:0 1vw">非工作时长 <span style="color:#F56C6C">{{noWorkTime}}</span> H</span>
      <span style="float:right;line-height:3">工作时长 <span style="color:aqua">{{workTime}}</span> H</span>

    </div>
</template>

<script>
export default {
  data () {
    return {
      templateData: [{ beginTime: '', timeLength: '', endTime: '', workTimeType: '' }],
      workTimeTypeList: [],
      isNumber: true
    }
  },
  computed: {
    workTime () {
      let restTime = 0
      let allTime = 0
      this.templateData.forEach(item => {
        if (!item.isProductionTime) {
          restTime += Number(item.timeLength)
        }
        allTime += Number(item.timeLength)
      })
      return allTime - restTime
    },
    noWorkTime () {
      let restTime = 0
      this.templateData.forEach(item => {
        if (!item.isProductionTime) {
          restTime += Number(item.timeLength)
        }
      })
      return restTime
    }

  },
  methods: {
    async deleteMachine (index) {
      let confirm = await this.$myPrompt.confirm('删除后是否自动调整时间')
      if (confirm) {
        if (index === this.templateData.length - 1) {
          this.templateData.splice(index, 1)
        } else {
          let time = this.templateData[index].beginTime
          let number = this.templateData[index].timeLength
          let number1 = this.templateData[index + 1].timeLength
          this.templateData.splice(index, 1)
          this.templateData[index].beginTime = time
          this.templateData[index].timeLength = number + number1
        }
      } else {
        if (index === this.templateData.length - 1 || index === 0) {
          this.editStatus = false
          this.templateData.splice(index, 1)
        } else {
          let time = this.templateData[index + 1].beginTime
          this.templateData.splice(index, 1)
          this.templateData[index].beginTime = time
          this.editStatus = true
        }
      }
    },
    checkNumber (value) {
      if (value) {
        let r = /^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*))$/
        if (r.test(Number(value))) {
          this.isNumber = true
        } else {
          this.isNumber = false
          this.$message.warning('请重新输入非负数  且保留两位小数')
        }
      }
    },
    addTableColumn () {
      if (this.isNumber) {
        this.templateData.push({
          beginTime: '',
          timeLength: '',
          endTime: '',
          workTimeType: ''
        })
      } else {
        this.$message.warning('请处理错误时间')
      }
    },
    async getDefaultTimeList () {
      let data1 = {
        detailKeywords: '',
        dictType: 'PRODUCTION_TIME_TYPE',
        pageIndex: 1,
        pageSize: 1000
      }
      let res1 = await this.$api.getDictionaryDetail(data1)
      let arr1 = res1.data.list
      arr1.map(item => {
        item.isProductionTime = true
      })
      let data2 = {
        detailKeywords: '',
        dictType: 'NO_PRODUCT_DATE_TYPE',
        pageIndex: 1,
        pageSize: 1000
      }
      let res2 = await this.$api.getDictionaryDetail(data2)
      let arr2 = res2.data.list
      arr2.map(item => {
        item.isProductionTime = false
      })
      this.workTimeTypeList = [...arr1, ...arr2]
    },
    addisProduction (i, isProductionTime) {
      this.templateData[i].isProductionTime = isProductionTime
    },
    startTime (i) {
      let res
      let templateData = this.$dayjs().format('YYYY-MM-DD')
      if (i === 0) {
        res = '00:00'
      } else {
        let num = this.templateData[i - 1].timeLength
        let data = `${templateData} ${this.templateData[i - 1].beginTime}`
        if (num) {
          let new1 = this.$dayjs(data).add(num, 'hour')
          res = this.$dayjs(new1).format('HH:mm')
        }
        if (!this.editStatus) {
          this.templateData[i].beginTime = res
        }
      }
      if (this.templateData[i].timeLength) {
        let num2 = this.templateData[i].timeLength
        let data2 = `${templateData} ${this.templateData[i].beginTime}`
        if (num2) {
          let new1 = this.$dayjs(data2).add(num2, 'hour')
          res = this.$dayjs(new1).format('HH:mm')
        }
        if (!this.editStatus) {
          this.templateData[i].endTime = res
        }
      }
      return res
    }
  },
  created () {
    this.getDefaultTimeList()
  }

}
</script>
