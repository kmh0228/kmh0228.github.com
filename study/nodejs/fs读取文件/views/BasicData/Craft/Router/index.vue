<template>
  <div style="height:100%;overflow:hidden" class="mes-main mes-work-order mes-material">
    <h3 class="mes-main-title">生产路由管理</h3>
    <el-form label-position="left" style="border-bottom:1px solid #d4d4d4;">
      <el-form-item >
        <el-input v-model="workflowName" placeholder="请输入生产路由名称" size="mini" style="width:12vw;" @keydown.enter.native="getRouterList">
           <i slot="suffix" class="el-input__icon el-icon-search" @click="getRouterList"></i>
        </el-input>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mes-router">
       <el-col :span="5">
         <el-card class="mes-table" style="height:100%;">
          <div slot="header">
            <span>生产路由列表</span>
            <div style="float: right;">
              <el-tooltip effect="dark" content="新增" placement="top" :hide-after="1000">
                <el-button type="text" style="font-size:1vw;" @click="addRouter" icon="el-icon-circle-plus"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="编辑" placement="top" :hide-after="1000">
                <el-button type="text" style="font-size:1vw;" icon="el-icon-edit" @click="editRouter"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top" :hide-after="1000">
                <el-button type="text" style="font-size:1vw;" icon="el-icon-delete" @click="deleteRoute"></el-button>
              </el-tooltip>
            </div>
          </div>
          <el-scrollbar style="width:100%;height:100%;padding:0 0 10px 0;">
            <el-table :data="routerList" border highlight-current-row @current-change="tableCurrentChange" @selection-change="tableSelectionChange" size="mini">
              <el-table-column type="selection" width="50" align="center"></el-table-column>
              <el-table-column prop="officeName" label="工厂"  align="center"></el-table-column>
              <el-table-column label="路由名称" prop="workflowName" align="center"></el-table-column>
            </el-table>
          </el-scrollbar>
        </el-card>
      </el-col>
       <el-col :span="19">
         <el-card>
          <div slot="header">
            <span>生产路由详情</span>
            <div style="float: right;">
              <el-button size="mini" type="primary" @click="saveFlow">保存</el-button>
            </div>
          </div>
          <base-flow ref="baseFlow" :saveFlowData="saveFlowData" :data="data" :workflowObj="workflowObj" @set-router="setRouter"></base-flow>
        </el-card>
       </el-col>
    </el-row>
  </div>
</template>

