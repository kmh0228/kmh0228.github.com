<template>
  <div>
    <el-form :model="dialogForm" ref="dialogForm" label-position="left" label-width="130px" class="el-row mes-form-rule" :rules="rules" size="mini">
      <el-form-item label="部门" prop="dept" class="el-col el-col-11">
        <el-input v-if="isEdit" v-model="officeName" disabled></el-input>
        <cascader-select v-else v-model="dialogForm.dept" type="2" placeholder="请选择部门" :disabled="isEdit" style="width:100%;"></cascader-select>
      </el-form-item>
      <el-form-item label="控制项名称" prop="itemCode" class="el-col el-col-11 el-col-offset-1">
        <el-input v-model="dialogForm.itemCode" placeholder="请输入控制项名称" :disabled="isEdit"></el-input>
      </el-form-item>
      <el-form-item label="控制项描述" prop="itemDesc" class="el-col el-col-23">
        <el-input type="textarea" v-model="dialogForm.itemDesc" placeholder="描述"></el-input>
      </el-form-item>
      <el-form-item label="料号" prop="mComMaterialId" class="el-col el-col-11">
        <el-input v-if="isEdit" v-model="materialNo" disabled></el-input>
        <material-select v-model="dialogForm.mComMaterialId" :materialNoVersion="materialNo" v-else style="width:100%" @select-change="setMaterialRev"></material-select>
      </el-form-item>
      <el-form-item label="料号版次" prop="materialRev" class="el-col el-col-11 el-col-offset-1">
        <el-input v-model="dialogForm.materialRev" placeholder="请输入料号版次"></el-input>
      </el-form-item>
      <el-form-item label="产品系列" prop="mComMaterialfamilyId" class="el-col el-col-11">
        <el-select v-model="dialogForm.mComMaterialfamilyId" clearable filterable style="width:100%">
          <el-option v-for="(option,i) in productList" :key="i" :label="option.mComMaterialfamilyName" :value="option.mComMaterialfamilyId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="量测站/实验室" prop="mSpcMeasurementStationId" class="el-col el-col-11 el-col-offset-1">
        <el-select v-model="dialogForm.mSpcMeasurementStationId" clearable filterable :disabled="isEdit" @change="getSpcInstrumentList" style="width:100%">
          <el-option v-for="(option,i) in measurementStationList" :key="i" :label="option.stationCode" :value="option.mSpcMeasurementStationId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="测量仪器" prop="mSpcMeasurementInstrumentId" class="el-col el-col-11">
        <el-select v-model="dialogForm.mSpcMeasurementInstrumentId" clearable filterable style="width:100%">
          <el-option v-for="(option,i) in measurementInstrumentList" :key="i" :label="option.instrumentName" :value="option.mSpcMeasurementInstrumentId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="线别" prop="mPomLineId" class="el-col el-col-11 el-col-offset-1">
        <el-select v-model="dialogForm.mPomLineId" clearable filterable style="width:100%">
          <el-option v-for="(option,i) in lineList" :key="i" :value="option.mPomLineId" :label="option.lineName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模穴号/零件位置" prop="moldCavityNo" class="el-col el-col-11">
        <el-input v-model="dialogForm.moldCavityNo" placeholder="请输入模穴号/零件位置" :disabled="isEdit"></el-input>
      </el-form-item>
      <el-form-item label="控制图" prop="controlChartType" class="el-col el-col-11 el-col-offset-1">
        <dict-select style="width:100%;" v-model="dialogForm.controlChartType" dictType="CONTROLCHART_TYPE" selectKey="dictCode" @change="controlChartTypeChange" clearable></dict-select>
      </el-form-item>
      <el-form-item prop="subgroupSize" class="el-col el-col-11">
        <div slot="label" style="display:inline-block;">
          <span>子组容量</span>
          <help-tips content="用于设置SPC控制图的样本大小" />
        </div>
        <el-input v-model="dialogForm.subgroupSize" placeholder="请输入子组容量" :disabled="isEdit"></el-input>
      </el-form-item>
      <el-form-item label="异常判定规则" prop="chartList" class="el-col el-col-11 el-col-offset-1">
        <el-button type="primary" @click="showAbnormalDialog(true)">异常判定规则</el-button>
      </el-form-item>
      <el-form-item label="Cpk目标值" prop="cpkTarget" class="el-col el-col-11">
        <el-input v-model="dialogForm.cpkTarget" placeholder="请输入Cpk目标值"></el-input>
      </el-form-item>
      <el-form-item label="USL" prop="usl" class="el-col el-col-11 el-col-offset-1">
        <el-input v-model="dialogForm.usl" placeholder="请输入USL"></el-input>
      </el-form-item>
      <el-form-item label="SL" prop="sl" class="el-col el-col-11">
        <el-input v-model="dialogForm.sl" placeholder="请输入SL"></el-input>
      </el-form-item>
      <el-form-item label="LSL" prop="lsl" class="el-col el-col-11 el-col-offset-1">
        <el-input v-model="dialogForm.lsl" placeholder="请输入LSL"></el-input>
      </el-form-item>
      <el-form-item label="接警设置" class="el-col el-col-11 el-row">
        <el-button type="primary" class="el-col el-col-18" @click="alarmDialog=true">接警设置</el-button>
        <el-checkbox v-model="isAlarm" class="el-col el-col-5 el-col-offset-1">不报警</el-checkbox>
      </el-form-item>
      <el-form-item label="控制阶段" prop="itemStatus" class="el-col el-col-11 el-col-offset-1">
        <el-radio-group v-model="dialogForm.itemStatus">
          <el-radio label="analysis">解析</el-radio>
          <el-radio label="control">管控</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-for="(item,i) in dialogForm.chartList" v-if="showControl">
        <el-form-item :key="`${i}_1`" :label="getControrItemLabel(item.chartType)+'-UCL'" class="el-col el-col-11" :class="{'el-col-offset-1':i%2===1}">
          <el-input v-model="dialogForm.chartList[i].ucl" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item :key="`${i}_2`" :label="getControrItemLabel(item.chartType)+'-CL'" class="el-col el-col-11" :class="{'el-col-offset-1':i%2===0}">
          <el-input v-model="dialogForm.chartList[i].cl" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item :key="`${i}_3`" :label="getControrItemLabel(item.chartType)+'-LCL'" class="el-col el-col-11" :class="{'el-col-offset-1':i%2===1}">
          <el-input v-model="dialogForm.chartList[i].lcl" placeholder="请输入"></el-input>
        </el-form-item>
      </template>
      <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
        <el-button type="primary" size="mini" @click="saveControlItem">保存</el-button>
        <el-button size="mini" @click="$emit('cannel')">取消</el-button>
      </el-form-item>
    </el-form>
    <!-- 异常判定规则 -->
    <el-dialog width="900px" title="异常判定规则" :visible.sync="abnormalDialog" append-to-body>
      <el-row class="mes-main-tabs" :gutter="20" v-if="abnormalDialog">
        <el-col v-for="(item,i) in dialogForm.chartList" :key="i" :span="dialogForm.chartList.length>1?12:24">
          <abnormal-one :chartType="item.chartType" :ref="'chart'+i" v-model="item.exceptionRule"></abnormal-one>
        </el-col>
      </el-row>
      <div style="text-align:center;">
        <el-button type="primary" @click="saveRule">确定</el-button>
        <el-button @click="abnormalDialog=false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 接警设置 -->
    <el-dialog width="900px" :title="alarmDialogTitle" :visible.sync="alarmDialog" top="10vh" append-to-body>
      <alarm-setting v-if="alarmDialog" :dialogForm="dialogForm" :alarmType="alarmType" @changeAlarmType="changeAlarmType" @cannel="alarmDialogCannel"></alarm-setting>
    </el-dialog>
  </div>
