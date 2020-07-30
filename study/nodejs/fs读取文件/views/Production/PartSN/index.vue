<template>
  <div class="mes-main mes-main-common">
    <div class="main-common-head">
      <el-button type="primary" plain size="mini" @click="snUnfold">{{$t('partSN_open')}}</el-button>
      <el-button type="primary" plain size="mini" @click="printSn">{{$t('common_Print')}}</el-button>
    </div>
    <el-form :model="partFrom" ref="part" :rules="rules" label-width="30%" label-position="left" class="el-row mes-form-rule">
      <el-form-item :label="$t('common_PartNo')" prop="mId" class="el-col el-col-11">
        <dialogTableSelect ref="dialogTableSelect" v-model="partFrom.mId" :contentValue="''" @change="materialChange" selectId="mComMaterialId" :searchPlaceholder="$t('common_PleaseSelectPN')" :searchForm="materialSearch" searchKey="materialNo" :showKey="['materialNo','version']" :tableColumns="materialColumns" getDataFunction="getMaterialMasters"></dialogTableSelect>
      </el-form-item>
      <el-form-item :label="$t('partSN_CodinRule')" prop="rulerName" class="el-col el-col-11 el-col-offset-1">
        <el-select v-model="partFrom.rulerName" :placeholder="$t('common_PleasSele')" clearable filterable style="width:100%" size="mini">
          <el-option v-for="(item,i) in ruleList" :key="i" :label="item.M_SEQ_NAME" :value="item.M_SEQ_NAME">
            <span style="float: left">{{ item.M_SEQ_NAME}}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.SEQ_NO_FORMAT }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('common_numbe')" prop="num" class="el-col el-col-11">
        <el-input v-model.trim="partFrom.num" :placeholder="$t('partSN_enterExpaQuan')" size="mini"></el-input>
      </el-form-item>
      <!-- <el-form-item :label="$t('partSN_ReasoForDepl')" prop="reason" class="el-col el-col-11 el-col-offset-1">
        <el-select v-model="partFrom.reason" :placeholder="$t('common_PleasSele')" style="width:100%" size="mini">
          <el-option :label="$t('partSN_GenerProd')" value="一般生产"></el-option>
          <el-option :label="$t('partSN_RepaiOrde')" value="维修补单"></el-option>
        </el-select>
      </el-form-item> -->
    </el-form>
    <div class="barcode-table mes-table">
      <p>{{$t('partSN_sparePartSND')}}</p>
      <div class="mes-table-content">
        <el-table :data="snTable" border size="mini" :empty-text="$t('partSN_NoExpaData')">
          <el-table-column :label="$t('common_Number')" align="center" width="60" prop="indexNum"></el-table-column>
          <el-table-column :label="$t('partSN_sparePartSN')" align="center" prop="SN"></el-table-column>
          <el-table-column :label="$t('common_PartNo')" align="center" prop="mNo">
            <template>
              <span>{{ materialNoVersion }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('partSN_DeploTime')" align="center" prop="createDate"></el-table-column>
          <!-- <el-table-column :label="$t('partSN_ReasoForDepl')" align="center"></el-table-column> -->
        </el-table>
      </div>
      <el-row style="text-align:center;padding:1vh 0;">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.pageIndex"
        :page-size="page.pageSize" layout="total, prev, pager, next, jumper" :total="total" background>
        </el-pagination>
      </el-row>
    </div>
  </div>
</template>

<script>
import dialogTableSelect from '@/components/Module/DialogTableSelect/dialogTableSelect'
export default {
  data () {
    return {
      partFrom: {
        mId: '',
        mNo: '',
        rulerName: '',
        num: ''
      },
      total: 0,
      ruleList: [],
      page: {
        pageIndex: 1,
        pageSize: 20
      },
      snTable: [],
      createdSnList: [],
      materialColumns: [{
        key: 'materialNo',
        label: this.$t('common_PorN')
      }, {
        key: 'materialName',
        label: this.$t('common_MaterialName')
      }, {
        key: 'version',
        label: this.$t('common_Edition')
      }, {
        key: 'mComMaterialtypeCode',
        label: this.$t('common_MaterialType')
      }],
      materialSearch: {
        materialNo: '',
        materialType: ''
      },
      materialNoVersion: ''
    }
  },
  computed: {
    rules () {
      const nameRule = (rule, value, callback) => {
        let { mId } = this.partFrom
        if (!mId) {
          callback(new Error(this.$t('partSN_selecPartNumbFirs')))
        } else {
          if (!value) {
            callback(new Error(this.$t('partSN_selecBarcRule')))
          } else {
            callback()
          }
        }
      }
      const numRule = (rule, value, callback) => {
        if (value) {
          let reg = /^[1-9]\d*$/
          if (!reg.test(value)) {
            callback(new Error(this.$t('partSN_expanQuanCanANumb')))
          } else {
            callback()
          }
        } else {
          callback(new Error(this.$t('partSN_ExpanQuanCannBeEmpt')))
        }
      }
      return {
        mId: [{ required: true, message: this.$t('partSN_PartNoCannBeEmpt') }],
        rulerName: [{ required: true, validator: nameRule }],
        num: [{ required: true, validator: numRule }]
      }
    }
  },
  methods: {
    handleSizeChange (size) {
      this.page.pageSize = size
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      let { pageSize } = this.page
      let startIndex = (index - 1) * pageSize
      let endIndex = startIndex + pageSize
      this.snTable = this.createdSnList.slice(startIndex, endIndex)
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    setMaterialNo (no) {
      this.partFrom.mNo = no
    },
    materialChange (val) {
      this.ruleList = []
      this.partFrom.rulerName = ''
      if (val) {
        this.getCodingRules(val)
      }
      this.materialNoVersion = this.$refs.dialogTableSelect.content
    },
    async getCodingRules (mId) {
      // let propCode = 'SN_RULE'
      // let propCode = ''
      let res = await this.$api.getSnCodingRules({ mId })
      if (res.code === '200') {
        let data = res.data
        if (data.length > 0) {
          this.ruleList = data
        } else {
          this.$message.warning(this.$t('partSN_BarCodeRulePartNumb'))
        }
      } else {
        this.$message.error(res.msg)
      }
    },
    snUnfold () {
      this.$refs.part.validate(async valid => {
        if (valid) {
          if (this.createdSnList.length > 0) {
            let res = await this.$myPrompt.confirm(this.$t('partSN_deleteSNregene'))
            if (res) {
              this.creatSnList()
            }
          } else {
            this.creatSnList()
          }
        }
      })
    },
    async creatSnList () {
      let res = await this.$api.creatSnList(this.partFrom)
      if (res.code === '200') {
        this.total = Number(this.partFrom.num)
        this.createdSnList = res.data
        this.page.pageIndex = 1
        this.snTable = this.createdSnList.slice(0, 20)
      } else {
        this.$message.error(res.msg)
      }
    },
    async printSn () {
      let { createdSnList } = this
      let len = createdSnList.length
      if (len > 0) {
        let data = {
          mPomLineStationPrinterId: '73c69d63-1fc6-4dd1-a4be-ec1d8e26e579',
          printTempName: 'CARTON',
          productSn: [createdSnList[0].SN]
        }
        let res = await this.$api.printSsn(data)
        if (res.code === '200') {
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      } else {
        this.$message.warning(this.$t('partSN_partIsNotCurrUnfo'))
      }
    }
  },
  components: {
    dialogTableSelect
  }
}
</script>
