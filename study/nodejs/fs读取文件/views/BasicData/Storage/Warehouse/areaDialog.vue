<template>
  <el-form :model="areaForm" ref="areaForm" :rules="rules" label-width="30%" label-position="left" class="el-row mes-form-rule">
    <el-form-item label="区域代码" prop="mWmsWarehouseAreaCode" class="el-col el-col-24">
      <el-input v-model.trim="areaForm.mWmsWarehouseAreaCode" size="mini"></el-input>
    </el-form-item>
    <el-form-item label="区域名称" prop="mWmsWarehouseAreaName" class="el-col el-col-24">
      <el-input v-model.trim="areaForm.mWmsWarehouseAreaName" size="mini"></el-input>
    </el-form-item>
    <el-form-item label="功能作用" prop="mWmsWarehouseAreaFunction" class="el-col el-col-24">
      <!-- <el-input v-model.trim="areaForm.mWmsWarehouseAreaFunction" size="mini"></el-input> -->
      <!-- <el-select v-model="areaForm.mWmsWarehouseAreaFunction" size="mini" style="width:100%" filterable placeholder="请选择功能作用">
        <el-option>理货收获</el-option>
      </el-select> -->
      <dict-select v-model="areaForm.mWmsWarehouseAreaFunction"  dictType="AREA_FUNCTION" clearable placeholder="请选择功能作用"></dict-select>
    </el-form-item>
    <el-form-item label="存储环境" prop="mWmsWarehouseAreaCondition" class="el-col el-col-24">
      <!-- <el-input v-model.trim="areaForm.mWmsWarehouseAreaCondition" size="mini"></el-input> -->
      <!-- <el-select v-model="areaForm.mWmsWarehouseAreaCondition" size="mini" style="width:100%" filterable placeholder="请选择存储环境">
        <el-option>常温常湿</el-option>
      </el-select> -->
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
      areaForm: {
        mWmsWarehouseAreaId: '',
        mWmsWarehouseAreaCode: '',
        mWmsWarehouseAreaName: '',
        mWmsWarehouseAreaFunction: '',
        mWmsWarehouseAreaCondition: '',
        mWmsWarehouseAreaValue: '',
        mWmsWarehouseAreaUse: ''
      },
      rules: {
        mWmsWarehouseAreaCode: [{ required: true, message: '区域代码不能为空' }],
        mWmsWarehouseAreaName: [{ required: true, message: '区域名称不能为空' }]
      }
    }
  },
  props: {
    isEdit: {
      type: Boolean
    },
    getArea: {
      type: Function
    },
    mWmsWarehouseId: {
      type: String
    }
  },
  methods: {
    saveArea () {
      this.$refs.areaForm.validate(async valid => {
        if (valid) {
          let { areaForm, mWmsWarehouseId } = this
          let data = Object.assign(areaForm, { mWmsWarehouseId })
          let res = this.isEdit ? await this.$api.editArea(data) : await this.$api.addArea(data)
          let { code, msg } = res
          if (code === '200') {
            this.$emit('getArea', areaForm.mWmsWarehouseId)
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
