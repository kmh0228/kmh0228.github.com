<template>
<div>
    <div class="main-common-head" v-if="type!== 'details'">
      <el-button type="primary" plain size="mini" :loading="saveLoading" @click="saveData('DRAFT')">{{$t('common_save')}}</el-button>
      <el-button type="primary" plain size="mini" :loading="saveLoading" @click="saveData('SUBMITTED')">{{$t('common_Submit')}}</el-button>
      <el-button type="primary" plain size="mini" @click="closePage">{{$t('common_close')}}</el-button>
      <span class="status_class">{{vdcsNo ? $t('common_OddNumb')+':'+ vdcsNo : ''}}</span>
       <span class="status_class">{{$t('common_Status')}}：{{ status === 'DRAFT' ? $t('common_NotSubm') : $t('common_Submitted') }}</span>
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
        <span>{{$t('common_suppl')}}</span>
      </div>
      <supplier ref="supplier" :isEdit="type!== 'details'" :formData="data" :userList="userList"></supplier>
    </el-card>
    <el-card class="box-card"  shadow="never" style="margin-top:1.6vh">
      <div slot="header" class="clearfix">
        <span>{{$t('VDCS_EffectTracking')}}</span>
      </div>
      <effect-ttracking ref="effectTtracking" :isEdit="type!== 'details'" :formData="data" :userList="userList"></effect-ttracking>
    </el-card>
   </div>
</div>
</template>

<script>
import BaseInfo from './baseInfo'
import Supplier from './supplier'
import EffectTtracking from './effectTtracking'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      saveLoading: false,
      data: {},
      vdcsNo: '',
      userList: []
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
    vdcsId: {
      type: String,
      default: ''
    }
  },
  watch: {
    vdcsId (o, n) {
      this.findVdcsDetail()
    }
  },
  methods: {
    ...mapActions(['changeQmsStatus', 'closeCurrentPage']),
    async saveData (status) {
      if (this.type === 'add' && !this.$refs.baseInfo.checkData()) {
        this.$message.warning(this.$t('VDCS_PleaseCompleteTheForm'))
        return false
      }
      if (this.type === 'update' && (!this.$refs.baseInfo.checkData() || !this.$refs.supplier.checkData() || !this.$refs.effectTtracking.checkData())) {
        this.$message.warning(this.$t('VDCS_PleaseCompleteTheForm'))
        return false
      }
      this.saveLoading = true
      let data = this.$refs.baseInfo.getData()
      // 修改的时候
      let updateData = null
      if (this.type === 'update') {
        data.vdcsId = this.vdcsId
        data = Object.assign(data, this.$refs.supplier.getData(), this.$refs.effectTtracking.getData())
        updateData = new FormData()
        for (let key in data) {
          if (key === 'files') {
            data[key].forEach(file => {
              updateData.append('files', file)
            })
          } else {
            updateData.append(key, data[key])
          }
        }
      }
      let res = this.vdcsId ? await this.$api.saveVdcsAndFiles(updateData) : await this.$api.saveVdcs(data)
      if (res.code === '200') {
        this.saveLoading = false
        this.$message.success(this.$t('common_SavedSuccessfully'))
        this.$router.push('/Quality/VDCS')
      }
    },
    async findVdcsDetail () {
      let res = await this.$api.findVdcsDetail({ vdcsId: this.vdcsId })
      if (res.code === '200') {
        let fileDatalist = res.data && res.data.fileDatalist ? res.data.fileDatalist : []
        res.data.fileDatalist = fileDatalist.map(item => {
          return {
            name: item.fileName,
            url: item.fileFullPath,
            ...item
          }
        })
        this.data = res.data
        this.vdcsNo = res.data.vdcsNo
      }
    },
    async getPersonList () {
      let res = await this.$api.getPersonList()
      if (res.code === '200') {
        this.userList = res.data
      }
    },
    closePage () {
      this.changeQmsStatus(true)
      let title = this.$route.meta.title
      let data = { title, url: `/Quality/VDCS/${this.type === 'add' ? 'add' : 'edit'}` }
      this.closeCurrentPage(data)
      this.$router.replace('/Quality/VDCS')
    }
  },
  components: {
    BaseInfo,
    Supplier,
    EffectTtracking
  },
  created () {
    this.getPersonList()
    if (this.vdcsId) {
      this.findVdcsDetail()
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
  margin-left: 20vw;
  color: #3b6f9a;
}
</style>
