<template>
  <el-form :model="dialogForm" ref="dialogForm" :rules="rules" label-width="8vw" label-position="left" class="el-row mes-form-rule">
    <el-form-item :label="$t('shift_shiftName')" prop="shiftName" class="el-col el-col-24">
      <el-input v-model.trim="dialogForm.shiftName" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('shift_shiftType')" prop="shiftType" class="el-col el-col-24">
      <el-input v-model.trim="dialogForm.shiftType" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_startTime')" prop="beginTime" class="el-col el-col-24">
      <el-time-picker :placeholder="$t('common_startTime')"  v-model="dialogForm.beginTime" :picker-options="{format:'HH:mm'}" value-format="HH:mm:00" size="mini" style="width:100%;"></el-time-picker>
    </el-form-item>
    <el-form-item :label="$t('common_endTime')" prop="endTime" class="el-col el-col-24">
        <el-time-picker :placeholder="$t('common_endTime')"  v-model="dialogForm.endTime" :picker-options="{format:'HH:mm'}" value-format="HH:mm:00" size="mini" style="width:100%;"></el-time-picker>
    </el-form-item>
    <el-form-item :label="$t('shift_shiftDesc')" prop="shiftDesc" class="el-col el-col-24">
      <el-input type="textarea" :rows="2" v-model="dialogForm.shiftDesc" size="mini"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveShift">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      dialogForm: {
        shiftName: '',
        shiftType: '',
        beginTime: '',
        endTime: '',
        shiftDesc: ''
      }
    }
  },
  computed: {
    rules () {
      return {
        shiftName: [{ required: true, message: this.$t('shift_shiftNameRequire') }],
        shiftType: [{ required: true, message: this.$t('shift_shiftTypeRequire') }],
        beginTime: [{ required: true, message: this.$t('shift_startTimeReqiure') }],
        endTime: [{ required: true, message: this.$t('shift_endTimeRequire') }]
      }
    }
  },
  props: {
    isEdit: {
      type: Boolean
    }
  },
  methods: {
    saveShift () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let { dialogForm } = this
          let res = this.isEdit ? await this.$api.ediShift(dialogForm) : await this.$api.addShift(dialogForm)
          if (res.code === '200') {
            this.$message.success(res.msg)
            this.$emit('getShifts')
            this.$emit('cannel')
          } else {
            this.$message.error(res.msg)
          }
        }
      })
    }
  }
}
</script>
