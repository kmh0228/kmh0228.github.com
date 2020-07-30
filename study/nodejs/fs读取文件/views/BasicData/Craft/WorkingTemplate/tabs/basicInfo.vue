<template>
  <el-form :model="basicInfo" ref="info" :rules="rules" label-width="30%" label-position="left" class="el-row work-order-info mes-form-rule">
    <el-form-item :label="$t('workingTemp_TemplCode')" prop="workCode" class="el-col el-col-12">
      <p v-if="isRead">{{ basicInfo.workCode }}</p>
      <el-input v-else v-model="basicInfo.workCode" size="mini" class="mes-form-item"></el-input>
    </el-form-item>
    <el-form-item :label="$t('workingTemp_TemplName')" prop="workName" class="el-col el-col-12">
      <p v-if="isRead">{{ basicInfo.workName }}</p>
      <el-input v-else v-model="basicInfo.workName" size="mini" class="mes-form-item"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_Edition')" prop="version" class="el-col el-col-12">
      <p v-if="isRead">{{ basicInfo.version }}</p>
      <el-input v-else v-model="basicInfo.version" size="mini" class="mes-form-item"></el-input>
    </el-form-item>
    <el-form-item :label="$t('workingTemp_StatiType')" prop="stationType" class="el-col el-col-12">
      <p v-if="isRead">{{ basicInfo.stationType }}</p>
      <el-input v-else v-model="basicInfo.stationType" size="mini" class="mes-form-item"></el-input>
    </el-form-item>
    <el-form-item :label="$t('workingTemp_InputOutpMark')" prop="inoutFlag" class="el-col el-col-12">
      <p v-if="isRead">{{ basicInfo.inoutFlag }}</p>
      <el-input v-else v-model="basicInfo.inoutFlag" size="mini" class="mes-form-item"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common_Enable')" prop="isInvalid" class="el-col el-col-12">
      <el-checkbox v-model="basicInfo.isInvalid" true-label="0" false-label="1"  :disabled="isRead"></el-checkbox>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: {
    useType: {
      type: Number
    },
    mPomWorkMasterId: {
      type: String
    },
    basicInfo: {
      type: Object
    }
  },
  computed: {
    isRead () {
      return this.useType === 0
    },
    rules () {
      return {
        workCode: [{ required: true, message: this.$t('workingTemp_TemplCodeCannBe') }],
        workName: [{ required: true, message: this.$t('workingTemp_TemplNameCannBe') }]
      }
    }
  },
  methods: {
    saveWorkTemplate () {
      this.$refs.info.validate(async valid => {
        if (valid) {
          let { mPomWorkMasterId, basicInfo } = this
          let sendData = mPomWorkMasterId ? Object.assign({ mPomWorkMasterId }, basicInfo) : basicInfo
          let res = mPomWorkMasterId ? await this.$api.editWorkTemplateInfo(sendData) : await this.$api.addWorkTemplateInfo(sendData)
          let { code, data, msg } = res
          if (code === '200') {
            if (this.useType === 1) {
              this.$emit('set-work-masterId', data)
            }
            this.$message.success(msg)
          } else {
            this.$message.error(msg)
          }
        }
      })
    }
  }
}
</script>
