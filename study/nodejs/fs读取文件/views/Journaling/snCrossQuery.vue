<template>
  <div class="mes-main mes-work-order mes-material">
    <h3 class="mes-main-title">SN过站记录查询</h3>
    <el-form label-position="left" label-width="70px">
      <el-form-item label="SN">
        <el-input v-model.trim="ssn" size="mini" style="width:12vw;" @keydown.enter.native="searchSnCrossQuery">
           <i slot="suffix" class="el-input__icon el-icon-search" @click="searchSnCrossQuery"></i>
        </el-input>
        <el-button size="mini" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
    <div class="mes-material-handle">
      <el-form label-width="30%" label-position="left" class="el-row">
        <el-form-item label="SN" class="el-col el-col-11">
          <p>{{ snInfo.product_sn }}</p>
        </el-form-item>
        <el-form-item label="工单号" class="el-col el-col-11 el-col-offset-1">
          <p>{{ snInfo.doc_no }}</p>
        </el-form-item>
        <el-form-item label="料号" class="el-col el-col-11">
          <p>{{ snInfo.material_no }}</p>
        </el-form-item>
        <el-form-item label="路由" class="el-col el-col-11 el-col-offset-1">
          <p>{{ snInfo.workflow_name }}</p>
        </el-form-item>
        <el-form-item label="线别" class="el-col el-col-11">
          <p>{{ snInfo.line }}</p>
        </el-form-item>
        <el-form-item label="当前工站" class="el-col el-col-11 el-col-offset-1">
          <p>{{ snInfo.current_station }}</p>
        </el-form-item>
        <el-form-item label="下一工站" class="el-col el-col-11">
          <p>{{ snInfo.next_station }}</p>
        </el-form-item>
        <el-form-item label="上线时间" class="el-col el-col-11 el-col-offset-1">
          <p>{{ snInfo.online_time }}</p>
        </el-form-item>
        <el-form-item label="最后扫描人" class="el-col el-col-11">
          <p>{{ snInfo.last_editor }}</p>
        </el-form-item>
        <el-form-item label="最后扫描时间" class="el-col el-col-11 el-col-offset-1">
          <p>{{ snInfo.last_edited_dt }}</p>
        </el-form-item>
      </el-form>
    </div>
    <div class="mes-main-tabs mes-table">
      <el-tabs v-model="tabAciveName">
        <el-tab-pane label="SN历史过站记录" name="table">
          <el-table :data="snHistory" border highlight-current-row size="mini">
              <el-table-column type="index" label="序号" align="center">
                <template slot-scope="scope">
                  <p>{{ scope.$index + 1 }}</p>
                </template>
              </el-table-column>
              <el-table-column label="工单号" align="center" sortable>
                <template>
                  <p>{{ snInfo.doc_no }} </p>
                </template>
              </el-table-column>
              <el-table-column label="料号" align="center" sortable>
                <template>
                  <p>{{ snInfo.material_no }} </p>
                </template>
              </el-table-column>
              <el-table-column label="路由" align="center" sortable>
                <template>
                  <p>{{ snInfo.workflow_name }} </p>
                </template>
              </el-table-column>
              <el-table-column prop="workType" label="线别" align="center" sortable>
                <template>
                  <p>{{ snInfo.line }} </p>
                </template>
              </el-table-column>
              <el-table-column prop="current_station" label="工站" align="center" sortable></el-table-column>
              <el-table-column prop="creator" label="操作人" align="center" sortable></el-table-column>
              <el-table-column prop="created_dt" label="过站时间" align="center" sortable></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ssn: '',
      tabAciveName: 'table',
      snInfo: {
        product_sn: '',
        doc_no: '',
        material_no: '',
        workflow_name: '',
        line: '',
        current_station: '',
        next_station: '',
        online_time: '',
        last_editor: '',
        last_edited_dt: ''
      },
      snHistory: []
    }
  },
  methods: {
    async searchSnCrossQuery () {
      let { ssn } = this
      if (ssn) {
        let infoRes = await this.$api.getWholeSnInfo(ssn)
        let recordRes = await this.$api.getWholeSnMoveHis(ssn)
        if (recordRes) {
          if (infoRes.code === '200') {
            this.snInfo = infoRes.data
          } else {
            this.$message.warning(infoRes.msg)
          }
          if (recordRes.code === '200') {
            this.snHistory = recordRes.data
          } else {
            this.$message.warning(recordRes.msg)
          }
        } else {
          this.$message.warning('请输入需要查询的SN！')
        }
      } else {
        this.$message.warning('改ssn的过站记录出错')
      }
    }
  },
  created () {
    if (this.$route.query.sn) {
      this.ssn = this.$route.query.sn
      this.searchSnCrossQuery()
    }
  }
}
</script>
