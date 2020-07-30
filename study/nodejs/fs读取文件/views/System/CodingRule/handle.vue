<template>
  <div class="mes-main mes-work-order mes-material">
    <h3 class="mes-main-title">{{handleName}}{{$t('CodingRule_Rule')}}</h3>
    <div class="mes-material-handle">
      <div class="mes-btn-group">
        <el-button type="primary" plain size="mini" @click="saveCodingRule">{{$t('common_save')}}</el-button>
        <el-button type="primary" plain size="mini" @click="closeCurrentPage">{{$t('common_cancel')}}</el-button>
      </div>
    </div>
    <el-form :model="formData" ref="codingForm" :rules="rules" label-width="8vw" label-position="left" class="el-row mes-form-rule">
      <el-form-item :label="$t('CodingRule_Name')" prop="mSeqName" class="el-col el-col-11">
        <el-input v-model.trim="formData.mSeqName" size="mini"></el-input>
      </el-form-item>
      <el-form-item :label="$t('CodingRule_BinaryEncoding')" prop="digitString" class="el-col el-col-11 el-col-offset-1">
        <el-input v-model.trim="formData.digitString" size="mini"></el-input>
      </el-form-item>
      <el-form-item :label="$t('CodingRule_FirstDay')" prop="firstDayOfWeek" class="el-col el-col-11">
        <el-select v-model="formData.firstDayOfWeek" :placeholder="$t('CodingRule_PleaseSelect')" style="width:100%" size="mini" clearable>
          <el-option v-for="(week,i) in weekList" :key="i" :value="week.value" :label="week.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('CodingRule_ResetType')" prop="resetType" class="el-col el-col-11 el-col-offset-1">
        <el-select v-model="formData.resetType" :placeholder="$t('CodingRule_PleaseSelect')" style="width:100%" size="mini" clearable>
          <el-option v-for="(list,i) in resetTypeList" :key="i" :value="list" :label="list"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('CodingRule_StartCode')" prop="minNo" class="el-col el-col-11">
        <el-input v-model="formData.minNo" size="mini"></el-input>
      </el-form-item>
      <el-form-item :label="$t('CodingRule_CutoffCode')" prop="maxNo" class="el-col el-col-11 el-col-offset-1">
        <el-input v-model="formData.maxNo" size="mini"></el-input>
      </el-form-item>
      <el-form-item :label="$t('CodingRule_Rule')" prop="description" class="el-col el-col-23" v-if="useType===2">
        <el-input v-model="formData.seqNoFormat" size="mini" disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('common_Description')" prop="description" class="el-col el-col-23">
        <el-input type="textarea" :rows="2" v-model="formData.description" size="mini"></el-input>
      </el-form-item>
    </el-form>
    <div class="mes-table" style="border:1px solid #d4d4d4;padding:1.5vh 0.5vw;border-radius:3px;">
      <h3>{{$t('CodingRule_RuleDetails')}}</h3>
      <div class="mes-table-handle" style="padding:1.5vh 0;">
        <el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="addCodingRuleRows">{{$t('CodingRule_AddRows')}}</el-button>
        <el-button type="primary" icon="el-icon-circle-close-outline" size="mini" @click="delCodingRuleRows">{{$t('common_Del')}}</el-button>
      </div>
      <div class="mes-table-content">
        <el-table :data="codingRuleList" size="mini" ref="codingTable" @selection-change="ruleSelectChange">
          <el-table-column type="selection" width="50" align="center"></el-table-column>
          <el-table-column type="index" :label="$t('CodingRule_ParameterNumber')" width="80" :index="indexMethod" align="center"></el-table-column>
          <el-table-column align="center" prop="type" :label="$t('CodingRule_ParameterType')">
            <template slot-scope="scope">
              <el-select v-model="scope.row.type" @change="changeParameterType(scope.row)" :placeholder="$t('CodingRule_selectType')" style="width:100%" size="mini" clearable>
                <el-option value="1" :label="$t('CodingRule_FixedValue')"></el-option>
                <el-option value="2" :label="$t('CodingRule_systemParameter')"></el-option>
                <el-option value="3" :label="$t('CodingRule_parameter')"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="values" :label="$t('CodingRule_parameterValues')">
            <template slot-scope="scope">
              <el-select v-model="scope.row.values" :placeholder="$t('CodingRule_selectParameterValues')" style="width:100%" size="mini" clearable v-if="scope.row.type === '2'">
                <el-option v-for="(item,i) in systemParameterList" :key="i" :value="item.value" :label="item.label">
                  <span style="float:left;">{{ item.label }}</span>
                  <span style="float:right;">{{ item.describe }}</span>
                </el-option>
              </el-select>
               <el-input v-model.trim="scope.row.values" size="mini" v-else></el-input>
            </template>
          </el-table-column>
           <el-table-column align="center" prop="values" :label="$t('common_Operate')">
            <template slot-scope="scope">
              <i class="el-icon-delete mes-table-handle-icon"  style="color:#F56C6C" @click="delCodingRuleRow(scope.$index)"></i>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formData: {
        mSeqName: '',
        digitString: '',
        firstDayOfWeek: '',
        resetType: '',
        minNo: '',
        maxNo: '',
        description: '',
        seqNoFormat: ''
      },
      weekList: [{
        label: this.$t('CodingRule_Monday'),
        value: 1
      }, {
        label: this.$t('CodingRule_Tuesday'),
        value: 2
      }, {
        label: this.$t('CodingRule_Wednesday'),
        value: 3
      }, {
        label: this.$t('CodingRule_Thursday'),
        value: 4
      }, {
        label: this.$t('CodingRule_Friday'),
        value: 5
      }, {
        label: this.$t('CodingRule_Saturday'),
        value: 6
      }, {
        label: this.$t('CodingRule_Sunday'),
        value: 7
      }],
      resetTypeList: ['NO_RESET', 'DAILY', 'WEEK'],
      systemParameterList: [{
        label: 'SEQ',
        value: '[SEQ]',
        describe: this.$t('CodingRule_serialNumber')
      }, {
        label: 'YYYY',
        value: '[YYYY]',
        describe: this.$t('CodingRule_Year')
      }, {
        label: 'MM',
        value: '[MM]',
        describe: this.$t('CodingRule_Months')
      }, {
        label: 'DD',
        value: '[DD]',
        describe: this.$t('CodingRule_Dates')
      }, {
        label: 'YY',
        value: '[YY]',
        describe: this.$t('CodingRule_LastTwoDigit')
      }, {
        label: 'M',
        value: '[M]',
        describe: this.$t('CodingRule_CurrentMonth')
      }, {
        label: 'D',
        value: '[D]',
        describe: this.$t('CodingRule_CurrentDate')
      }, {
        label: 'WW',
        value: '[WW]',
        describe: this.$t('CodingRule_CurrentWeek')
      }],
      codingRuleList: [],
      selectedList: []
    }
  },
  props: {
    useType: {
      type: Number
    }
  },
  computed: {
    handleName () {
      return this.useType === 1 ? this.$t('common_Add') : this.$t('common_Edit')
    },
    rules () {
      const minNoRule = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('CodingRule_startCode')))
        } else {
          callback()
        }
      }
      const maxNoRule = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('CodingRule_cutOffCode')))
        } else {
          let len1 = this.formData.minNo.length
          let len2 = value.length
          if (len1 !== len2) {
            callback(new Error(this.$t('CodingRule_MustBeConsistent')))
          } else {
            callback()
          }
        }
      }
      return {
        mSeqName: [{ required: true, message: this.$t('CodingRule_cannotbeempty') }],
        digitString: [{ required: true, message: this.$t('CodingRule_Binarybeempty') }],
        firstDayOfWeek: [{ required: true, message: this.$t('CodingRule_selectFirstDay') }],
        resetType: [{ required: true, message: this.$t('CodingRule_resetType') }],
        minNo: [{ required: true, validator: minNoRule, trigger: 'blur' }],
        maxNo: [{ required: true, validator: maxNoRule, trigger: 'blur' }]
      }
      // if (this.useType === 1) {
      //   return {
      //     mSeqName: [{ required: true, message: '编码名称不能为空' }],
      //     digitString: [{ required: true, message: '进制编码不能为空' }],
      //     firstDayOfWeek: [{ required: true, message: '请选择星期首日' }],
      //     resetType: [{ required: true, message: '请选择重置类型' }],
      //     minNo: [{ required: true, validator: minNoRule, trigger: 'blur' }],
      //     maxNo: [{ required: true, validator: maxNoRule, trigger: 'blur' }]
      //   }
      // } else {
      //   return {
      //     mSeqName: [{ required: true, message: '编码名称不能为空' }],
      //     digitString: [{ required: true, message: '进制编码不能为空' }],
      //     firstDayOfWeek: [{ required: true, message: '请选择星期首日' }],
      //     resetType: [{ required: true, message: '请选择重置类型' }],
      //     minNo: [{ required: true, validator: minNoRule, trigger: 'blur' }],
      //     maxNo: [{ required: true, validator: maxNoRule, trigger: 'blur' }]
      //   }
      // }
    },
    // 将编码规则明细列表转换成编码规则
    codingRuleStr () {
      let codingRuleList = this.codingRuleList
      let len = codingRuleList.length
      let str = ''
      codingRuleList.forEach((val, index) => {
        if (val.type === '1') {
          str += index === len - 1 ? val.values : `${val.values}|`
        } else if (val.type === '2') {
          str += index === len - 1 ? val.values : `${val.values}|`
        } else if (val.type === '3') {
          str += index === len - 1 ? `{${val.values}}` : `{${val.values}}|`
        }
      })
      return str
    }
  },
  methods: {
    indexMethod (index) {
      return index + 1
    },
    // 获取当前编辑的规则详情
    async getCurrentCodingRule () {
      let mSeqId = this.$route.query.seqid
      let res = await this.$api.getCodingRuleById({ mSeqId })
      this.formData = res.data
      this.codingRuleList = await this.codingRuleTurnTable()
    },
    // 规则添加行
    addCodingRuleRows () {
      let index = this.$dayjs().valueOf()
      this.codingRuleList.push({
        index,
        type: '',
        values: ''
      })
    },
    // 将编码规则转换成列表
    codingRuleTurnTable () {
      let seqNoFormat = this.formData.seqNoFormat
      let codingRuleList = []
      let list = seqNoFormat.split('|')
      let index = String(this.$dayjs().valueOf())
      let reg1 = /^\[(.+?)\]$/
      let reg2 = /^\{(.+?)\}$/
      list.forEach((val, i) => {
        if (reg1.test(val)) {
          codingRuleList.push({
            index: index + i,
            type: '2',
            values: val
          })
        } else if (reg2.test(val)) {
          let value = val.replace(/^\{/g, '')
          let values = value.replace(/\}$/g, '')
          codingRuleList.push({
            index: index + i,
            type: '3',
            values
          })
        } else {
          codingRuleList.push({
            index: index + i,
            type: '1',
            values: val
          })
        }
      })
      return codingRuleList
    },
    // 参数类型发生变化则重置参数值
    changeParameterType (row) {
      row.values = ''
    },
    ruleSelectChange (selection) {
      this.selectedList = []
      selection.forEach(val => {
        this.selectedList.push(val.index)
      })
    },
    // 删除多个规则
    delCodingRuleRows () {
      let { codingRuleList, selectedList } = this
      this.codingRuleList = codingRuleList.filter(item => {
        return selectedList.indexOf(item.index) === -1
      })
    },
    // 删除单个规则
    delCodingRuleRow (index) {
      this.codingRuleList.splice(index, 1)
    },
    /**
     * 验证添加编码规则是否符合规范
     * @return Boolean
     */
    verifyCodingRule () {
      let { codingRuleStr, codingRuleList } = this
      let len = codingRuleList.length
      if (len > 0) {
        if (codingRuleStr) {
          if (codingRuleStr.indexOf('[SEQ]') === -1) {
            this.$message.warning(this.$t('CodingRule_selectSerialNumber'))
            return false
          } else {
            return true
          }
        } else {
          this.$message.warning(this.$t('CodingRule_selectRulesDetails'))
          return false
        }
      } else {
        this.$message.warning(this.$t('CodingRule_addRuleDetails'))
        return false
      }
    },
    saveCodingRule () {
      this.$refs.codingForm.validate(async valid => {
        if (valid) {
          let ruleRes = this.verifyCodingRule()
          if (ruleRes) {
            this.formData.seqNoFormat = this.codingRuleStr
            let res
            if (this.useType === 1) {
              res = await this.$api.addCodingRule(this.formData)
            } else {
              let mSeqId = this.$route.query.seqid
              let data = Object.assign({ mSeqId }, this.formData)
              res = await this.$api.editCodingRule(data)
            }
            let { code, msg } = res
            if (code === '200') {
              this.$message.success(msg)
              this.closeCurrentPage()
            } else {
              this.$message.error(res.msg)
            }
          }
        }
      })
    },
    closeCurrentPage () {
      let title = this.$route.meta.title
      let data = { title, url: '/System/CodingRule' }
      this.$store.dispatch('closeCurrentPage', data)
    }
  },
  created () {
    if (this.useType === 2) {
      this.getCurrentCodingRule()
    }
  }
}
</script>
