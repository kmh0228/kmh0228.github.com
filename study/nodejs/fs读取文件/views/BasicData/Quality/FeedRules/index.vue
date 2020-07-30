<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('feedRules_InspeReguMain')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
         <el-select style="width:35%;" size="mini" clearable filterable  :placeholder="$t('feedRules_PleasSeleItemNu')" v-model="searchForm.materialId" >
          <el-option v-for="(option,i) in materialList" :key="i" :label="option.materialNo" :value="option.mComMaterialId" ></el-option>
        </el-select>
      </el-col>
      <el-col :span="12">
        <el-input style="width:35%;float:right" v-model.trim="searchForm.sipNo" size="mini" clearable :placeholder="$t('feedRules_PleasEnteInspNu')" @keydown.enter.native="initData">
        </el-input>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button size="mini" icon="el-icon-search" @click="initData">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus"  @click="handleInspection('')">{{$t('common_Add')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="delSipMain('')">{{$t('common_Delete')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh"  @click="refreshData">{{$t('common_Refresh')}}</el-button>
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
          <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod" ></el-table-column>
          <el-table-column prop="sipNo" :label="$t('feedRules_InspeReguNo')" align="center" sortable label-class-name="mes-table-label" class-name="mes-table-click"></el-table-column>
          <el-table-column prop="sipVersion" :label="$t('feedRules_RevisInspRegu')" align="center" sortable></el-table-column>
          <el-table-column prop="lastEditor" :label="$t('feedRules_LastMain')" align="center" sortable></el-table-column>
          <el-table-column prop="lastEditedDt" :label="$t('feedRules_LastMainTime')" align="center" sortable></el-table-column>
          <el-table-column :label="$t('common_Operate')" align="center" width="120" fixed="right">
            <template slot-scope="scope">
              <handle-button @click="handleInspection(scope.row)" iconClass='el-icon-edit-outline' :tipText="$t('common_Edit')"></handle-button>
              <handle-button @click="delSipMain(scope.row.mqomSipMainId)" iconClass='el-icon-delete' :tipText="$t('common_Del')" iconColor='#f56c6c'></handle-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="mes-main-tabs" v-if="showTabs" style="margin-top:10px">
        <el-tabs v-model="activeName">
          <el-tab-pane :label="$t('feedRules_CorreMateNumbIn')" name="inspectMaterial">
                <el-row class="mes-table-handle">
                  <el-col :span="12">
                    <div  v-if="editDetail" >
                      <el-button @click="addMaterialRow">{{$t('common_add')}}</el-button>
                      <span class="split-line">|</span>
                      <el-button @click="saveMaterial">{{$t('common_save')}}</el-button>
                      <span class="split-line">|</span>
                      <el-button @click="revokeInspect">{{$t('common_revok')}}</el-button>
                    </div>
                      <el-button  v-else type="primary" plain size="mini" @click="editDetail = true">{{$t('common_Edit')}}</el-button>
                  </el-col>
                </el-row>
              <div class="mes-table-content">
                <el-table :data="materialData" border size="mini">
                  <el-table-column type="index" :label="$t('common_Number')" align="center" ></el-table-column>
                  <el-table-column  :label="$t('common_PorN')" align="center" sortable>
                    <template slot-scope="scope">
                        <dialogTableSelect v-if="editDetail" ref="dialogTableSelect" class="mes-form-item" :contentValue="materialNoVersion(scope.$index)"  v-model="scope.row.mcomMaterialId" selectId="mComMaterialId" :searchPlaceholder="$t('common_PleaseSelectPN')" :searchForm="materialSearch" searchKey="materialNo" :showKey="['materialNo','version']" :tableColumns="materialColumns" getDataFunction="getMaterialMasters" @change="getTypeAndNameByPartNo(scope.row.mcomMaterialId,scope.$index)"></dialogTableSelect>
                      <p v-else>{{ scope.row.materialNo }}</p>
                    </template>
                  </el-table-column>
                  <el-table-column  :label="$t('feedRules_ItemNumbCate')" align="center" sortable>
                     <template slot-scope="scope">
                      <el-input   v-if="editDetail" size="mini" :disabled="true" v-model="scope.row.materialClassCode"></el-input>
                      <p v-else>{{ scope.row.materialClassCode }}</p>
                    </template>
                  </el-table-column>
                  <el-table-column  :label="$t('common_ProduName')" align="center" sortable>
                     <template slot-scope="scope">
                      <el-input   v-if="editDetail" size="mini" v-model="scope.row.productName" ></el-input>
                      <p v-else>{{ scope.row.productName }}</p>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('common_Operate')" align="center" v-if="editDetail" >
                    <template slot-scope="scope">
                      <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteMaterial(scope.$index)"></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
          </el-tab-pane>
           <el-tab-pane :label="$t('feedRules_InspeItem')" name="inspectItem">
             <el-row class="mes-table-handle">
              <el-col :span="12">
                <el-button size="mini" :disabled="iqcEditdisabled" @click="handleIqc(true)">{{$t('common_Edit')}}</el-button>
                <span class="split-line">|</span>
                <el-button size="mini" @click="handleIqc(false)">{{$t('common_Add')}}</el-button>
                <span class="split-line">|</span>
                <el-button size="mini" @click="delQomSipItem">{{$t('common_Del')}}</el-button>
                <span class="split-line">|</span>
                <el-button size="mini" :disabled="iqcDisabled" @click="iqcTypeDialog =true">{{$t('feedRules_TypeInsp')}}</el-button>
              </el-col>
             </el-row>
             <div class="mes-table-content">
               <el-table :data="iqcData" border size="mini"  @selection-change="selectionChangeIqc">
                <el-table-column  type="selection"></el-table-column>
                <el-table-column type="index" :label="$t('common_Number')" align="center" ></el-table-column>
                <el-table-column prop="inspectItem" :label="$t('common_InspeItem')" align="center" sortable></el-table-column>
                <el-table-column prop="inspectContent" :label="$t('common_InspeCont')" align="center" sortable></el-table-column>
                <el-table-column prop="locationContent" :label="$t('common_MapLoca')" align="center" sortable></el-table-column>
                <el-table-column prop="spec" :label="$t('common_Speci')" align="center" sortable></el-table-column>
                <el-table-column prop="inspectMethod" :label="$t('feedRules_testMeth')" align="center" sortable></el-table-column>
                <el-table-column prop="inspectTool" :label="$t('feedRules_TestiTool')" align="center" sortable></el-table-column>
                <el-table-column prop="frequency" :label="$t('feedRules_DetecFreq')" align="center" sortable></el-table-column>
                <el-table-column prop="checkType" :label="$t('feedRules_TypeInsp')" align="center" sortable></el-table-column>
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
    <el-dialog :visible.sync="iqcTypeDialog" :title="$t('feedRules_ReEditGaugType')" width="400px" class="handle-dialog">
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
        label: 'common_PorN'
      }, {
        key: 'materialName',
        label: 'common_MaterialName'
      }, {
        key: 'version',
        label: 'common_Edition'
      }, {
        key: 'mComMaterialtypeCode',
        label: 'common_MaterialType'
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
      return this.isEdit ? this.$t('feedRules_EditIncoInspRul') : this.$t('feedRules_NewIncoInspRule')
    },
    iqcDialogTitle () {
      return this.isEditIqc ? this.$t('feedRules_EditInspItem') : this.$t('feedRules_NewInspItem')
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
        const confirm = await this.$myPrompt.confirm(this.$t('feedRules_AreYouSureDeleS'))
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
        this.$message.warning(this.$t('common_PleasSeleInfoDe'))
      }
    },
    // 删除检规项目
    async delQomSipItem () {
      let ids = this.sqcSelectList
      const len = ids.length
      if (len > 0) {
        const confirm = await this.$myPrompt.confirm(this.$t('feedRules_AreYouSureDeleT'))
        if (confirm) {
          let res = await this.$api.delQomSipItem(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.findItemList()
          })
        }
      } else {
        this.$message.warning(this.$t('common_PleasSeleInfoDe'))
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
