<template>
  <div class="mes-main mes-main-common mes-workstation">
    <div class="main-common-head">
      <el-button type="primary" plain size="mini" icon="el-icon-lock" @click="holdHandle">锁定</el-button>
      <el-button type="primary" plain size="mini" icon="el-icon-search" @click="getHoldOrUnHoldRecord">查询</el-button>
    </div>
    <el-form :model="formData" ref="formData" :rules="rules" label-width="30%" label-position="left" class="el-row mes-form-rule">
      <el-form-item label="锁定编码" class="el-col el-col-11" prop="holdId">
        <el-input size="mini" placeholder="请在下方进行扫描"  v-model="formData.holdId" readonly clearable></el-input>
      </el-form-item>
      <el-form-item label="锁定范围类型" class="el-col el-col-11 el-col-offset-1" prop="holdScopeType">
        <dict-select v-model="formData.holdScopeType" dictType="HOLD_SCOPE_TYPE" clearable @change="holdScopeTypeChange" @option-click="setScopeType"></dict-select>
      </el-form-item>
      <el-form-item label="锁定类型" class="el-col el-col-11" prop="holdType">
        <dict-select v-model="formData.holdType" dictType="HOLD_TYPE" clearable @clear="holdTypeLabel=''" @option-click="setHoldType"></dict-select>
      </el-form-item>
      <el-form-item label="锁定范围" class="el-col el-col-11 el-col-offset-1" prop="holdScopeId">
        <el-input v-model="formData.holdScopeId" placeholder="请搜索" size="mini" readonly @focus="openScopeDialog">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="openScopeDialog"></i>
        </el-input>
      </el-form-item>
      <el-form-item label="锁定原因" class="el-col el-col-11" prop="holdReason">
        <dict-select  v-model="formData.holdReason" dictType="HOLD_REASON" clearable @change="holdReasonChange" @option-click="holdReasonClick"></dict-select>
      </el-form-item>
      <el-form-item label="锁定描述" class="el-col el-col-11 el-col-offset-1">
        <el-input size="mini" type="textarea" v-model="formData.holdDesc"></el-input>
      </el-form-item>
    </el-form>
    <station-logs logName="操作日志" recordName="Hold记录" :recordTableLabel="recordTableLabel" ref="logs"></station-logs>
    <scan-input :scanType="holdTypeLabel" @scan-code="scanCode"></scan-input>
    <el-dialog title="请选择" :visible.sync="dialogVisible" class="handle-dialog">
      <el-row style="padding-bottom:1vh;">
        <el-col :span="7">
          <el-input v-model="keyWord" :placeholder="searchPlaceholder" size="mini" @keydown.enter.native="getHoldScopeList">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="getHoldScopeList"></i>
          </el-input>
        </el-col>
      </el-row>
      <div style="padding:1vh 0; overflow: hidden;border-top:1px solid #d4d4d4;">
        <div class="mes-btn-group" style="float:left;">
          <el-button size="mini" type="primary" @click="dialogConfrim">确定</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" @click="dialogVisible = false">取消</el-button>
        </div>
        <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
          layout="total,sizes, prev, pager, next, jumper, ->" :total="total"
          @current-change="handleCurrentChange" @size-change="handleSizeChange" style="float:right;">
        </el-pagination>
      </div>
      <div class="mes-table">
        <el-table :data="tableData" border @selection-change="selectTable">
          <el-table-column type="selection" align="center"></el-table-column>
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column v-for="(col,i) in tableColumns" :key="i" :prop="col.key" :label="col.label" align="center"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/**
 * HOLD 逻辑
 * 如果是选择多个范围 数据库中需要插入多笔数据
 */
