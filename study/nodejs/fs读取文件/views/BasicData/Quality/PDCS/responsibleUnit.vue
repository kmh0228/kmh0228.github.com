<template>
  <div>
    <el-tabs :key="tabIndex" v-model="editableTabsValue" type="card" :editable="isEdit" @edit="handleTabsEdit">
      <el-tab-pane
        :key="item.name"
        v-for="(item, index) in editableTabs"
        :label="item.title"
        :name="item.name"
      >
        <el-form :model="item.content" :ref="'form' + index" :rules="rules" label-width="125px" label-position="left" class="el-row mes-form-rule"  style="margin-top:1.5vh"  size="mini">
          <el-form-item :label="$t('PDCS_RespoUnit')" prop="department" class="el-col el-col-7">
            <!-- <mes-select  v-model="item.content.department" method="getProductionUnit" labelKey="companyCode" valueKey="officeCode" @change="departmentChange" v-if="isEdit"></mes-select> -->
            <el-select  v-model="item.content.department" :filterable="true" :clearable="true" @change="departmentChange(item.content.department)"  v-if="isEdit">
              <el-option v-for="(option,i) in productionUnit" :key="i" :label="option.companyCode" :value="option.officeCode"></el-option>
            </el-select>
            <span v-else>{{item.content.departmentVn}}</span>
          </el-form-item>
          <el-form-item :label="$t('PDCS_RootCausAnal')" prop="primaryCause" class="el-col el-col-23 ">
            <el-input type="textarea" :rows="3" v-model="item.content.primaryCause" v-if="isEdit"></el-input>
            <span v-else>{{item.content.primaryCause}}</span>
          </el-form-item>
          <el-form-item :label="$t('PDCS_CorreAndPrevMeas')" prop="precaution" class="el-col el-col-23 ">
            <el-input type="textarea" :rows="3" v-model="item.content.precaution" v-if="isEdit"></el-input>
            <span v-else>{{item.content.precaution}}</span>
          </el-form-item>
          <el-form-item :label="$t('PDCS_effecDate')" prop="validDate" class="el-col el-col-11">
            <el-date-picker  v-model="item.content.validDate" type="date" :editable="false" :placeholder="$t('common_SelecDate')" style="width:100%" value-format="yyyy-MM-dd HH:mm:ss" v-if="isEdit"> </el-date-picker>
            <span v-else>{{item.content.validDate}}</span>
          </el-form-item>
          <el-form-item :label="$t('PDCS_ExpecCompDate')" prop="estimateDate" class="el-col el-col-11 el-col-offset-1">
            <el-date-picker  v-model="item.content.estimateDate" type="date" :editable="false" :placeholder="$t('common_SelecDate')" style="width:100%" value-format="yyyy-MM-dd HH:mm:ss" v-if="isEdit"> </el-date-picker>
            <span v-else>{{item.content.estimateDate}}</span>
          </el-form-item>
          <el-form-item :label="$t('PDCS_Agent')" prop="operator" class="el-col el-col-11">
            <!-- <mes-select v-model="item.content.operator" method="getPersonList" labelKey="userName" valueKey="userCode" v-if="isEdit"></mes-select> -->
            <el-select  v-model="item.content.operator" :filterable="true" :clearable="true"  style="width: 100%;"  v-if="isEdit">
              <el-option v-for="(option,i) in userList" :key="i" :label="option.userName" :value="option.userCode"></el-option>
            </el-select>
            <span v-else>{{item.content.operatorVn}}</span>
          </el-form-item>
          <el-form-item :label="$t('PDCS_exami')" prop="confirmer" class="el-col el-col-11 el-col-offset-1">
             <el-select  v-model="item.content.confirmer" :filterable="true" :clearable="true"  style="width: 100%;" v-if="isEdit">
              <el-option v-for="(option,i) in userList" :key="i" :label="option.userName" :value="option.userCode"></el-option>
            </el-select>
            <span v-else>{{item.content.confirmerVn}}</span>
          </el-form-item>
        </el-form>
      </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import mesSelect from '@/components/Module/Select/select'

