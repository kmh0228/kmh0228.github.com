<template>
  <div class="mes-main mes-work-order">
    <div class="mes-main-title">{{$t('packagingUnit_PackaUnit')}}</div>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
        <el-input :placeholder="$t('common_code')" v-model.trim="code" size="mini" style="width:40%" @keydown.enter.native="$refs.tableList.queryList(true)"></el-input>
        <el-input :placeholder="$t('common_Name')" v-model.trim="name" size="mini" style="width:40%" @keydown.enter.native="$refs.tableList.queryList(true)"></el-input>
      </el-col>
    </el-row>
    <div>
      <table-list ref="tableList" :tableData="tableData" :tableOption="option" :queryListApi="getPackagingUnit" :total="total">
        <div slot="buttonBox">
          <el-button size="mini" icon="el-icon-search" @click="$refs.tableList.queryList(true)">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-plus" @click="showPop">{{$t('common_Add')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="deletetableData($refs.tableList.getSelectData().map(item => item.mComUomPackId))">{{$t('common_Delete')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshPage">{{$t('common_Refresh')}}</el-button>
        </div>
      </table-list>
    </div>
    <!-- 新增弹窗 -->
    <el-dialog
        :title="addForm.mComUomPackId ? $t('packagingUnit_EditPackUnit') : $t('packagingUnit_NewPackUnit') "
        :visible.sync="addVisible"
        width="600px">
        <el-form class="el-row" ref="addForm" :model="addForm" :rules="rules" label-width="100px" label-position="left">
          <el-form-item :label="$t('common_code')"  prop="code" class="el-col el-col-11 ">
            <el-input  v-model="addForm.code"></el-input>
          </el-form-item>
          <el-form-item :label="$t('common_Name')"  prop="name" class="el-col el-col-11 el-col-offset-1">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item :label="$t('common_Description')"  prop="description" class="el-col el-col-23">
            <el-input type="textarea" :rows="3" v-model="addForm.description"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible = false">{{$t('common_cancel')}}</el-button>
          <el-button type="primary" @click="savePackagingUnit" :loading="saveLoading">{{$t('common_ok')}}</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import TableList from '@/components/Module/TableList'
export default {
  data () {
    return {
      code: '',
      name: '',
      addVisible: false,
      saveLoading: false,
      total: 0,
      tableData: [],
      addForm: {
        mComUomPackId: '',
        code: '',
        name: '',
        description: ''
      }
    }
  },
  computed: {
    rules () {
      return {
        code: [{ required: true, message: this.$t('packagingUnit_CodeCannBeEmpt') }],
        name: [{ required: true, message: this.$t('packagingUnit_TheNameCannBeEm') }],
        description: [{ required: true, message: this.$t('packagingUnit_DescrCannBeEmpt') }]
      }
    },
    option () {
      let This = this
      return {
        style: {
          width: '100%'
        },
        highlightCurrentRow: true,
        tableTitle: [
          {
            title: 'common_code',
            prop: 'code'
          },
          {
            title: 'common_Name',
            prop: 'name'
          },
          {
            title: 'common_Description',
            prop: 'description'
          },
          {
            title: 'common_CreateTime',
            prop: 'createdDt',
            replaceFun: row => {
              return row.createdDt
                ? this.$dayjs(row.createdDt).format('YYYY-MM-DD HH:mm:ss')
                : ''
            }
          },
          {
            title: 'common_Creator',
            prop: 'creatorName'
          },
          {
            title: 'common_Operate',
            prop: 'operation',
            fixed: 'right',
            width: '120',
            operation: true,
            buttonArr: [
              {
                iconClass: 'el-icon-edit-outline',
                text: 'common_Edit',
                operationClick (row) {
                  This.addForm = {
                    ...row
                  }
                  This.addVisible = true
                }
              },
              {
                iconClass: 'el-icon-delete',
                iconColor: '#f56c6c',
                text: 'common_Del',
                operationClick (row) {
                  This.deletetableData([row.mComUomPackId])
                }
              }
            ]
          }
        ]
      }
    }
  },
  methods: {
    // 刷新数据，重新查询
    refreshPage () {
      this.code = ''
      this.name = ''
      this.$refs.tableList.queryList(true)
    },
    showPop () {
      this.addForm = {
        mComUomPackId: '',
        code: '',
        name: '',
        description: ''
      }
      this.$refs.addForm && this.$refs.addForm.resetFields()
      this.addVisible = true
    },
    async getPackagingUnit (page) {
      let res = await this.$api.getPackUomList({ ...page, uomCode: this.code, uomName: this.name })
      if (res.code === '200') {
        this.total = res.data.totalNum
        this.tableData = res.data.list
      } else {
        this.total = 0
        this.tableData = []
      }
    },
    async savePackagingUnit () {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          this.saveLoading = true
          let res = await this.$api.savePackUom({ ...this.addForm })
          this.saveLoading = false
          if (res.code === '200') {
            this.addVisible = false
            this.$message.success(this.$t('common_SavedSuccessfully'))
            this.$refs.tableList.queryList(true)
          }
        }
      })
    },
    async deletetableData (ids) {
      const len = ids.length
      if (len > 0) {
        const confirmRes = await this.$myPrompt.confirm(this.$t('packagingUnit_AreYouSureDeleC'))
        if (confirmRes) {
          const res = await this.$api.delPackUom(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.$refs.tableList.queryList()
          })
        }
      } else {
        this.$message.warning(this.$t('packagingUnit_PleasSelePackUn'))
      }
    }
  },
  components: {
    TableList
  },
  created () {

  }
}
</script>
