<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('material_materialManager')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-select v-model="materialType" style="width:40%;" size="mini" clearable filterable :placeholder="$t('common_MaterialType')" @change="initData">
          <el-option v-for="(option,i) in materialTypes" :key="i" :label="option.mComMaterialtypeCode" :value="option.mComMaterialtypeId"></el-option>
        </el-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;" @click="showMoreConditon = !showMoreConditon">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-input :placeholder="$t('material_pleaseEnterCode')" v-model.trim="materialNo" size="mini" style="width:40%;float:right;" @keydown.enter.native="initData">
        </el-input>
      </el-col>
      <el-col :span="24" style="padding-top:1vh;">
        <el-form class="el-row mes-search-form" :model="searchForm" label-width="30%" label-position="left" v-show="showMoreConditon">
          <el-form-item :label="$t('material_materialType')" class="el-col el-col-11">
            <el-select v-model="searchForm.mComMaterialClassId" size="mini" style="width:100%" @change="initData"></el-select>
          </el-form-item>
          <el-form-item :label="$t('material_showDelMater')" class="el-col el-col-11 el-col-offset-1">
             <el-checkbox v-model="searchForm.isDeleted" @change="initData"></el-checkbox>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button size="mini" icon="el-icon-search" @click="initData">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="$router.push('/BasicData/Product/Materiel/Add')">{{$t('common_Add')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deleteItemMasters('')">{{$t('common_Delete')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh"  @click="refreshPage">{{$t('common_Refresh')}}</el-button>
          <el-button size="mini" icon=" el-icon-download " @click="showDownDialog">{{$t('common_downLoad')}}</el-button>
        </el-col>
        <el-col :span="12">
          <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :page-count="5"
            layout="total, sizes, prev, pager, next, jumper, ->" :total="total" :current-page="page.pageIndex"
            @current-change="handleCurrentChange" @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
      </el-row>
      <div class="mes-table-content">
        <el-table :data="tableData" border highlight-current-row @selection-change="tableSelectChange" @cell-click="cellClick" @current-change="tableCurrentChange" size="mini">
          <el-table-column type="selection" width="50" align="center"></el-table-column>
          <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod"></el-table-column>
          <el-table-column prop="officeName" :label="$t('common_Factory')" sortable align="center"></el-table-column>
          <el-table-column prop="materialNo" sortable :label="$t('common_PorN')" label-class-name="mes-table-label" class-name="mes-table-click" align="center"></el-table-column>
          <el-table-column prop="materialName" sortable :label="$t('common_MaterialName')" align="center"></el-table-column>
          <el-table-column prop="version" sortable :label="$t('common_Edition')"  width="120" align="center"></el-table-column>
          <el-table-column prop="mComMaterialtypeCode" sortable :label="$t('common_MaterialType')" align="center"></el-table-column>
          <el-table-column prop="materialDesc" sortable :label="$t('material_materialDesc')" align="center"></el-table-column>
          <el-table-column prop="uomCode" sortable :label="$t('material_basicUnit')" align="center"></el-table-column>
          <el-table-column prop="createdDt" sortable :label="$t('common_CreateTime')" align="center"></el-table-column>
           <el-table-column :label="$t('common_Operate')" align="center" width="120">
            <template slot-scope="scope">
              <handle-button @click="toEditPage(scope.row.mComMaterialId)" iconClass='el-icon-edit-outline' :tipText="$t('common_Edit')"></handle-button>
              <handle-button @click="deleteItemMasters(scope.row.mComMaterialId)" iconClass='el-icon-delete' :tipText="$t('common_Del')" iconColor='#f56c6c'></handle-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="mes-main-tabs" v-if="showTabs">
      <material-tabs :useType="0" :mComMaterialId="mComMaterialId"></material-tabs>
    </div>
    <!-- 物料下载 -->
    <el-dialog :visible.sync="downDialog" :title="$t('material_materialDownload')" width="600px" class="handle-dialog">
       <el-form class="el-row mes-search-form" :model="downForm" label-width="20%" label-position="left">
          <el-form-item :label="$t('common_pleaseSelDate')" class="el-col el-col-24">
            <el-date-picker v-model="downForm.CreateTime" style="width:90%" size="mini" type="date" :placeholder="$t('common_pleaseSelDateTime')" align="right" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
             <el-button type="primary" @click="downMaterial" >{{$t('common_ok')}}</el-button>
             <el-button @click="downDialog = false">{{$t('common_cancel')}}</el-button>
          </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import materialTabs from './Tabs/tabs'
import paging from '@/mixins/paging'
export default {
  mixins: [paging],
  data () {
    return {
      materialType: '',
      queryLevel: 1,
      materialTypes: [],
      materialNo: '',
      showMoreConditon: false,
      searchForm: {
        mComMaterialClassId: '',
        isDeleted: false
      },
      mComMaterialId: null,
      tableData: [],
      ids: [],
      downDialog: false,
      downForm: {
        CreateTime: ''
      }
    }
  },
  computed: {
    pickerOptions () {
      return {
        disabledDate: time => {
          return time.getTime() < Date.now() - 24 * 3600 * 1000
        },
        shortcuts: [{
          text: this.$t('common_today'),
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: this.$t('common_yesterday'),
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: this.$t('common_lastWeek'),
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      }
    },
    pageTotal () {
      return this.total ? Math.ceil(this.total / this.page.pageSize) : 0
    },
    showTabs () {
      return !!this.mComMaterialId
    }
  },
  watch: {
    downDialog (val) {
      this.downForm.CreateTime = ''
    }
  },
  methods: {
    refreshPage () {
      this.page.pageIndex = 1
      this.page.pageSize = 10
      this.materialType = ''
      this.materialNo = ''
      this.initData()
    },
    // 获取物料类型
    async getMaterialTypes () {
      let keywords = ''
      let pageSize = 1000
      let pageIndex = 1
      let data = Object.assign({ keywords, pageSize, pageIndex })
      let res = await this.$api.getMaterialType(data)
      this.materialTypes = res.data.list
    },
    tableSelectChange (selection) {
      this.ids = []
      selection.forEach(row => {
        this.ids.push(row.mComMaterialId)
      })
    },
    tableCurrentChange (row) {
      if (row) {
        this.mComMaterialId = row.mComMaterialId
      }
    },
    cellClick (row, column, cell, event) {
      let { property } = column
      if (property === 'materialNo') {
        let mComMaterialId = row.mComMaterialId
        this.$router.push(`/BasicData/Product/Materiel/Edit?MaterialId=${mComMaterialId}`)
      }
    },
    showDownDialog () {
      this.downDialog = true
    },
    async downMaterial () {
      if (this.downForm.CreateTime) {
        let CreateTime = this.$dayjs(this.downForm.CreateTime).format('YYYY-MM-DDTHH:mm:ss') + 'Z'
        let res = await this.$api.downMaterialBySAP({ CreateTime })
        this.$myPrompt.handleMsg(res, () => {
          this.downDialog = false
          this.initData()
        })
      } else {
        this.$message.warning('请先选择时间')
      }
    },
    // 获取所有物料信息
    async initData () {
      let { materialNo, materialType, page, queryLevel } = this
      let data = Object.assign({ materialNo, materialType, queryLevel }, page)
      let res = await this.$api.getMaterialMasters(data)
      if (res.code === '200') {
        this.total = res.data.totalNum
        this.tableData = res.data.list
      }
    },
    // 前往编辑页
    toEditPage (mComMaterialId) {
      this.$router.push(`/BasicData/Product/Materiel/Edit?MaterialId=${mComMaterialId}`)
    },
    // 删除物料
    async deleteItemMasters (id) {
      let ids = id ? [id] : this.ids
      let len = ids.length
      if (len > 0) {
        let isConfirm = await this.$myPrompt.confirm(this.$t('material_confirmDelSelMaterial'))
        if (isConfirm) {
          let res = await this.$api.deleteMaterials(this.ids)
          let { code, msg } = res
          if (code === '200') {
            if ((this.total - len) % this.page.pageSize === 0) {
              this.page.pageIndex = this.page.pageIndex === 1 ? 1 : this.page.pageIndex - 1
            }
            this.mComMaterialId = ''
            this.initData()
            this.$message.success(msg)
          } else {
            this.$message.error(msg)
          }
        }
      } else {
        this.$message.warning(this.$t('material_placeSelDelMaterial'))
      }
    }
  },
  components: {
    materialTabs
  },
  created () {
    this.getMaterialTypes()
    this.initData()
  }
}
</script>
