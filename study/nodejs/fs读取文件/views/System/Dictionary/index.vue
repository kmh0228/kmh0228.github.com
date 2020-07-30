<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('dictionary_dataDictionary')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
    </el-row>
    <el-row :gutter="20" >
      <el-col :span="9">
        <el-card class="mes-table" shadow="never">
         <div slot="header">
            <span>{{$t('dictionary_configuration')}}</span>
            <div style="float:right">
                <el-button size="mini" @click="handleDictionary('dialogForm',false)">{{$t('common_Add')}}</el-button>
            </div>
         </div>
          <el-row class="mes-table-handle">
               <el-input :placeholder="$t('dictionary_enterName')" v-model="keywords" size="mini" style="width:50%" @keydown.native.enter="getDictionaryType" @change="selectChange">
                  <i slot="suffix" class="el-input__icon el-icon-search" @click="getDictionaryType"></i>
               </el-input>
               <!-- <el-button icon="el-icon-search" size="mini"  style="margin-left:10px">查询</el-button> -->
          </el-row>
         <el-table :data="tableData" @selection-change="tableChange" size="mini"  highlight-current-row @current-change="currentChange">
           <!-- <el-table-column type="selection" width="50px" align="center"></el-table-column> -->
           <el-table-column type="index" :label="$t('common_Number')" width="50" align="center"  :index="indexMethod"></el-table-column>
           <el-table-column prop="mDataDictTypeName" show-overflow-tooltip :label="$t('dictionary_Name')" sortable align="center" ></el-table-column>
           <el-table-column prop="mDataDictTypeType" show-overflow-tooltip :label="$t('dictionary_Type')" sortable align="center" ></el-table-column>
           <!-- <el-table-column label="操作" width="100" align="center">
             <template slot-scope="scope">
                 <el-tooltip effect="dark" content="编辑" placement="top" >
                <el-button type="text" style="font-size:1vw;"  icon="el-icon-edit" size="mini" @click="handleDictionary('dialogForm',true,scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top" style="margin-left:20px;color:#F56C6C" >
                <el-button type="text" style="font-size:1vw;"  icon="el-icon-delete" size="mini" @click="deleteDict(scope.row.mDataDictTypeId)"></el-button>
              </el-tooltip>
             </template>
           </el-table-column> -->
         </el-table>
         <el-row class="mes-table-handle" style="float:left;margin-top:15px">
            <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :page-count="5"
              layout="total,prev,next,jumper,->" :total="total"
              @current-change="handleCurrentChange" @size-change="handleSizeChange">
            </el-pagination>
          </el-row>
        </el-card>
      </el-col>
       <el-col :span="15">
        <el-card class="mes-table" shadow="never">
         <div slot="header">
            <span>{{$t('dictionary_Details')}}</span>
            <div style="float:right">
              <el-button size="mini" :disabled="addDisabled" @click="handleDictionary('detailForm',false)">{{$t('common_Add')}}</el-button>
            </div>
         </div>
          <div v-if="choiseDetail">
            <p style="padding:10px; border-left:3px solid #ddd;">{{$t('dictionary_clickOnTheDictionary')}}</p>
          </div>
          <div v-else>
            <el-row class="mes-table-handle" >
              <el-input :placeholder="$t('dictionary_nameOfDetails')" v-model="detailKeywords" size="mini" style="width:30%" @keydown.native.enter="getDictionaryDetail(dictType)">
                <i slot="suffix" class="el-input__icon el-icon-search" @click="getDictionaryDetail(dictType)"></i>
              </el-input>
            </el-row>
            <el-table :data="detailData" @selection-change="tableChange1" size="mini">
              <!-- <el-table-column type="selection" width="50px" align="center"></el-table-column> -->
              <!-- <el-table-column type="index" label="序号" width="50" align="center" :index="indexMethod1"></el-table-column> -->
              <el-table-column prop="dictName"  :label="$t('dictionary_label')" align="center" ></el-table-column>
              <el-table-column prop="dictCode" :label="$t('dictionary_value')" align="center" ></el-table-column>
              <el-table-column prop="sortNo" :label="$t('dictionary_sort')" align="center" ></el-table-column>
              <!-- <el-table-column label="是否启用" sortable align="center"></el-table-column> -->
              <el-table-column :label="$t('common_Operate')" width="100" align="center" >
                <template slot-scope="scope">
                    <el-tooltip effect="dark" :content="$t('common_Edit')" placement="top" >
                    <el-button type="text" style="font-size:1vw;"  icon="el-icon-edit" size="mini" @click="handleDictionary('detailForm',true,scope.row)" ></el-button>
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common_Delete')" placement="top" style="margin-left:20px;color:#F56C6C" >
                    <el-button type="text" style="font-size:1vw;"  icon="el-icon-delete" size="mini" @click="deleteDetail(scope.row.mDataDictId)"></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
            <el-row class="mes-table-handle" style="float:left;margin-top:15px">
              <el-pagination background :page-size="page1.pageSize" :page-sizes="[10,20,30,50]" :page-count="5"
                layout="total,prev,next,jumper,->" :total="total1"
                @current-change="handleCurrentChange1" @size-change="handleSizeChange1">
              </el-pagination>
          </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog  :visible.sync="dialogVisible" :title="dialogTitle" width="600px" class="handle-dialog">
      <component v-if="dialogVisible" ref="dialog" :is="dialogComponent" @cannel="cannel" :isEdit="isEdit" @getDictionaryType="getDictionaryType" :dictType="dictType" @getDictionaryDetail="getDictionaryDetail"></component>
    </el-dialog>
  </div>
