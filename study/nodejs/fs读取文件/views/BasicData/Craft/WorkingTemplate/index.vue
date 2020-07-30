<template>
  <div class="mes-main mes-work-order mes-material">
    <h3 class="mes-main-title">{{$t('workingTemp_WorkTempMana')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-input v-model="keyWords" size="mini" style="width:35%;" :placeholder="$t('workingTemp_TemplName')" @keydown.enter.native="getWorkTemplateList">
        </el-input>
      </el-col>
    </el-row>
    <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
        <el-button size="mini" icon="el-icon-search" @click="getWorkTemplateList">{{$t('common_Inquire')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-plus"  @click="$router.push('/BasicData/Craft/WorkingTemplate/Add')">{{$t('common_Add')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-delete-solid" @click="deleteWorkTem('')">{{$t('common_Delete')}}</el-button>
        <span class="split-line">|</span>
        <el-button size="mini" icon="el-icon-refresh"  @click="refreshPage">{{$t('common_Refresh')}}</el-button>
        </el-col>
        <el-col :span="12">
          <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total,sizes, prev, pager, next, jumper, ->" :total="total"
            @current-change="handleCurrentChange" @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
      </el-row>
      <el-table :data="workTemplateData" border highlight-current-row size="mini" @current-change="tableCurrentChange" @selection-change="selectTable">
        <el-table-column type="selection" width="80" align="center"></el-table-column>
        <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod"></el-table-column>
        <el-table-column prop="workCode" :label="$t('workingTemp_TemplCode')" align="center" sortable></el-table-column>
        <el-table-column prop="workName" :label="$t('workingTemp_TemplName')" align="center" sortable></el-table-column>
        <el-table-column prop="version" :label="$t('common_Edition')" align="center" width="100" sortable></el-table-column>
        <el-table-column prop="stationType" :label="$t('workingTemp_StatiType')" align="center" sortable></el-table-column>
        <el-table-column prop="inOutFlag" :label="$t('workingTemp_InputOutpMark')" align="center" sortable></el-table-column>
        <el-table-column prop="isInvalid" :label="$t('common_Enable')" align="center" sortable>
          <template slot-scope="prop">
            <el-tag :type="prop.row.isInvalid==='0'?'':'danger'" size="mini">{{ prop.row.isInvalid==="0"? $t('common_Enabl'):$t('common_Disab')}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common_Operate')" align="center" width="120">
          <template slot-scope="scope">
            <handle-button @click="toEditPage(scope.row.mPomWorkMasterId)" iconClass='el-icon-edit-outline' :tipText="$t('common_Edit')"></handle-button>
            <handle-button @click="deleteWorkTem(scope.row.mPomWorkMasterId)" iconClass='el-icon-delete' :tipText="$t('common_Del')" iconColor='#f56c6c'></handle-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="mes-main-tabs" v-if="showTabs">
      <tabs :useType="0" :wrokMasterId="wrokMasterId"></tabs>
    </div>
  </div>
</template>

<script>
import tabs from './tabs/tabs'
export default {
  data () {
    return {
      keyWords: '',
      queryLevel: 1,
      total: 0,
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      workTemplateData: [],
      selectedList: [],
      wrokMasterId: ''
    }
  },
  computed: {
    showTabs () {
      return !!this.wrokMasterId
    }
  },
  methods: {
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getWorkTemplateList()
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getWorkTemplateList()
    },
    // 刷新页面
    refreshPage () {
      this.keyWords = ''
      this.page.pageIndex = 1
      this.page.pageSize = 10
      this.getWorkTemplateList()
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    tableCurrentChange (row) {
      if (row) {
        let { mPomWorkMasterId } = row
        this.wrokMasterId = mPomWorkMasterId
      }
    },
    selectTable (selection) {
      this.selectedList = []
      selection.forEach(val => {
        this.selectedList.push(val.mPomWorkMasterId)
      })
    },
    toEditPage (id) {
      this.$router.push(`/BasicData/Craft/WorkingTemplate/Edit?WorkMasterId=${id}`)
    },
    async getWorkTemplateList () {
      let { keyWords, page, queryLevel } = this
      let data = Object.assign({ keyWords, queryLevel }, page)
      let res = await this.$api.getWorkTemplates(data)
      this.workTemplateData = res.data.list
      this.total = res.data.totalNum
    },
    async deleteWorkTem (id) {
      let ids = id ? [id] : this.selectedList
      let len = ids.length
      if (len > 0) {
        let confirmRes = await this.$myPrompt.confirm(this.$t('workingTemp_AreYouSureYouWa'))
        if (confirmRes) {
          let res = await this.$api.deleteTemplates(ids)
          this.$myPrompt.handleMsg(res, this.getWorkTemplateList())
        }
      } else {
        this.$message.warnning(this.$t('common_PleasSeleInfoDe'))
      }
    }
  },
  created () {
    this.getWorkTemplateList()
  },
  components: {
    tabs
  }
}
</script>
