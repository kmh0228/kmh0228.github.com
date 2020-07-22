<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">检规维护</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
         <el-select style="width:35%;" size="mini" clearable filterable  placeholder="请选择维护的料号" v-model="searchForm.materialId" >
          <el-option v-for="(option,i) in materialList" :key="i" :label="option.materialNo" :value="option.mComMaterialId" ></el-option>
        </el-select>
      </el-col>
      <el-col :span="12">
        <el-input style="width:35%;float:right" v-model.trim="searchForm.sipNo" size="mini" clearable placeholder="请输入检验编号" @keydown.enter.native="initData">
        </el-input>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button size="mini" icon="el-icon-search" @click="initData">查询</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus"  @click="handleInspection('')">新增</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="delSipMain('')">批量删除</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh"  @click="refreshData">刷新</el-button>
        </el-col>
        <el-col :span="12">
           <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper, ->" :total="total" :current-page="page.pageIndex"
            @current-change="handleCurrentChange" @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
      </el-row>
      <div class="mes-table-content">
        <el-table :data="tableData" border size="mini" @selection-change="selectionChange" highlight-current-row @cell-click="cellClick">
          <el-table-column type="selection" align="center"></el-table-column>
          <el-table-column type="index" label="序号" align="center" :index="indexMethod" ></el-table-column>
          <el-table-column prop="sipNo" label="检规编号" align="center" sortable label-class-name="mes-table-label" class-name="mes-table-click"></el-table-column>
          <el-table-column prop="sipVersion" label="检规版次" align="center" sortable></el-table-column>
          <el-table-column prop="lastEditor" label="最后维护人" align="center" sortable></el-table-column>
          <el-table-column prop="lastEditedDt" label="最后维护时间" align="center" sortable></el-table-column>
          <el-table-column label="操作" align="center" width="120" fixed="right">
            <template slot-scope="scope">
              <handle-button @click="handleInspection(scope.row)" iconClass='el-icon-edit-outline' tipText="编辑"></handle-button>
              <handle-button @click="delSipMain(scope.row.mqomSipMainId)" iconClass='el-icon-delete' tipText="删除" iconColor='#f56c6c'></handle-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="mes-main-tabs" v-if="showTabs" style="margin-top:10px">
        <el-tabs v-model="activeName">
          <el-tab-pane label="检规对应料号" name="inspectMaterial">
                <el-row class="mes-table-handle">
                  <el-col :span="12">
                    <div  v-if="editDetail" >
                      <el-button @click="addMaterialRow">添加</el-button>
                      <span class="split-line">|</span>
                      <el-button @click="saveMaterial">保存</el-button>
                      <span class="split-line">|</span>
                      <el-button @click="revokeInspect">撤销</el-button>
                    </div>
                      <el-button  v-else type="primary" plain size="mini" @click="editDetail = true">编辑</el-button>
                  </el-col>
                </el-row>
              <div class="mes-table-content">
                <el-table :data="materialData" border size="mini">
                  <el-table-column type="index" label="序号" align="center" ></el-table-column>
                  <el-table-column  label="料号" align="center" sortable>
                    <template slot-scope="scope">
                        <dialogTableSelect v-if="editDetail" ref="dialogTableSelect" class="mes-form-item" :contentValue="materialNoVersion(scope.$index)"  v-model="scope.row.mcomMaterialId" selectId="mComMaterialId" searchPlaceholder="请选择料号" :searchForm="materialSearch" searchKey="materialNo" :showKey="['materialNo','version']" :tableColumns="materialColumns" getDataFunction="getMaterialMasters" @change="getTypeAndNameByPartNo(scope.row.mcomMaterialId,scope.$index)"></dialogTableSelect>
                      <p v-else>{{ scope.row.materialNo }}</p>
                    </template>
                  </el-table-column>
                  <el-table-column  label="料号类别" align="center" sortable>
                     <template slot-scope="scope">
                      <el-input   v-if="editDetail" size="mini" :disabled="true" v-model="scope.row.materialClassCode"></el-input>
                      <p v-else>{{ scope.row.materialClassCode }}</p>
                    </template>
                  </el-table-column>
                  <el-table-column  label="品名" align="center" sortable>
                     <template slot-scope="scope">
                      <el-input   v-if="editDetail" size="mini" v-model="scope.row.productName" ></el-input>
                      <p v-else>{{ scope.row.productName }}</p>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center" v-if="editDetail" >
                    <template slot-scope="scope">
                      <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteMaterial(scope.$index)"></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
          </el-tab-pane>
           <el-tab-pane label="检规项目" name="inspectItem">
             <el-row class="mes-table-handle">
              <el-col :span="12">
                <el-button size="mini" :disabled="iqcEditdisabled" @click="handleIqc(true)">编辑</el-button>
                <span class="split-line">|</span>
                <el-button size="mini" @click="handleIqc(false)">新增</el-button>
                <span class="split-line">|</span>
                <el-button size="mini" @click="delQomSipItem">删除</el-button>
                <span class="split-line">|</span>
                <el-button size="mini" :disabled="iqcDisabled" @click="iqcTypeDialog =true">检验类型</el-button>
              </el-col>
             </el-row>
             <div class="mes-table-content">
               <el-table :data="iqcData" border size="mini"  @selection-change="selectionChangeIqc">
                <el-table-column  type="selection"></el-table-column>
                <el-table-column type="index" label="序号" align="center" ></el-table-column>
                <el-table-column prop="inspectItem" label="检验项目" align="center" sortable></el-table-column>
                <el-table-column prop="inspectContent" label="检验内容" align="center" sortable></el-table-column>
                <el-table-column prop="locationContent" label="图位" align="center" sortable></el-table-column>
                <el-table-column prop="spec" label="规格" align="center" sortable></el-table-column>
                <el-table-column prop="inspectMethod" label="检测方法" align="center" sortable></el-table-column>
                <el-table-column prop="inspectTool" label="检测工具" align="center" sortable></el-table-column>
                <el-table-column prop="frequency" label="检测频率" align="center" sortable></el-table-column>
                <el-table-column prop="checkType" label="检验类型" align="center" sortable></el-table-column>
              </el-table>
             </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle"  width="600px" class="handle-dialog">
      <dialog-form v-if="dialogVisible" ref="dialogForm"  @cannel="cannel" @initData="initData" :isEdit="isEdit"></dialog-form>
    </el-dialog>
    <el-dialog :visible.sync="iqcDialogVisible" :title="iqcDialogTitle" width="900px" class="handle-dialog">
      <iqc-dialog  v-if="iqcDialogVisible" ref="iqcDialog" @cannelIqc="cannelIqc" :onMQomSipMainId="onMQomSipMainId" @findItemList="findItemList" :isEditIqc="isEditIqc"></iqc-dialog>
    </el-dialog>
    <el-dialog :visible.sync="iqcTypeDialog" title="重新编辑检规类型" width="400px" class="handle-dialog">
      <iqc-type v-if="iqcTypeDialog" ref="iqcTypeForm" @cannelType="cannelType" :sqcSelectList="sqcSelectList" @findItemList="findItemList"></iqc-type>
    </el-dialog>
    </div>
  </div>
