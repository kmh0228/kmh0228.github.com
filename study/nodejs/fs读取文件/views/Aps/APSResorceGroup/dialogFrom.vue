<template>
<el-form :model="dialogForm" ref="dialogForm" label-position="left"  label-width="120px" class="el-row mes-form-rule" :rules="rules">
  <el-form-item label-width="220px" :label="$t('APSResorce_One') + ' . ' + $t('common_essenInfo')" class="el-col el-col-24"></el-form-item>
  <el-form-item  prop="resourceGroupCode" :label="$t('apsResGroup_ResouGrouCode') + ':'" class="el-col el-col-11">
    <el-input :disabled="isEdit"  v-model="dialogForm.resourceGroupCode"></el-input>
  </el-form-item>
  <el-form-item :label="$t('common_Enable') + ':'" class="el-col el-col-11 el-col-offset-1">
     <el-checkbox v-model="dialogForm.invalid"></el-checkbox>
  </el-form-item>
  <el-form-item :label="$t('common_Description')" class="el-col el-col-23">
    <el-input v-model="dialogForm.resourceGroupDesc"  type="textarea" :rows="2" :placeholder="$t('common_PleasEnteCont')"  ></el-input>
  </el-form-item>
  <el-form-item label-width="220px" :label="$t('apsResGroup_Two') + ' . ' + $t('apsResGroup_resouList')" class="el-col el-col-23"></el-form-item>
  <div class="special_table">
     <el-form-item  class="el-col el-col-8" label-width="0">
        <el-card class="mes-table" shadow="never">
            <div slot="header">
                <span>{{$t('apsResGroup_AllReso')}}</span>
            </div>
            <el-scrollbar style="height:18vh;">
            <el-table :data="allResourceData" size="mini"  highlight-current-row broder @cell-click="cellClick">
              <el-table-column type="index" :label="$t('common_Number')" width="50" align="center"></el-table-column>
              <el-table-column prop="resourceCode" :label="$t('apsResGroup_SchedResoCode')" align="center" ></el-table-column>
            </el-table>
            </el-scrollbar>
        </el-card>
     </el-form-item>
     <el-form-item  class="el-col el-col-2" style="text-aligin:center">
       <el-button style="border-radius:50%;width:45px;height:45px;font-size:20px;margin-left:17px;background-color:#F5F7FA;" :disabled="addDisabeld" class="addButton" @click="addResource"><i class="el-icon-arrow-right"></i></el-button>
       <el-button style="border-radius:50%;width:45px;height:45px;font-size:20px;margin-left:17px!important;background-color:#F5F7FA;" :disabled="deleteDisabeld" class="deleteButton" @click="deleteResource"><i class="el-icon-arrow-left"></i></el-button>
     </el-form-item>
      <el-form-item class="el-col el-col-13">
        <el-card class="mes-table" shadow="never">
          <div slot="header">
              <span>{{$t('apsResGroup_SelecReso')}}</span>
          </div>
          <el-table :data="allResourceDataDetail" size="mini"  highlight-current-row broder  @cell-click="cellClick2" doLayout>
            <el-table-column type="index" :label="$t('common_Number')" width="50" align="center"></el-table-column>
            <el-table-column prop="resourceCode" :label="$t('apsResGroup_SchedResoCode')" align="center" ></el-table-column>
            <el-table-column type="index" :label="$t('apsResGroup_prior')" width="80" align="center"></el-table-column>
            <el-table-column :label="$t('apsResGroup_AdjusPrio')" align="center">
              <template slot-scope="scope" >
                  <el-button type="text" @click="moveTop(scope.$index)" :disabled="disabeldTop(scope.$index)">{{$t('apsResGroup_Toppi')}}</el-button>
                  <el-button type="text" @click="moveUp(scope.$index)"  :disabled="disabeldUp(scope.$index)">{{$t('apsResGroup_MoveUp')}}</el-button>
                  <el-button type="text" @click="moveDown(scope.$index)"  :disabled="disabeldDown(scope.$index)">{{$t('apsResGroup_MoveDown')}}</el-button>
                  <el-button type="text" @click="moveBottom(scope.$index)"  :disabled="disabeldBottom(scope.$index)">{{$t('apsResGroup_SetBott')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-form-item>
  </div>
  <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
    <el-button type="primary" size="mini" @click="saveForm">{{$t('common_save')}}</el-button>
    <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
  </el-form-item>
</el-form>
</template>

<script>
export default {
  data () {
    return {
      dialogForm: {
        resourceGroupCode: '',
        invalid: this.isEdit ? '' : true,
        resourceGroupDesc: '',
        mPsmResourceGroupId: ''
      },
      allResourceData: [],
      allResourceDataDetail: [],
      addDisabeld: true,
      deleteDisabeld: true,
      addList: '',
      deleteList: ''
    }
  },
  props: {
    cannel: Function,
    getResourceGroupList: Function,
    mPsmResourceGroupId: String,
    isEdit: Boolean
  },
  computed: {
    rules () {
      return {
        resourceGroupCode: [{ required: true, message: this.$t('apsResGroup_enterResoGrou') }]
      }
    }
  },
  methods: {
    disabeldTop (i) {
      return i === 0
    },
    disabeldUp (i) {
      return i === 0
    },
    disabeldDown (i) {
      let len = this.allResourceDataDetail.length - 1
      return i === len
    },
    disabeldBottom (i) {
      let len = this.allResourceDataDetail.length - 1
      return i === len
    },
    saveForm () {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let { dialogForm, allResourceDataDetail } = this
          let detailVmList = []
          let obj
          allResourceDataDetail.forEach((item, $index) => {
            obj = {
              mPsmResourceId: item.mPsmResourceId,
              resourcePriority: $index + 1
            }
            detailVmList.push(obj)
          })
          let data = Object.assign({ detailVmList }, dialogForm)
          let res = await this.$api.saveApsResourceGroup(data)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getResourceGroupList')
          })
        }
      })
    },
    cellClick (row, column, cell, event) {
      this.addDisabeld = false
      this.addList = row
    },
    cellClick2 (row, column, cell, event) {
      this.deleteDisabeld = false
      this.deleteList = row
    },
    addResource () {
      let resouceArray = []
      this.allResourceDataDetail.map(item => {
        return resouceArray.push(item.mPsmResourceId)
      })
      let res = resouceArray.indexOf(this.addList.mPsmResourceId)
      if (res === -1) {
        this.allResourceDataDetail.push(this.addList)
      } else {
        this.$message.warning(this.$t('apsResGroup_doNotAddItAgai'))
      }
    },
    deleteResource () {
      let mPsmResourceId = this.deleteList.mPsmResourceId
      let i
      this.allResourceDataDetail.forEach((item, $index) => {
        if (item.mPsmResourceId === mPsmResourceId) {
          i = $index
        }
      })
      this.allResourceDataDetail.splice(i, 1)
      this.deleteDisabeld = true
    },
    // 上移
    moveUp (index) {
      // console.log(index)
      // let obj
      // obj = this.allResourceDataDetail[index - 1]
      // this.allResourceDataDetail[index - 1] = this.allResourceDataDetail[index]
      // this.allResourceDataDetail[index] = obj
      // console.log(this.allResourceDataDetail)
      // obj = ''
      let obj1 = this.allResourceDataDetail[index]
      let obj2 = this.allResourceDataDetail[index - 1]
      this.$set(this.allResourceDataDetail, index, obj2)
      this.$set(this.allResourceDataDetail, index - 1, obj1)
    },
    // 下移
    moveDown (index) {
      // console.log(this.allResourceDataDetail[index], this.allResourceDataDetail[index + 1])
      // let obj = this.allResourceDataDetail[index + 1]
      // this.allResourceDataDetail[index + 1] = this.allResourceDataDetail[index]
      // this.allResourceDataDetail[index] = obj
      // console.log(this.allResourceDataDetail[index], this.allResourceDataDetail[index + 1])
      let obj1 = this.allResourceDataDetail[index]
      let obj2 = this.allResourceDataDetail[index + 1]
      this.$set(this.allResourceDataDetail, index, obj2)
      this.$set(this.allResourceDataDetail, index + 1, obj1)
    },
    moveTop (index) {
      let obj = this.allResourceDataDetail[index]
      this.allResourceDataDetail.splice(index, 1)
      this.allResourceDataDetail.unshift(obj)
    },
    moveBottom (index) {
      let obj = this.allResourceDataDetail[index]
      this.allResourceDataDetail.splice(index, 1)
      this.allResourceDataDetail.push(obj)
    },
    // 获取资源列表
    async getResourceList () {
      let data = {
        status: '',
        keyWord: '',
        pageSize: 1000,
        pageIndex: 1
      }
      let res = await this.$api.getResourceList(data)
      this.allResourceData = res.data.list
    },
    async  setDefaultData () {
      if (this.isEdit) {
        let { mPsmResourceGroupId } = this
        let res = await this.$api.getResourceGroupById({ mPsmResourceGroupId })
        if (res.code === '200') {
          this.allResourceDataDetail = res.data.list ? res.data.list : []
          this.dialogForm.resourceGroupCode = res.data.resourceGroupCode
          this.dialogForm.invalid = res.data.invalid
          this.dialogForm.resourceGroupDesc = res.data.resourceGroupDesc
        } else {
          this.allResourceDataDetail = []
        }
      }
    }
  },
  created () {
    this.setDefaultData()
    this.getResourceList()
  }
}
</script>

<style lang="scss">
.special_table {
  .el-form-item__content {
    margin-left: 0 !important;
  }
}
.addButton {
  margin-top: 80%;
  margin-left: 10%;
}
.deleteButton {
  margin-left: 10% !important;
  margin-top: 40%;
}
</style>
