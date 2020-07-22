<template>
  <el-form :model="areaForm" ref="areaForm" :rules="rules" label-width="30%" label-position="left" class="el-row mes-form-rule">
    <el-form-item label="仓库" prop="mWmsWarehouseId" class="el-col el-col-24">
      <el-select  v-model="areaForm.mWmsWarehouseId" filterable clearable style="width:100%">
        <el-option :label="item.mWmsWarehouseName" :value="item.mWmsWarehouseId" :key="i" v-for="(item,i) in warehousesList"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="区域代码" prop="mWmsWarehouseAreaCode" class="el-col el-col-24">
      <el-input v-model.trim="areaForm.mWmsWarehouseAreaCode" size="mini"></el-input>
    </el-form-item>
    <el-form-item label="区域名称" prop="mWmsWarehouseAreaName" class="el-col el-col-24">
      <el-input v-model.trim="areaForm.mWmsWarehouseAreaName" size="mini"></el-input>
    </el-form-item>
    <el-form-item label="功能作用" prop="mWmsWarehouseAreaFunction" class="el-col el-col-24">
      <dict-select v-model="areaForm.mWmsWarehouseAreaFunction"  dictType="AREA_FUNCTION" clearable placeholder="请选择功能作用"></dict-select>
    </el-form-item>
    <el-form-item label="存储环境" prop="mWmsWarehouseAreaCondition" class="el-col el-col-24">
      <dict-select v-model="areaForm.mWmsWarehouseAreaCondition"  dictType="AREA_STORAGE_ENVIRONMENT" clearable placeholder="请选择存储环境"></dict-select>
    </el-form-item>
    <el-form-item label="存储贵重类型" prop="mWmsWarehouseAreaValue" class="el-col el-col-24">
      <dict-select v-model="areaForm.mWmsWarehouseAreaValue"  dictType="STORAGE_VALUABLE_TYPES" clearable placeholder="请选择存储环境"></dict-select>
    </el-form-item>
    <el-form-item label="储位使用情况" prop="mWmsWarehouseAreaUse" class="el-col el-col-24">
      <el-input v-model.trim="areaForm.mWmsWarehouseAreaUse" size="mini"></el-input>
    </el-form-item>
    <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveArea">保存</el-button>
      <el-button size="mini" @click="$emit('cannel')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      rules: {
        mWmsWarehouseId: [{ required: true, message: '仓库不能为空' }],
        mWmsWarehouseAreaCode: [{ required: true, message: '区域代码不能为空' }],
        mWmsWarehouseAreaName: [{ required: true, message: '区域名称不能为空' }]
      }
    }
  },
  props: {
    warehousesList: {
      type: Array
    },
    getArea: {
      type: Function
    },
    mWmsWarehouseAreaId: {
      type: String
    },
    areaForm: {
      type: Object
    }
  },
  methods: {
    resetFields () {
      this.$refs.areaForm.resetFields()
    },
    saveArea () {
      this.$refs.areaForm.validate(async valid => {
        if (valid) {
          let res = this.areaForm.mWmsWarehouseAreaId ? await this.$api.editArea({ ...this.areaForm }) : await this.$api.addArea({ ...this.areaForm })
          let { code, msg } = res
          if (code === '200') {
            this.getArea()
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
