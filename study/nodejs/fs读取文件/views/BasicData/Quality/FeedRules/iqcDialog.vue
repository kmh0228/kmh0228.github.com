<template>
  <el-form :model="iqcDialogForm" ref="iqcDialogForm" :rules="rules"  label-width="130px" label-position="left" class="el-row mes-form-rule" size="mini">
    <el-form-item :label="$t('common_InspeItem')" prop="inspectItem" class="el-col el-col-11 ">
      <el-input size="mini" v-model.trim="iqcDialogForm.inspectItem"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_item')" prop="sortNo" class="el-col el-col-11 el-col-offset-1">
      <el-input t size="mini" v-model.number="iqcDialogForm.sortNo" :placeholder="$t('feedRules_PleasEnteNumbTy')" @blur="checkNumber(iqcDialogForm.sortNo)"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_MapLoca')" prop="locationContent" class="el-col el-col-11">
      <el-input size="mini" v-model.trim="iqcDialogForm.locationContent"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_InspeCont')" prop="inspectContent" class="el-col el-col-23">
      <el-input type="textarea" :rows="3"  v-model="iqcDialogForm.inspectContent" :placeholder="$t('feedRules_WithiWord1000')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('feedRules_InspeTool')" prop="inspectTool" class="el-col el-col-11">
      <el-input size="mini"  v-model.trim="iqcDialogForm.inspectTool"></el-input>
    </el-form-item>
    <el-form-item :label="$t('feedRules_InspeFreq')" prop="frequency"  class="el-col el-col-11 el-col-offset-1">
      <el-input size="mini" style="width:50%"  v-model.trim="iqcDialogForm.frequency"></el-input>
      <el-select style="width:40%;margin-left:7%" v-model="iqcDialogForm.frequencyUom">
        <el-option v-for="(option,i) in frequencyUomList" :key="i" :label="option" :value="option"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('feedRules_SpeciNeedBeInsp')" class="el-col el-col-11">
      <el-checkbox v-model="checked" ></el-checkbox>
    </el-form-item>
    <el-form-item :label="$t('feedRules_TestMeth')" prop="inspectMethod"  class="el-col el-col-11 el-col-offset-1">
      <el-input   v-model.trim="iqcDialogForm.inspectMethod"></el-input>
    </el-form-item>
    <div v-show="checked">
      <el-form-item :label="$t('feedRules_InspeSpecDeta')" prop="spec" class="el-col el-col-11 ">
        <el-input  v-model="iqcDialogForm.spec" ></el-input>
      </el-form-item>
      <el-form-item :label="$t('feedRules_SpeciUnit')" prop="specUom" class="el-col el-col-11 el-col-offset-1">
        <el-input  v-model.trim="iqcDialogForm.specUom"></el-input>
      </el-form-item>
      <el-form-item :label="$t('feedRules_LowerSpecLimi')" prop="minValue" class="el-col el-col-11">
        <el-input v-model="iqcDialogForm.minValue" :placeholder="$t('common_pleasEnteANumb')" @blur="checkNumber(iqcDialogForm.minValue)"></el-input>
      </el-form-item>
      <el-form-item :label="$t('feedRules_UpperSpecLimi')" prop="maxValue" class="el-col el-col-11 el-col-offset-1" >
        <el-input v-model="iqcDialogForm.maxValue" :placeholder="$t('common_pleasEnteANumb')" @blur="checkValue(iqcDialogForm.maxValue)"></el-input>
      </el-form-item>
    </div>
    <el-form-item :label="$t('feedRules_DefecCate')" prop="defectClass" class="el-col el-col-24" >
      <div slot="label">
        <span>{{$t('feedRules_DefecCate')}}</span>
        <help-tips :content="$t('feedRules_CRMAMIDesc')" />
      </div>
      <el-radio-group v-model="iqcDialogForm.defectClass">
        <el-radio label="CR">CR</el-radio>
        <el-radio label="MA">MA</el-radio>
        <el-radio label="MI">MI</el-radio>
        <el-radio label="">{{$t('feedRules_empty')}}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item :label="$t('common_InspeCate')" class="el-col el-col-24" >
      <el-checkbox-group v-model="checkedInspect" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="option in inspectTypes" :label="option.value" :key="option.value">{{$t(option.label)}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveForm">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannelIqc')">{{$t('common_cancel')}}</el-button>
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
          label: 'feedRules_Feed',
          value: 'iqc'
        },
        {
          label: 'feedRules_FirstInsp',
          value: 'fai'
        },
        {
          label: 'feedRules_tour',
          value: 'tour'
        },
        {
          label: 'feedRules_Wareh',
          value: 'fqc'
        },
        {
          label: 'feedRules_InvenRech',
          value: 'ric'
        }
      ],
      frequencyUomList: [this.$t('common_month'), this.$t('common_week'), this.$t('common_day')],
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
  computed: {
    rules () {
      return {
        inspectItem: [{ required: true, message: this.$t('feedRules_PleasFillInItem') }],
        inspectContent: [{ required: true, message: this.$t('feedRules_PleasFillInCon') }]
      }
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
          this.$message.warning(this.$t('feedRules_PleasReeANonNe') + ' ' + this.$t('feedRules_AndKeepTwoDeciP'))
        }
      }
    },
    checkValue (value) {
      this.checkNumber(value)
      if (this.isNumber) {
        let { maxValue, minValue } = this.iqcDialogForm
        if (Number(minValue) > Number(maxValue)) {
          this.$message.warning(this.$t('feedRules_TheLoweLimiValu'))
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
