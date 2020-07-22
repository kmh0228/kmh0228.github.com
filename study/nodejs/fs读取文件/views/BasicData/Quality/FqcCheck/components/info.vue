<template>
  <el-tabs v-model="activeName" >
    <el-tab-pane label="基本资料" name="info">
      <el-form v-model="iqcInfo"  label-width="90px" label-position="left" class="el-row mes-form-rule" :rules="rules">
        <el-form-item label="入库单号" class="el-col el-col-7">
          <el-input size="mini" v-model="iqcInfo.batchNo" :disabled="userType !== 1"></el-input>
        </el-form-item>
        <el-form-item label="批号" class="el-col el-col-7 el-col-offset-1">
          <el-input size="mini" v-model="iqcInfo.lotNo" ></el-input>
        </el-form-item>
        <el-form-item label="料号" class="el-col el-col-7 el-col-offset-1">
           <material-select v-model="iqcInfo.materialNo" @change="handleData" v-if="userType === 1" style="width:100%"></material-select>
           <el-input disabled v-else v-model="iqcInfo.materialNo" placeholder="请输入数字"></el-input>
        </el-form-item>
          <el-form-item label="入库数量" class="el-col el-col-7">
          <el-input size="mini" v-model.number="iqcInfo.stockInQty" style="width:60%" ></el-input>
          <el-input style="width:35%;float:right" v-model="iqcInfo.qtyUom" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="客户" class="el-col el-col-7 el-col-offset-1">
          <el-input size="mini" v-model="iqcInfo.customer" ></el-input>
        </el-form-item>
          <el-form-item label="客户料号" class="el-col el-col-7 el-col-offset-1">
          <el-input size="mini" v-model="iqcInfo.custMaterialNo" ></el-input>
        </el-form-item>
        <el-form-item label="生产线别" class="el-col el-col-7">
           <el-select style="width:100%" size="mini" clearable placeholder="请选择线别"  v-model="infoData.mPomLineId">
            <el-option v-for="(option,i) in lineList" :key="i" :label="option.lineName" :value="option.mPomLineId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地点" class="el-col el-col-7 el-col-offset-1">
          <el-input size="mini" v-model="iqcInfo.location" ></el-input>
        </el-form-item>
        <el-form-item label="入库日期" class="el-col e l-col-7 el-col-offset-1">
          <el-date-picker  v-model="iqcInfo.stockInDate" type="date"  placeholder="选择日期" style="width:100%"></el-date-picker>
        </el-form-item>
        <el-form-item label="检验日期" class="el-col el-col-7">
          <el-date-picker  v-model="iqcInfo.inspectDate"  type="date"  placeholder="选择日期" style="width:100%"> </el-date-picker>
        </el-form-item>
        <el-form-item label="检验员" class="el-col el-col-7 el-col-offset-1">
           <el-select  v-model="iqcInfo.inspector" style="width:100%">
            <el-option v-for="(option,i) in userList" :key="i" :label="option.employeeName" :value="option.mComEmployeeId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import materialSelect from '@/components/Module/materialSelect/materialSelect'

export default {
  data () {
    return {
      activeName: 'info',
      infoData: {
        batchNo: '',
        stockInDate: '',
        materialNo: '',
        qtyUom: '',
        customer: '',
        custMaterialNo: '',
        mPomLineId: '',
        location: '',
        lotNo: '',
        inspectDate: '',
        inspector: ''
      },
      rules: {
        batchNo: [{ required: true, message: '请输入入库单号' }],
        materialNo: [{ required: true, message: '请选择料号' }],
        stockInQty: [{ required: true, message: '请输入入库数量' }],
        mPomLineId: [{ required: true, message: '请选择生产线别' }],
        inspectDate: [{ required: true, message: '请输入检验日期' }]
      },
      lineList: [],
      userList: []
    }
  },
  props: {
    iqcInfo: Object,
    userType: Number
  },
  methods: {
    setInfoData () {
      const keys = Object.keys(this.infoData)
      keys.forEach(key => {
        this.iqcInfo[key] = this.infoData[key]
      })
    },
    // 获取线别列表
    async getLineData () {
      let data = { lineName: '', lineType: '', pageIndex: 1, pageSize: 1000 }
      let res = await this.$api.getLineList(data)
      if (res.code === '200') {
        this.lineList = res.data.list
      }
    },
    // 获取人员信息
    async getUsers () {
      let data = {
        keyWords: '',
        pageSize: 1000,
        pageIndex: 1
      }
      const res = await this.$api.getEmployees(data)
      if (res.code === '200') {
        this.userList = res.data.list
      } else {
        this.userList = []
      }
    },
    async handleData () {
      let materialNo = this.iqcInfo.materialNo
      let res = await this.$api.getInspectContentByMaterialNo({ materialNo })
      if (res.code === '200') {
        this.iqcInfo.iqcTestDetailDtoList = res.data
      } else {
        this.iqcInfo.iqcTestDetailDtoList = []
      }
    }
  },
  created () {
    this.setInfoData()
    this.getUsers()
    this.getLineData()
  },
  components: {
    materialSelect
  }

}
</script>
