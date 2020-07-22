<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">物料ESOP关联管理</h3>
     <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-input style="width:40%" placeholder="请输入料号" v-model="materialNo" @keydown.native.enter="getTableData" clearable></el-input>
      </el-col>
    </el-row>
     <div class="mes-table">
      <el-row class="mes-table-handle">
        <el-col :span="12">
          <el-button  size="mini" icon="el-icon-search" @click="getTableData">查询</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">刷新</el-button>
        </el-col>
        <el-col :span="12">
          <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper, ->" :total="total" :current-page="page.pageIndex"
            @current-change="handleCurrentChange" @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
      </el-row>
      <div class="mes-table-content">
        <el-table :data="tableData"  border size="mini" @cell-click="cellClick" highlight-current-row>
          <el-table-column type="index" align="center" label="序号" :index="indexMethod"></el-table-column>
          <el-table-column prop="materialNo" sortable label="料号" align="center"></el-table-column>
          <el-table-column prop="materialName" sortable label="物料名称" align="center" ></el-table-column>
          <el-table-column prop="version" sortable label="版次" align="center" ></el-table-column>
          <el-table-column prop="mComMaterialtypeCode" sortable label="物料类型" align="center" ></el-table-column>
          <el-table-column prop="materialDesc" sortable label="物料描述" align="center" ></el-table-column>
          <el-table-column prop="createdDt" sortable label="创建时间" align="center" ></el-table-column>
        </el-table>
      </div>
     </div>
      <div class="mes-main-tabs" v-if="showTas">
        <el-tabs v-model="activeName">
          <el-tab-pane label="物料ESOP文档" name="detail">
            <div  v-if="editDetail" style="margin-bottom:2vh">
               <el-button type="success" plain size="mini" @click="saveDetailList">保存</el-button>
               <el-button  type="warning" plain size="mini"  @click="goback">返回</el-button>
            </div>
            <el-button style="margin-bottom:2vh" v-else type="primary" plain size="mini" @click="editDetail = true">编辑</el-button>
            <el-table :data="detailList" border highlight-current-row size="mini">
              <el-table-column type="index" label="序号" align="center"></el-table-column>
              <el-table-column sortable label="文档编号" align="center">
                <template slot-scope="scope">
                  <el-select v-if="editDetail" v-model="scope.row.mcomDocId"  size="mini" >
                    <el-option v-for="(option,i) in wordList" :key="i"  :label="option.docNo" :value="option.mComDocId" @click.native="getWordNameAndVer(option,scope.$index)"></el-option>
                  </el-select>
                  <p v-else>{{scope.row.docNo}}</p>
                </template>
              </el-table-column>
              <el-table-column sortable label="文档名称" align="center">
                 <template slot-scope="scope">
                  <el-input :disabled="true" v-if="editDetail" v-model="scope.row.docName"  size="mini"></el-input>
                  <p v-else>{{scope.row.docName}}</p>
                </template>
              </el-table-column>
              <el-table-column sortable label="版本" align="center">
                 <template slot-scope="scope">
                  <el-input :disabled="true" v-if="editDetail" v-model="scope.row.version"  size="mini"></el-input>
                  <p v-else>{{scope.row.version}}</p>
                </template>
              </el-table-column>
              <el-table-column sortable label="制程" align="center">
                 <template slot-scope="scope">
                  <el-select v-if="editDetail" v-model="scope.row.mcomProcessSegId"  size="mini">
                    <el-option v-for="(option,i) in processModuleList"  :key="i" :label="option.segCode" :value="option.mComProcessSegId"></el-option>
                  </el-select>
                  <p v-else>{{scope.row.segCode}}</p>
                </template>
              </el-table-column>
              <el-table-column sortable label="操作" align="center" v-if="editDetail">
              <template slot-scope="scope">
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRow(scope.$index)"></el-button>
              </template>
              </el-table-column>
            </el-table>
             <el-button type="primary" plain size="mini" v-if="editDetail"  @click="addList" style="margin-top:1vh;">添加</el-button>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- <el-dialog :visible.sync="dialogVisible" title="新增物料文档关系" class="handle-dialog" width="600px">
        <dialog-from v-if="dialogVisible" @cancel="cancel" ref="dialog" :onMaterialNo="onMaterialNo" :onMaterialId="onMaterialId"></dialog-from>
      </el-dialog> -->
</div>
</template>

