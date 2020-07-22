<template>
  <el-form :model="iqcDialogForm" ref="iqcDialogForm" :rules="rules"  label-width="120px" label-position="left" class="el-row mes-form-rule" size="mini">
    <el-form-item label="检验项目" prop="inspectItem" class="el-col el-col-11 ">
      <el-input size="mini" v-model.trim="iqcDialogForm.inspectItem"></el-input>
    </el-form-item>
    <el-form-item label="项次" prop="sortNo" class="el-col el-col-11 el-col-offset-1">
      <el-input t size="mini" v-model.number="iqcDialogForm.sortNo" placeholder="请输入数字类型" @blur="checkNumber(iqcDialogForm.sortNo)"></el-input>
    </el-form-item>
    <el-form-item label="图位" prop="locationContent" class="el-col el-col-11">
      <el-input size="mini" v-model.trim="iqcDialogForm.locationContent"></el-input>
    </el-form-item>
    <el-form-item label="检验内容" prop="inspectContent" class="el-col el-col-23">
      <el-input type="textarea" :rows="3"  v-model="iqcDialogForm.inspectContent" placeholder="请输入1000字以内"></el-input>
    </el-form-item>
    <el-form-item label="检验工具" prop="inspectTool" class="el-col el-col-11">
      <el-input size="mini"  v-model.trim="iqcDialogForm.inspectTool"></el-input>
    </el-form-item>
    <el-form-item label="检验频率" prop="frequency"  class="el-col el-col-11 el-col-offset-1">
      <el-input size="mini" style="width:50%"  v-model.trim="iqcDialogForm.frequency"></el-input>
      <el-select style="width:40%;margin-left:7%" v-model="iqcDialogForm.frequencyUom">
        <el-option v-for="(option,i) in frequencyUomList" :key="i" :label="option" :value="option"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="需要检验规格" class="el-col el-col-11">
      <el-checkbox v-model="checked" ></el-checkbox>
    </el-form-item>
    <el-form-item label="检验方法" prop="inspectMethod"  class="el-col el-col-11 el-col-offset-1">
      <el-input   v-model.trim="iqcDialogForm.inspectMethod"></el-input>
    </el-form-item>
    <div v-show="checked">
      <el-form-item label="检验规格详情" prop="spec" class="el-col el-col-11 ">
        <el-input  v-model="iqcDialogForm.spec" ></el-input>
      </el-form-item>
      <el-form-item label="规格单位" prop="specUom" class="el-col el-col-11 el-col-offset-1">
        <el-input  v-model.trim="iqcDialogForm.specUom"></el-input>
      </el-form-item>
      <el-form-item label="规格下限" prop="minValue" class="el-col el-col-11">
        <el-input v-model="iqcDialogForm.minValue" placeholder="请输入数字" @blur="checkNumber(iqcDialogForm.minValue)"></el-input>
      </el-form-item>
      <el-form-item label="规格上限" prop="maxValue" class="el-col el-col-11 el-col-offset-1" >
        <el-input v-model="iqcDialogForm.maxValue" placeholder="请输入数字" @blur="checkValue(iqcDialogForm.maxValue)"></el-input>
      </el-form-item>
    </div>
    <el-form-item label="缺陷类别" prop="defectClass" class="el-col el-col-24" >
      <div slot="label">
        <span>缺陷类别</span>
        <help-tips content="CR是致命缺陷 MA是严重缺陷 MI是轻微缺陷" />
      </div>
      <el-radio-group v-model="iqcDialogForm.defectClass">
        <el-radio label="CR">CR</el-radio>
        <el-radio label="MA">MA</el-radio>
        <el-radio label="MI">MI</el-radio>
        <el-radio label="">空</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="检验类别" class="el-col el-col-24" >
      <el-checkbox-group v-model="checkedInspect" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="option in inspectTypes" :label="option.value" :key="option.value">{{option.label}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveForm">保存</el-button>
      <el-button size="mini" @click="$emit('cannelIqc')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      checked: true,
      inspectTypes: [
        {
          label: '进料',
          value: 'iqc'
        },
        {
          label: '首检',
          value: 'fai'
        },
        {
          label: '巡回',
          value: 'tour'
        },
        {
          label: '入库',
          value: 'fqc'
        },
        {
          label: '库存重检',
          value: 'ric'
        }
      ],
      frequencyUomList: ['月', '周', '日'],
      checkedInspect: [],
      iqcDialogForm: {
        inspectItem: '',
        sortNo: '',
        locationContent: '',
        inspectContent: '',
        inspectMethod: '',
        inspectTool: '',
        frequency: '',
        frequencyUom: '',
        spec: '',
        specUom: '',
        maxValue: '',
        minValue: '',
        defectClass: '',
        iqc: false,
        fai: false,
        tour: false,
        fqc: false,
        ric: false
      },
      rules: {
        inspectItem: [{ required: true, message: '请填写检规项目' }],
        inspectContent: [{ required: true, message: '请填写检验内容' }]
      },
      isNumber: true
    }
  },
  props: {
    cannelIqc: {
      type: Function
    },
    onMQomSipMainId: {
      type: String
    },
    findItemList: {
      type: Function
    },
    isEditIqc: {
      type: Boolean
    }

  },
  methods: {
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
    checkValue (value) {
      this.checkNumber(value)
      if (this.isNumber) {
        let { maxValue, minValue } = this.iqcDialogForm
        if (Number(minValue) > Number(maxValue)) {
          this.$message.warning('下限值不能超过上限值')
          this.isNumber = false
        }
      }
    },
    handleCheckedCitiesChange () {

    },
    saveForm () {
      this.$refs.iqcDialogForm.validate(async valid => {
        if (valid) {
          let { checkedInspect, iqcDialogForm, onMQomSipMainId, isNumber } = this
          if (isNumber) {
            iqcDialogForm.iqc = false
            iqcDialogForm.fai = false
            iqcDialogForm.tour = false
            iqcDialogForm.fqc = false
            iqcDialogForm.ric = false
            if (iqcDialogForm.spec === '' || iqcDialogForm.spec === null) {
              iqcDialogForm.spec = 0
            }
            if (iqcDialogForm.minValue === '' || iqcDialogForm.minValue === null) {
              iqcDialogForm.minValue = 0
            }
            if (iqcDialogForm.maxValue === '' || iqcDialogForm.maxValue === null) {
              iqcDialogForm.maxValue = 0
            }
            let array = checkedInspect
            array.map(item => {
              iqcDialogForm[item] = true
            })
            let mqomSipMainId = onMQomSipMainId
            let data = Object.assign({ mqomSipMainId }, iqcDialogForm)
            let res = this.isEditIqc ? await this.$api.updateItem(data) : await this.$api.addQomSipItem(data)
            this.$myPrompt.handleMsg(res, () => {
              this.$emit('cannelIqc')
              this.$emit('findItemList')
            })
          }
        }
      })
    }
  },
  created () {
  }
}
</script>
