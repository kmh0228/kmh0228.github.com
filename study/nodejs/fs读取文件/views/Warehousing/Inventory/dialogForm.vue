<template>
  <div class="mes-main-tabs">
    <el-tabs>
      <el-tab-pane  label="基本信息">
        <el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="100px" label-position="left" class="el-row mes-form-rule">
          <el-form-item label="盘点单号" prop="checklistNo" class="el-col el-col-12" >
            <el-row>
              <el-col :lg="{span:13}" :xl="{span:13}">
                <el-input v-model="dialogForm.checklistNo" placeholder="请生成盘点单号"></el-input>
              </el-col>
              <el-col :lg="{span:10,offset:1}" :xl="{span:10,offset:1}">
                <el-button type="primary" plain  @click="getJobOrderNo" style="width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">按规则生成盘点单号</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="仓库编号" prop="mWmsWarehouseId" class="el-col el-col-11  el-col-offset-1">
            <mes-select v-model="dialogForm.mWmsWarehouseId" method="getWarehouses" labelKey="mWmsWarehouseCode" valueKey="mWmsWarehouseId" placeholder="请选择仓库" @change="warehouseChange"></mes-select>
          </el-form-item>
          <el-form-item label="单据日期" prop="createdDt" class="el-col el-col-12">
            <el-date-picker v-model="dialogForm.createdDt" type="datetime" size="mini" placeholder="选择日期" class="mes-form-item" style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item label="备注" prop="remarks" class="el-col el-col-11  el-col-offset-1">
            <el-input type="textarea" v-model="dialogForm.remarks"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-tabs>
      <el-tab-pane  label="盘点单明细">
        <div>
          <el-table :data="isEdit?detailData:addDetailData" border size="mini">
            <el-table-column type="index" label="序号" align="center"></el-table-column>
            <el-table-column prop="materialNo" label="物料料号" align="center" min-width="120">
              <template slot-scope="scope">
                <dialogTableSelect v-model.trim="scope.row.mComMaterialId" @change="detailCellClick(scope.$index)" :contentValue="getMaterialNoVersion(scope.row.materialNo,scope.row.version)" selectId="mComMaterialId" searchPlaceholder="请选择料号" :searchForm="materialSearch" searchKey="mComMaterialId" :showKey="['materialNo','version']" :tableColumns="materialColumns" getDataFunction="getMaterialMasters" @sendMateriaList="sendMateriaList"></dialogTableSelect>
              </template>
            </el-table-column>
            <el-table-column  prop="materialName" label="物料名称" align="center" min-width="120">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.materialName" size="mini" :disabled="true"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="bookQuantity" label="账面数量" align="center" min-width="120">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.bookQuantity" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="realQuantity" label="实际数量" align="center" min-width="120">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.realQuantity" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" align="center">
              <template slot-scope="scope">
                <el-button type="danger" icon="el-icon-delete" @click="delCurrentRow(scope.$index, scope.row.mWmsChecklistDetailId)"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row style="margin-top:15px;">
            <el-button type="primary" plain size="mini" icon="el-icon-plus" @click="addinventoryList">添加</el-button>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div  class="dialog-footer">
      <el-button type="primary" @click="saveLnventoryList">保存</el-button>
      <el-button @click="$emit('cannel')">取消</el-button>
    </div>
  </div>
</template>

