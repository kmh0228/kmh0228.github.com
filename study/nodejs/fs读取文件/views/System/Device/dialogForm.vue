<template>
  <el-form :model="dialogForm" ref="dialogForm" :rules="rules" label-width="8vw" label-position="left" class="el-row mes-form-rule">
    <el-form-item :label="$t('Device_deviceCode')" prop="eqpCode" class="el-col el-col-11">
      <el-input v-model.trim="dialogForm.eqpCode" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('Device_deviceName')" prop="eqpName" class="el-col el-col-11 el-col-offset-1">
      <el-input v-model.trim="dialogForm.eqpName" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_Line')" prop="mPomLineId" class="el-col el-col-11">
      <mes-select v-model="dialogForm.mPomLineId" method="getLineList" labelKey="lineName" valueKey="mPomLineId"></mes-select>
    </el-form-item>
    <el-form-item :label="$t('common_Process')" prop="mComProcessSegId" class="el-col el-col-11 el-col-offset-1">
      <el-select v-model="dialogForm.mComProcessSegId" clearable size="mini" style="width:100%;">
        <el-option v-for="(process,i) in processList" :key="i" :label="process.segName" :value="process.mComProcessSegId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('Device_Custodian')" prop="mComPersonEqpOwnerId" class="el-col el-col-11">
      <el-select v-model="dialogForm.mComPersonEqpOwnerId" clearable size="mini" style="width:100%;">
        <el-option v-for="(user,i) in userList" :key="i" :label="user.employeeName" :value="user.mComEmployeeId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('Device_Inspector')" prop="repairUserCid" class="el-col el-col-11 el-col-offset-1">
      <el-select v-model="dialogForm.repairUserCid" clearable size="mini" style="width:100%;">
        <el-option v-for="(user,i) in userList" :key="i" :label="user.employeeName" :value="user.mComEmployeeId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('Device_MAC')" prop="eqpMac" class="el-col el-col-11">
      <el-input v-model.trim="dialogForm.eqpMac" size="mini"></el-input>
    </el-form-item>
     <el-form-item :label="$t('Device_IP')" prop="eqpIp" class="el-col el-col-11 el-col-offset-1">
      <el-input v-model.trim="dialogForm.eqpIp" size="mini"></el-input>
    </el-form-item>
    <el-form-item prop="documentAuthority" class="el-col el-col-11">
      <div slot="label">
        <span>{{$t('Device_Document')}}</span>
        <help-tips :content="$t('Device_checking')" />
      </div>
      <el-checkbox v-model="dialogForm.documentAuthority"></el-checkbox>

    </el-form-item>
    <el-form-item :label="$t('common_Description')" prop="eqpDesc" class="el-col el-col-11 el-col-offset-1">
      <el-input v-model="dialogForm.eqpDesc" type="textarea"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveUser">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      dialogForm: {
        eqpCode: '',
        eqpName: '',
        mPomLineId: '',
        mComProcessSegId: '',
        mComPersonEqpOwnerId: '',
        repairUserCid: '',
        eqpMac: '',
        eqpIp: '',
        documentAuthority: '',
        eqpDesc: ''
      },
      rules: {
        eqpCode: [{ required: true, message: this.$t('Device_codeEmpty') }],
        eqpName: [{ required: true, message: this.$t('Device_nameEmpty') }],
        eqpMac: [{ required: true, message: this.$t('Device_MACEmpty') }],
        eqpIp: [{ required: true, message: this.$t('Device_IPEmpty') }]
      }
    }
  },
  props: {
    lineList: {
      type: Array,
      default () {
        return []
      }
    },
    userList: {
      type: Array,
      default () {
        return []
      }
    },
    processList: {
      type: Array,
      default () {
        return []
      }
    },
    isEdit: {
      type: Boolean
    }
  },
  methods: {
    resetFields () {
      this.$refs.dialogForm.resetFields()
    },
    saveUser () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let { dialogForm, isEdit } = this
          const res = isEdit ? await this.$api.editEqp(dialogForm) : await this.$api.addEqp(dialogForm)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getDevices')
          })
        }
      })
    }
  }
}
</script>
