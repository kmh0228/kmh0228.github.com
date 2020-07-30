<template>
<div>
    <div class="main-common-head" v-if="type!== 'details'">
      <el-button type="primary" plain size="mini" :loading="saveLoading" @click="saveData('DRAFT')">{{$t('common_save')}}</el-button>
      <el-button type="primary" plain size="mini" :loading="saveLoading" @click="saveData('SUBMITTED')">{{$t('common_Submit')}}</el-button>
      <el-button type="primary" plain size="mini" @click="closePage">{{$t('common_close')}}</el-button>
      <span class="status_class">{{pdcsNo ? $t('common_OddNumb') + ':'+ pdcsNo : ''}}</span>
       <span class="status_class">{{$t('PDCS_Statu')}}{{ status === 'DRAFT' ? $t('common_NotSubm') : this.$t('common_Submitted') }}</span>
    </div>
     <el-card class="box-card"  shadow="never" >
       <div slot="header" class="clearfix">
        <span>{{$t('common_BasicInfo')}}</span>
      </div>
      <base-info ref="baseInfo"  :isEdit="type!== 'details'" :formData="data" :userList="userList"></base-info>
   </el-card>
   <div v-show="type!== 'add'">
    <el-card class="box-card"  shadow="never" style="margin-top:1.6vh">
      <div slot="header" class="clearfix">
        <span>{{$t('PDCS_CauseAnal')}}</span>
      </div>
      <cause-analysis ref="causeAnalysis" :isEdit="type!== 'details'" :formData="data" :userList="userList"></cause-analysis>
    </el-card>
    <el-card class="box-card"  shadow="never" style="margin-top:1.6vh">
      <div slot="header" class="clearfix">
        <span>{{$t('PDCS_RespoUnit')}}</span>
      </div>
      <responsible-unit ref="responsibleUnit" :pdcsId="pdcsId" :isEdit="type!== 'details'" :userList="userList" :formData="data.pdcsUnitList ? data.pdcsUnitList : []"></responsible-unit>
    </el-card>
    <el-card class="box-card"  shadow="never" style="margin-top:1.6vh">
      <div slot="header" class="clearfix">
        <span>{{$t('PDCS_EffecTrac')}}</span>
      </div>
      <effect-ttracking ref="effectTtracking" :isEdit="type!== 'details'" :userList="userList" :formData="data"></effect-ttracking>
    </el-card>
   </div>
</div>
</template>

<script>
import BaseInfo from './baseInfo'
import CauseAnalysis from './causeAnalysis'
import ResponsibleUnit from './responsibleUnit'
import EffectTtracking from './effectTtracking'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      saveLoading: false,
      pdcsNo: '',
      userList: [],
      data: {}
    }
  },
  props: {
    type: {
      type: String,
      default: 'add'
    },
    status: {
      type: String,
      default: 'DRAFT'
    },
    pdcsId: {
      type: String,
      default: ''
    }
  },
  watch: {
    pdcsId (o, n) {
      this.findPdcsDetail()
    }
  },
  methods: {
    ...mapActions(['changeQmsStatus', 'closeCurrentPage']),
    async saveData (status) {
      if (this.type === 'add' && !this.$refs.baseInfo.checkData()) {
        this.$message.warning(this.$t('PDCS_complForm'))
        return false
      }
      if (this.type === 'update' && (!this.$refs.baseInfo.checkData() || !this.$refs.causeAnalysis.checkData() || !this.$refs.responsibleUnit.checkData() || !this.$refs.effectTtracking.checkData())) {
        this.$message.warning(this.$t('PDCS_complForm'))
        return false
      }
      this.saveLoading = true
      let data = this.$refs.baseInfo.getData()
      data.department = data.department.join(',')
      if (this.type === 'update') {
        data.pdcsId = this.pdcsId
        data = Object.assign(data, this.$refs.causeAnalysis.getData(), this.$refs.effectTtracking.getData())
        let unit = this.$refs.responsibleUnit.getData()
        data.pdcsUnitList = unit
      }
      let res = await this.$api.savePdcs(data)
      if (res.code === '200') {
        this.saveLoading = false
        this.$message.success(this.$t('common_SavedSuccessfully'))
        this.$router.push('/Quality/PDCS')
      }
    },
    async findPdcsDetail () {
      let res = await this.$api.findPdcsDetail({ pdcsId: this.pdcsId })
      if (res.code === '200') {
        let data = res.data
        data.department = data.department ? data.department.split(',') : []
        this.data = data
        this.pdcsNo = data.pdcsNo
      }
    },
    async getPersonList () {
      let res = await this.$api.getPersonList()
      if (res.code === '200') {
        this.userList = res.data
      }
    },
    closePage () {
      let title = this.$route.meta.title
      let data = { title, url: `/Quality/PDCS/${this.type === 'add' ? 'add' : 'edit'}` }
      this.closeCurrentPage(data)
      this.$router.replace('/Quality/PDCS')
    }
  },
  components: {
    BaseInfo,
    CauseAnalysis,
    ResponsibleUnit,
    EffectTtracking
  },
  created () {
    this.getPersonList()
    if (this.pdcsId) {
      this.findPdcsDetail()
    }
  }

}
</script>

<style lang="scss">
.span_class {
  display: block;
  height: 100%;
  width: 100%;
}
.status_class {
  font-size: 1vw;
  margin-left: 10vw;
  color: #3b6f9a;
}
</style>