</template>

<script>
import dialogTableSelect from '@/components/Module/DialogTableSelect/dialogTableSelect'
import dialogForm from './dialogForm'
import iqcDialog from './iqcDialog'
import iqcType from './iqcType'
export default {
  data () {
    // 0是进料检验规则  1是进料检验规则详细
    return {
      materialList: [],
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
      tableData: [],
      materialData: [],
      iqcData: [],
      selectList: [],
      showTabs: false,
      activeName: 'inspectMaterial',
      editDetail: false,
      editDetail1: false,
      isEdit: false,
      isEditIqc: false,
      dialogVisible: false,
      iqcDialogVisible: false,
      iqcTypeDialog: false,
      searchForm: {
        queryLevel: 1,
        materialId: '',
        sipNo: ''
      },
      sqcSelectList: [],
      // 被选中的检规id
      onMQomSipMainId: '',
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
      }
    }
  },
  computed: {
    iqcEditdisabled () {
      let len = this.sqcSelectList.length
      return len !== 1
    },
    iqcDisabled () {
      let len = this.sqcSelectList.length
      return len < 1
    },
    dialogTitle () {
      return this.isEdit ? '编辑进料检验规则' : '新增进料检验规则'
    },
    iqcDialogTitle () {
      return this.isEditIqc ? '编辑检规项目' : '新增检规项目'
    }

  },
  methods: {
    handleSizeChange (size) {
      this.page.pageSize = size
      this.initData()
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.initData()
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    cellClick (row, column, cell, event) {
      this.onMQomSipMainId = row.mqomSipMainId
      this.showTabs = true
      this.getMainRelationList()
      this.findItemList()
    },
    selectionChange (selection) {
      this.selectList = []
      selection.map(item => {
        this.selectList.push(item.mqomSipMainId)
      })
    },
    selectionChangeIqc (selection) {
      this.sqcSelectList = []
      selection.map(item => {
        this.sqcSelectList.push(item.mqomSipItemId)
      })
    },
    handleInspection (row) {
      this.dialogVisible = true
      if (row) {
        this.isEdit = true
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.dialogForm.dialogForm)
          this.$refs.dialogForm.dialogForm = this.$global.filterForm(row, keys)
          this.$refs.dialogForm.dialogForm.mqomSipMainId = row.mqomSipMainId
        })
      } else {
        this.isEdit = false
      }
    },
    handleIqc (isEditIqc) {
      this.isEditIqc = isEditIqc
      this.iqcDialogVisible = true
      let selectObj = {}
      if (isEditIqc) {
        let { sqcSelectList, iqcData } = this
        let mqomSipItemId = sqcSelectList[0]
        selectObj = iqcData.filter(item => {
          return item.mqomSipItemId === mqomSipItemId
        })[0]
        this.$nextTick(() => {
          let keys = Object.keys(this.$refs.iqcDialog.iqcDialogForm)
          this.$refs.iqcDialog.iqcDialogForm = this.$global.filterForm(selectObj, keys)
          this.$refs.iqcDialog.iqcDialogForm.mqomSipItemId = mqomSipItemId
          let checkType = selectObj.checkType.toLowerCase()
          checkType = checkType.split(',')
          this.$refs.iqcDialog.checkedInspect = checkType
        })
      }
    },
    materialNoVersion (index) {
      const materialNo = this.materialData[index].materialNo ? this.materialData[index].materialNo : ''
      return `${materialNo}`
    },
    // 获取所有料号列表
    async getMaterialList () {
      let data = {
        materialNo: '',
        materialType: '',
        pageIndex: 1,
        pageSize: 1000
      }
      let res = await this.$api.getMaterialMasters(data)
      this.materialList = res.data.list
    },
    // 根据料号获取品名和物料类别
    async getTypeAndNameByPartNo (partId, index) {
      let res = await this.$api.getTypeAndNameByPartNo({ partId })
      let { materialClass, materialClassCode, productName } = res.data
      // let materialClassCode = res.data.materialClassCode
      // let productName = res.data.productName
      this.materialData[index].materialClassCode = materialClassCode
      this.materialData[index].materialClass = materialClass
      this.materialData[index].productName = productName
    },
    // 获取检规列表
    async initData () {
      let { page, searchForm } = this
      let data = Object.assign(page, searchForm)
      let res = await this.$api.getListPage(data)
      if (res.code === '200') {
        this.tableData = res.data.list
        this.total = res.data.totalNum
      } else {
        this.total = 0
        this.tableData = []
      }
    },
    // 刷新数据，重新查询
    refreshData () {
      for (let i in this.searchForm) {
        this.searchForm[i] = ''
      }
      this.page = {
        pageIndex: 1,
        pageSize: 10
      }
      this.initData()
    },
    // 获取检规对应料号列表
    async getMainRelationList () {
      let mainId = this.onMQomSipMainId
      let res = await this.$api.getMainRelationList({ mainId })
      this.materialData = res.data
    },
    // 保存检规对应料号
    async  saveMaterial () {
      let mqomSipMainId = this.onMQomSipMainId
      let partList = this.materialData
      let data = Object.assign({ mqomSipMainId }, { partList })
      let res = await this.$api.saveQomSipTypeRelation(data)
      this.$myPrompt.handleMsg(res, () => {
        this.editDetail = false
        this.getMainRelationList()
      })
    },
    revokeInspect () {
      this.editDetail = false
      this.getMainRelationList()
    },
    // 添加一行检规料号
    addMaterialRow () {
      this.materialData.push({
        mcomMaterialId: '',
        materialClass: '',
        materialClassCode: '',
        productName: ''
      })
    },
    deleteMaterial (index) {
      this.materialData.splice(index, 1)
    },
    // 获取检规项目列表
    async findItemList () {
      let mainId = this.onMQomSipMainId
      let res = await this.$api.findItemList({ mainId })
      this.iqcData = res.data
    },
    // 删除检规
    async delSipMain (id) {
      let ids = id ? [id] : this.selectList
      let len = ids.length
      if (len > 0) {
        const confirm = await this.$myPrompt.confirm('确定删除选择的检规信息吗?')
        if (confirm) {
          let res = await this.$api.delSipMain(ids)
          this.$myPrompt.handleMsg(res, () => {
            if ((this.total - len) % this.page.pageSize === 0) {
              this.page.pageIndex = this.page.pageIndex === 1 ? 1 : this.page.pageIndex - 1
            }
            this.initData()
          })
        }
      } else {
        this.$message.warning('请选择要删除的信息')
      }
    },
    // 删除检规项目
    async delQomSipItem () {
      let ids = this.sqcSelectList
      const len = ids.length
      if (len > 0) {
        const confirm = await this.$myPrompt.confirm('确定删除这些检规项吗？')
        if (confirm) {
          let res = await this.$api.delQomSipItem(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.findItemList()
          })
        }
      } else {
        this.$message.warning('请选择要删除的信息')
      }
    },
    cannel () {
      this.dialogVisible = false
    },
    cannelIqc () {
      this.iqcDialogVisible = false
    },
    cannelType () {
      this.iqcTypeDialog = false
    }
  },
  components: {
    dialogForm, iqcDialog, iqcType, dialogTableSelect
  },
  created () {
    this.getMaterialList()
    this.initData()
  }
}
</script>
