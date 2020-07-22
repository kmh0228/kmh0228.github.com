<template>
  <el-form :model="dialogForm"  ref="dialogForm" label-position="left" label-width="130px" class="el-row mes-form-rule" :rules="rules" size="mini">
   <el-form-item label="料号" prop="mcomMaterialId" class="el-col el-col-24">
     <dialogTableSelect ref="dialogTableSelect" v-model="dialogForm.mcomMaterialId" :contentValue="materialNoVersion" selectId="mComMaterialId" searchPlaceholder="请选择料号" :searchForm="materialSearch" searchKey="materialNo" :showKey="['materialNo','version']" :tableColumns="materialColumns" getDataFunction="getMaterialMasters"></dialogTableSelect>
   </el-form-item>
   <el-form-item label="线别" prop="mpomLineId" class="el-col el-col-24">
     <el-select v-model="dialogForm.mpomLineId" style="width:100%">
       <el-option v-for="(option,i) in lineList" :key="i" :label="option.lineName" :value="option.mPomLineId"></el-option>
     </el-select>
   </el-form-item>
   <el-form-item label="开始时间" prop="startTime" class="el-col el-col-24">
      <el-date-picker v-model="dialogForm.startTime"  type="datetime"  placeholder="选择开始日期" :picker-options="pickerOptions" style="width:100%" value-format="yyyy-MM-dd HH:mm:ss" ></el-date-picker>
   </el-form-item>
   <el-form-item label="结束时间" prop="endTime" class="el-col el-col-24">
      <el-date-picker v-model="dialogForm.endTime"  type="datetime"  placeholder="选择开始日期" :picker-options="pickerOptions" style="width:100%" value-format="yyyy-MM-dd HH:mm:ss" @change="compareDate"></el-date-picker>
   </el-form-item>
   <el-form-item label="播放间隔/单位：S" prop="intervals" class="el-col el-col-24">
     <el-input  v-model="dialogForm.intervals" placeholder="请输入大于0的数字"></el-input>
   </el-form-item>
  <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveForm">保存</el-button>
        <el-button size="mini" @click="$emit('cancel')">取消</el-button>
  </el-form-item>
  </el-form>
</template>

<script>
import dialogTableSelect from '@/components/Module/DialogTableSelect/dialogTableSelect'

export default {
  data () {
    return {
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 24 * 3600 * 1000
        }
      },
      dialogForm: {
        mcomMaterialId: '',
        mpomLineId: '',
        intervals: '',
        startTime: '',
        endTime: '',
        materialNo: '',
        version: ''
      },
      mComDocScheduleId: '',
      materialNo: '',
      processModuleList: [],
      rules: {
        mcomMaterialId: [{ required: true, message: '料号不能为空' }]
      },
      materialSearch: {
        materialNo: '',
        materialType: ''
      },
      materialColumns: [{
        key: 'materialNo',
        label: '料号'
      }, {
        key: 'materialName',
        label: '物料名称'
      }, {
        key: 'version',
        label: '版次'
      }, {
        key: 'mComMaterialtypeCode',
        label: '物料类型'
      }],
      lineList: []
    }
  },
  computed: {
    materialNoVersion () {
      const materialNo = this.dialogForm.materialNo ? this.dialogForm.materialNo + ':' : ''
      const version = this.dialogForm.version ? this.dialogForm.version : ''
      return `${materialNo}${version}`
    }
  },
  props: {
    cancel: Function,
    getTableData: Function,
    isEdit: Boolean
  },
  methods: {
    saveForm () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          if (this.dialogForm.intervals === '') {
            this.dialogForm.intervals = 0
          }
          let { dialogForm, mComDocScheduleId, isEdit } = this
          let data = isEdit ? Object.assign({ mComDocScheduleId }, dialogForm) : dialogForm
          let res = isEdit ? await this.$api.updPlaySchedul(data) : await this.$api.savePlaySchedul(data)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cancel')
            this.$emit('getTableData')
          })
        }
      })
    },
    // 获取线别列表
    async getLineData () {
      let data = { lineName: '', lineType: '', pageIndex: 1, pageSize: 1000 }
      let res = await this.$api.getLineList(data)
      if (res.code === '200') {
        this.lineList = res.data.list
      }
    },
    compareDate () {
      let { startTime, endTime } = this.dialogForm
      let res = this.$dayjs(endTime).isAfter(this.$dayjs(startTime))
      if (!res) {
        this.$message.warning('结束时间要大于开始时间   请重新选择！！！')
        this.dialogForm.endTime = ''
      }
    }
  },
  created () {
    this.getLineData()
  },
  components: {
    dialogTableSelect
  }
}
</script>
