export let tableOption = (This) => {
  return {
    style: {
      width: '100%'
    },
    highlightCurrentRow: true,
    tableTitle: [
      {
        title: '采购订单号',
        prop: 'mwmsPoNo'
      },
      // {
      //   title: '上一级条码',
      //   prop: 'name'
      // },
      {
        title: '订单类型',
        prop: 'billType'
      },
      {
        title: '订单状态',
        prop: 'orderState',
        replaceFun: (row) => {
          return { '0': '开立', '1': '取消', '2': '收货中', '3': '完成' }[row.orderState]
        }
      },
      {
        title: '制单日期',
        prop: 'orderDate',
        replaceFun: (row) => {
          return row.orderDate ? This.$dayjs(row.orderDate).format('YYYY-MM-DD HH:mm:ss') : ''
        }
      },
      {
        title: '制单人',
        prop: 'contacts',
        width: '150px'
      },
      {
        title: '供应商编码',
        prop: 'vendorCode'
      },
      {
        title: '供应商名称',
        prop: 'vendorName'
      },
      {
        title: '来源',
        prop: 'orderBy'
      },
      {
        title: '操作',
        prop: 'operation',
        fixed: 'right',
        width: '120',
        operation: true,
        buttonArr: [
          {
            iconClass: 'el-icon-edit-outline',
            text: '编辑',
            operationClick (row) {
              This.addForm = {
                ...row
              }
              This.addVisible = true
            }
          },
          {
            iconClass: 'el-icon-delete',
            iconColor: '#f56c6c',
            text: '删除',
            operationClick (row) {
              This.deletetableData([row.mwmsPoId])
            }
          }
        ]
      }
    ],
    cellClick (row) {
      This.mwmsPoId = row.mwmsPoId
      This.showTabs = true
    }
  }
}
