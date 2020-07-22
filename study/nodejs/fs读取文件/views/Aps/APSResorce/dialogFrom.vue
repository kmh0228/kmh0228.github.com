<template>
<el-form :model="dialogFrom" ref="dialogFrom" label-position="left"  label-width="120px" class="el-row mes-form-rule" :rules="rules">
  <el-form-item label="一 . 基本信息" class="el-col el-col-24"></el-form-item>
  <el-form-item label="排产资源码:" prop="resourceCode" class="el-col el-col-11">
    <el-input :disabled="isEdit" v-model="dialogFrom.resourceCode"></el-input>
  </el-form-item>
  <el-form-item label="描述" class="el-col el-col-24">
    <el-input  v-model="dialogFrom.resourceDesc"  type="textarea" :rows="2" placeholder="请输入内容"></el-input>
  </el-form-item>
    <el-form-item label="二 . 产能信息" class="el-col el-col-23"></el-form-item>
    <el-form-item  label="利用率" prop="capacityUtilization" class="el-col el-col-11">
      <div slot="label" style="display:inline-block;">
        <span>利用率</span>
        <help-tips content="资源利用率用于排产时计算工单的生产所需时间，生产时间=数量/产能/利用率" />
      </div>
      <el-input v-model.number="dialogFrom.capacityUtilization" placeholder="请输入数字"></el-input>
    </el-form-item>
    <el-form-item label="状态" class="el-col el-col-11 el-col-offset-1">
      <dict-select v-model="dialogFrom.status" dictType="RESOURCE_STATUS"  selectKey="dictCode"></dict-select>
    </el-form-item>
      <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveForm">保存</el-button>
      <el-button size="mini" @click="$emit('cannel')">取消</el-button>
    </el-form-item>
</el-form>
</template>

<script>
export default {
  data () {
    return {
      dialogFrom: {
        resourceCode: '',
        resourceDesc: '',
        status: this.isEdit ? '' : 'NORMAL',
        capacityUtilization: '',
        mPsmResourceId: ''
      },
      rules: {
        resourceCode: [{ required: true, message: '请输入料号' }],
        capacityUtilization: [{ required: true, message: '请输入利用率' }]

      }
    }
  },
  props: {
    cannel: Function,
    isEdit: Boolean,
    getResourceList: Function
  },
  methods: {
    saveForm () {
      this.$refs.dialogFrom.validate(async valid => {
        if (valid) {
          let { dialogFrom } = this
          let res = await this.$api.saveApsResource(dialogFrom)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getResourceList')
          })
        }
      })
    }
  }

}
</script>
