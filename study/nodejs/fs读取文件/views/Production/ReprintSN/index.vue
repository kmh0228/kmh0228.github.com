<template>
   <div class="mes-main mes-main-common">
    <div class="main-common-head">
      <el-button type="primary" plain size="mini" @click="reprintSn">补印</el-button>
    </div>
    <el-form :model="reprintFrom" ref="reprint" label-width="30%" label-position="left" class="el-row mes-form-rule">
      <el-form-item label="SN" prop="snInfo" class="el-col el-col-11">
        <el-input v-model="reprintFrom.snInfo" placeholder="请输入SN，多个用逗号分隔" style="width:100%" size="mini">
          <i slot="suffix" style="cursor:pointer;" @click="snSearchDialog = true" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-form-item>
      <!-- <el-form-item label="结束SN" prop="end" class="el-col el-col-11 el-col-offset-1">
        <el-input v-model="reprintFrom.end" placeholder="请输入" clearable filterable style="width:100%" size="mini">
          <i slot="suffix" style="cursor:pointer;" @click="snSearchDialog = true" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-form-item> -->
      <el-form-item label="补印数量" prop="num" class="el-col el-col-11 el-col-offset-1">
        <el-input v-model="reprintFrom.num" placeholder="请输入补印数量" size="mini"></el-input>
      </el-form-item>
      <!-- <el-form-item label="补印原因" prop="reason" class="el-col el-col-11 el-col-offset-1">
        <el-select v-model="reprintFrom.reason" placeholder="请选择" style="width:100%" size="mini">
          <el-option label="标签损坏" value="标签损坏"></el-option>
          <el-option label="一般生产" value="一般生产"></el-option>
        </el-select>
      </el-form-item> -->
    </el-form>
    <div class="barcode-table mes-table">
      <p>SN 补印详情</p>
      <div class="mes-table-content">
        <el-table :data="reprintList" border size="mini" empty-text="暂无数据">
          <el-table-column type="index" label="序号" align="center" width="60" :index="indexMethod"></el-table-column>
          <el-table-column label="零件SN" prop="productSn" align="center"></el-table-column>
          <el-table-column label="零件料号" prop="materialNo" align="center"></el-table-column>
          <el-table-column label="打印次数" prop="printTimes" align="center"></el-table-column>
          <!-- <el-table-column label="打印时间" align="center"></el-table-column> -->
        </el-table>
      </div>
      <!-- <el-row style="text-align:center;margin-top:1vh;">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.pageIndex"
        :page-size="20" layout="total, prev, pager, next, jumper" :total="total" background>
        </el-pagination>
      </el-row> -->
      <el-dialog title="零件SN查询" :visible.sync="snSearchDialog" class="handle-dialog" top="12vh">
        <el-form label-width="20%" label-position="left" class="el-row" style="border-bottom:1px solid #B2B2B2;margin-bottom:0;">
          <el-form-item label="料号" class="el-col el-col-7">
            <el-select size="mini" v-model="mComMaterialId" filterable clearable style="width:100%;">
              <el-option v-for="(option,i) in materialList" :key="i" :label="option.MATERIAL_NO" :value="option.M_COM_MATERIAL_ID"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="SN" class="el-col el-col-7 el-col-offset-1">
            <el-input size="mini" v-model="keyWord"></el-input>
          </el-form-item>
          <el-form-item class="el-col el-col-2">
            <el-button type="primary" size="mini" @click="searchSnPrint">查询</el-button>
          </el-form-item>
        </el-form>
        <div class="mes-table">
          <el-table :data="snList" ref="multipleTable" border @selection-change="handleSelectionChange" @select="selectRows">
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column type="index" :index="dialogIndexMethod" label="序号"></el-table-column>
            <el-table-column label="SN" prop="productSn"></el-table-column>
            <el-table-column label="零件料号" prop="materialNo"></el-table-column>
            <el-table-column label="打印次数" prop="printTimes"></el-table-column>
            <!-- <el-table-column label="创建时间"></el-table-column> -->
          </el-table>
        </div>
        <div style="text-align:center">
          <el-pagination @size-change="dialogSizeChange" @current-change="dialogCurrentChange" :current-page="dialogPage.pageIndex"
            :page-size="10" layout="total, prev, pager, next" :total="dialogTotal" background>
            </el-pagination>
        </div>
        <div slot="footer">
          <el-button type="primary" @click="setCheckedSn">确 定</el-button>
          <el-button @click="snSearchDialog = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      reprintFrom: {
        snInfo: '',
        end: '',
        num: 1,
        reason: '标签损坏'
      },
      total: 0,
      page: {
        pageIndex: 1,
        pageSize: 20
      },
      reprintList: [],
      snSearchDialog: false,
      dialogPage: {
        pageIndex: 1,
        pageSize: 10
      },
      dialogTotal: 0,
      snList: [],
      materialList: [],
      keyWord: '',
      prevKeyWord: '',
      mComMaterialId: null,
      checkedSn: []
    }
  },
  watch: {
    snSearchDialog (val) {
      if (val) {
        this.dialogTotal = 0
        this.snList = []
        this.checkedSn = []
      }
    }
  },
  methods: {
    handleSizeChange (size) {
      this.page.pageSize = size
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
    },
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    dialogSizeChange (size) {
      this.dialogPage.pageSize = size
      this.searchSnPrint()
    },
    dialogCurrentChange (index) {
      this.dialogPage.pageIndex = index
      this.searchSnPrint()
    },
    dialogIndexMethod (index) {
      let { pageIndex, pageSize } = this.dialogPage
      return pageSize * (pageIndex - 1) + index + 1
    },
    // 获取SN补印详情
    async getSnReprintInfo (productSn) {
      let data = Object.assign({ productSn }, this.page)
      let res = await this.$api.getSnPrintAgainList(data)
      this.total = res.data.total_num || 0
      this.reprintList = res.data.list || []
    },
    // 获取料号列表
    async getMaterials () {
      let res = await this.$api.getMaterials()
      this.materialList = res.data
    },
    // 查询SN补印详情
    async searchSnPrint () {
      let { keyWord, prevKeyWord, mComMaterialId, dialogPage } = this
      if (mComMaterialId) {
        if (prevKeyWord && prevKeyWord !== keyWord) {
          let isClear = await this.$myPrompt.confirm('搜索关键字发生变化，是否将上次选中的SN列表清空？')
          if (isClear) {
            this.checkedSn = []
          }
        }
        let data = Object.assign(dialogPage, { keyWord, mComMaterialId })
        let res = await this.$api.getSnPrintAgainList(data)
        this.prevKeyWord = keyWord
        this.dialogTotal = res.data.total_num || 0
        this.snList = res.data.list || []
        this.$nextTick(() => {
          this.toggleSelection()
        })
      } else {
        this.$message.warning('请先选择料号信息')
      }
    },
    handleSelectionChange (rows) {
      rows.forEach(val => {
        this.checkedSn.push(val.productSn)
        this.checkedSn = Array.from(new Set(this.checkedSn))
      })
    },
    selectRows (select, row) {
      let arr = []
      let { productSn } = row
      select.forEach(val => {
        if (val.productSn === productSn) {
          arr.push(true)
        }
      })
      if (arr.indexOf(true) === -1) {
        this.checkedSn.splice(this.checkedSn.indexOf(productSn), 1)
      }
    },
    toggleSelection () {
      let { checkedSn, snList } = this
      snList.forEach(row => {
        for (let i in checkedSn) {
          if (checkedSn[i] === row.productSn) {
            this.$refs.multipleTable.toggleRowSelection(row, true)
          }
        }
      })
    },
    setCheckedSn () {
      let { checkedSn } = this
      let len = checkedSn.length
      if (len > 0) {
        this.reprintFrom.snInfo = checkedSn.join(',')
        this.snSearchDialog = false
      } else {
        this.$message.warning('当前未选中SN信息!')
      }
    },
    async reprintSn () {
      let { snInfo } = this.reprintFrom
      if (snInfo) {
        let productSn = snInfo.indexOf(',') ? this.reprintFrom.snInfo.split(',') : [snInfo]
        let data = {
          mPomLineStationPrinterId: '73c69d63-1fc6-4dd1-a4be-ec1d8e26e579',
          printTempName: 'CARTON',
          productSn
        }
        let res = await this.$api.printSsn(data)
        let { msg, code } = res
        if (code === '200') {
          this.$message.success(msg)
          this.checkedSn = []
          this.getSnReprintInfo(productSn)
        } else {
          this.$message.error(msg)
        }
      } else {
        this.$message.warning('请输入或选择需要补印的SN!')
      }
    }
  },
  created () {
    this.getMaterials()
  }
}
</script>
