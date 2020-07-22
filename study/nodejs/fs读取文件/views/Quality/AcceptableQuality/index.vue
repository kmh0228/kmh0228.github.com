<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">合格质量水平管理</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
         <el-input placeholder="合格质量水平" v-model.trim="aqlLevelCode" size="mini" style="width:35%;" @keydown.enter.native="getAqlLevels">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="getAqlLevels"></i>
        </el-input>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="mes-table">
          <div slot="header">
            <span>合格质量水平</span>
            <div style="float: right;">
              <el-tooltip effect="dark" content="复制" placement="top" :hide-after="1000">
                <el-button type="text" style="font-size:1vw;" icon="el-icon-document-copy" :disabled="levelEditBtn" @click="handleAqlLevel('mainDialog','level',true,true)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="新增" placement="top" :hide-after="1000">
                <el-button type="text" style="font-size:1vw;" icon="el-icon-circle-plus" @click="handleAqlLevel('mainDialog','level',false)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="编辑" placement="top" :hide-after="1000">
                <el-button type="text" style="font-size:1vw;" icon="el-icon-edit" :disabled="levelEditBtn" @click="handleAqlLevel('mainDialog','level',true)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top" :hide-after="1000">
                <el-button type="text" style="font-size:1vw;" icon="el-icon-delete" @click="deleteAqlLevels"></el-button>
              </el-tooltip>
            </div>
          </div>
          <el-table :data="aqlLevelData" border highlight-current-row @current-change="tableCurrentChange" @selection-change="aqlSelectionChange">
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column label="检查水平" prop="levelCode" align="center"></el-table-column>
            <el-table-column label="合格质量水平" prop="aqlLevelCode" align="center"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="16">
         <el-card class="mes-table">
          <div slot="header">
            <span>合格质量水平详情</span>
            <div style="float: right;">
              <el-tooltip effect="dark" content="新增" placement="top" :hide-after="1000">
                <el-button type="text" style="font-size:1vw;" icon="el-icon-circle-plus" :disabled="!isSelect" @click="handleAqlLevel('infoDialog','info',false)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="编辑" placement="top" :hide-after="1000">
                <el-button type="text" style="font-size:1vw;" icon="el-icon-edit" :disabled="infoEditBtn" @click="handleAqlLevel('infoDialog','info',true)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top" :hide-after="1000">
                <el-button type="text" style="font-size:1vw;" icon="el-icon-delete" @click="deleteAqlInfos"></el-button>
              </el-tooltip>
            </div>
          </div>
          <div v-if="!isSelect">
            <p style="padding:10px; border-left:3px solid #ddd;">点击合格质量水平列表查看详情</p>
          </div>
          <el-table :data="aqlLevelInfo" v-else border @selection-change="infoSelectionChange">
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column label="样本代码" prop="sampleCode" align="center"></el-table-column>
            <el-table-column label="样本数量" prop="sampleSize" align="center"></el-table-column>
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
      let handleName = this.isCopy ? '复制' : this.isEdit ? '编辑' : '新增'
      let typeName = this.dialogType === 'level' ? '合格质量水平' : '合格质量水平详情'
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
        const isConfirm = await this.$myPrompt.confirm('确定删除当前选中的合格质量水平吗？')
        if (isConfirm) {
          const res = await this.$api.deleteAqlLevels(aqlSelects)
          this.$myPrompt.handleMsg(res, this.getAqlLevels)
        }
      } else {
        this.$message.warning('请选择需要删除的合格质量水平！')
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
        const isConfirm = await this.$myPrompt.confirm('确定删除当前选中的合格质量水平详情吗？')
        if (isConfirm) {
          const res = await this.$api.delAqlLevelDetails(infoSelects)
          this.$myPrompt.handleMsg(res, () => {
            this.getAqlLevelDetails(mQomAqlLevelMainId)
          })
        }
      } else {
        this.$message.warning('请选择需要删除的合格质量水平详情！')
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
