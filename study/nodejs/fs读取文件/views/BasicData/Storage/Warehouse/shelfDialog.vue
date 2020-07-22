<template>
  <el-form :model="shelfForm" ref="shelfForm" :rules="rules"  label-width="120px" label-position="left" class="el-row mes-from-rule">
    <el-form-item label="货架编号" prop="mWmsWarehouseShelfCode" class="el-col el-col-24">
      <el-input v-model.trim="shelfForm.mWmsWarehouseShelfCode" size="mini"></el-input>
    </el-form-item>
    <el-form-item label="货架类型" prop="mWmsWarehouseShelfType" class="el-col el-col-24">
      <!-- <el-input v-model.trim="shelfForm.mWmsWarehouseShelfType" size="mini"></el-input> -->
       <!-- <el-select v-model="shelfForm.mWmsWarehouseShelfType" size="mini" style="width:100%" filterable placeholder="请选择货架类型">
       <el-option>BOX</el-option>
     </el-select> -->
           <dict-select v-model="shelfForm.mWmsWarehouseShelfType"  dictType="SHELF_TYPE" clearable placeholder="请选择货架类型"></dict-select>

    </el-form-item>
    <el-form-item label="储位个数" prop="mWmsWarehouseShelfNumber" class="el-col-24">
      <el-input v-model.trim="shelfForm.mWmsWarehouseShelfNumber" size="mini"></el-input>
    </el-form-item>
    <el-form-item label="储位使用情况" prop="mWmsWarehouseShelfUse" class="el-col-24">
      <el-input v-model.trim="shelfForm.mWmsWarehouseShelfUse" size="mini"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveShelf">保存</el-button>
      <el-button size="mini" @click="$emit('cannel')">取消</el-button>
    </el-form-item>
  </el-form>

</template>

<script>
export default {
  data () {
    return {
      shelfForm: {
        mWmsWarehouseShelfCode: '',
        mWmsWarehouseShelfType: '',
        mWmsWarehouseShelfNumber: '',
        mWmsWarehouseShelfUse: ''
      },
      rules: {
        mWmsWarehouseShelfCode: [{ required: true, message: '货架编号不能为空' }]
      }
    }
  },
  props: {
    isEdit: {
      type: Boolean
    },
    getShelf: {
      type: Function
    },
    mWmsWarehouseAreaId: {
      type: String
    }
  },
  methods: {
    saveShelf () {
      this.$refs.shelfForm.validate(async valid => {
        if (valid) {
          let { shelfForm, mWmsWarehouseAreaId } = this
          let mWmsWarehouseShelfAreaid = mWmsWarehouseAreaId
          let data = Object.assign(shelfForm, { mWmsWarehouseShelfAreaid })
          let res = this.isEdit ? await this.$api.updateShelf(data) : await this.$api.insertShelf(data)
          let { code, msg } = res
          if (code === '200') {
            this.$emit('getShelf', shelfForm.mWmsWarehouseAreaId)
            this.$message.success(msg)
          } else {
            this.$message.error(msg)
          }
          this.$emit('cannel')
        }
      })
    }
  }
}
</script>
