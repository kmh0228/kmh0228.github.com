<template>
<el-form :model="dialogForm" ref="dialogForm" :rules="rules"  label-width="120px" label-position="left" class="el-row mes-form-rule">
  <el-form-item label="产品系列" class="el-col el-col-11">
    <el-select v-model="dialogForm.machine" clearable placeholder="请选择产品系列" style="width:100%">
      <el-option v-for="(option,i) in machineList" :key="i"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="机能" class="el-col el-col-11 el-col-offset-1">
    <el-select v-model="dialogForm.enginery" clearable placeholder="请选择机能" style="width:100%">
      <el-option v-for="(option,i) in engineryList" :key="i"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="稽核项目" class="el-col el-col-11">
    <el-select v-model="dialogForm.auditItem" clearable placeholder="请输入稽核项目" style="width:100%">
      <el-option v-for="(option,i) in auditItemList" :key="i"></el-option>
    </el-select>
  </el-form-item>
   <el-form-item label="测试频率" class="el-col el-col-11 el-col-offset-1">
    <el-input v-model="dialogForm.checkFrequency" clearable placeholder="请输入测试频率">
      <el-option v-for="(option,i) in checkFrequencyList" :key="i"></el-option>
    </el-input>
  </el-form-item>
  <el-form-item label="描述" class="el-col el-col-23">
      <el-input type="textarea" :rows="2" v-model="dialogForm.desc" size="mini"></el-input>
  </el-form-item>
  <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" >保存</el-button>
      <el-button size="mini" @click="$emit('cannel')">取消</el-button>
    </el-form-item>
</el-form>
</template>

<script>
export default {
  data () {
    return {
      dialogForm: {
        machine: '',
        enginery: '',
        auditItem: '',
        checkFrequency: '',
        desc: ''

      },
      machineList: [],
      engineryList: [],
      auditItemList: [],
      checkFrequencyList: []
    }
  },
  props: {
    cannel: Function
  }

}
</script>
