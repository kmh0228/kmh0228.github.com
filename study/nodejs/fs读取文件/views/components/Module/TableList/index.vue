<template>
  <div class="mes-table">
    <el-row class="mes-table-handle">
      <el-col :span="12">
        <div style="minHeight:30px">
          <slot name="buttonBox"></slot>
        </div>
      </el-col>
      <el-col :span="12">
        <el-pagination background :page-size="page.pageSize" :page-sizes="[10,20,30,50]" :pager-count="5"
          layout="total, sizes, prev, pager, next, jumper, ->" :total="total" :current-page="page.pageIndex"
          @current-change="pageHandleCurrentChange" @size-change="handleSizeChange">
        </el-pagination>
      </el-col>
    </el-row>
    <div style="padding-top:10px;" class="mes-table-content" v-loading="loading">
      <el-table ref="multipleTable"
        :data="tableData"
        :max-height="option.maxHeight"
        :stripe="option.stripe"
        :border="option.border"
        :cell-class-name="cellClassName"
        :highlight-current-row="option.highlightCurrentRow"
        @selection-change="selectionChange"
        @current-change="handleCurrentChange"
        :style="option.style ? option.style : {width:'100%'}"
        @cell-click="cellClick"
        size="mini">
         <el-table-column
          fixed
          v-if="option.selection"
          type="selection"
          :selectable="option.selectable && option.selectable"
        ></el-table-column>
        <el-table-column
          fixed
          v-if="option.index"
          type="index"
          :label="$t(option.indexTitle)"
          :width="option.indexWidth"
          :index="indexMethod"
          align="center"
        ></el-table-column>
        <el-table-column
          :sortable="!item.operation"
          align="center"
          :prop="item.prop"
          :label="$t(item.title)"
          :min-width="item.minWidth"
          :width="item.width"
          :key="j"
          :fixed="item.fixed"
          :show-overflow-tooltip="item.showTooltip"
          v-for="(item, j) in option.tableTitle"
        >
          <template slot-scope="props">
            <span
              v-if="item.isClick"
              style="cursor: pointer;color: #0070b1;"
              @click.stop="item.cb  && item.cb(props.row)"
            >{{props.row[item.prop]}}</span>
            <span v-else-if="item.operation">
              <handle-button :key="k" v-for="(itemButton, k) in item.buttonArr"  @click="itemButton.operationClick  && itemButton.operationClick(props.row)" :iconClass="itemButton.iconClass" :iconColor="itemButton.iconColor" :tipText="$t(itemButton.text)"></handle-button>
            </span>
            <span v-else-if="item.replaceFun && typeof item.replaceFun === 'function'">{{item.replaceFun(props.row)}}</span>
            <span v-else>{{props.row[item.prop]}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      page: {
        pageSize: 10,
        pageIndex: 1
      },
      loading: false,
      multipleSelection: [],
      currentRow: {},
      option: {
        stripe: false,
        border: true,
        selection: true,
        index: true,
        indexTitle: 'common_Number',
        indexWidth: '60',
        tableTitle: []

      }
    }
  },
  props: {
    tableData: {
      type: Array,
      required: true
    },
    queryListApi: {
      type: Function
    },
    tableOption: {
      type: Object,
      required: true
    },
    total: {
      type: Number,
      required: true,
      default: 0
    }
  },
  methods: {
    indexMethod (index) {
      let { pageIndex, pageSize } = this.page
      return pageSize * (pageIndex - 1) + index + 1
    },
    cellClassName ({ row, column, rowIndex, columnIndex }) {
      let obj = this.option.tableTitle.find(item => item.prop === column.property)
      if (obj && obj.className) {
        if (typeof obj.className === 'string' && obj.className) {
          return obj.className
        } else if (typeof obj.className === 'function' && obj.className(row)) {
          return obj.className(row)
        }
      }
    },
    async queryList (resetPage = false) {
      if (resetPage) {
        this.page.pageIndex = 1
      }
      this.loading = true
      await this.queryListApi(this.page)
      this.loading = false
    },
    pageHandleCurrentChange (index) {
      this.page.pageIndex = index
      this.queryList()
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.queryList(true)
    },
    handleCurrentChange (val) {
      if (this.option.highlightCurrentRow) {
        this.currentRow = val
      }
    },
    // 返回当前选中数据
    getCurrentRow () {
      return this.currentRow
    },
    selectionChange (val) {
      this.multipleSelection = val
    },
    // 返回多选中数据
    getSelectData () {
      return this.multipleSelection
    },
    cellClick (row, column, cell, event) {
      this.option.cellClick && this.option.cellClick(row, column, cell, event)
    }
  },
  created () {
    this.option = { ...this.option, ...this.tableOption }
    if (this.queryListApi) {
      this.queryList()
    }
  }
}
// {
//     style: {
//       width: '100%'
//     },
//     tableTitle: [
//       {
//         title: 'VDCS编号',
//         prop: 'vdcsNo',
//         isClick:true, // 是否可以点击
//         cb:(row,e)=>{ // 点击函数
//           e.stopPropagation()
//           console.log(row)
//         }
//       },
//       {
//         title: '供应商',
//         prop: 'vendorVn'
//       },
//       {
//         title: '日期',
//         prop: 'vdcsDate'
//       },
//       {
//         title: '料号',
//         prop: 'partNoVn',
//         replaceFun: (row) => {
//           return row.sipVer ? `${row.partNoVn}:${row.sipVer}` : row.partNoVn
//         }
//       },
//       {
//         title: '是否回复',
//         prop: 'isVendorReply',
//         replaceFun: (row) => {
//           return row.isVendorReply ? '是' : '否'
//         }
//       },
//       {
//         title: '处理方式',
//         prop: 'handleMethodVn'
//       },
//       {
//         title: '状态',
//         prop: 'status',
//         replaceFun: (row) => {
//           return row.status ? row.status : '未提交'
//         }
//       },
//       {
//         title: '操作',
//         prop: 'operation',
//         fixed: 'right',
//         width: '120',
//         operation: true,
//         buttonArr: [
//           {
//             iconClass: 'el-icon-edit-outline',
//             text: '编辑',
//             operationClick (row,e) {
//               This.$router.push(`VDCS/edit?vdcsId=${row.vdcsId}&status=${row.status ? row.status : 'DRAFT'}`)
//             }
//           },
//           {
//             iconClass: 'el-icon-delete',
//             iconColor: '#f56c6c',
//             text: '删除',
//             operationClick (row,e) {
//               This.deletetableData([row.vdcsId])
//             }
//           }
//         ]
//       }
//     ],
//     cellClick (row, column, cell, event) {
//       This.showTabs = true
//       This.vdcsId = row.vdcsId
//     }
//   }
</script>
