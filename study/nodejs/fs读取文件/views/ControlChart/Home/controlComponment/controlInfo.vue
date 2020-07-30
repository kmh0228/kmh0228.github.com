<template>
  <el-form :model="infoDataFrom" ref="infoFrom" label-position="left"  label-width="180px" class="el-row mes-form-rule" :rules="rules" size="mini">
    <el-form-item :label="$t('common_Department')" prop="mPomLineId" :class="elClass">
      <el-input  v-model="infoDataFrom.officeName" style="width:100%"  disabled ></el-input>
    </el-form-item>
    <el-form-item :label="$t('conChartHome_measLabo')"  :class="otherClass">
     <el-input  v-model="infoDataFrom.stationCode" style="width:100%"  disabled></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_ContrName')" :class="otherClass">
      <el-input  v-model="infoDataFrom.itemCode" style="width:100%"  disabled></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_MeasuInst')" prop="mPomLineId" :class="elClass">
      <el-input  v-model="infoDataFrom.instrumentName" style="width:100%"  disabled></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_ContrDesc')" :class="otherClass">
     <el-input  v-model="infoDataFrom.itemDesc" style="width:100%"  disabled></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_Line')" :class="otherClass">
      <el-input  v-model="infoDataFrom.lineCode" style="width:100%"  disabled></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_PorN')" prop="mPomLineId" :class="elClass">
      <el-input  v-model="infoDataFrom.materialNo" style="width:100%"  disabled></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_MouldHoleNumb')" :class="otherClass">
     <el-input  v-model="infoDataFrom.moldCavityNo" style="width:100%"  disabled></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_ItemNoRev')" :class="otherClass">
      <el-input  v-model="infoDataFrom.materialRev" style="width:100%"  disabled></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_ContrChar')" prop="mPomLineId" :class="elClass">
      <el-input  v-model="infoDataFrom.controlChartType" style="width:100%"  disabled></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_ProduSeries')" :class="otherClass">
     <el-input  v-model="infoDataFrom.materialfamilyCode" style="width:100%"  disabled></el-input>
    </el-form-item>
    <el-form-item :label="$t('conChartHome_ContrPhas')" :class="otherClass">
      <el-input  v-model="infoDataFrom.itemStatusName" style="width:100%"  disabled></el-input>
    </el-form-item>
    <el-form-item label="$t('conChartHome_cpkValue')" prop="mPomLineId" :class="elClass">
      <el-input  v-model="infoDataFrom.cpkTarget" style="width:100%"  disabled></el-input>
    </el-form-item>
    <el-form-item :label="$t('conChartHome_SubgrCapa')" :class="otherClass">
     <el-input  v-model="infoDataFrom.subgroupSize" style="width:100%"  disabled></el-input>
    </el-form-item>
    <el-form-item :label="$t('conChartHome_NumbeSubg')" :class="otherClass">
      <el-input  v-model="infoDataFrom.location" style="width:100%"  disabled></el-input>
    </el-form-item>
    <el-form-item label="" prop="mPomLineId" :class="elClass">
      <el-button v-if="hiddenButton" type="primary" style="width:100%" @click="showAbnormalDialog">{{$t('conChartHome_AbnorJudgRule')}}</el-button>
    </el-form-item>
    <el-dialog width="800px" :title="$t('conChartHome_AbnorJudgRule')" :visible.sync="abnormalDialog" append-to-body>
      <el-row class="mes-main-tabs" :gutter="20" v-if="abnormalDialog">
        <el-col v-for="(item,i) in chartList" :key="i" :span="chartList.length>1?12:24">
          <abnormal-one :chartType="item.chartType" :ref="'chart'+i" v-model="item.exceptionRule"></abnormal-one>
        </el-col>
      </el-row>
      <div style="text-align:center;">
        <el-button @click="abnormalDialog=false">{{$t('common_cancel')}}</el-button>
      </div>
    </el-dialog>
  </el-form>
</template>

<script>
import abnormalOne from '@/views/BasicData/Spc/ControltermManage/abnormalOne'
export default {
  data () {
    return {
      infoDataFrom: {
        officeName: '',
        stationCode: '',
        itemCode: '',
        instrumentName: '',
        itemDesc: '',
        lineCode: '',
        materialNo: '',
        moldCavityNo: '',
        materialRev: '',
        controlChartType: '',
        materialfamilyCode: '',
        location: '',
        cpkTarget: '',
        subgroupSize: ''
      },
      abnormalDialog: false,
      chartList: [],
      rules: {

      }
    }
  },
  computed: {
    elClass () {
      let { len } = this
      return len > 1 ? 'el-col el-col-23' : 'el-col el-col-7'
    },
    otherClass () {
      let { len } = this
      return len > 1 ? 'el-col el-col-23' : 'el-col el-col-7 el-col el-col-offset-1'
    }
  },
  props: {
    tSpcControlItemId: {
      type: String
    },
    hiddenButton: {
      type: Boolean,
      default: true
    },
    len: {
      type: Number
    }
  },
  methods: {
    async showAbnormalDialog () {
      const itemId = this.tSpcControlItemId
      const res = await this.$api.getSpcControlChartByItemId({ itemId })
      const { code, data } = res
      if (code === '200') {
        if (data.length > 0) {
          this.chartList = data
        }
      }
      this.abnormalDialog = true
    },
    setDefaultData () {
    }
  },

  components: {
    abnormalOne
  },
  created () {
    this.setDefaultData()
  }
}
</script>