export default {
  data () {
    return {
      productionUnit: [],
      editableTabsValue: '1',
      editableTabs: [],
      tabIndex: 0,
      rules: {
        department: [{ required: true, message: this.$t('PDCS_selecRespUnit') }],
        primaryCause: [{ required: true, message: this.$t('PDCS_enterRootCausAnal') }],
        precaution: [{ required: true, message: this.$t('PDCS_inputCorrAndPrevMeas') }],
        validDate: [{ required: true, message: this.$t('PDCS_selecEffeDate') }],
        estimateDate: [{ required: true, message: this.$t('PDCS_selecExpeCompDate') }],
        operator: [{ required: true, message: this.$t('PDCS_selecOper') }],
        confirmer: [{ required: true, message: this.$t('PDCS_selecAudi') }]
      }
    }
  },
  props: {
    isEdit: {
      type: Boolean,
      default: true
    },
    pdcsId: {
      type: String,
      default: ''
    },
    formData: {
      type: Array
    },
    userList: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    formData (n, o) {
      this.setForm(n)
    }
  },
  methods: {
    async handleTabsEdit (targetName, action) {
      if (action === 'add') {
        let { code, unitId } = await this.insertPdcsUnit()
        if (code === '200') {
          this.$message.success(this.$t('PDCS_AddedSucc'))
          let newTabName = ++this.tabIndex + ''
          this.editableTabs.push({
            title: this.$t('PDCS_RespoUnit') + (this.editableTabs.length + 1),
            name: newTabName,
            content: {
              pdcsUnitId: unitId,
              department: '',
              departmentVn: '',
              primaryCause: '',
              precaution: '',
              validDate: '',
              estimateDate: '',
              operator: '',
              operatorVn: '',
              confirmer: '',
              confirmerVn: ''
            }
          })
          this.editableTabsValue = newTabName
        }
      }
      if (action === 'remove') {
        let tabs = this.editableTabs
        if (tabs.length <= 1) {
          this.$message.warning(this.$t('PDCS_KeepAtLeasRespUnit'))
          return false
        }
        let activeName = this.editableTabsValue
        let confirm = await this.$myPrompt.confirm(this.$t('PDCS_AreYouSureUnitInfo'))
        if (confirm) {
          tabs.forEach(async (tab, index) => {
            if (tab.name === targetName) {
              // 删除责任单位
              let code = await this.deletePdcsUnit(tab.content)
              if (code === '200') {
                this.$message.success(this.$t('PDCS_DeletSucc'))
                let nextTab = tabs[index + 1] || tabs[index - 1]
                if (nextTab) {
                  activeName = nextTab.name
                }
                this.editableTabsValue = activeName
                this.editableTabs = tabs.filter(tab => tab.name !== targetName)
              }
            }
          })
        }
      }
    },
    async deletePdcsUnit (content, tabs) {
      let res = await this.$api.deletePdcsUnit([content.pdcsUnitId])
      return res.code
    },
    async insertPdcsUnit () {
      let res = await this.$api.insertPdcsUnit({ pdcsId: this.pdcsId })
      return {
        code: res.code,
        unitId: res.data ? res.data : ''
      }
    },
    async getProductionUnit () {
      let res = await this.$api.getProductionUnit()
      if (res.code === '200') {
        this.productionUnit = res.data
      }
    },
    departmentChange (department) {
      let obj = this.productionUnit.find(unit => unit.officeCode === department)
      if (obj) this.editableTabs[parseInt(this.editableTabsValue) - 1].title = obj.companyCode
    },
    // 获取表单数据
    getData () {
      return JSON.parse(JSON.stringify(this.editableTabs.map(item => item.content)))
    },
    // 数据验证
    checkData () {
      let flag = true
      this.editableTabs.forEach((item, i) => {
        this.$refs['form' + i][0].validate(valid => {
          if (!valid) {
            this.editableTabsValue = i + 1 + ''
            flag = false
          }
        })
      })
      return flag
    },
    // 重置表单
    resetFields () {
      this.editableTabs.forEach((item, i) => {
        this.$refs['form' + i][0].resetFields()
      })
    },
    // 设置表单数据
    setForm (arr = []) {
      if (arr.length > 0) {
        this.editableTabsValue = '1'
        this.editableTabs = []
        this.tabIndex = arr.length
        arr.forEach((item, i) => {
          Object.keys(item).forEach(key => {
            item[key] = item[key] || item[key] === 0 ? item[key] : ''
          })
          this.editableTabs.push({
            title: item.department ? item.department : this.$t('PDCS_RespoUnit') + (i + 1),
            name: i + 1 + '',
            content: { ...item }
          })
        })
      }
    }
  },
  components: {
    mesSelect
  },
  created () {
    this.getProductionUnit()
    this.formData && this.setForm(this.formData)
  }

}
</script>

<style lang="scss">
</style>
