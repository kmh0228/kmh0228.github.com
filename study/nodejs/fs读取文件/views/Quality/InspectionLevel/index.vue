<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">检查水平管理</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
         <el-input placeholder="检查水平" v-model.trim="levelCode" size="mini" style="width:35%;" @keydown.enter.native="getInspectLevelList">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="getInspectLevelList"></i>
        </el-input>
      </el-col>
      <el-col :span="12">
         <div style="float:right;">
           <!-- <el-button plain size="mini" icon="el-icon-refresh-right" @click="showLevel=!showLevel">切换</el-button> -->
         </div>
      </el-col>
    </el-row>
    <transition name="el-zoom-in-center">
      <el-row :gutter="20" class="mes-table" v-if="showLevel">
        <el-table :data="tableData" border size="mini">
          <el-table-column label="批量最小/大值" align="center" width="150">
            <template slot-scope="prop">
              <p>{{  prop.row.lotSizeMin }} ~ {{ prop.row.lotSizeMax }} </p>
            </template>
          </el-table-column>
          <el-table-column label="特殊检查水平" align="center" class-name="special-levels">
            <el-table-column v-for="(col,i) in specialLevels" :key="i" :prop="col.key" :label="col.label" align="center" class-name="special-levels"></el-table-column>
          </el-table-column>
          <el-table-column label="一般检查水平" align="center" class-name="general-levels">
            <el-table-column v-for="(col,i) in generalLevels" :key="i" :prop="col.key" :label="col.label" align="center" class-name="general-levels"></el-table-column>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row :gutter="20" v-else>
        <el-col :span="10">
          <el-card class="mes-table">
            <div slot="header">
              <span>检查水平</span>
              <div style="float: right;">
                <el-tooltip effect="dark" content="新增" placement="top" :hide-after="1000">
                  <el-button type="text" style="font-size:1vw;" icon="el-icon-circle-plus" @click="handleLevel('mainDialog','level',false)"></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="编辑" placement="top" :hide-after="1000">
                  <el-button type="text" style="font-size:1vw;" icon="el-icon-edit" :disabled="levelEditBtn" @click="handleLevel('mainDialog','level',true)"></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="删除" placement="top" :hide-after="1000">
                  <el-button type="text" style="font-size:1vw;" icon="el-icon-delete" @click="delInspectLevels"></el-button>
                </el-tooltip>
              </div>
            </div>
            <el-table :data="levelData" border highlight-current-row @current-change="tableCurrentChange" @selection-change="levelSelectionChange">
              <el-table-column type="selection" width="50" align="center"></el-table-column>
              <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
              <el-table-column label="类型" prop="levelType" sortable align="center"></el-table-column>
              <el-table-column label="检查水平" prop="levelCode" align="center"></el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="14">
          <el-card class="mes-table">
            <div slot="header">
              <span>检查水平详情</span>
              <div style="float: right;">
                <el-tooltip effect="dark" content="新增" placement="top" :hide-after="1000">
                  <el-button type="text" style="font-size:1vw;" :disabled="!isSelect" icon="el-icon-circle-plus" @click="handleLevel('infoDialog','info',false)"></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="编辑" placement="top" :hide-after="1000">
                  <el-button type="text" style="font-size:1vw;" icon="el-icon-edit" :disabled="infoEditBtn"  @click="handleLevel('infoDialog','info',true)"></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="删除" placement="top" :hide-after="1000">
                  <el-button type="text" style="font-size:1vw;" icon="el-icon-delete" @click="delInspectLevelInfo"></el-button>
                </el-tooltip>
              </div>
            </div>
            <div v-if="!isSelect">
              <p style="padding:10px; border-left:3px solid #ddd;">点击检查水平列表查看详情</p>
            </div>
            <el-table :data="levelInfo" border v-else @selection-change="infoSelectionChange">
              <el-table-column type="selection" width="50" align="center"></el-table-column>
              <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
              <el-table-column label="批量最小值" prop="lotSizeMin" align="center"></el-table-column>
              <el-table-column label="批量最大值" prop="lotSizeMax" align="center"></el-table-column>
              <el-table-column label="样本代码" prop="sampleCode" align="center"></el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </transition>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px" class="handle-dialog">
      <component v-if="dialogVisible" :is="dialogComponent" :mQomInspectionLevelId="mQomInspectionLevelId" :levelList="levelData" :isEdit="isEdit" @cannel="cannel" @getInspectLevelList="getInspectLevelList" @getInspectLevelInfo="getInspectLevelInfo" ref="dialog"></component>
    </el-dialog>
  </div>
</template>

