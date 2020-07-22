<template>
  <el-form :model="detailForm"  ref="detailForm" label-position="left" label-width="140px" class="el-row mes-form-rule" :rules="rules" size="mini">
    <el-form-item label="点检方式" prop="item" class="el-col el-col-11" size="mini">
      <el-input v-model="detailForm.item" style="width:100%" ></el-input>
    </el-form-item>
    <el-form-item label="点检内容" prop="detail" class="el-col el-col-11 el-col-offset-1" size="mini">
      <el-input v-model="detailForm.detail" dictType="WORK_KIND" style="width:100%;"></el-input>
    </el-form-item>
     <el-form-item label="点检方法" prop="method" class="el-col el-col-11" size="mini">
      <el-input v-model="detailForm.method" style="width:100%" ></el-input>
    </el-form-item>
    <el-form-item label="设备状态" prop="status" class="el-col el-col-11 el-col-offset-1" size="mini">
      <dict-select v-model="detailForm.status" dictType="RESOURCE_STATUS" selectKey="dictCode"></dict-select>
    </el-form-item>
    <el-form-item label="下限值" prop="lowerValue" class="el-col el-col-11" size="mini">
      <el-input v-model.number="detailForm.lowerValue" style="width:100%" ></el-input>
    </el-form-item>
    <el-form-item label="上限值" prop="upperValue" class="el-col el-col-11 el-col-offset-1" size="mini">
      <el-input v-model.number="detailForm.upperValue" dictType="WORK_KIND" style="width:100%;" @blur="checkValue"></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="remark" class="el-col el-col-11" size="mini">
      <el-input v-model="detailForm.remark" style="width:100%" ></el-input>
    </el-form-item>
   <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveDetailInsecptionList">保存</el-button>
      <el-button size="mini" @click="$emit('detailDialogCannel')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      detailForm: {
        item: '',
        detail: '',
        method: '',
        status: '',
        lowerValue: '',
        upperValue: '',
        remark: ''
      },
      rules: {
        item: [{ required: true, message: '请输入点检方式' }],
        detail: [{ required: true, message: '请输入点检内容' }],
        method: [{ required: true, message: '请输入点检方法' }],
        status: [{ required: true, message: '请选择设备状态' }]
      }

    }
  },
  props: {
    detailDialogCannel: Function,
    isDetailEdit: Boolean,
    mMomCheckitemId: String,
    findCheckitemDetailList: Function
  },
  methods: {
    saveDetailInsecptionList () {
      this.$refs.detailForm.validate(async valid => {
        if (valid) {
          let { detailForm, isDetailEdit, mMomCheckitemId } = this
          //  Object.assign  会合并到第一个对象上面去
          const data = Object.assign({ mMomCheckitemId }, detailForm)
          let res = isDetailEdit ? await this.$api.modifyCheckitemDetail(detailForm) : await this.$api.saveCheckitemDetail(data)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('detailDialogCannel')
            this.$emit('findCheckitemDetailList')
          })
        }
      })
    },
    checkValue () {
      let { lowerValue, upperValue } = this.detailForm
      if (lowerValue > upperValue) {
        this.$message.warning('下限值不能超过上限值')
      }
    }

  }

}
</script>
