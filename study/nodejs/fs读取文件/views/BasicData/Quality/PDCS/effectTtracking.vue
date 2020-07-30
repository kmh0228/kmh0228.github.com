<template>
  <div>
    <el-form :model="infoData" ref="infoData" :rules="rules"   label-width="170px" label-position="left" class="el-row mes-form-rule"  style="margin-top:1.5vh"  size="mini">
      <el-form-item :label="$t('PDCS_ImproTrac')" prop="improvetrace" class="el-col el-col-23">
        <el-input type="textarea" :rows="3" v-model="infoData.improvetrace" v-if="isEdit"></el-input>
        <span v-else>{{infoData.improvetrace}}</span>
      </el-form-item>
      <el-form-item :label="$t('PDCS_ThisDefiHasOrClos')" prop="isHandle" class="el-col el-col-11 ">
        <el-radio-group v-model="infoData.isHandle" v-if="isEdit">
          <el-radio :label="1">{{$t('common_Yes')}}</el-radio>
          <el-radio :label="0">{{$t('common_No')}}</el-radio>
        </el-radio-group>
        <span v-else>{{infoData.isHandle == 1 ? this.$t('common_Yes') : infoData.isHandle == 0 ? this.$t('common_No'): ''}}</span>
      </el-form-item>
      <el-form-item :label="$t('PDCS_EffecTracDate')" prop="traceDate" class="el-col el-col-11 el-col-offset-1">
        <el-date-picker  v-model="infoData.traceDate" type="date" :editable="false" :placeholder="$t('common_SelecDate')" style="width:100%" value-format="yyyy-MM-dd HH:mm:ss" v-if="isEdit"> </el-date-picker>
        <span v-else>{{infoData.traceDate}}</span>
      </el-form-item>
      <el-form-item label="QE" prop="traceQe" class="el-col el-col-11">
        <el-select  v-model="infoData.traceQe" :filterable="true" :clearable="true"  style="width: 100%;"  v-if="isEdit">
          <el-option v-for="(option,i) in userList" :key="i" :label="option.userName" :value="option.userCode"></el-option>
        </el-select>
        <span v-else>{{infoData.traceQeVn}}</span>
      </el-form-item>
      <el-form-item :label="'QE ' + $t('PDCS_execuDire')" prop="traceQeLeader" class="el-col el-col-11 el-col-offset-1">
        <el-select  v-model="infoData.traceQeLeader" :filterable="true" :clearable="true"  style="width: 100%;"  v-if="isEdit">
          <el-option v-for="(option,i) in userList" :key="i" :label="option.userName" :value="option.userCode"></el-option>
        </el-select>
        <span v-else>{{infoData.traceQeLeaderVn}}</span>
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
        improvetrace: '',
        isHandle: '',
        traceDate: '',
        traceQe: '',
        traceQeVn: '',
        traceQeLeader: '',
        traceQeLeaderVn: ''
      }
    }
  },
  computed () {
    return {
      improvetrace: [{ required: true, message: this.$t('PDCS_inputImprTrac') }],
      isHandle: [{ required: true, message: this.$t('PDCS_selecWhetThisOrClos') }],
      traceDate: [{ required: true, message: this.$t('PDCS_selecEffeTracDate') }],
      traceQe: [{ required: true, message: this.$t('common_PleasSele') + 'QE' }],
      traceQeLeader: [{ required: true, message: this.$t('common_PleasSele') + 'QE' + this.$t('PDCS_execuDire') }]
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
