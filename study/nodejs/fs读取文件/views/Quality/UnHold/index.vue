<template>
  <div class="mes-main mes-main-common mes-workstation">
    <div class="main-common-head">
      <el-button type="primary" plain size="mini" icon="el-icon-unlock" @click="unHoldHandle">解锁</el-button>
      <el-button type="primary" plain size="mini" icon="el-icon-search" @click="getHoldOrUnHoldRecord">查询</el-button>
    </div>
    <el-form :model="formData" ref="formData" :rules="rules" label-width="30%" label-position="left" class="el-row mes-form-rule">
      <el-form-item label="解锁编码" class="el-col el-col-11" prop="holdId">
        <el-input size="mini" placeholder="请在下方进行扫描"  v-model="formData.holdId" readonly></el-input>
      </el-form-item>
      <el-form-item label="解锁范围类型" class="el-col el-col-11 el-col-offset-1" prop="holdScopeType">
        <dict-select v-model="formData.holdScopeType" dictType="HOLD_SCOPE_TYPE" @option-click="setScopeType"></dict-select>
      </el-form-item>
      <el-form-item label="解锁类型" class="el-col el-col-11" prop="holdType">
        <dict-select v-model="formData.holdType" dictType="HOLD_TYPE" @change="holdTypeChange" @option-click="holdTypeClick"></dict-select>
      </el-form-item>
      <el-form-item label="解锁范围" class="el-col el-col-11 el-col-offset-1" prop="holdScopeId">
        <el-select style="width:100%;" clearable v-model="formData.holdScopeId" :no-data-text="holdScopeText" size="mini">
          <el-option v-for="(option,i) in holdScopes" :key="i" :label="option.holdScope" :value="option.holdScope"  @click.native="setHoldMainId(option.tPomHoldId)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="解锁原因" class="el-col el-col-11" prop="unHoldReason">
        <dict-select  v-model="formData.unHoldReason" dictType="UNHOLD_REASON" clearable @change="unHoldReasonChange" @option-click="unHoldReasonClick"></dict-select>
      </el-form-item>
      <el-form-item label="解锁描述" class="el-col el-col-11 el-col-offset-1">
        <el-input size="mini" type="textarea" v-model="formData.unHoldDesc"></el-input>
      </el-form-item>
    </el-form>
    <station-logs logName="操作日志" recordName="UnHold记录" :recordTableLabel="recordTableLabel" ref="logs"></station-logs>
    <scan-input :scanType="holdType" @scan-code="scanCode"></scan-input>
 </div>
</template>

<script>
import stationLogs from '../../Production/DataAcquisition/Module/logs'
import scanInput from '../../Production/DataAcquisition/Module/scanInput'
export default {
  data () {
    return {
      formData: {
        tPomHoldId: null,
        holdId: '',
        holdType: '',
        holdScopeType: '',
        unHoldReason: '',
        holdScopeId: '',
        unHoldDesc: ''
      },
      rules: {
        holdId: [{ required: true, message: '解锁编码不能为空' }],
        holdType: [{ required: true, message: '请选择解锁类型' }],
        holdScopeType: [{ required: true, message: '请选择解锁范围类型' }],
        unHoldReason: [{ required: true, message: '请选择解锁原因' }],
        holdScopeId: [{ required: true, message: '请选择解锁范围' }]
      },
      holdType: '',
      holdScopes: [],
      unHoldReason: '',
      recordTableLabel: [
        {
          key: 'holdId',
          label: '解锁编码'
        }, {
          key: 'holdType',
          label: '解锁类型'
        }, {
          key: 'holdScopeId',
          label: '解锁范围'
        }, {
          key: 'unHoldReason',
          label: '解锁原因'
        }
      ],
      holdScopeTypeName: ''
    }
  },
  computed: {
    holdScopeText () {
      let { holdId, holdScopeType } = this.formData
      if (holdId && holdScopeType) {
        return '解锁编码在当前解锁范围类型下暂无数据！ '
      } else {
        return '请先扫描解锁编码，并选择解锁范围！'
      }
    }
  },
  watch: {
    holdScopes: {
      handler (val) {
        this.formData.tPomHoldId = null
      },
      deep: true
    }
  },
  methods: {
    // 获取解锁范围
    async getHoldScopes () {
      let { holdId, holdScopeType } = this.formData
      let { holdScopeTypeName } = this
      let data = { holdId, holdScopeType, holdScopeTypeName }
      let res = await this.$api.getHoldScopes(data)
      if (res.code === '200') {
        this.holdScopes = res.data
        this.formData.holdScopeId = ''
      } else {
        this.holdScopes = []
      }
    },
    setScopeType (option) {
      this.holdScopeTypeName = option.dictName
      this.getHoldScopes()
    },
    holdTypeChange (val) {
      this.getHoldScopes()
      if (!val) {
        this.holdType = ''
      }
    },
    holdTypeClick (option) {
      this.holdType = option.dictName
    },
    unHoldReasonChange (val) {
      if (!val) {
        this.unHoldReason = ''
      }
    },
    unHoldReasonClick (option) {
      this.unHoldReason = option.dictName
    },
    // 设置hold主id
    setHoldMainId (id) {
      this.formData.tPomHoldId = id
    },
    scanCode (code) {
      this.formData.holdId = code
      let { holdId, holdScopeType } = this.formData
      if (holdId && holdScopeType) {
        this.getHoldScopes()
      } else {
        this.holdScopes = []
        this.formData.tPomHoldId = null
        this.formData.holdScopeId = ''
      }
    },
    unHoldHandle () {
      this.$refs.formData.validate(async valid => {
        if (valid) {
          let { holdId, tPomHoldId, unHoldDesc, unHoldReason } = this.formData
          let data = { tPomHoldId, unHoldDesc, unHoldReason }
          let res = await this.$api.unHoldItem(data)
          if (res.code === '200') {
            let { logMsg, scanStatus } = res.data
            this.$refs.logs.createLogsInfo(holdId, scanStatus, logMsg)
            // this.$refs.logs.recordList.push({
            //   holdId,
            //   holdType: this.holdType,
            //   unHoldReason: this.unHoldReason,
            //   holdScopeId
            // })
            this.getHoldOrUnHoldRecord()
            this.getHoldScopes()
          } else {
            this.$message.error(res.msg)
          }
        }
      })
    },
    async getHoldOrUnHoldRecord () {
      let { unHoldReason, unHoldDesc } = this.formData
      let res = await this.$api.getHoldOrUnHoldRecord({
        ...this.formData,
        holdReason: unHoldReason,
        holdDesc: unHoldDesc,
        holdScopeId: null,
        type: '0'
      })
      if (res.code === '200') {
        this.$refs.logs.recordList = res.data && res.data.map(item => {
          return {
            holdId: item.id,
            holdType: item.type,
            holdScopeId: item.scope,
            unHoldReason: item.reason
          }
        })
      }
    }
  },
  created () {
    this.getHoldOrUnHoldRecord()
  },
  components: {
    stationLogs, scanInput
  }
}
</script>
