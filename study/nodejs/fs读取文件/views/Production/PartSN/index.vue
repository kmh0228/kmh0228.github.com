<template>
  <div class="mes-main mes-main-common">
    <div class="main-common-head">
      <el-button type="primary" plain size="mini" @click="snUnfold">SN展开</el-button>
      <el-button type="primary" plain size="mini" @click="printSn">打印</el-button>
    </div>
    <el-form :model="partFrom" ref="part" :rules="rules" label-width="30%" label-position="left" class="el-row mes-form-rule">
      <el-form-item label="零件料号" prop="mId" class="el-col el-col-11">
        <dialogTableSelect ref="dialogTableSelect" v-model="partFrom.mId" :contentValue="''" @change="materialChange" selectId="mComMaterialId" searchPlaceholder="请选择料号" :searchForm="materialSearch" searchKey="materialNo" :showKey="['materialNo','version']" :tableColumns="materialColumns" getDataFunction="getMaterialMasters"></dialogTableSelect>
      </el-form-item>
      <el-form-item label="编码规则" prop="rulerName" class="el-col el-col-11 el-col-offset-1">
        <el-select v-model="partFrom.rulerName" placeholder="请选择" clearable filterable style="width:100%" size="mini">
          <el-option v-for="(item,i) in ruleList" :key="i" :label="item.M_SEQ_NAME" :value="item.M_SEQ_NAME">
            <span style="float: left">{{ item.M_SEQ_NAME}}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.SEQ_NO_FORMAT }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数量" prop="num" class="el-col el-col-11">
        <el-input v-model.trim="partFrom.num" placeholder="请输入展开数量" size="mini"></el-input>
      </el-form-item>
      <!-- <el-form-item label="展开原因" prop="reason" class="el-col el-col-11 el-col-offset-1">
        <el-select v-model="partFrom.reason" placeholder="请选择" style="width:100%" size="mini">
          <el-option label="一般生产" value="一般生产"></el-option>
          <el-option label="维修补单" value="维修补单"></el-option>
        </el-select>
      </el-form-item> -->
    </el-form>
    <div class="barcode-table mes-table">
      <p>零件SN详情</p>
      <div class="mes-table-content">
        <el-table :data="snTable" border size="mini" empty-text="暂无展开SN数据">
          <el-table-column label="序号" align="center" width="60" prop="indexNum"></el-table-column>
          <el-table-column label="零件SN" align="center" prop="SN"></el-table-column>
          <el-table-column label="零件料号" align="center" prop="mNo">
            <template>
              <span>{{ materialNoVersion }}</span>
            </template>
          </el-table-column>
          <el-table-column label="展开时间" align="center" prop="createDate"></el-table-column>
          <!-- <el-table-column label="展开原因" align="center"></el-table-column> -->
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
        label: '料号'
      }, {
        key: 'materialName',
        label: '物料名称'
      }, {
        key: 'version',
        label: '版次'
      }, {
        key: 'mComMaterialtypeCode',
        label: '物料类型'
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
          callback(new Error('请先选择零件料号'))
        } else {
          if (!value) {
            callback(new Error('请选择条码规则'))
          } else {
            callback()
          }
        }
      }
      const numRule = (rule, value, callback) => {
        if (value) {
          let reg = /^[1-9]\d*$/
          if (!reg.test(value)) {
            callback(new Error('展开数量只能为数字'))
          } else {
            callback()
          }
        } else {
          callback(new Error('展开数量不能为空'))
        }
      }
      return {
        mId: [{ required: true, message: '零件料号不能为空' }],
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
          this.$message.warning('当前选择零件料号暂未配置条码规则！')
        }
      } else {
        this.$message.error(res.msg)
      }
    },
    snUnfold () {
      this.$refs.part.validate(async valid => {
        if (valid) {
          if (this.createdSnList.length > 0) {
            let res = await this.$myPrompt.confirm('确定清除SN列表，重新生成SN吗？')
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
        this.$message.warning('当前未展开零件SN')
      }
    }
  },
  components: {
    dialogTableSelect
  }
}
</script>
