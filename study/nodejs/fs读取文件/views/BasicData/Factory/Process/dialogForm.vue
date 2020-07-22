<template>
  <el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="120px" label-position="left" class="el-row mes-form-rule">
    <el-form-item :label="$t('process_processCode')" prop="segCode" class="el-col el-col-24">
      <el-input v-model="dialogForm.segCode" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('process_processName')" prop="segName" class="el-col el-col-24">
      <el-input v-model="dialogForm.segName" size="mini"></el-input>
    </el-form-item>
    <el-form-item :label="$t('process_stationType') " prop="mModuleId" class="el-col el-col-24">
      <dict-select v-model="dialogForm.mModuleId" dictType="WORK_MASTER_STATION_TYPE"></dict-select>
    </el-form-item>
    <!-- <el-form-item label="操作类型 " prop="operationType" class="el-col el-col-24">
      <el-select size="mini" filterable v-model="dialogForm.operationType" clearable style="width:100%">
        <el-option v-for="(option,i) in processModuleTypeList" :key="i" ></el-option>
      </el-select>
    </el-form-item> -->
    <el-form-item prop="isLeaf" class="el-col el-col-24" >
      <div slot="label">
        <span>{{$t('process_childrenNode')}}</span>
        <help-tips :content="$t('process_selectAddInfo')" />
      </div>
      <el-switch v-model="dialogForm.isLeaf" :active-text="$t('common_Yes')" :inactive-text="$t('common_No')" active-value="1" inactive-value="0"></el-switch>
    </el-form-item>
    <el-form-item prop="movein" class="el-col el-col-24" >
      <div slot="label">
        <span>{{$t('process_needToRece')}}</span>
        <help-tips :content="$t('process_selectBtnInOut')" />
      </div>
      <el-switch v-model="dialogForm.movein" :active-text="$t('common_Yes')" :inactive-text="$t('common_No')" active-value="1" inactive-value="0"></el-switch>
    </el-form-item>
    <el-form-item :label="$t('process_fatherNode')" class="el-col el-col-24"  v-if="!isEdit">
      <el-cascader v-model="processParentId" expand-trigger="hover" change-on-select clearable :show-all-levels="false" style="width:100%" size="mini" :options="processOptions" :props="cascaderProps">
      </el-cascader>
    </el-form-item>
    <el-form-item :label="$t('process_processDesc')" class="el-col el-col-24">
      <el-input type="textarea" v-model="dialogForm.segDesc" size="mini"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="dialog-footer el-col el-col-24">
      <el-button type="primary" size="mini" @click="submitForm">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      processModuleTypeList: [],
      dialogForm: {
        segCode: '',
        segName: '',
        mModuleId: '',
        isLeaf: true,
        segDesc: '',
        movein: '1',
        operationType: ''
      },
      processParentId: [],
      cascaderProps: {
        label: 'segCode',
        value: 'mComProcessSegId',
        children: 'children'
      }
    }
  },
  computed: {
    rules () {
      return {
        segCode: [{ required: true, message: this.$t('process_codeRequired') }],
        segName: [{ required: true, message: this.$t('process_processNameRequired') }],
        mModuleId: [{ required: true, message: this.$t('process_stationTypeRequired') }]
      }
    }
  },
  props: {
    mComProcessSegPId: {
      type: String
    },
    processOptions: {
      type: Array
    },
    isEdit: {
      type: Boolean
    }
  },
  methods: {
    submitForm () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let { dialogForm, isEdit } = this
          let len = this.processParentId.length
          let mComProcessSegPId = len > 0 ? this.processParentId[len - 1] : ''
          let data = isEdit ? dialogForm : Object.assign({ mComProcessSegPId }, dialogForm)
          let res = isEdit ? await this.$api.updateProcess(data) : await this.$api.insertProcess(data)
          let { code, msg } = res
          if (code === '200') {
            this.$message.success(msg)
            this.$emit('getProcessTree')
            this.$emit('cannel')
          } else {
            this.$message.error(msg)
          }
        }
      })
    }
  }
}
</script>