<script>
// import dialogFrom from './dialogFrom'
export default {
  data () {
    return {
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [],
      materialNo: '',
      showTas: false,
      activeName: 'detail',
      detailList: [],
      dialogVisible: false,
      onMaterialNo: '',
      onMaterialId: '',
      wordList: [],
      processModuleList: [],
      editDetail: false
    }
  },
  computed: {
  },
  methods: {
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getTableData()
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getTableData()
    },
    indexMethod (index) {
      let { pageSize, pageIndex } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    async cellClick (row, column, cell, event) {
      this.showTas = true
      const partId = row.mComMaterialId
      let res = await this.$api.queryDocRel({ partId })
      this.detailList = res.data
      this.onMaterialNo = row.materialNo
      this.onMaterialId = row.mComMaterialId
    },
    async getTableData () {
      let { materialNo, page } = this
      let materialType = ''
      let data = Object.assign({ materialNo, materialType }, page)
      let res = await this.$api.getMaterialMasters(data)
      if (res.code === '200') {
        this.total = res.data.totalNum
        this.tableData = res.data.list
      }
    },
    async saveDetailList () {
      let { detailList } = this
      let keys = Object.keys(detailList[0])
      let i
      let word
      let status = true
      detailList.forEach((item, index) => {
        for (i of keys) {
          if (item[i] === '') {
            word = i === 'docNo' ? '文档编号' : '制程'
            this.$message.warning(`请填写第${index + 1}行中${word}的内容`)
            status = false
          }
        }
      })
      if (status) {
        let mcomMaterialId = this.onMaterialId
        let splitVmList = []
        detailList.forEach(item => {
          let obj = {
            mcomDocId: item.mcomDocId,
            mcomProcessSegId: item.mcomProcessSegId
          }
          splitVmList.push(obj)
        })
        let res = await this.$api.savePartDocRel({ splitVmList, mcomMaterialId })
        this.$myPrompt.handleMsg(res, () => {
          this.goback()
          this.refreshData(mcomMaterialId)
        })
      }
    },
    // 数据改变后的刷新方法
    async refreshData (partId) {
      let res = await this.$api.queryDocRel({ partId })
      this.detailList = res.data
    },
    goback () {
      this.editDetail = false
      let mcomMaterialId = this.onMaterialId
      this.refreshData(mcomMaterialId)
    },
    // 获取所有文档类型
    async queryDoc () {
      let res = await this.$api.queryDoc()
      this.wordList = res.data
    },
    // 获取制程列表
    async getProcessTree () {
      const data = {
        pageIndex: 1,
        pageSize: 1000,
        segCode: ''
      }
      let res = await this.$api.getProcessTree(data)
      if (res.code === '200') {
        this.processModuleList = res.data.processTreeDtos
      }
    },
    checkWord (value) {
      let arr = []
      this.detailList.forEach(item => {
        arr.push(item.mcomDocId)
      })
      let id = arr.indexOf(value)
      if (id !== -1) {
        this.$message.warning('该文档编号已经被关联，请重新选择文档编号！')
        value = ''
      }
    },
    getWordNameAndVer (option, index) {
      if (this.detailList.length > 1) {
        let str = option.docNo
        let arr = []
        this.detailList.forEach(item => {
          arr.push(item.docNo)
        })
        if (arr.indexOf(str) !== -1) {
          this.$message.warning('该文档编号已经被关联，请重新选择文档编号！')
          this.detailList[index].mcomDocId = ''
          this.detailList[index].docNo = ''
          this.detailList[index].docName = ''
          this.detailList[index].version = ''
        } else {
          this.detailList[index].docNo = option.docNo
          this.detailList[index].docName = option.docName
          this.detailList[index].version = option.version
        }
      } else {
        this.detailList[index].docNo = option.docNo
        this.detailList[index].docName = option.docName
        this.detailList[index].version = option.version
      }
    },
    deleteRow (index) {
      this.detailList.splice(index, 1)
    },
    addList () {
      this.editDetail = true
      let obj = {
        mcomDocId: '',
        docNo: '',
        docName: '',
        version: '',
        mcomProcessSegId: ''
      }
      this.detailList.push(obj)
    },
    cancel () {
      this.dialogVisible = false
    },
    refreshPage () {
      this.materialNo = ''
      this.page.pageIndex = 1
      this.page.pageSize = 10
      this.getTableData()
    }
  },
  created () {
    this.getTableData()
    this.queryDoc()
    this.getProcessTree()
  }
  // components: {
  //   dialogFrom
  // }
}
</script>