<script>
import baseFlow from './Module/baseFlow'
export default {
  data () {
    return {
      workflowName: '',
      data: {},
      queryLevel: 1,
      workflowObj: {
        workflowName: '',
        mWorkflowSpecId: '',
        mPomWorkMasterId: '',
        jsonText: ''
      },
      isClear: true,
      routerList: [],
      tableSelectList: []
    }
  },
  methods: {
    async setRouter (obj) {
      if (obj) {
        let { mWorkflowSpecId } = obj
        let resObj = await this.getOneRoute(mWorkflowSpecId)
        let keys = Object.keys(this.workflowObj)
        keys.forEach(key => {
          this.workflowObj[key] = resObj[key] || ''
        })
        try {
          // 选择路由后设置data
          let jsonObj = JSON.parse(this.workflowObj.jsonText)
          this.data = jsonObj
        } catch (e) {
          this.data = {}
        }
      }
    },
    async getOneRoute (id) {
      let res = await this.$api.getRouterById(id)
      return res.data
    },
    saveFlow () {
      this.$refs.baseFlow.saveFlow()
    },
    async saveFlowData (data) {
      let { mWorkflowSpecId, mPomWorkMasterId } = this.workflowObj
      if (mWorkflowSpecId) {
        let edges = data.edges || []
        let nodes = data.nodes || []
        let connList = []
        let segList = []
        // 解析节点数据
        nodes.forEach(node => {
          let nodeObj = {
            mWorkflowSpecId,
            mWorkflowSpecSegid: node.nodeid,
            isInput: node.isInput || false,
            isOutput: node.isOutput || false
          }
          segList.push(nodeObj)
        })
        // 解析连线数据
        edges.forEach(val => {
          let mWorkflowSpecNodeFromId = ''
          let mWorkflowSpecNodeToId = ''
          let { source, target } = val
          for (let i in nodes) {
            let { id, nodeid } = nodes[i]
            if (source === id) {
              mWorkflowSpecNodeFromId = nodeid
            }
            if (target === id) {
              mWorkflowSpecNodeToId = nodeid
            }
          }
          connList.push({
            mWorkflowSpecId,
            mPomWorkMasterId,
            mWorkflowSpecNodeFromId,
            mWorkflowSpecNodeToId,
            condition: val.label ? val.label.text : ''
          })
        })
        if (connList.length > 0) {
          const start = {
            mWorkflowSpecId: connList[0].mWorkflowSpecId,
            mPomWorkMasterId: connList[0].mPomWorkMasterId,
            mWorkflowSpecNodeFromId: 'START',
            mWorkflowSpecNodeToId: connList[0].mWorkflowSpecNodeFromId,
            condition: ''
          }
          const lastIndex = connList.length - 1
          const end = {
            mWorkflowSpecId: connList[lastIndex].mWorkflowSpecId,
            mPomWorkMasterId: connList[lastIndex].mPomWorkMasterId,
            mWorkflowSpecNodeFromId: connList[lastIndex].mWorkflowSpecNodeToId,
            mWorkflowSpecNodeToId: 'END',
            condition: ''
          }
          connList.unshift(start)
          connList.push(end)
          let sendData = {
            mWorkflowSpecId,
            mPomWorkMasterId,
            jsonText: JSON.stringify(data),
            connList,
            segList
          }
          let res = await this.$api.saveRouterConnect(sendData)
          let { code, msg } = res
          if (code === '200') {
            this.$message.success(msg)
          } else {
            this.$message.error(msg)
          }
        } else {
          this.$message.warning('请先配置路由节点！')
        }
      } else {
        this.$message.warning('请先选择路由！')
      }
    },
    // 获取所有路由
    async getRouterList () {
      let { workflowName, queryLevel } = this
      let res = await this.$api.getRouters({ workflowName, queryLevel })
      this.routerList = res.data
    },
    // 添加路由
    addRouter () {
      this.$prompt('路由名称', '新增路由', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\S+/,
        inputErrorMessage: '路由名称不能为空'
      }).then(async ({ value }) => {
        if (!value) {
          return false
        }
        let data = {
          workflowName: value,
          jsonText: ''
        }
        let res = await this.$api.addWorkflow(data)
        let { msg, code } = res
        if (code === '200') {
          this.$message.success(msg)
          this.getRouterList()
        } else {
          this.$message.error(msg)
        }
      }).catch(() => {
        return false
      })
    },
    tableCurrentChange (row) {
      // this.workflowObj = row
      this.setRouter(row)
    },
    tableSelectionChange (selection) {
      this.tableSelectList = []
      selection.forEach(row => {
        this.tableSelectList.push(row)
      })
    },
    // 编辑路由
    async editRouter (row) {
      const { tableSelectList } = this
      const len = tableSelectList.length
      if (len === 1) {
        let { mWorkflowSpecId, workflowName } = tableSelectList[0]
        this.$prompt('路由名称', '编辑路由', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^\S+/,
          inputValue: workflowName,
          inputErrorMessage: '路由名称不能为空'
        }).then(async ({ value }) => {
          if (!value) {
            return false
          }
          let data = {
            mWorkflowSpecId,
            workflowName: value
          }
          let res = await this.$api.updateRouter(data)
          let { msg, code } = res
          if (code === '200') {
            this.$message.success(msg)
            this.getRouterList()
          } else {
            this.$message.error(msg)
          }
        }).catch(() => {
          return false
        })
      } else {
        this.$message.warning('请选择一条需要编辑的路由！')
      }
    },
    // 删除路由
    async deleteRoute () {
      const { tableSelectList } = this
      const len = tableSelectList.length
      if (len > 0) {
        let confrim = await this.$myPrompt.confirm('确定删除当前路由吗？')
        if (confrim) {
          let ids = []
          tableSelectList.map(item => {
            ids.push(item.mWorkflowSpecId)
          })
          let res = await this.$api.deleteRouters(ids)
          let { code, msg } = res
          if (code === '200') {
            this.$message.success(msg)
            this.getRouterList()
          } else {
            this.$message.error(msg)
          }
        }
      } else {
        this.$message.warning('请选择需要删除的路由！')
      }
    }
  },
  components: {
    baseFlow
  },
  created () {
    this.getRouterList()
  }
}
</script>

<style lang="scss">
.mes-router {
  margin-top: 1vh;
  height: 85%;
  .el-col {
    height: 100%;
    .el-card {
      height: 100%;
      .el-card__body {
        padding: 0;
        height: 92%;
      }
    }
  }
}
</style>
