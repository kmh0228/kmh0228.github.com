<template>
  <div>
    <el-form :model="infoData" ref="infoData" :rules="rules"   label-width="120px" label-position="left" class="el-row mes-form-rule"  style="margin-top:1.5vh"  size="mini">
      <el-form-item label="初步原因分析" prop="preReason" class="el-col el-col-23">
        <el-input type="textarea" :rows="3" v-model="infoData.preReason" v-if="isEdit"></el-input>
        <span v-else>{{infoData.preReason}}</span>
      </el-form-item>
      <el-form-item label="暂时对策" prop="tempWay" class="el-col el-col-11 ">
        <dict-select v-model="infoData.tempWay" dictType="PDCS_Temp_Way"  selectKey="dictCode" v-if="isEdit"></dict-select>
         <span v-else>{{infoData.tempWayVn}}</span>
      </el-form-item>
      <el-form-item label="原因回复日期" prop="replyDate" class="el-col el-col-11 el-col-offset-1">
        <el-date-picker  v-model="infoData.replyDate" type="date" :editable="false" placeholder="选择日期" style="width:100%" value-format="yyyy-MM-dd HH:mm:ss" v-if="isEdit"> </el-date-picker>
         <span v-else>{{infoData.replyDate}}</span>
      </el-form-item>
      <el-form-item label="暂时对策描述" prop="tempWayDesc" class="el-col el-col-23">
        <el-input type="textarea" :rows="3" v-model="infoData.tempWayDesc" v-if="isEdit"></el-input>
         <span v-else>{{infoData.tempWayDesc}}</span>
      </el-form-item>
      <el-form-item label="经办" prop="replyOne" class="el-col el-col-7">
         <el-select  v-model="infoData.replyOne" :filterable="true" :clearable="true"  style="width: 100%;" v-if="isEdit">
          <el-option v-for="(option,i) in userList" :key="i" :label="option.userName" :value="option.userCode"></el-option>
        </el-select>
         <span v-else>{{infoData.replyOneVn}}</span>
      </el-form-item>
      <el-form-item label="审核" prop="replyTwo" class="el-col el-col-7 el-col-offset-1">
        <el-select  v-model="infoData.replyTwo" :filterable="true" :clearable="true"  style="width: 100%;" v-if="isEdit">
          <el-option v-for="(option,i) in userList" :key="i" :label="option.userName" :value="option.userCode"></el-option>
        </el-select>
         <span v-else>{{infoData.replyTwoVn}}</span>
      </el-form-item>
      <el-form-item label="核准" prop="replyThr" class="el-col el-col-7 el-col-offset-1">
        <el-select  v-model="infoData.replyThr" :filterable="true" :clearable="true"  style="width: 100%;" v-if="isEdit">
          <el-option v-for="(option,i) in userList" :key="i" :label="option.userName" :value="option.userCode"></el-option>
        </el-select>
        <span v-else>{{infoData.replyThrVn}}</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import mesSelect from '@/components/Module/Select/select'

export default {
  data () {
    return {
      infoData: {
        preReason: '',
        tempWay: '',
        tempWayVn: '',
        replyDate: '',
        tempWayDesc: '',
        replyOne: '',
        replyOneVn: '',
        replyTwo: '',
        replyTwoVn: '',
        replyThr: '',
        replyThrVn: ''

      },
      rules: {
        preReason: [{ required: true, message: '请输入初步原因分析' }],
        tempWay: [{ required: true, message: '请选择暂时对策' }],
        replyDate: [{ required: true, message: '请选择原因回复日期' }],
        tempWayDesc: [{ required: true, message: '请输入暂时对策描述' }],
        replyOne: [{ required: true, message: '请选择经办' }],
        replyTwo: [{ required: true, message: '请选择审核' }],
        replyThr: [{ required: true, message: '请选择核准' }]
      }
    }
  },
  props: {
    isEdit: {
      type: Boolean,
      default: true
    },
    formData: {
      type: Object
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
    // 获取表单数据
    getData () {
      return JSON.parse(JSON.stringify(this.infoData))
    },
    // 数据验证
    checkData () {
      let flag = false
      this.$refs['infoData'].validate(valid => {
        if (valid) {
          flag = true
        }
      })
      return flag
    },
    // 重置表单
    resetFields () {
      this.$refs.infoData.resetFields()
    },
    // 设置表单数据
    setForm (data) {
      Object.keys(this.infoData).forEach(key => {
        this.infoData[key] = data[key] || data[key] === 0 ? data[key] : ''
      })
    }
  },
  components: {
    mesSelect
  },
  created () {
    this.formData && this.setForm(this.formData)
  }

}
</script>

<style lang="scss">
</style>
