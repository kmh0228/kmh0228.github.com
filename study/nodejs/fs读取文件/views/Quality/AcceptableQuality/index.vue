<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('AcceptableQuality_QualifiedQualityLevelManagement')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
         <el-input :placeholder="$t('AcceptableQuality_QualifiedQualityLevel')" v-model.trim="aqlLevelCode" size="mini" style="width:35%;" @keydown.enter.native="getAqlLevels">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="getAqlLevels"></i>
        </el-input>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="mes-table">
          <div slot="header">
            <span>{{$t('AcceptableQuality_QualifiedQualityLevel')}}</span>
            <div style="float: right;">
              <el-tooltip effect="dark" :content="$t('AcceptableQuality_Copy')" placement="top" :hide-after="1000">
                <el-button type="text" style="font-size:1vw;" icon="el-icon-document-copy" :disabled="levelEditBtn" @click="handleAqlLevel('mainDialog','level',true,true)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common_Add')" placement="top" :hide-after="1000">
                <el-button type="text" style="font-size:1vw;" icon="el-icon-circle-plus" @click="handleAqlLevel('mainDialog','level',false)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common_Edit')" placement="top" :hide-after="1000">
                <el-button type="text" style="font-size:1vw;" icon="el-icon-edit" :disabled="levelEditBtn" @click="handleAqlLevel('mainDialog','level',true)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common_Del')" placement="top" :hide-after="1000">
                <el-button type="text" style="font-size:1vw;" icon="el-icon-delete" @click="deleteAqlLevels"></el-button>
              </el-tooltip>
            </div>
          </div>
          <el-table :data="aqlLevelData" border highlight-current-row @current-change="tableCurrentChange" @selection-change="aqlSelectionChange">
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column type="index" :label="$t('common_Number')" width="50" align="center"></el-table-column>
            <el-table-column :label="$t('common_InspeLeve')" prop="levelCode" align="center"></el-table-column>
            <el-table-column :label="$t('AcceptableQuality_QualifiedQualityLevel')" prop="aqlLevelCode" align="center"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="16">
         <el-card class="mes-table">
          <div slot="header">
            <span>{{$t('AcceptableQuality_QualifiedQualityLevelDetails')}}</span>
            <div style="float: right;">
              <el-tooltip effect="dark" :content="$t('common_Add')" placement="top" :hide-after="1000">
                <el-button type="text" style="font-size:1vw;" icon="el-icon-circle-plus" :disabled="!isSelect" @click="handleAqlLevel('infoDialog','info',false)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common_Edit')" placement="top" :hide-after="1000">
                <el-button type="text" style="font-size:1vw;" icon="el-icon-edit" :disabled="infoEditBtn" @click="handleAqlLevel('infoDialog','info',true)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common_Del')" placement="top" :hide-after="1000">
                <el-button type="text" style="font-size:1vw;" icon="el-icon-delete" @click="deleteAqlInfos"></el-button>
              </el-tooltip>
            </div>
          </div>
          <div v-if="!isSelect">
            <p style="padding:10px; border-left:3px solid #ddd;">{{$t('AcceptableQuality_ClickQualifiedQualityLevelListToViewDetails')}}</p>
          </div>
          <el-table :data="aqlLevelInfo" v-else border @selection-change="infoSelectionChange">
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column :label="$t('AcceptableQuality_SampleCode')" prop="sampleCode" align="center"></el-table-column>
            <el-table-column :label="$t('AcceptableQuality_SampleQuantity')" prop="sampleSize" align="center"></el-table-column>
            <el-table-column label="AC(Accept)" prop="acceptance" align="center"></el-table-column>
            <el-table-column label="RE(Reject)" prop="rejection" align="center"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px" class="handle-dialog">
      <component v-if="dialogVisible" :is="dialogComponent" :isEdit="isEdit" :isCopy="isCopy" @cannel="cannel" :aqlLevelList="aqlLevelData" :mQomAqlLevelMainId="mQomAqlLevelMainId" :mQomInspectionLevelId="mQomInspectionLevelId" @getAqlLevelDetails="getAqlLevelDetails" @getAqlLevels="getAqlLevels" ref="dialog"></component>
    </el-dialog>
  </div>
</template>