<script>
import materialSelect from '@/components/Module/materialSelect/materialSelect'
import dialogTableSelect from '@/components/Module/DialogTableSelect/dialogTableSelect'
export default {
  data () {
    return {
      materialNo: '',
      dialogForm: {
        checklistNo: '',
        mWmsWarehouseId: '',
        createdDt: '',
        remarks: ''
      },
      materialColumns: [{
        key: 'materialNo',
        label: '料号'
      }, {
        key: 'materialName',
        label: '物料名称'
      }, {
        key: 'version',
        label: '版次'
      }, {
        key: 'mComMaterialtypeCode',
        label: '物料类型'
      }],
      materialSearch: {
        materialNo: '',
        materialType: ''
      },
      MateriaList: [],
      addDetailData: [{
        materialNo: '',
        materialName: '',
        bookQuantity: 0,
        realQuantity: 0
      }],
      rules: {
        checklistNo: [{ required: true, message: '盘点单号不能为空' }],
        mWmsWarehouseId: [{ required: true, message: '仓库编号不能为空' }],
        createdDt: [{ required: true, message: '单据日期不能为空' }]
      }
    }
  },
  props: {
    isEdit: Boolean,
    cannel: Function,
    getinventoryList: Function,
    getInventoryDetail: Function,
    detailData: Array,
    checkId: String
  },
  methods: {
    warehouseChange (val) {
      this.dialogForm.mWmsWarehouseId = val
    },
    async getJobOrderNo () {
      const res = await this.$api.getJobOrderNo('PDC', 1)
      if (res.code === '200') {
        this.dialogForm.checklistNo = res.data
      }
    },
    saveLnventoryList () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let { dialogForm, isEdit } = this
          let data = Object.assign(dialogForm)
          isEdit ? await this.editInventoryAndDetail(data) : await this.addinventoryListAndDetail(data)
        }
      })
    },
    async addinventoryListAndDetail (data) {
      let params = await this.$api.addinventoryList(data)
      const { addDetailData } = this
      addDetailData.forEach(e => {
        e.mWmsChecklistId = params.data
      })
      const addDetail = Object.assign(addDetailData)
      const res = await this.$api.saveDetailList(addDetail)
      this.$myPrompt.handleMsg(res, () => {
        this.$emit('cannel')
        this.$emit('getinventoryList')
      })
    },
    async editInventoryAndDetail (data) {
      await this.$api.editInventory(data)
      const { detailData, checkId } = this
      const params = Object.assign(detailData)
      const res = await this.$api.saveDetailList(params)
      this.$myPrompt.handleMsg(res, () => {
        this.$emit('cannel')
        this.$emit('getinventoryList')
        this.$emit('getInventoryDetail', checkId)
      })
    },
    async delCurrentRow (index, detailId) {
      let confirmRes = await this.$myPrompt.confirm('确定删除当前选中的盘点详情信息吗?')
      if (confirmRes) {
        this.detailData.splice(index, 1)
      }
    },
    // async deleteDetail (index, detailId) {
    //   let confirmRes = await this.$myPrompt.confirm('确定删除当前选中的盘点详情信息吗?')
    //   if (confirmRes && detailId) {
    //     const res = await this.$api.deleteDetailData([detailId])
    //     let { code, msg } = res
    //     if (code === '200') {
    //       this.$message.success(msg)
    //       this.detailData.splice(index, 1)
    //     } else {
    //       this.$message.error(msg)
    //     }
    //   } else {
    //     this.detailData.splice(index, 1)
    //   }
    // },
    addinventoryList () {
      const { isEdit } = this
      if (isEdit) {
        this.detailData.push({
          materialNo: '',
          materialName: '',
          bookQuantity: 0,
          realQuantity: 0,
          mWmsChecklistId: this.checkId
        })
      } else {
        this.addDetailData.push({
          materialNo: '',
          materialName: '',
          bookQuantity: 0,
          realQuantity: 0
        })
      }
    },
    detailCellClick (index) {
      const { detailData, addDetailData, MateriaList, isEdit } = this
      if (isEdit) {
        MateriaList.forEach(e => {
          if (e.mComMaterialId === detailData[index].mComMaterialId) {
            detailData[index].materialName = e.materialName
          }
        })
      } else {
        MateriaList.forEach(e => {
          if (e.mComMaterialId === addDetailData[index].mComMaterialId) {
            addDetailData[index].materialName = e.materialName
          }
        })
      }
    },
    getMaterialNoVersion (num, v) {
      let materialNo = num || ''
      let vsersion = v ? ':' + v : ''
      return `${materialNo}${vsersion}`
    },
    sendMateriaList (data) {
      this.MateriaList = data
    },
    setMaterialRev (material) {
      this.dialogForm.materialName = material.materialName
    }
  },
  components: {
    materialSelect,
    dialogTableSelect
  }
}
</script>
