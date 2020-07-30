<template>
  <div class="mes-table" style="width:100%">
    <el-table :data="tableData" border size="mini" style="width:100%" >
      <el-table-column prop="code" :label="$t('common_code')" min-width="150px" align="center" ></el-table-column>
      <el-table-column prop="name" :label="$t('common_Name')" min-width="150px" align="center" ></el-table-column>
      <el-table-column prop="description" :label="$t('materialBathS_expla')" min-width="250px" align="center" >
         <template slot-scope="scope">
            <div v-if="isRead">{{scope.row.description}}</div>
            <el-input v-else size="mini" v-model="scope.row.description"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="fieldType" :label="$t('common_type')"  min-width="100px" align="center" >
         <template slot-scope="scope">
            <div >{{{'0':$t('common_Date'), '1':$t('materialBathS_text'), '2':$t('materialBathS_numerValu')}[scope.row.fieldType]}}</div>
            <!-- <el-select v-else  v-model="scope.row.fieldType" style="width:100%">
              <el-option label="日期" value="0"></el-option>
              <el-option label="文本" value="1"></el-option>
              <el-option label="数值" value="2"></el-option>
            </el-select> -->
        </template>
      </el-table-column>
      <el-table-column prop="inputType" :label="$t('materialBathS_InputCont')"  min-width="150px" align="center" >
        <template slot-scope="scope">
            <div v-if="isRead">{{{'0':$t('materialBathS_MustLose'), '1':$t('materialBathS_readOnly'), '2':$t('materialBathS_Optional'), '3':$t('common_Disab')}[scope.row.inputType]}}</div>
            <el-select v-else  v-model="scope.row.inputType" style="width:100%">
              <el-option :label="$t('materialBathS_MustLose')" value="0"></el-option>
              <el-option :label="$t('materialBathS_readOnly')" value="1"></el-option>
              <el-option :label="$t('materialBathS_Optional')" value="2"></el-option>
              <el-option :label="$t('common_Disab')" value="3"></el-option>
            </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="receiveVerification" :label="$t('materialBathS_ReceiVeri')" min-width="100px"  align="center" >
        <template slot-scope="scope">
          <div v-if="isRead">{{scope.row.receiveVerification ? $t('common_Yes') : $t('common_No')}}</div>
          <el-checkbox v-else v-model="scope.row.receiveVerification"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="outVerification" :label="$t('materialBathS_DelivVeri')" min-width="100px" align="center" >
        <template slot-scope="scope">
          <div v-if="isRead">{{scope.row.outVerification ? $t('common_Yes') : $t('common_No')}}</div>
          <el-checkbox v-else v-model="scope.row.outVerification"></el-checkbox>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: []
    }
  },
  computed: {
  },
  props: {
    batchData: {
      type: Array,
      default: () => []
    },
    isRead: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    batchData (n) {
      this.init()
    }
  },
  methods: {
    init () {
      this.tableData = this.batchData.map(item => item)
    },
    getBatchData () {
      return this.tableData
    }
  },
  components: {},
  created () {
    this.init()
  }
}
</script>
