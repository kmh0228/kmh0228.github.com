<template>
  <el-form :model="dialogForm"  ref="dialogForm" label-position="left" label-width="140px" class="el-row mes-form-rule" :rules="rules" size="mini">
    <el-form-item label="工厂" prop="officeCode" class="el-col el-col-11" size="mini">
      <cascader-select v-model="dialogForm.officeCode" style="width:100%" dataType="1"></cascader-select>
    </el-form-item>
    <el-form-item label="工种" prop="workKind" class="el-col el-col-11 el-col-offset-1" size="mini">
      <dict-select v-model="dialogForm.workKind" dictType="WORK_KIND" style="width:100%;" selectKey="dictCode"></dict-select>
    </el-form-item>
    <el-form-item label="设备类别名称" prop="mMomResourceTypeId" class="el-col el-col-11">
      <el-select  placeholder="请选择设备类别名称" v-model.trim="dialogForm.mMomResourceTypeId" size="mini" style="width:100%" >
        <el-option v-for="(option,i) in equipmentCategoryList" :key="i"  :label="option.typeName" :value="option.mMomResourceTypeId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="点检频率" prop="frequency" class="el-col el-col-11  el-col-offset-1" size="mini">
      <el-select v-model="dialogForm.frequency" placeholder="请选择点检频率" style="width:100%" >
        <el-option v-for="(option,i) in frequencyList" :key="i" :label="option.label" :value="option.value" @click.native="changeTime(option.value)"></el-option>
      </el-select>
    </el-form-item>
     <el-form-item label="点检日期" prop="date" class="el-col el-col-11" size="mini">
       <el-select v-model="dialogForm.date" :placeholder="placeholderDate" :disabled="dateDisabeld" v-if="isSelectDateType" style="width:100%">
         <el-option v-for="(option,i) in dateList" :key="i" :label="option.label" :value="option.value"></el-option>
       </el-select>
      <el-date-picker v-else  v-model="dialogForm.date"  type="date" placeholder="选择日期" style="width:100%" value-format="yyyy-MM-dd"></el-date-picker>
    </el-form-item>
    <el-form-item label="点检时间" prop="time" class="el-col el-col-11  el-col-offset-1" size="mini">
       <el-input v-model="dialogForm.time"  placeholder="请输入正确格式（如 09:00 多个时间请；隔开）" :disabled="standardTimeDisabeld" @blur="checkdate"></el-input>
    </el-form-item>
    <el-form-item label="标准点检时长" prop="standardTime" class="el-col el-col-11" size="mini">
      <el-input v-model="dialogForm.standardTime" placeholder="请输入标准点检时长" @blur="checkTime"></el-input>
    </el-form-item>
     <el-form-item label="是否自动生成点检单" prop="isautogenerate" class="el-col el-col-11  el-col-offset-1" size="mini">
      <el-checkbox v-model="dialogForm.isautogenerate"></el-checkbox>
    </el-form-item>
    <el-form-item label="备注" prop="remark" class="el-col el-col-23" size="mini">
      <el-input v-model="dialogForm.remark" type="textarea"  placeholder="请输入故障描述" ></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
    <el-button type="primary" size="mini" @click="saveInsecptionList">保存</el-button>
      <el-button size="mini" @click="$emit('cannel')">取消</el-button>
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
        mMomResourceTypeId: [{ required: true, message: '请选择设备类别' }],
        frequency: [{ required: true, message: '请输入点检频率' }],
        time: [{ required: true, message: '请输入点检时间' }],
        date: [{ required: true, message: '请输入点检日期' }],
        standardTime: [{ required: true, message: '请输入标准点检时长' }],
        isautogenerate: [{ required: true, message: '请选择是否自动生成点检单' }]

      },
      equipmentCategoryList: [],
      frequencyList: [
        {
          label: '月/点检',
          value: '3'
        },
        {
          label: '周/点检',
          value: '2'
        },
        {
          label: '日/点检',
          value: '1'
        }
      ],
      statusList: [
        {
          label: '已发布',
          value: '1'
        },
        {
          label: '未发布',
          value: '0'
        }
      ],
      dateList: [
        {
          label: '星期一',
          value: 'Mon'
        },
        {
          label: '星期二',
          value: 'Tue'
        },
        {
          label: '星期三',
          value: 'Wed'
        },
        {
          label: '星期四',
          value: 'Thu'
        },
        {
          label: '星期五',
          value: 'Fri'
        },
        {
          label: '星期六',
          value: 'Sat'
        }, {
          label: '星期天',
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
      return this.dateDisabeld ? '默认为每天' : '选择日期'
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
        this.dialogForm.date = '每天'
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
        this.$message.warning('请输入大于0的数字')
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
            this.$message.warning('请输入正确的时间格式')
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
