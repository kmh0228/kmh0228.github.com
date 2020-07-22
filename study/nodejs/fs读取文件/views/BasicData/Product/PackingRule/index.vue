<template>
<div class="mes-main mes-work-order">
  <div class="mes-main-title">包装规则管理</div>
  <el-row :gutter="20" class="mes-main-filte">
    <el-col :span="12">
      <el-input placeholder="包装规则代码" v-model.trim="keywords" size="mini" style="width:40%" @keydown.enter.native="getPackingRules">
      </el-input>
    </el-col>
  </el-row>
  <div class="mes-table">
    <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button size="mini" icon="el-icon-search" @click="getPackingRules">查询</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus"  @click="handlePackRule('')">新增</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deleteRule('')">批量删除</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh"  @click="refreshData">刷新</el-button>
<!--
          <el-button size="mini" :disabled="editDisabled"  @click="handlePackRule(true)">编辑</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" @click="handlePackRule(false)">新增</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" @click="deleteRule">删除</el-button> -->
        </el-col>
        <el-col :span="12">
          <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :page-count="5"
              layout="total,sizes,prev,pager,next,jumper,->" :total="total"
              @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
        </el-col>
    </el-row>
    <div class="mes-table-content">
      <el-table :data="tableData" border highlight-current-row size="mini"  @selection-change="handleSelectionChange" @cell-click="cellClick">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column type="index" label="序号" align="center" :index="indexMethod"></el-table-column>
        <el-table-column label="包装规则代码" prop="ruleName" align="center" sortable></el-table-column>
        <el-table-column label="描述" prop="ruleDesc" align="center" sortable></el-table-column>
        <el-table-column label="创建人" prop="creator" align="center" sortable></el-table-column>
        <el-table-column label="创建时间" prop="createdDt" align="center" sortable></el-table-column>
        <el-table-column label="是否启用" align="center" sortable>
          <template slot-scope="scope">
            <el-tag :type="scope.row.isInvalid?'':'danger'" size="mini">{{ scope.row.isInvalid? '启用':'禁用'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <handle-button @click="handlePackRule(scope.row)" iconClass='el-icon-edit-outline' tipText="编辑"></handle-button>
            <handle-button @click="deleteRule(scope.row.mPomWorkMasPackRuleId)" iconClass='el-icon-delete' tipText="删除" iconColor='#f56c6c'></handle-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" class="handle-dialog" width="600px">
      <dialog-form v-if="dialogVisible" ref="dialog" @cannel="cannel" @getPackingRules="getPackingRules" :isEdit="isEdit"></dialog-form>
    </el-dialog>
  </div>
  <div class="mes-main-tabs" v-if="showTabs">
      <el-card class="mes-table" shadow="never" style="border:none;">
         <div slot="header">
          <span>包装规则详情</span>
          <div style="float: right;">
            <div  v-if="editDetail" >
               <el-button type="success" plain size="mini" @click="saveDetailList">保存</el-button>
               <el-button  type="warning" plain size="mini"  @click="goback">撤销</el-button>
            </div>
              <el-button  v-else type="primary" plain size="mini" @click="editPackDetail">编辑</el-button>
          </div>
        </div>
        <el-table size="mini" :data="detailData">
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column label="步骤名" align="center">
            <template slot-scope="scope">
              <el-input v-if="editDetail" v-model="scope.row.stepName"  size="mini"></el-input>
              <p v-else>{{scope.row.stepName}}</p>
            </template>
          </el-table-column>
           <el-table-column label="单位" align="center">
            <template slot-scope="scope">
              <el-input v-if="editDetail" v-model="scope.row.mComUomPackId"  size="mini"></el-input>
              <p v-else>{{scope.row.mComUomPackId}}</p>
            </template>
          </el-table-column>
           <el-table-column label="目标数量" align="center" prop="stdQty">
            <template slot-scope="scope">
              <el-input v-if="editDetail" v-model.number="scope.row.stdQty" placeholder="请输入数字" size="mini"></el-input>
              <p v-else>{{ parseInt(scope.row.stdQty) }}</p>
            </template>
          </el-table-column>
           <el-table-column label="编码规则" align="center" prop="mSegName">
            <template slot-scope="scope">
              <el-select v-if="editDetail" v-model="scope.row.mSeqPackId"  size="mini">
                <el-option v-for="(option,i) in codeRuleList" :key="i" :label="option.mSeqName" :value="option.mSeqId"></el-option>
              </el-select>
              <p v-else>{{scope.row.mSegName}}</p>
            </template>
          </el-table-column>
          <el-table-column label="打印条码模板" align="center" prop="fileName">
            <template slot-scope="scope">
              <el-select v-if="editDetail" v-model="scope.row.mPomWorkMasPrintTmplId"  size="mini">
                <el-option v-for="(option,i) in printBarList" :key="i" :label="option.fileName" :value="option.mPomWorkMasPrintTmplId"></el-option>
              </el-select>
              <p v-else>{{scope.row.fileName}}</p>
            </template>
          </el-table-column>
          <el-table-column label="扫描类型" align="center">
            <template slot-scope="scope">
              <el-select v-if="editDetail" v-model="scope.row.scanType" size="mini">
                <el-option label="SSN" value="SSN"></el-option>
                <el-option label="BOX" value="BOX"></el-option>
              </el-select>
              <p v-else>{{scope.row.scanType}}</p>
            </template>
          </el-table-column>
           <el-table-column label="包装类型" align="center">
            <template slot-scope="scope">
              <el-select v-if="editDetail" v-model="scope.row.packType" size="mini">
                <el-option label="BOX" value="BOX"></el-option>
                <el-option label="PALLET" value="PALLET"></el-option>
              </el-select>
              <p v-else>{{scope.row.packType}}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center" v-if="editDetail">
             <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="delDetailRow(scope.$index)"></el-button>
            </template>
          </el-table-column>
        </el-table>
         <el-button type="primary" plain size="mini" v-if="editDetail"  @click="addDetail" style="margin-top:1vh;">添加</el-button>
      </el-card>
    </div>
</div>

</template>

<script>
import dialogForm from './dialogForm'
export default {
  data () {
    return {
      mPomWorkMasPackRuleId: '',
      keywords: '',
      queryLevel: 1,
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
      tableData: [],
      dialogVisible: false,
      dialogComponent: '',
      isEdit: false,
      showTabs: false,
      editDetail: false,
      selectList: [],
      detailData: [],
      codeRuleList: [],
      codeRuleSearch: {
        mSeqName: '',
        pageSize: 1000,
        pageIndex: 1
      },
      printBarList: [],
      PrintBarCodeTypeSearch: {
        keywords: '',
        pageSize: 1000,
        pageIndex: 1
      }
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? '编辑包装规则' : '新增包装规则'
    },
    editDisabled () {
      return this.selectList.length !== 1
    }
  },
  methods: {
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getPackingRules()
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getPackingRules()
    },
    handlePackRule (row) {
      this.dialogVisible = true
      if (row) {
        this.isEdit = true
        let mPomWorkMasPackRuleId = row.mPomWorkMasPackRuleId
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialog.dialogForm)
          this.$refs.dialog.dialogForm = this.$global.filterForm(row, keys)
          this.$refs.dialog.dialogForm.mPomWorkMasPackRuleId = mPomWorkMasPackRuleId
        })
      } else {
        this.isEdit = false
      }
    },
    editPackDetail () {
      this.editDetail = true
    },
    // 获取编码规则
    async getCodingRules () {
      let res = await this.$api.getCodingRules(this.codeRuleSearch)
      this.codeRuleList = res.data.list
    },
    // 获取打印条码模板
    async getPrintBarCodeType () {
      let res = await this.$api.getPrintBarCodeType(this.PrintBarCodeTypeSearch)
      this.printBarList = res.data.list
    },
    cellClick (row, column, cell, event) {
      this.showTabs = true
      this.mPomWorkMasPackRuleId = row.mPomWorkMasPackRuleId
      this.getPackingRuleStep()
    },
    handleSelectionChange (selection) {
      this.selectList = []
      selection.map(item => {
        this.selectList.push(item.mPomWorkMasPackRuleId)
      })
    },
    // 获取所有包装规则
    async getPackingRules () {
      const { keywords, page, queryLevel } = this
      const data = Object.assign({ keywords, queryLevel }, page)
      const res = await this.$api.getPackingRules(data)
      if (res.code === '200') {
        this.tableData = res.data.list
        this.total = res.data.totalNum
      } else {
        this.tableData = []
        this.total = 0
      }
    },
    // 刷新数据，重新查询
    refreshData () {
      this.keywords = ''
      this.page = {
        pageIndex: 1,
        pageSize: 10
      }
      this.getPackingRules()
    },
    addDetail () {
      this.detailData.push({
        stepName: '',
        mComUomPackId: '',
        stdQty: '',
        mSeqPackId: '',
        mPomWorkMasPrintTmplId: '',
        scanType: '',
        packType: ''
      })
    },
    goback () {
      this.editDetail = false
      this.getPackingRuleStep()
    },
    delDetailRow (index) {
      this.detailData.splice(index, 1)
    },
    // 根据id获取包装规则详情
    async getPackingRuleStep () {
      let { mPomWorkMasPackRuleId } = this
      let res = await this.$api.getPackingRuleStep({ mPomWorkMasPackRuleId })
      this.detailData = res.data
    },
    async saveDetailList () {
      let { mPomWorkMasPackRuleId, detailData } = this
      let valid = true
      if (detailData.length > 0) {
        for (let i = 0; i < detailData.length; i++) {
          if (!detailData[i].stepName) {
            this.$message.warning(`请选择第${i + 1}行中的步骤名`)
            valid = false
            break
          }
          if (!detailData[i].mComUomPackId) {
            this.$message.warning(`请选择第${i + 1}行中的单位`)
            valid = false
            break
          }
          if (!detailData[i].stdQty) {
            this.$message.warning(`请选择第${i + 1}行中的目标数量`)
            valid = false
            break
          }
          if (!detailData[i].mPomWorkMasPrintTmplId) {
            this.$message.warning(`请选择第${i + 1}行中的打印条码模板`)
            valid = false
            break
          }
          if (!detailData[i].scanType) {
            this.$message.warning(`请选择第${i + 1}行中的扫描类型`)
            valid = false
            break
          }
          if (!detailData[i].packType) {
            this.$message.warning(`请选择第${i + 1}行中的包装类型`)
            valid = false
            break
          }
        }
        if (valid) {
          let list = []
          let keys = ['stepName', 'mComUomPackId', 'stdQty', 'mSeqPackId', 'mPomWorkMasPrintTmplId', 'scanType', 'packType']
          detailData.map(item => {
            let obj = {}
            keys.forEach(key => {
              obj[key] = item[key]
            })
            list.push(obj)
          })
          let data = {
            mPomWorkMasPackRuleId, packRuleStepVms: list
          }
          let res = await this.$api.updatePackRuleStep(data)
          this.$myPrompt.handleMsg(res, () => {
            this.editDetail = false
            this.getPackingRuleStep()
          })
        }
      } else {
        this.$message.warning('请先添加包装规则详情！')
      }
    },
    async deleteRule (id) {
      let ids = id ? [id] : this.selectList
      let len = ids.length
      if (len > 0) {
        let confirmRes = await this.$myPrompt.confirm('确定删除当前选中的包装规则信息吗?')
        if (confirmRes) {
          let res = await this.$api.delPackingRules(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.getPackingRules()
            this.cannel()
          })
        }
      } else {
        this.$message.warning('请选择需要删除的包装规则！')
      }
    },
    cannel () {
      this.dialogVisible = false
    }
  },
  components: {
    dialogForm
  },
  created () {
    this.getPackingRules()
    this.getCodingRules()
    this.getPrintBarCodeType()
  }
}
</script>