</template>

<script>
import materialSelect from '@/components/Module/materialSelect/materialSelect'
import abnormalOne from './abnormalOne'
import alarmSetting from './alarmSetting'
export default {
  data () {
    const subgroupSizeRule = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入子组容量'))
      } else {
        if (value > 0) {
          callback()
        } else {
          callback(new Error('子组容量必须为正整数'))
        }
      }
    }
    const cpkTargetRule = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入子Cpk目标值'))
      } else {
        if (value > 0) {
          callback()
        } else {
          callback(new Error('Cpk目标值必须大于0'))
        }
      }
    }
    const uslRule = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入USL'))
      } else {
        if (value > 0) {
          callback()
        } else {
          callback(new Error('USL必须大于0'))
        }
      }
    }
    const slRule = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入SL'))
      } else {
        if (value > 0) {
          callback()
        } else {
          callback(new Error('SL必须大于0'))
        }
      }
    }
    const lslRule = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入LSL'))
      } else {
        if (value > 0) {
          callback()
        } else {
          callback(new Error('LSL必须大于0'))
        }
      }
    }
    return {
      materialNo: '',
      officeName: '',
      dialogForm: {
        dept: '',
        itemCode: '',
        itemDesc: '',
        itemStatus: 'analysis',
        mComMaterialId: '',
        materialRev: '',
        mComMaterialfamilyId: '',
        mSpcMeasurementStationId: '',
        mSpcMeasurementInstrumentId: '',
        mPomLineId: '',
        moldCavityNo: '',
        controlChartType: '',
        subgroupSize: '',
        cpkTarget: 1.33,
        usl: '',
        sl: '',
        lsl: '',
        mSpcAlertId: '',
        chartList: [],
        notAlert: ''
      },
      rules: {
        dept: [{ required: true, message: '请选择部门' }],
        itemCode: [{ required: true, message: '请输入控制项名称' }],
        mComMaterialId: [{ required: true, message: '请选择料号' }],
        mSpcMeasurementStationId: [{ required: true, message: '请选择量测站/实验室' }],
        moldCavityNo: [{ required: true, message: '请输入模穴号/零件位置' }],
        controlChartType: [{ required: true, message: '请选择控制图' }],
        subgroupSize: [{ required: true, validator: subgroupSizeRule }],
        cpkTarget: [{ required: true, validator: cpkTargetRule }],
        usl: [{ required: true, validator: uslRule }],
        sl: [{ required: true, validator: slRule }],
        lsl: [{ required: true, validator: lslRule }],
        chartList: [{ required: true, message: '请选择异常判定规则' }]
      },
      measurementStationList: [],
      measurementInstrumentList: [],
      isAlarm: false,
      abnormalDialog: false,
      alarmDialog: false,
      alarmType: 'table'
    }
  },
  props: {
    isEdit: Boolean,
    isCopy: Boolean,
    productList: {
      type: Array,
      default: () => []
    },
    lineList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    showControl () {
      return this.dialogForm.itemStatus === 'control'
    },
    alarmDialogTitle () {
      return this.alarmType === 'table' ? '接警设置' : '新增接警设置'
    }
  },
  watch: {
    isAlarm (val) {
      if (!val) {
        this.dialogForm.mSpcAlertId = ''
      }
    }
  },
  methods: {
    async getMeasurementStation () {
      const params = { keyWord: '' }
      const res = await this.$api.getMeasurementStation(params)
      if (res.code === '200') {
        this.measurementStationList = res.data
      } else {
        this.measurementStationList = []
      }
    },
    async getSpcInstrumentList () {
      const { mSpcMeasurementStationId } = this.dialogForm
      this.dialogForm.mSpcMeasurementInstrumentId = ''
      const params = { mSpcMeasurementStationId, keywords: '' }
      const res = await this.$api.getSpcInstrumentList(params)
      const { code, data } = res
      if (code === '200') {
        this.measurementInstrumentList = data.list
      } else {
        this.measurementInstrumentList = []
      }
    },
    async showAbnormalDialog (isOpen = true) {
      const { controlChartType } = this.dialogForm
      if (controlChartType) {
        const { isEdit } = this
        if (isEdit) {
          const itemId = this.dialogForm.tSpcControlItemId
          const res = await this.$api.getSpcControlChartByItemId({ itemId })
          const { code, data } = res
          if (code === '200') {
            if (data.length > 0) {
              this.dialogForm.chartList = data
            }
          }
        }
        this.abnormalDialog = isOpen
      } else {
        this.$message.warning('请先选择控制图!')
      }
    },
    controlChartTypeChange (type) {
      this.setRuleList(type)
    },
    setRuleList (controlChartType) {
      if (controlChartType) {
        switch (controlChartType) {
          case 'XBar-R':
            this.dialogForm.chartList = [{
              chartType: 'XBar',
              exceptionRule: '',
              cl: '',
              lcl: '',
              ucl: ''
            }, {
              chartType: 'R',
              exceptionRule: '',
              cl: '',
              lcl: '',
              ucl: ''
            }]
            break
          case 'XBar-S':
            this.dialogForm.chartList = [{
              chartType: 'XBar',
              exceptionRule: '',
              cl: '',
              lcl: '',
              ucl: ''
            }, {
              chartType: 'S',
              exceptionRule: '',
              cl: '',
              lcl: '',
              ucl: ''
            }]
            break

          case 'I-MR':
            this.dialogForm.chartList = [{
              chartType: 'I',
              exceptionRule: '',
              cl: '',
              lcl: '',
              ucl: ''
            }, {
              chartType: 'MR',
              exceptionRule: '',
              cl: '',
              lcl: '',
              ucl: ''
            }]
            break
          default:
            this.dialogForm.chartList = []
            break
        }
      } else {
        this.dialogForm.chartList = []
      }
    },
    getControrItemLabel (value) {
      let label = null
      switch (value) {
        case 'XBar':
          label = 'X'
          break

        case 'R':
          label = 'R'
          break

        case 'S':
          label = 'S'
          break

        case 'I':
          label = 'I'
          break

        case 'MR':
          label = 'MR'
          break

        default:
          label = 'P'
          break
      }
      return label
    },
    saveRule () {
      const { chartList } = this.dialogForm
      chartList.forEach((list, index) => {
        this.$refs[`chart${index}`][0].emitNewValue()
      })
      this.abnormalDialog = false
    },
    setMaterialRev (material) {
      this.dialogForm.materialRev = material.version
    },
    changeAlarmType (type) {
      this.alarmType = type
    },
    alarmDialogCannel () {
      this.alarmDialog = false
    },
    saveControlItem () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          const { dialogForm, isCopy, isEdit, isAlarm } = this
          dialogForm.notAlert = isAlarm
          const res = isCopy || !isEdit ? await this.$api.addSpcControlItem(dialogForm) : await this.$api.editSpcControlItem(dialogForm)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getSpcControlItem')
          })
        }
      })
    }
  },
  created () {
    this.getSpcInstrumentList()
    this.getMeasurementStation()
  },
  components: { materialSelect, abnormalOne, alarmSetting }
}
</script>
