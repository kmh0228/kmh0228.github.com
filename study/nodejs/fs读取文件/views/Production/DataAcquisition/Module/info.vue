<template>
  <el-row class="mes-workstation-info" :class="changeSize" :gutter="10">
    <el-col v-for="(item,i) in workStationLabel" :key="i" :span="12" class="el-row">
      <p class="el-col el-col-6">{{ item.label }}</p>
      <p class="el-col el-col-18">{{ workStationInfo[item.key] }}</p>
    </el-col>
  </el-row>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  data () {
    return {
    }
  },
  props: {
    workStationInfo: {
      type: Object
    },
    workStationCode: {
      type: String
    },
    // 用于当前工站检测是否扫描过工站代码
    isCheck: {
      type: Boolean,
      default () {
        return true
      }
    },
    workStationStype: {
      type: String,
      default () {
        return ''
      }
    }
  },
  computed: {
    ...mapState('workStation', ['workStationStates', 'checkIsRefresh']),
    ...mapGetters('workStation', ['workStationType']),
    changeSize () {
      const changeFontSize = Number(localStorage.getItem('fontSize'))
      let size = ''
      switch (changeFontSize) {
        case 1:
          size = 'font-small'
          break
        case 2:
          size = 'font-normal'
          break
        case 3:
          size = 'font-bigger'
          break
        case 4:
          size = 'font-oversize'
          break
        default:
          size = 'font-normal'
          break
      }
      return size
    },
    // 根据工站类型，展示不同的基本信息
    workStationLabel () {
      let { workStationStype } = this
      if (workStationStype === 'pack') {
        return [{
          label: this.$t('dataAcqLogin_userName'),
          key: 'userName'
        }, {
          label: this.$t('dataAcqLogin_IPaddre'),
          key: 'ip'
        }, {
          label: this.$t('dataAcqLogin_StatiType'),
          key: 'stationType'
        }, {
          label: this.$t('common_ProduSeries'),
          key: 'model'
        }, {
          label: this.$t('dataAcqLogin_NameWorkStat'),
          key: 'lineStationName'
        }, {
          label: this.$t('common_Line'),
          key: 'lineCode'
        }, {
          label: this.$t('common_WorkOrdeNo'),
          key: 'docNo'
        }, {
          label: this.$t('common_FinisProdNo'),
          key: 'materialNo'
        }, {
          label: this.$t('dataAcqLogin_produSN'),
          key: 'productSn'
        }, {
          label: this.$t('dataAcqLogin_PackaNumb'),
          key: 'pack_no'
        }]
      } else if (workStationStype === 'storage') {
        return [{
          label: this.$t('dataAcqLogin_userName'),
          key: 'userName'
        }, {
          label: this.$t('dataAcqLogin_IPaddre'),
          key: 'ip'
        }, {
          label: this.$t('dataAcqLogin_StatiType'),
          key: 'stationType'
        }, {
          label: this.$t('dataAcqLogin_NameWorkStat'),
          key: 'lineStationName'
        }, {
          label: this.$t('common_Line'),
          key: 'lineCode'
        }, {
          label: this.$t('common_PalleNo'),
          key: 'pack_no'
        }]
      } else if (workStationStype === 'shipout') {
        return [{
          label: this.$t('dataAcqLogin_userName'),
          key: 'userName'
        }, {
          label: this.$t('dataAcqLogin_IPaddre'),
          key: 'ip'
        }, {
          label: this.$t('dataAcqLogin_StatiType'),
          key: 'stationType'
        }, {
          label: this.$t('dataAcqLogin_NameWorkStat'),
          key: 'lineStationName'
        }, {
          label: this.$t('common_Line'),
          key: 'lineCode'
        }, {
          label: 'DN',
          key: 'docNo'
        }, {
          label: this.$t('dataAcqLogin_SalesOrdeNo'),
          key: 'salesOrder'
        }, {
          label: this.$t('dataAcqLogin_DNItems'),
          key: 'itemNo'
        }, {
          label: this.$t('dataAcqLogin_PlaceShip'),
          key: 'itemNo'
        }, {
          label: this.$t('common_PalleNo'),
          key: 'packNo'
        }]
      } else {
        return [{
          label: this.$t('dataAcqLogin_userName'),
          key: 'userName'
        }, {
          label: this.$t('dataAcqLogin_IPaddre'),
          key: 'ip'
        }, {
          label: this.$t('dataAcqLogin_StatiType'),
          key: 'stationType'
        }, {
          label: this.$t('common_ProduSeries'),
          key: 'model'
        }, {
          label: this.$t('dataAcqLogin_NameWorkStat'),
          key: 'lineStationName'
        }, {
          label: this.$t('common_Line'),
          key: 'lineCode'
        }, {
          label: this.$t('common_WorkOrdeNo'),
          key: 'docNo'
        }, {
          label: this.$t('common_FinisProdNo'),
          key: 'materialNo'
        }, {
          label: this.$t('dataAcqLogin_produSN'),
          key: 'productSn'
        }]
      }
    }
  },
  methods: {
    // 扫描工站代码成功后获取当前工站信息,防止页面刷新数据丢失
    async setWorkStationInfo () {
      let lineStationCode = this.workStationCode
      if (lineStationCode) {
        // if (this.checkIsRefresh) {
        //   await this.$store.dispatch('workStation/getWorkStationInfo', { lineStationCode })
        // }
        if (lineStationCode === 'login') {
          return false
        }
        await this.$store.dispatch('workStation/getWorkStationInfo', { lineStationCode })
        this.workStationInfo = Object.assign(this.workStationInfo, this.workStationStates)
      } else {
        this.$alert(this.$t('dataAcqLogin_systeHasDeteCodeFirs'), this.$t('common_tips'), {
          type: 'warning',
          confirmButtonText: this.$t('common_ok'),
          callback: action => {
            this.$router.push('/WorkStation/Login')
          }
        })
      }
    },
    /**
     * 获取用户详情
     * @param code  员工代码
     */
    async getUserInfo (code) {
      const employeeCardId = code
      const res = await this.$api.scanEmployeeCardId({ employeeCardId })
      if (res.code === '200') {
        const userInfo = res.data
        const userName = `${code}(${userInfo.employeeName})`
        this.workStationInfo = Object.assign(this.workStationInfo, { userName, employeeCardId })
        return { status: 1, nextStep: userInfo.nextStep }
      } else {
        return { status: 0, nextStep: res.msg }
      }
    },
    // SSN扫描 （公共）
    async sacnSSNCommon (scanValue) {
      let { processId } = this.workStationInfo
      let data = Object.assign({ processId }, { scanValue })
      let res = await this.$api.ssnScanCommon(data)
      if (res.code === '200') {
        let resultData = res.data
        let productSn = scanValue
        this.workStationInfo = Object.assign(this.workStationInfo, resultData, { productSn })
        // 区别工作模版id在组装和其他工站调用不一致的问题
        this.workStationInfo.mPomWorkMasterId = this.workStationInfo.masterId
        return res
      } else {
        return res
      }
    }
  },
  created () {
    this.setWorkStationInfo()
  }
}
</script>
