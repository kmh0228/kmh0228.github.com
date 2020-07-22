<template>
  <el-table :data="templateMaterials.materialList" border size="mini">
    <el-table-column type="index" label="序号" :index="indexMethod" align="center"></el-table-column>
    <el-table-column label="料号" align="center">
      <template slot-scope="props">
        <p v-if="isRead">{{ props.row.materialNo }}</p>
        <el-select v-else v-model="props.row.mComMaterialId" size="mini" clearable filterable style="width:100%;" @clear="setMaterialObj('',props.$index)">
          <el-option v-for="(option,i) in materialList" :key="i" :label="option.materialNo" :value="option.mComMaterialId" @click.native="setMaterialObj(option,props.$index)">
          </el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="名称" align="center" prop="materialName"></el-table-column>
    <el-table-column label="版次" align="center" prop="version" width="80"></el-table-column>
    <el-table-column label="物料类型" align="center" prop="mComMaterialtypeCode" width="100"></el-table-column>
    <el-table-column label="组装类别" prop="assemblyType" align="center">
      <template slot-scope="props">
        <p v-if="isRead">{{ props.row.assemblyType }}</p>
        <el-input v-else v-model="props.row.assemblyType" size="mini"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="制程" align="center">
      <template slot-scope="props">
        <p v-if="isRead">{{ props.row.segName }}</p>
        <el-select v-else filterable clearable v-model="props.row.mPomWorkMasterSpecMProcess" size="mini" style="width:100%;">
          <el-option v-for="(options,i) in processList" :key="i" :label="options.segCode" :value="options.mComProcessSegId"></el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="数量" align="center">
      <template slot-scope="props">
        <p v-if="isRead">{{ props.row.qty }}</p>
        <el-input v-else v-model.number="props.row.qty" size="mini"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="组装顺序" prop="assemblyStep" align="center">
      <template slot-scope="props">
        <p v-if="isRead">{{ props.row.assemblyStep }}</p>
        <el-input v-else v-model="props.row.assemblyStep" size="mini"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="描述" prop="specDesc" align="center">
      <template slot-scope="props">
        <p v-if="isRead">{{ props.row.specDesc }}</p>
        <el-input v-else v-model="props.row.specDesc" size="mini"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="是否启用" align="center" width="80">
      <template slot-scope="prop">
        <el-checkbox v-model="prop.row.isInvalid" true-label="0" false-label="1"  :disabled="useType===0"></el-checkbox>
      </template>
    </el-table-column>
    <el-table-column label="操作" v-if="useType!==0" width="80" align="center">
      <template slot-scope="scope">
        <el-button type="text" size="mini" style="color:#F56C6C;font-size:0.8vw;" icon="el-icon-delete" @click="delCurrentRow(scope.$index)"></el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data () {
    return {
      materialList: [],
      processList: []
    }
  },
  props: {
    useType: {
      type: Number
    },
    templateMaterials: {
      type: Object
    }
  },
  computed: {
    isRead () {
      return this.useType === 0
    }
  },
  methods: {
    indexMethod (index) {
      return index + 1
    },
    delCurrentRow (index) {
      this.templateMaterials.materialList.splice(index, 1)
    },
    setMaterialObj (obj, index) {
      let keys = ['mComMaterialId', 'materialNo', 'materialName', 'version', 'materialType']
      if (obj) {
        keys.forEach(key => {
          this.templateMaterials.materialList[index][key] = obj[key]
        })
      } else {
        keys.forEach(key => {
          this.templateMaterials.materialList[index][key] = ''
        })
      }
    },
    // 获取所有料号列表
    async getMaterialList () {
      let data = {
        materialNo: '',
        materialType: '',
        pageIndex: 1,
        pageSize: 1000
      }
      let res = await this.$api.getMaterialMasters(data)
      this.materialList = res.data.list
    },
    // 获取制程列表
    async getProcessList () {
      const data = {
        segCode: '',
        pageIndex: 1,
        pageSize: 1000
      }
      const res = await this.$api.getAllProcessList(data)
      if (res.code === '200') {
        this.processList = res.data.list
      } else {
        this.processList = []
      }
    },
    async saveWorkTemplate () {
      let { mPomWorkMasterId } = this.templateMaterials
      if (mPomWorkMasterId) {
        let res = await this.$api.saveTemplateMaterials(this.templateMaterials)
        let { code, msg } = res
        if (code === '200') {
          this.$message.success(msg)
        } else {
          this.$message.error(msg)
        }
      } else {
        this.$message.warning('请先保存基本信息!')
      }
    }
  },
  created () {
    if (!this.isRead) {
      this.getMaterialList()
      this.getProcessList()
    }
  }
}
</script>
