<template>
  <el-form :model="dialogForm"  ref="dialogForm" label-position="left" label-width="140px" class="el-row mes-form-rule" :rules="rules" size="mini">
    <el-form-item :label="$t('common_Factory')" prop="officeCode" class="el-col el-col-11" size="mini">
      <cascader-select v-model="dialogForm.officeCode" style="width:100%" dataType="1"></cascader-select>
    </el-form-item>
    <el-form-item :label="$t('common_TypeWork')" prop="workKind" class="el-col el-col-11 el-col-offset-1" size="mini">
      <dict-select v-model="dialogForm.workKind" dictType="WORK_KIND" style="width:100%;" selectKey="dictCode"></dict-select>
    </el-form-item>
    <el-form-item :label="$t('common_EquipCateName')" prop="mMomResourceTypeId" class="el-col el-col-11">
      <el-select  :placeholder="$t('inspecItem_selecDeviCateName')" v-model.trim="dialogForm.mMomResourceTypeId" size="mini" style="width:100%" >
        <el-option v-for="(option,i) in equipmentCategoryList" :key="i"  :label="option.typeName" :value="option.mMomResourceTypeId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('common_SpotChecFreq')" prop="frequency" class="el-col el-col-11  el-col-offset-1" size="mini">
      <el-select v-model="dialogForm.frequency" :placeholder="$t('inspecItem_selecSpotChecFreq')" style="width:100%" >
        <el-option v-for="(option,i) in frequencyList" :key="i" :label="option.label" :value="option.value" @click.native="changeTime(option.value)"></el-option>
      </el-select>
    </el-form-item>
     <el-form-item :label="$t('inspecItem_SpotChecDate')" prop="date" class="el-col el-col-11" size="mini">
       <el-select v-model="dialogForm.date" :placeholder="placeholderDate" :disabled="dateDisabeld" v-if="isSelectDateType" style="width:100%">
         <el-option v-for="(option,i) in dateList" :key="i" :label="option.label" :value="option.value"></el-option>
       </el-select>
      <el-date-picker v-else  v-model="dialogForm.date"  type="date" :placeholder="$t('common_SelecDate')" style="width:100%" value-format="yyyy-MM-dd"></el-date-picker>
    </el-form-item>
    <el-form-item :label="$t('inspecItem_SpotChecTime')" prop="time" class="el-col el-col-11  el-col-offset-1" size="mini">
       <el-input v-model="dialogForm.time"  :placeholder="$t('inspecItem_corFormat')" :disabled="standardTimeDisabeld" @blur="checkdate"></el-input>
    </el-form-item>
    <el-form-item :label="$t('inspecItem_StandSpotChecDura')" prop="standardTime" class="el-col el-col-11" size="mini">
      <el-input v-model="dialogForm.standardTime" :placeholder="$t('inspecItem_inputStanSpotChecDura')" @blur="checkTime"></el-input>
    </el-form-item>
     <el-form-item :label="$t('inspecItem_WhethGeneADocuAuto')" prop="isautogenerate" class="el-col el-col-11  el-col-offset-1" size="mini">
      <el-checkbox v-model="dialogForm.isautogenerate"></el-checkbox>
    </el-form-item>
    <el-form-item :label="$t('common_remarks')" prop="remark" class="el-col el-col-23" size="mini">
      <el-input v-model="dialogForm.remark" type="textarea"  :placeholder="$t('inspecItem_enterFaulDesc')" ></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
    <el-button type="primary" size="mini" @click="saveInsecptionList">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      dialogForm: {
        officeCode: '',
        workKind: '',
        mMomResourceTypeId: '',
        frequency: '',
        time: '',
        date: '',
        standardTime: '',
        isautogenerate: '',
        remark: ''
      },
      checked: '',
      rules: {
        mMomResourceTypeId: [{ required: true, message: this.$t('inspecItem_selecDeviCate') }],
        frequency: [{ required: true, message: this.$t('inspecItem_inputSpotChecFreq') }],
        time: [{ required: true, message: this.$t('inspecItem_inputSpotChecTime') }],
        date: [{ required: true, message: this.$t('inspecItem_enterSpotChecDate') }],
        standardTime: [{ required: true, message: this.$t('inspecItem_inputStanSpotChecDura') }],
        isautogenerate: [{ required: true, message: this.$t('inspecItem_selecWhetGeneListAuto') }]

      },
      equipmentCategoryList: [],
      frequencyList: [
        {
          label: this.$t('common_month') + '/' + this.$t('inspecItem_SpotChec'),
          value: '3'
        },
        {
          label: this.$t('common_week') + '/' + this.$t('inspecItem_SpotChec'),
          value: '2'
        },
        {
          label: this.$t('common_day') + '/' + this.$t('inspecItem_SpotChec'),
          value: '1'
        }
      ],
      statusList: [
        {
          label: this.$t('inspecItem_Publi'),
          value: '1'
        },
        {
          label: this.$t('inspecItem_Unpub'),
          value: '0'
        }
      ],
      dateList: [
        {
          label: this.$t('inspecItem_Monda'),
          value: 'Mon'
        },
        {
          label: this.$t('inspecItem_Tuesd'),
          value: 'Tue'
        },
        {
          label: this.$t('inspecItem_Wedne'),
          value: 'Wed'
        },
        {
          label: this.$t('inspecItem_Thurs'),
          value: 'Thu'
        },
        {
          label: this.$t('inspecItem_Frida'),
          value: 'Fri'
        },
        {
          label: this.$t('inspecItem_Satur'),
          value: 'Sat'
        }, {
          label: this.$t('inspecItem_Sunda'),
          value: 'Sun'
        }
      ],
      dateDisabeld: false,
      isSelectDateType: true,
      standardTimeDisabeld: false
    }
  },
  computed: {
    placeholderDate () {
      return this.dateDisabeld ? this.$t('inspecItem_defauIsEverDay') : this.$t('common_SelecDate')
    }
  },
  props: {
    isEdit: Boolean,
    cannel: Function,
    findCheckitemList: Function
  },
  methods: {
    saveInsecptionList () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let { dialogForm, isEdit } = this
          let res = isEdit ? await this.$api.modifyCheckitem(dialogForm) : await this.$api.saveCheckitem(dialogForm)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('findCheckitemList')
          })
        }
      })
    },
    // 查询所有设备类别
    async getDeviceClassList () {
      const params = {
        officeCode: '',
        pageSize: 1000,
        pageIndex: 1
      }
      const res = await this.$api.getDeviceClassList(params)
      const { code, data } = res
      if (code === '200') {
        this.equipmentCategoryList = data.list
      } else {
        this.equipmentCategoryList = []
      }
    },
    changeTime (type) {
      if (type === '1') {
        this.dialogForm.time = ''
        this.dialogForm.date = this.$t('inspecItem_EveryDay')
        this.dateDisabeld = true
        this.isSelectDateType = true
        this.standardTimeDisabeld = false
      } else if (type === '2') {
        this.dialogForm.time = '09:00'
        this.dateDisabeld = false
        this.dialogForm.date = ''
        this.isSelectDateType = true
        this.standardTimeDisabeld = true
      } else if (type === '3') {
        this.dialogForm.time = '09:00'
        this.dialogForm.date = ''
        this.isSelectDateType = false
        this.standardTimeDisabeld = true
      }
    },
    checkTime () {
      let arr = Number(this.dialogForm.standardTime)
      if (arr > 0) {

      } else {
        this.$message.warning(this.$t('inspecItem_enterGreaThan0'))
        // this.dialogForm.standardTime = ''
      }
    },
    checkdate () {
      let { time } = this.dialogForm
      if (time) {
        let timeArray = time.split(';')
        for (let i in timeArray) {
          let tPattern = /^([0-1]{1}\d|2[0-3]):([0-5]\d)$/
          if (!tPattern.test(timeArray[i])) {
            this.$message.warning(this.$t('inspecItem_enterCorrTimeForm'))
            // this.dialogForm.time = ''
            break
          }
        }
      }
    }
  },
  created () {
    this.getDeviceClassList()
  }

}
</script>
