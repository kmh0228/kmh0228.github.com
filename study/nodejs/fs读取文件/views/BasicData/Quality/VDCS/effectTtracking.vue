<template>
  <div>
    <el-form :model="infoData" ref="infoData" :rules="rules"   label-width="120px" label-position="left" class="el-row mes-form-rule"  style="margin-top:1.5vh"  size="mini">
      <el-form-item label="效果追踪" prop="improvetRace" class="el-col el-col-23">
        <el-input type="textarea" :rows="3" v-model="infoData.improvetRace" v-if="isEdit"></el-input>
        <span v-else>{{infoData.improvetRace}}</span>
      </el-form-item>
      <el-form-item label="IQC" prop="traceIpc" class="el-col el-col-11">
        <!-- <mes-select v-model="infoData.traceIpc" method="getPersonList" labelKey="userName" valueKey="userCode" v-if="isEdit"></mes-select> -->
        <el-select  v-model="infoData.traceIpc" :filterable="true" :clearable="true" style="width: 100%;"  v-if="isEdit">
          <el-option v-for="(option,i) in userList" :key="i" :label="option.userName" :value="option.userCode"></el-option>
        </el-select>
        <span v-else>{{infoData.traceIpcVn}}</span>
      </el-form-item>
      <el-form-item label="IQC主管" prop="traceLeader" class="el-col el-col-11 el-col-offset-1">
        <!-- <mes-select v-model="infoData.traceLeader" method="getPersonList" labelKey="userName" valueKey="userCode" v-if="isEdit"></mes-select> -->
        <el-select  v-model="infoData.traceLeader" :filterable="true" :clearable="true" style="width: 100%;"  v-if="isEdit">
          <el-option v-for="(option,i) in userList" :key="i" :label="option.userName" :value="option.userCode"></el-option>
        </el-select>
        <span v-else>{{infoData.traceLeaderVn}}</span>
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
        improvetRace: '',
        traceIpc: '',
        traceIpcVn: '',
        traceLeader: '',
        traceLeaderVn: ''
      },
      rules: {
        improvetRace: [{ required: true, message: '请输入效果追踪' }],
        traceIpc: [{ required: true, message: '请选择IQC' }],
        traceLeader: [{ required: true, message: '请选择IQC主管' }]
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
