<template>
  <div class="mes-main mes-work-order">
    <h3 class="mes-main-title">{{$t('snTypeQuery_CaseNumbPallInqu')}}</h3>
    <el-row :gutter="20" class="mes-main-filte">
      <el-col :span="12">
       <el-select style="width:35%;" size="mini" v-model="type" clearable  :placeholder="$t('common_PleasSele')" >
          <el-option v-for="(option,i) in snTypeList" :key="i" :label="option.label" :value="option.value"></el-option>
        </el-select>
      </el-col>
      <el-col :span="12">
        <el-button size="mini" style="float:right;margin-left:10px;">
          <i class="fa fa-filter"></i>
        </el-button>
        <el-input :placeholder="$t('snTypeQuery_enterAValu')" v-model.trim="keyword" size="mini" style="width:40%;float:right;" @keydown.enter.native="initData">
          <!-- <i slot="suffix" class="el-input__icon el-icon-search" @click="initData"></i> -->
        </el-input>
      </el-col>
    </el-row>
    <div class="mes-table">
       <el-row class="mes-table-handle">
        <el-col :span="12">
           <el-button icon="el-icon-search" size="mini" @click="initData">{{$t('common_Inquire')}}</el-button>
          <span class="split-line">|</span>
          <el-button icon="el-icon-refresh-right" size="mini" @click="resestList">{{$t('common_Refresh')}}</el-button>
        </el-col>
        <el-col :span="12">
          <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper, ->" :total="total"
            @current-change="handleCurrentChange" @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
      </el-row>
      <div class="mes-table-content">
        <el-table :data="tableData" border size="mini">
          <el-table-column type="index" :label="$t('common_Number')" align="center" :index="indexMethod"></el-table-column>
          <el-table-column prop="sn" sortable :label="$t('snTypeQuery_finisProd')" label-class-name="mes-table-label"  align="center"></el-table-column>
          <el-table-column prop="mn" sortable :label="$t('common_FinisProdNo')" align="center"></el-table-column>
          <el-table-column prop="dn" sortable :label="$t('common_WorkOrdeNo')" align="center"></el-table-column>
          <el-table-column prop="box" sortable :label="$t('snTypeQuery_CaseNumb')" align="center"></el-table-column>
          <el-table-column prop="pallet" sortable :label="$t('common_PalleNo')" align="center"></el-table-column>
          <!-- <el-table-column prop="dn" sortable label="出货单" align="center"></el-table-column> -->
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import paging from '@/mixins/paging'
export default {
  mixins: [paging],
  data () {
    return {
      type: 'SN',
      snTypeList: [
        {
          label: 'SN',
          value: 'sn'
        },
        {
          label: this.$t('snTypeQuery_CaseNumb'),
          value: 'box'
        },
        {
          label: this.$t('common_PalleNo'),
          value: 'pallet'
        },
        {
          label: 'DN',
          value: 'dn'
        }
      ],
      keyword: '',
      tableData: []
    }
  },
  methods: {
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    // 获取sn箱号栈板
    async initData () {
      let { keyword, type } = this
      let data = Object.assign({ keyword, type }, this.page)
      let res = await this.$api.getBoxPallet(data)
      this.tableData = res.data.list
      this.total = res.data.totalNum
    },
    resestList () {
      this.keyword = ''
      this.initData()
    }

  },
  created () {
    this.initData()
  }
}
</script>