</template>

<script>
import dialogForm from './dialogForm'
import detailForm from './detailForm'
export default {
  data () {
    return {
      tableData: [],
      detailData: [],
      keywords: '',
      detailKeywords: '',
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
      page1: {
        pageSize: 10,
        pageIndex: 1
      },
      total1: 0,
      dialogVisible: false,
      dialogComponent: '',
      isEdit: '',
      selectList: [],
      selectList1: [],
      dictType: '',
      choiseDetail: true,
      oldType: ''
    }
  },
  computed: {
    dialogTitle () {
      let word = this.isEdit ? this.$t('common_Edit') : this.$t('common_Add')
      let word1 = this.dialogComponent === 'dialogForm' ? this.$t('dictionary_configuration') : this.$t('dictionary_DictionaryDetails')
      return `${word}${word1}`
    },
    addDisabled () {
      return this.choiseDetail
    }
  },
  methods: {
    indexMethod (index) {
      let { pageSize, pageIndex } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getDictionaryType()
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getDictionaryType()
    },
    // indexMethod1 (index) {
    //   let { pageSize, pageIndex } = this.page1
    //   return pageSize * (pageIndex - 1) + index + 1
    // },
    handleCurrentChange1 (index) {
      this.page1.pageIndex = index
    },
    handleSizeChange1 (size) {
      this.page1.pageSize = size
    },
    tableChange (selection) {
      this.selectList = []
      return selection.map(item => {
        this.selectList.push(item.mDataDictTypeId)
      })
    },
    tableChange1 (selection) {
      this.selectList1 = []
      return selection.map(item => {
        this.selectList1.push(item.mDataDictId)
      })
    },
    selectChange () {
      this.page = {
        pageSize: 10,
        pageIndex: 1
      }
      this.getDictionaryType()
    },
    currentChange (currentRow, oldCurrentRow) {
      if (currentRow) {
        this.dictType = currentRow.mDataDictTypeType
        this.getDictionaryDetail(this.dictType)
        this.choiseDetail = false
      } else {
        this.choiseDetail = true
      }
    },
    handleDictionary (dialogname, isEdit, row) {
      let dictType = this.dictType
      this.dialogComponent = dialogname
      this.isEdit = isEdit
      if (dialogname === 'detailForm' && !dictType) {
        this.$message.warning(this.$t('dictionary_beforeAdding'))
      } else {
        this.dialogVisible = true
        if (isEdit) {
          if (dialogname === 'dialogForm') {
            this.$nextTick(() => {
              let keys = Object.keys(this.$refs.dialog.dialogForm)
              this.$refs.dialog.dialogForm = this.$global.filterForm(row, keys)
              this.$refs.dialog.dialogForm.mDataDictTypeId = row.mDataDictTypeId
              this.oldType = this.$refs.dialog.dialogForm.mDataDictTypeType
              this.$refs.dialog.dialogForm.oldType = this.oldType
            })
          } else {
            this.$nextTick(() => {
              let keys = Object.keys(this.$refs.dialog.detailForm)
              this.$refs.dialog.detailForm = this.$global.filterForm(row, keys)
              this.$refs.dialog.detailForm.mDataDictId = row.mDataDictId
            })
          }
        }
      }
    },
    // 获取数据字典类型
    async getDictionaryType () {
      let { keywords, page } = this
      let data = Object.assign({ keywords }, page)
      let res = await this.$api.getDictionaryTypeList(data)
      this.tableData = res.data.list
      this.total = res.data.totalNum
    },
    // 根据字典获取字典类型详情
    async getDictionaryDetail (dictType) {
      let { detailKeywords } = this
      let data = Object.assign({ dictType }, { detailKeywords }, this.page1)
      let res = await this.$api.getDictionaryDetail(data)
      this.detailData = res.data.list
      this.total1 = res.data.totalNum
    },
    // async deleteDict (id) {
    //   let confirmRes = await this.$myPrompt.confirm('确定删除当前选中的字典吗?')
    //   if (confirmRes) {
    //     let res = await this.$api.deleteDictionaryType([id])
    //     this.$myPrompt.handleMsg(res, () => {
    //       this.getDictionaryType()
    //     })
    //   }
    // },
    async deleteDetail (id) {
      let { dictType } = this
      let confirmRes = await this.$myPrompt.confirm(this.$t('dictionary_sure'))
      if (confirmRes) {
        let res = await this.$api.deleteDictionaryDetail([id])
        this.$myPrompt.handleMsg(res, () => {
          this.getDictionaryDetail(dictType)
        })
      }
    },
    cannel () {
      this.dialogVisible = false
    }
  },
  components: {
    dialogForm, detailForm
  },
  created () {
    this.getDictionaryType()
  }

}
</script>
