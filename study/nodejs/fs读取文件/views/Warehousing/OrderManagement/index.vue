<template>
  <div class="mes-main mes-work-order">
    <div class="mes-main-title">采购订单管理</div>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-select size="mini" placeholder="订单状态"  v-model="searchForm.orderState" clearable filterable style="width:40%" @change="$refs.tableList.queryList(true)">
            <el-option label="开立" value="0"></el-option>
            <el-option label="取消" value="1"></el-option>
            <el-option label="收货中" value="2"></el-option>
            <el-option label="完成" value="3"></el-option>
          </el-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;" @click="showMoreConditon = !showMoreConditon">
            <i class="fa fa-filter"></i>
        </el-button>
        <el-input size="mini" placeholder="采购订单号" v-model="searchForm.poNo" style="width:40%;float:right;" @keydown.enter.native="$refs.tableList.queryList(true)">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="$refs.tableList.queryList(true)"></i>
        </el-input>
      </el-col>
      <el-col :span="24"   style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
          <el-form-item label="物料编码" class="el-col el-col-11">
            <el-input size="mini" v-model="searchForm.materialNo"></el-input>
          </el-form-item>
          <el-form-item label="物料名称" class="el-col el-col-11 el-col-offset-1">
            <el-input size="mini" v-model="searchForm.materialName"></el-input>
          </el-form-item>
          <el-form-item label="供应商编码" class="el-col el-col-11">
            <el-input size="mini" v-model="searchForm.vendorCode"></el-input>
          </el-form-item>
          <el-form-item label="供应商名称" class="el-col el-col-11 el-col-offset-1">
            <el-input size="mini" v-model="searchForm.vendorName"></el-input>
          </el-form-item>
          <el-form-item label="制单日期" class="el-col el-col-11">
            <el-date-picker
              v-model="searchForm.time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"  format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              size="mini"
              style="width:100%;">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div>
      <table-list ref="tableList" :tableData="tableData" :tableOption="option"  :queryListApi="getPoList" :total="total">
        <div slot="buttonBox">
          <el-button size="mini" icon="el-icon-search" @click="$refs.tableList.queryList(true)">查询</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="showPop">新增</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deletetableData($refs.tableList.getSelectData().map(item => item.mwmsPoId))">批量删除</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">刷新</el-button>
        </div>
      </table-list>
    </div>
     <div class="mes-main-tabs mes-table" v-if="showTabs" style="margin-top:10px">
        <el-tabs v-model="activeName">
          <el-tab-pane label="采购订单明细" name="detailed">
            <div v-if="!isEdit"><el-button size="mini" icon="el-icon-edit" @click="isEdit = true">编辑</el-button></div>
            <div v-else>
              <el-button size="mini" icon="el-icon-plus" @click="addDetail">新增</el-button>
              <span class="split-line">|</span>
              <el-button size="mini" icon="el-icon-delete-solid" @click="delDetail">删除</el-button>
              <span class="split-line">|</span>
              <el-button size="mini" icon="el-icon-refresh-right" @click="savePoDetail()">保存</el-button>
            </div>
            <el-table :data="detailList" border size="mini" style="margin-top:10px" @selection-change="selectionChange">
              <el-table-column type="selection" align="center" fixed="left" ></el-table-column>
              <el-table-column type="index" label="序号" align="center" fixed="left" width="80" :index="1"></el-table-column>
              <el-table-column prop="materialId" sortable label="物料" min-width="180" align="center">
                <template slot-scope="scope">
                  <el-select v-if="isEdit" v-model="scope.row.materialId" filterable clearable  style="width:100%" @change="changeMaterial(scope.row)">
                    <el-option v-for="(option,i) in masterialList" :key="i" :label="option.materialNo" :value="option.mComMaterialId"></el-option>
                  </el-select>
                  <div v-else>{{findMaterial(scope.row.materialId).materialNo}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="materialName" sortable label="物料名称" min-width="150" align="center"></el-table-column>
              <el-table-column prop="uomName" sortable label="主单位" min-width="150" align="center">
                 <template slot-scope="scope">
                  <div>{{findMaterial(scope.row.materialId).uomName}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="poQty" sortable label="采购数量" min-width="150" align="center">
                 <template slot-scope="scope">
                  <el-input v-if="isEdit" size="mini"  v-model="scope.row.poQty" @change="checkPoQty(scope.row)"></el-input>
                  <div v-else>{{scope.row.poQty}}</div>
                 </template>
              </el-table-column>
              <el-table-column prop="receiveWarehouseId" sortable label="收货仓库" min-width="150" align="center">
                <template slot-scope="scope">
                  <el-select v-if="isEdit" v-model="scope.row.receiveWarehouseId" filterable clearable  style="width:100%">
                    <el-option v-for="(option,i) in warehouseList" :key="i" :label="option.mWmsWarehouseName" :value="option.mWmsWarehouseId"></el-option>
                  </el-select>
                  <div v-else>{{scope.row.receiveWarehouseName}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="workOrderNo" sortable label="工单号" min-width="150" align="center">
                <template slot-scope="scope">
                  <el-select v-if="isEdit" v-model="scope.row.workOrderNo" filterable clearable  style="width:100%">
                    <el-option v-for="(option,i) in jobOrderList" :key="i" :label="option.DOC_NO" :value="option.DOC_NO"></el-option>
                  </el-select>
                  <div v-else>{{scope.row.workOrderNo}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="receiveQty" sortable label="已收数量" min-width="150" align="center"></el-table-column>
              <el-table-column prop="notReceiveQty" sortable label="未收数量" min-width="150" align="center"></el-table-column>
              <el-table-column prop="returnQty" sortable label="退货数量" min-width="150" align="center"></el-table-column>
              <el-table-column prop="createUnReceiveQty" sortable label="已建单未收数量" min-width="180" align="center"></el-table-column>
              <el-table-column prop="unCreateUnReceiveQty" sortable label="未建单未收数量" min-width="180" align="center"></el-table-column>
              <el-table-column prop="shelveQty" sortable label="上架数量" min-width="150" align="center"></el-table-column>
              <el-table-column prop="createReturnQty" sortable label="已建单待退数量" min-width="180" align="center"></el-table-column>
              <el-table-column prop="unCreateReturnQty" sortable label="未建单可退数量" min-width="180" align="center"></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 新增弹窗 -->
    <el-dialog
        :title="addForm.mwmsPoId ? '编辑采购订单' : '新增采购订单' "
        :visible.sync="addVisible"
        width="1200px">
        <el-form class="el-row" ref="addForm" :model="addForm" :rules="rules" label-width="120px" label-position="left">
          <el-row>
            <el-form-item label="采购订单号"  prop="mwmsPoNo" class="el-col el-col-11 ">
              <el-input  v-model="addForm.mwmsPoNo" style="width:60%"></el-input>
              <el-button type="primary" style="width:35%;float: right;" @click="getJobOrderNo()">按规则产生单号</el-button>
            </el-form-item>
            <el-form-item label="供应商"  prop="vendorId" class="el-col el-col-11 el-col-offset-1">
              <el-select v-model="addForm.vendorId" filterable clearable  style="width:100%" @change="changeVendor">
                <el-option v-for="(option,i) in vendorList" :key="i" :label="option.mWmsVendorName" :value="option.mWmsVendorId">
                  <span style="float: left">{{ option.mWmsVendorCode }}</span>
                  <span style="float: right; color: #8492a6; font-size: 14px">{{ option.mWmsVendorName}}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-form-item label="供应商编码"  prop="vendorCode" class="el-col el-col-11">
            <el-input v-model="addForm.vendorCode" disabled></el-input>
          </el-form-item>
          <el-form-item label="订单类型"  prop="billType" class="el-col el-col-11 el-col-offset-1">
            <dict-select v-model="addForm.billType" dictType="PURCHASE_ORDER_TYPE"  selectKey="dictCode"></dict-select>
          </el-form-item>
          <el-form-item label="联系电话"  prop="contactNumber" class="el-col el-col-11">
            <el-input v-model="addForm.contactNumber"></el-input>
          </el-form-item>
          <el-form-item label="联系人"  prop="contacts" class="el-col el-col-11  el-col-offset-1">
            <el-input v-model="addForm.contacts"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="savePo" :loading="saveLoading">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import TableList from '@/components/Module/TableList'
import { tableOption } from './tableOption'
export default {
  data () {
    return {
      searchForm: {
        orderState: '',
        poNo: '',
        materialNo: '',
        materialName: '',
        vendorCode: '',
        vendorName: '',
        time: []
      },
      addForm: {
        mwmsPoId: '',
        billType: '',
        contactNumber: '',
        contacts: '',
        mwmsPoNo: '',
        orderDate: '',
        vendorId: '',
        vendorCode: ''
      },
      rules: {
        mwmsPoNo: [{ required: true, message: '订单号不能为空' }],
        vendorId: [{ required: true, message: '供应商不能为空' }],
        billType: [{ required: true, message: '订单类型不能为空' }],
        contactNumber: [{ pattern: /^1[3456789]\d{9}$|^0\d{2,3}-?\d{7,8}$/, message: '请输入正确的手机或电话号码' }]
      },
      saveLoading: false,
      vendorList: [],
      masterialList: [],
      warehouseList: [],
      jobOrderList: [],
      showMoreConditon: false,
      total: 0,
      option: tableOption(this),
      tableData: [],
      showTabs: false,
      addVisible: false,
      isEdit: false,
      mwmsPoId: '',
      activeName: 'detailed',
      detailList: [],
      multipleSelection: []
    }
  },
  computed: {
  },
  watch: {
    mwmsPoId (n) {
      this.getPoDetailList()
    }
  },
  methods: {
    // 刷新数据，重新查询
    refreshPage () {
      this.searchForm = {
        orderState: '',
        poNo: '',
        materialNo: '',
        materialName: '',
        vendorCode: '',
        vendorName: '',
        time: []
      }
      this.$refs.tableList.queryList(true)
    },
    async getVendors () {
      let data = {
        mWmsVendorCode: '',
        pageIndex: 1,
        pageSize: 1000
      }
      let res = await this.$api.getVendors(data)
      this.vendorList = res.code === '200' ? res.data.list : []
    },
    showPop () {
      this.addForm = {
        mwmsPoId: '',
        billType: '',
        contactNumber: '',
        contacts: '',
        mwmsPoNo: '',
        orderDate: '',
        vendorId: '',
        vendorCode: ''
      }
      this.$refs.addForm && this.$refs.addForm.resetFields()
      this.addVisible = true
    },
    async getJobOrderNo () {
      let res = await this.$api.getJobOrderNo('po', 1)
      this.addForm.mwmsPoNo = res.data
    },
    changeVendor () {
      let vendorObj = this.addForm.vendorId ? this.vendorList.find(item => this.addForm.vendorId === item.mWmsVendorId) : null
      this.addForm.vendorCode = vendorObj ? vendorObj.mWmsVendorCode : ''
    },
    async getPoList (page) {
      let { time } = this.searchForm
      let data = {
        ...this.searchForm,
        startTime: time && time.length ? time[0] : '',
        endTime: time && time.length ? time[1] : ''
      }
      delete data.time
      let res = await this.$api.getPoList({ ...page, ...data })
      if (res.code === '200') {
        this.total = res.data.totalNum
        this.tableData = res.data.list
      } else {
        this.total = 0
        this.tableData = []
      }
    },
    async savePo () {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          this.saveLoading = true
          let res = this.addForm.mwmsPoId ? await this.$api.updatePo({ ...this.addForm }) : await this.$api.insertPo({ ...this.addForm })
          this.saveLoading = false
          if (res.code === '200') {
            this.addVisible = false
            this.$message.success('保存成功')
            this.$refs.tableList.queryList(true)
          }
        }
      })
    },
    async deletetableData (ids) {
      const len = ids.length
      if (len > 0) {
        const confirmRes = await this.$myPrompt.confirm('确定删除当前选中的数据吗?')
        if (confirmRes) {
          const res = await this.$api.deletePo(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.$refs.tableList.queryList()
          })
        }
      } else {
        this.$message.warning('确定删除当前选中的数据吗')
      }
    },
    async getPoDetailList () {
      let res = await this.$api.getPoDetailList({ id: this.mwmsPoId })
      if (res.code === '200') {
        this.detailList = res.data && res.data.list ? res.data.list.map(item => {
          return {
            ...item,
            rowId: item.mwmsPoDtlId
          }
        }) : []
      } else {
        this.detailList = []
      }
    },
    // 获取物料列表
    async getMaterialMasters () {
      let res = await this.$api.getMaterialMasters({ pageIndex: 1, pageSize: 1000 })
      if (res.code === '200') {
        this.masterialList = res.data && res.data.list ? res.data.list : []
      } else {
        this.masterialList = []
      }
    },
    // 获取仓库列表
    async getWarehouses () {
      let res = await this.$api.getWarehouses({ keywords: '', pageSize: 10000, pageIndex: 1 })
      // 过滤掉未启用仓库
      this.warehouseList = res.data.list ? res.data.list.filter(item => item.invalid) : []
    },
    // 获取工单数据列表
    async getWorkOrderList () {
      let data = {
        orderStatus: '',
        keyWord: '',
        sortDes: '',
        pageSize: 1000,
        pageIndex: 1
      }
      let res = await this.$api.getJobOrdersByArg(data)
      this.jobOrderList = res.data.list
    },
    findMaterial (id) {
      let materialObj = this.masterialList.find(item => item.mComMaterialId === id)
      return {
        materialNo: materialObj ? materialObj.materialNo : '',
        materialName: materialObj ? materialObj.materialName : '',
        uomName: materialObj ? materialObj.uomCode : ''
      }
    },
    checkPoQty (row) {
      let reg = /^\d+(\.\d+)?$/
      if (!reg.test(row.poQty)) {
        row.poQty = ''
        this.$message.error('采购数量格式不正确')
        return false
      }
    },
    selectionChange (val) {
      this.multipleSelection = val
    },
    addDetail () {
      this.detailList.push({
        rowId: new Date().getTime(),
        materialId: '',
        materialNo: '',
        materialName: '',
        poQty: '',
        receiveWarehouseId: '',
        unitId: '',
        uomName: '',
        workOrderNo: ''
      })
    },
    delDetail () {
      let rowIds = this.multipleSelection.map(item => item.rowId)
      this.detailList = this.detailList.filter(item => rowIds.indexOf(item.rowId) === -1)
    },
    changeMaterial (row) {
      let materialObj = this.masterialList.find(item => item.mComMaterialId === row.materialId)
      row.materialNo = materialObj ? materialObj.materialNo : ''
      row.materialName = materialObj ? materialObj.materialName : ''
      row.uomName = materialObj ? materialObj.uomCode : ''
      row.unitId = materialObj ? materialObj.mComUomId : ''
    },
    async savePoDetail () {
      let obj = this.detailList.find(item => !item.materialId || !item.unitId || !item.poQty)
      if (obj) {
        this.$message.warning('物料、主单位、采购数量不能为空')
        return false
      }
      let res = await this.$api.savePoDetail({ mwmsPoId: this.mwmsPoId, items: this.detailList })
      if (res.code === '200') {
        this.isEdit = false
        this.$message.success('保存成功')
        this.getPoDetailList()
      }
    }
  },
  components: {
    TableList
  },
  created () {
    this.getVendors()
    this.getMaterialMasters()
    this.getWarehouses()
    this.getWorkOrderList()
  }
}
</script>
