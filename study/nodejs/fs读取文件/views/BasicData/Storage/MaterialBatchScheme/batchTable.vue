<template>
  <div class="mes-table" style="width:100%">
    <el-table :data="tableData" border size="mini" style="width:100%" >
      <el-table-column prop="code" label="编码" min-width="150px" align="center" ></el-table-column>
      <el-table-column prop="name" label="名称" min-width="150px" align="center" ></el-table-column>
      <el-table-column prop="description" label="说明" min-width="250px" align="center" >
         <template slot-scope="scope">
            <div v-if="isRead">{{scope.row.description}}</div>
            <el-input v-else size="mini" v-model="scope.row.description"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="fieldType" label="类型"  min-width="100px" align="center" >
         <template slot-scope="scope">
            <div >{{{'0':'日期', '1':'文本', '2':'数值'}[scope.row.fieldType]}}</div>
            <!-- <el-select v-else  v-model="scope.row.fieldType" style="width:100%">
              <el-option label="日期" value="0"></el-option>
              <el-option label="文本" value="1"></el-option>
              <el-option label="数值" value="2"></el-option>
            </el-select> -->
        </template>
      </el-table-column>
      <el-table-column prop="inputType" label="输入控制"  min-width="150px" align="center" >
        <template slot-scope="scope">
            <div v-if="isRead">{{{'0':'必输', '1':'只读', '2':'可选', '3':'禁用'}[scope.row.inputType]}}</div>
            <el-select v-else  v-model="scope.row.inputType" style="width:100%">
              <el-option label="必输" value="0"></el-option>
              <el-option label="只读" value="1"></el-option>
              <el-option label="可选" value="2"></el-option>
              <el-option label="禁用" value="3"></el-option>
            </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="receiveVerification" label="收货校验" min-width="100px"  align="center" >
        <template slot-scope="scope">
          <div v-if="isRead">{{scope.row.receiveVerification ? '是' : '否'}}</div>
          <el-checkbox v-else v-model="scope.row.receiveVerification"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="outVerification" label="出库校验" min-width="100px" align="center" >
        <template slot-scope="scope">
          <div v-if="isRead">{{scope.row.outVerification ? '是' : '否'}}</div>
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