<script>
import mainDialog from './mainDialog'
import infoDialog from './infoDialog'
export default {
  data () {
    return {
      showLevel: false,
      levelCode: '',
      page: {
        pageIndex: 1,
        pageSize: 100
      },
      levelData: [],
      levelInfo: [],
      specialLevels: [
        {
          label: 'S-1',
          key: 'spec1'
        },
        {
          label: 'S-2',
          key: 'spec2'
        },
        {
          label: 'S-3',
          key: 'spec3'
        },
        {
          label: 'S-4',
          key: 'spec4'
        }
      ],
      generalLevels: [
        {
          label: 'I',
          key: 'gen1'
        },
        {
          label: 'II',
          key: 'gen2'
        },
        {
          label: 'III',
          key: 'gen3'
        }
      ],
      tableData: [
        {
          lotSizeMin: 2,
          lotSizeMax: 8,
          spec1: 'A',
          spec2: 'A',
          spec3: 'A',
          spec4: 'A',
          gen1: 'A',
          gen2: 'A',
          gen3: 'B'
        },
        {
          lotSizeMin: 9,
          lotSizeMax: 15,
          spec1: 'A',
          spec2: 'A',
          spec3: 'A',
          spec4: 'A',
          gen1: 'A',
          gen2: 'B',
          gen3: 'C'
        },
        {
          lotSizeMin: 16,
          lotSizeMax: 25,
          spec1: 'A',
          spec2: 'A',
          spec3: 'A',
          spec4: 'A',
          gen1: 'B',
          gen2: 'C',
          gen3: 'D'
        },
        {
          lotSizeMin: 26,
          lotSizeMax: 50,
          spec1: 'A',
          spec2: 'A',
          spec3: 'B',
          spec4: 'B',
          gen1: 'B',
          gen2: 'C',
          gen3: 'D'
        },
        {
          lotSizeMin: 51,
          lotSizeMax: 90,
          spec1: 'B',
          spec2: 'B',
          spec3: 'C',
          spec4: 'C',
          gen1: 'C',
          gen2: 'E',
          gen3: 'F'
        },
        {
          lotSizeMin: 91,
          lotSizeMax: 150,
          spec1: 'B',
          spec2: 'B',
          spec3: 'C',
          spec4: 'D',
          gen1: 'D',
          gen2: 'F',
          gen3: 'G'
        },
        {
          lotSizeMin: 151,
          lotSizeMax: 280,
          spec1: 'B',
          spec2: 'C',
          spec3: 'D',
          spec4: 'E',
          gen1: 'E',
          gen2: 'G',
          gen3: 'H'
        },
        {
          lotSizeMin: 281,
          lotSizeMax: 500,
          spec1: 'B',
          spec2: 'C',
          spec3: 'D',
          spec4: 'E',
          gen1: 'F',
          gen2: 'H',
          gen3: 'I'
        },
        {
          lotSizeMin: 501,
          lotSizeMax: 1200,
          spec1: 'C',
          spec2: 'C',
          spec3: 'E',
          spec4: 'F',
          gen1: 'G',
          gen2: 'J',
          gen3: 'K'
        },
        {
          lotSizeMin: 1201,
          lotSizeMax: 3200,
          spec1: 'C',
          spec2: 'D',
          spec3: 'E',
          spec4: 'G',
          gen1: 'H',
          gen2: 'K',
          gen3: 'L'
        },
        {
          lotSizeMin: 3201,
          lotSizeMax: 10000,
          spec1: 'C',
          spec2: 'D',
          spec3: 'F',
          spec4: 'G',
          gen1: 'J',
          gen2: 'L',
          gen3: 'M'
        },
        {
          lotSizeMin: 10001,
          lotSizeMax: 35000,
          spec1: 'C',
          spec2: 'D',
          spec3: 'F',
          spec4: 'H',
          gen1: 'K',
          gen2: 'M',
          gen3: 'N'
        },
        {
          lotSizeMin: 35001,
          lotSizeMax: 150000,
          spec1: 'D',
          spec2: 'E',
          spec3: 'G',
          spec4: 'J',
          gen1: 'L',
          gen2: 'N',
          gen3: 'P'
        },
        {
          lotSizeMin: 150001,
          lotSizeMax: 500000,
          spec1: 'D',
          spec2: 'E',
          spec3: 'G',
          spec4: 'J',
          gen1: 'M',
          gen2: 'P',
          gen3: 'Q'
        },
        {
          lotSizeMin: 500001,
          lotSizeMax: 'over',
          spec1: 'D',
          spec2: 'E',
          spec3: 'H',
          spec4: 'K',
          gen1: 'M',
          gen2: 'Q',
          gen3: 'R'
        }
      ],
      levelSelects: [],
      infoSelects: [],
      dialogVisible: false,
      isEdit: false,
      dialogType: 'level',
      dialogComponent: '',
      isSelect: false,
      mQomInspectionLevelId: null
    }
  },
  computed: {
    dialogTitle () {
      let handleName = this.isEdit ? '编辑' : '新增'
      let typeName = this.dialogType === 'level' ? '检查水平' : '检查水平详情'
      return `${handleName}${typeName}`
    },
    levelEditBtn () {
      let { levelSelects } = this
      return levelSelects.length !== 1
    },
    infoEditBtn () {
      let { infoSelects } = this
      return infoSelects.length !== 1
    }
  },
  watch: {
    mQomInspectionLevelId (val) {
      this.getInspectLevelInfo(val)
    }
  },
  methods: {
    async getInspectLevelList () {
      const { levelCode, page } = this
      const params = Object.assign({ levelCode }, page)
      const res = await this.$api.getInspectLevels(params)
      if (res.code === '200') {
        this.levelData = res.data.list
      } else {
        this.levelData = []
      }
    },
    cannel () {
      this.dialogVisible = false
    },
    handleLevel (dialogName, type, isEdit) {
      this.dialogComponent = dialogName
      this.dialogType = type
      this.isEdit = isEdit
      this.dialogVisible = true
      let selectObj = {}
      if (isEdit) {
        if (type === 'level') {
          const { levelSelects, levelData } = this
          const mQomInspectionLevelId = levelSelects[0]
          selectObj = levelData.filter(item => {
            return item.mQomInspectionLevelId === mQomInspectionLevelId
          })[0]
          this.$nextTick(() => {
            let keys = Object.keys(this.$refs.dialog.mainForm)
            this.$refs.dialog.mainForm = this.$global.filterForm(selectObj, keys)
            this.$refs.dialog.mainForm.mQomInspectionLevelId = mQomInspectionLevelId
          })
        } else {
          let { infoSelects, levelInfo } = this
          const mQomInspectionLotSizeId = infoSelects[0]
          selectObj = levelInfo.filter(item => {
            return item.mQomInspectionLotSizeId === mQomInspectionLotSizeId
          })[0]
          this.$nextTick(() => {
            let keys = Object.keys(this.$refs.dialog.infoForm)
            this.$refs.dialog.infoForm = this.$global.filterForm(selectObj, keys)
            this.$refs.dialog.infoForm.mQomInspectionLotSizeId = mQomInspectionLotSizeId
          })
        }
      }
    },
    tableCurrentChange (row) {
      if (row) {
        this.mQomInspectionLevelId = row.mQomInspectionLevelId
        this.isSelect = true
      } else {
        this.mQomInspectionLevelId = null
        this.isSelect = false
      }
    },
    levelSelectionChange (selection) {
      this.levelSelects = []
      selection.forEach(val => {
        this.levelSelects.push(val.mQomInspectionLevelId)
      })
    },
    async delInspectLevels () {
      const { levelSelects } = this
      if (levelSelects.length > 0) {
        const isConfirm = await this.$myPrompt.confirm('确定删除当前选中的检查水平吗？')
        if (isConfirm) {
          const res = await this.$api.delInspectlevel(levelSelects)
          this.$myPrompt.handleMsg(res, this.getInspectLevelList)
        }
      } else {
        this.$message.warning('请选择需要删除的检查水平！')
      }
    },
    async getInspectLevelInfo (mQomInspectionLevelId) {
      const params = Object.assign({ mQomInspectionLevelId }, this.page)
      const res = await this.$api.getInspectLevelInfo(params)
      if (res.code === '200') {
        this.levelInfo = res.data.list
      } else {
        this.levelInfo = []
      }
    },
    infoSelectionChange (selection) {
      this.infoSelects = []
      selection.forEach(val => {
        this.infoSelects.push(val.mQomInspectionLotSizeId)
      })
    },
    async delInspectLevelInfo () {
      const { infoSelects, mQomInspectionLevelId } = this
      if (infoSelects.length > 0) {
        const isConfirm = await this.$myPrompt.confirm('确定删除当前选中的检查水平详情吗？')
        if (isConfirm) {
          const res = await this.$api.deleteInspectLevelInfo(infoSelects)
          this.$myPrompt.handleMsg(res, () => {
            this.getInspectLevelInfo(mQomInspectionLevelId)
          })
        }
      } else {
        this.$message.warning('请选择需要删除的检查水平详情！')
      }
    }
  },
  components: {
    mainDialog, infoDialog
  },
  created () {
    this.getInspectLevelList()
  }
}
</script>
