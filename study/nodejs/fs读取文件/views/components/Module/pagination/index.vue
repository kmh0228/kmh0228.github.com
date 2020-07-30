<template>
  <el-pagination background
    :page-size="page.pageSize"
    :page-sizes="pageSizes"
    :pager-count="pagerCount"
    layout="total, sizes, prev, pager, next, jumper, ->"
    :total="total"
    :current-page="page.pageIndex"
     @current-change="handleCurrentChange"
     @size-change="handleSizeChange"></el-pagination>
</template>

<script>
export default {
  data () {
    return {
      page: {
        pageIndex: 1,
        pageSize: 10
      }
    }
  },
  props: {
    pageSizes: {
      type: Array,
      default () {
        return [10, 20, 30, 50]
      }
    },
    pagerCount: {
      type: Number,
      default: 5
    },
    total: {
      type: Number,
      default: 0
    },
    initData: {
      type: Function,
      default: () => { }
    }
  },
  methods: {
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.initData()
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.initData()
    },
    resetPage (index = 1, size = 10) {
      this.page.pageIndex = index
      this.page.pageSize = size
    }
  }
}
</script>