<script>
import mainDialog from './mainDialog'
import infoDialog from './infoDialog'
export default {
  data () {
    return {
      aqlLevelCode: '',
      aqlLevelData: [],
      aqlSelects: [],
      aqlLevelInfo: [],
      infoSelects: [],
      isSelect: false,
      isCopy: false,
      page: {
        pageIndex: 1,
        pageSize: 100
      },
      dialogComponent: '',
      dialogVisible: false,
      isEdit: false,
      mQomAqlLevelMainId: null,
      mQomInspectionLevelId: null
    }
  },
  computed: {
    dialogTitle () {
      let handleName = this.isCopy ? this.$t('AcceptableQuality_Copy') : this.isEdit ? this.$t('common_Edit') : this.$t('common_Add')
      let typeName = this.dialogType === 'level' ? this.$t('AcceptableQuality_QualifiedQualityLevel') : this.$t('AcceptableQuality_QualifiedQualityLevelDetails')
      return `${handleName}${typeName}`
    },
    levelEditBtn () {
      let { aqlSelects } = this
      return aqlSelects.length !== 1
    },
    infoEditBtn () {
      let { infoSelects } = this
      return infoSelects.length !== 1
    }
  },
  watch: {
    mQomAqlLevelMainId (val) {
      this.getAqlLevelDetails(val)
    }
  },
  methods: {
    cannel () {
      this.dialogVisible = false
    },
    handleAqlLevel (dialogName, type, isEdit, isCopy) {
      this.dialogComponent = dialogName
      this.dialogType = type
      this.isEdit = isEdit
      this.dialogVisible = true
      this.isCopy = isCopy
      let selectObj = {}
      if (isEdit) {
        if (type === 'level') {
          const { aqlSelects, aqlLevelData } = this
          const mQomAqlLevelMainId = aqlSelects[0]
          selectObj = aqlLevelData.filter(item => {
            return item.mQomAqlLevelMainId === mQomAqlLevelMainId
          })[0]
          this.$nextTick(() => {
            let keys = Object.keys(this.$refs.dialog.mainForm)
            this.$refs.dialog.mainForm = this.$global.filterForm(selectObj, keys)
            this.$refs.dialog.mainForm.mQomAqlLevelMainId = mQomAqlLevelMainId
          })
        } else {
          const { infoSelects, aqlLevelInfo } = this
          const mQomAqlLevelDetailId = infoSelects[0]
          selectObj = aqlLevelInfo.filter(item => {
            return item.mQomAqlLevelDetailId === mQomAqlLevelDetailId
          })[0]
          this.$nextTick(() => {
            let keys = Object.keys(this.$refs.dialog.infoForm)
            this.$refs.dialog.infoForm = this.$global.filterForm(selectObj, keys)
            this.$refs.dialog.infoForm.mQomAqlLevelDetailId = mQomAqlLevelDetailId
          })
        }
      }
    },
    async getAqlLevels () {
      const { aqlLevelCode, page } = this
      const params = Object.assign({ aqlLevelCode }, page)
      const res = await this.$api.getAqlLevels(params)
      if (res.code === '200') {
        this.aqlLevelData = res.data.list
      } else {
        this.aqlLevelData = []
      }
    },
    tableCurrentChange (row) {
      if (row) {
        this.mQomAqlLevelMainId = row.mQomAqlLevelMainId
        this.mQomInspectionLevelId = row.mQomInspectionLevelId
        this.isSelect = true
      } else {
        this.mQomAqlLevelMainId = null
        this.mQomInspectionLevelId = null
        this.isSelect = false
      }
    },
    aqlSelectionChange (selection) {
      this.aqlSelects = []
      selection.forEach(item => {
        this.aqlSelects.push(item.mQomAqlLevelMainId)
      })
    },
    async deleteAqlLevels () {
      const { aqlSelects } = this
      if (aqlSelects.length > 0) {
        const isConfirm = await this.$myPrompt.confirm(this.$t('AcceptableQuality_Tips1'))
        if (isConfirm) {
          const res = await this.$api.deleteAqlLevels(aqlSelects)
          this.$myPrompt.handleMsg(res, this.getAqlLevels)
        }
      } else {
        this.$message.warning(this.$t('AcceptableQuality_PleaseSelectTheQualifiedQualityLevelToBeDeleted'))
      }
    },
    async getAqlLevelDetails (mQomAqlLevelMainId) {
      const params = Object.assign({ mQomAqlLevelMainId }, this.page)
      const res = await this.$api.getAqlLevelDetails(params)
      if (res.code === '200') {
        this.aqlLevelInfo = res.data.list
      } else {
        this.aqlLevelInfo = []
      }
    },
    infoSelectionChange (selection) {
      this.infoSelects = []
      selection.forEach(item => {
        this.infoSelects.push(item.mQomAqlLevelDetailId)
      })
    },
    async deleteAqlInfos () {
      const { infoSelects, mQomAqlLevelMainId } = this
      if (infoSelects.length > 0) {
        const isConfirm = await this.$myPrompt.confirm(this.$t('AcceptableQuality_Tips2'))
        if (isConfirm) {
          const res = await this.$api.delAqlLevelDetails(infoSelects)
          this.$myPrompt.handleMsg(res, () => {
            this.getAqlLevelDetails(mQomAqlLevelMainId)
          })
        }
      } else {
        this.$message.warning(this.$t('AcceptableQuality_Tips3'))
      }
    }
  },
  components: {
    mainDialog, infoDialog
  },
  created () {
    this.getAqlLevels()
  }
}
</script>