import stationLogs from '../../Production/DataAcquisition/Module/logs'
import scanInput from '../../Production/DataAcquisition/Module/scanInput'
export default {
  data () {
    return {
      formData: {
        holdId: '',
        holdType: '',
        holdScopeType: '',
        holdReason: '',
        holdScopeId: '',
        holdDesc: ''
      },
      rules: {
        holdId: [{ required: true, message: '请扫描锁定编码' }],
        holdType: [{ required: true, message: '请选择锁定类型' }],
        holdScopeType: [{ required: true, message: '请选择锁定范围类型' }],
        holdReason: [{ required: true, message: '请选择锁定原因' }],
        holdScopeId: [{ required: true, message: '请选择锁定范围' }]
      },
      holdTypeLabel: '',
      holdReasonLabel: '',
      holdTypes: [],
      recordTableLabel: [{
        key: 'holdId',
        label: '锁定编码'
      }, {
        key: 'holdTypeLabel',
        label: '锁定类型'
      }, {
        key: 'holdScopeLabel',
        label: '锁定范围'
      }, {
        key: 'holdReasonLabel',
        label: '锁定原因'
      }],
      scopeTypeName: '',
      dialogVisible: false,
      tableData: [],
      tableColumns: [],
      total: 0,
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      keyWord: '',
      searchPlaceholder: '请输入',
      recordList: [],
      selectList: [],
      pageDict: {
        pageSize: 100,
        pageIndex: 1,
        dictName: '',
        dictType: ''
      }
    }
  },
  watch: {
    scopeTypeName (val) {
      this.getHoldScopeList()
      if (val === '线别工站') {
        this.searchPlaceholder = '工站名称'
        this.tableColumns = [
          {
            label: '工站代码',
            key: 'lineStationCode'
          },
          {
            label: '工站名称',
            key: 'lineStationName'
          },
          {
            label: '线别',
            key: 'lineName'
          },
          {
            label: '制程名称',
            key: 'segName'
          }
        ]
      } else if (val === '制程') {
        this.searchPlaceholder = '制程代码'
        this.tableColumns = [
          {
            label: '制程代码',
            key: 'segCode'
          },
          {
            label: '制程名称',
            key: 'segName'
          },
          {
            label: '制程描述',
            key: 'defectReasonDesc'
          }
        ]
      }
    }
  },
  methods: {
    setHoldType (option) {
      this.holdTypeLabel = option.dictName
    },
    setScopeType (option) {
      this.scopeTypeName = option.dictName
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getHoldScopeList()
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getHoldScopeList()
    },
    holdScopeTypeChange () {
      this.formData.holdScopeId = ''
    },
    // 获取所有线别工站或制程
    async getHoldScopeList () {
      let { scopeTypeName, keyWord } = this
      let res
      if (scopeTypeName === '线别工站') {
        let data = Object.assign({ lineStationName: keyWord, mPomLineStationId: '' }, this.page)
        res = await this.$api.getLineStationByLike(data)
      } else if (scopeTypeName === '制程') {
        let data = Object.assign({ keyWord }, this.page)
        res = await this.$api.getProcess(data)
      }
      const { code, data } = res
      if (code === '200') {
        this.tableData = data.list
        this.total = data.totalNum || data.total_num
      }
    },
    selectTable (selection) {
      this.selectList = []
      let { scopeTypeName } = this
      if (scopeTypeName === '线别工站') {
        selection.map(item => {
          this.selectList.push({
            id: item.mPomLineStationId,
            name: item.lineStationName
          })
        })
      } else if (scopeTypeName === '制程') {
        selection.map(item => {
          this.selectList.push({
            id: item.mComProcessSegId,
            name: item.segName
          })
        })
      }
    },
    openScopeDialog () {
      let { holdScopeType } = this.formData
      if (holdScopeType) {
        this.dialogVisible = true
      } else {
        this.$message.warning('请先选择锁定范围类型！')
      }
    },
    dialogConfrim () {
      const { selectList } = this
      const len = selectList.length
      if (len > 0) {
        this.formData.holdScopeId = ''
        selectList.map(item => {
          if (len === 1) {
            this.formData.holdScopeId += `${item.name}`
          } else {
            this.formData.holdScopeId += `${item.name},`
          }
        })
        this.dialogVisible = false
      } else {
        this.$message.warning('未选择锁定范围')
      }
    },
    holdReasonChange (val) {
      if (!val) {
        this.holdReasonLabel = ''
      }
    },
    holdReasonClick (option) {
      this.holdReasonLabel = option.dictName
    },
    // 验证当前扫描编码是否有效 产品系列管理
    validCode () {
      this.$refs.formData.validate(async valid => {
        if (valid) {
          this.recordList = []
          const { holdTypeLabel, recordList } = this
          const { holdId } = this.formData
          // selectList.map(item => {
          //   this.recordList.push({
          //     holdId: formData.holdId,
          //     holdType: formData.holdType,
          //     holdTypeLabel,
          //     holdReasonLabel,
          //     holdScopeType: formData.holdScopeType,
          //     holdReason: formData.holdReason,
          //     holdScopeId: item.id,
          //     holdScopeLabel: item.name,
          //     holdDesc: formData.holdDesc
          //   })
          // })
          const data = { holdType: holdTypeLabel, holdId, recordList }
          const res = await this.$api.holdItem(data)
          if (res.code === '200') {
            const { logMsg, scanStatus } = res.data
            this.$refs.logs.createLogsInfo(holdId, scanStatus, logMsg)
            this.getHoldOrUnHoldRecord()
            // this.$refs.logs.recordList = recordList
          } else {
            this.$message.error(res.msg)
          }
        }
      })
    },
    scanCode (code) {
      this.formData.holdId = code
    },
    holdHandle () {
      this.validCode()
    },
    async getHoldOrUnHoldRecord () {
      let res = await this.$api.getHoldOrUnHoldRecord({
        ...this.formData,
        holdScopeId: this.selectList.length > 0 ? this.selectList.map(item => item.id) : null,
        type: '1'
      })
      if (res.code === '200') {
        this.$refs.logs.recordList = res.data && res.data.map(item => {
          return {
            holdId: item.id,
            holdTypeLabel: item.type,
            holdScopeLabel: item.scope,
            holdReasonLabel: item.reason
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
