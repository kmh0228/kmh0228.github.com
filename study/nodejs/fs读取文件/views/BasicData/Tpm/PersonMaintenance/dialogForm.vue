<template>
  <el-form :model="dialogForm" ref="dialogForm" label-position="left" label-width="120px" class="el-row mes-form-rule" :rules="rules">
    <el-form-item :label="$t('common_Factory')" prop="officeCode" class="el-col el-col-24">
      <cascader-select v-model="dialogForm.officeCode" style="width:100%" dataType="1"></cascader-select>
    </el-form-item>
    <el-form-item :label="$t('personMainten_RespoLeveName')" prop="hierarchyId" class="el-col el-col-24">
      <el-select v-model="dialogForm.hierarchyId" size="mini" style="width:100%;" :placeholder="$t('personMainten_selecRespLeve')">
        <el-option v-for="option in hierarchyList" :key="option.mMomHierarchyId" :label="option.hierarchyName" :value="option.mMomHierarchyId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('common_TypeWork')" prop="workKind" class="el-col el-col-24">
      <dict-select v-model="dialogForm.workKind" dictType="WORK_KIND" style="width:100%;"></dict-select>
    </el-form-item>
    <el-form-item :label="$t('personMainten_perso')" prop="userCode" class="el-col el-col-24">
      <el-select v-model="dialogForm.userCode" size="mini" style="width:100%;" :placeholder="$t('personMainten_selecAPers')">
        <el-option v-for="option in personList" :key="option.userCode" :label="option.userName" :value="option.userCode"></el-option>
        <!-- <el-option v-for="(option,i) in userList" :key="i" :label="option.employeeName" :value="option.mComEmployeeId"></el-option> -->
      </el-select>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveHierarchyUser">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      dialogForm: {
        officeCode: '',
        hierarchyId: '',
        workKind: '',
        userCode: ''
      },
      personList: []
    }
  },
  computed: {
    rules () {
      return {
        officeCode: [{ required: true, message: this.$t('common_PleasSeleFact') }],
        hierarchyId: [{ required: true, message: this.$t('personMainten_selecRespLeve') }],
        workKind: [{ required: true, message: this.$t('personMainten_selecTypeWork') }],
        userCode: [{ required: true, message: this.$t('personMainten_selecAPers') }]
      }
    }
  },
  props: {
    isEdit: Boolean,
    hierarchyList: Array
  },
  methods: {
    saveHierarchyUser () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          const { dialogForm, isEdit } = this
          const res = isEdit ? await this.$api.editHierarchyUser(dialogForm) : await this.$api.addHierarchyUser(dialogForm)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getHierarchyUserList')
          })
        }
      })
    },
    // 获取所有人员
    async getPersonList () {
      const res = await this.$api.getPersonList()
      if (res.code === '200') {
        this.personList = res.data
      } else {
        this.personList = []
      }
    }
  },
  created () {
    this.getPersonList()
  }
}
</script>
