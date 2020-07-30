export let tableOption = (This) => {
  return {
    style: {
      width: '100%'
    },
    highlightCurrentRow: true,
    tableTitle: [
      {
        title: 'OrderManagement_PurchaseOrderNumber',
        prop: 'mwmsPoNo'
      },
      {
        title: 'OrderManagement_OrderType',
        prop: 'billType'
      },
      {
        title: 'OrderManagement_OrderStatus',
        prop: 'orderState',
        replaceFun: (row) => {
          return { '0': This.$t('common_open'), '1': This.$t('common_cancel'), '2': This.$t('OrderManagement_Receiving'), '3': This.$t('common_compl') }[row.orderState]
        }
      },
      {
        title: 'OrderManagement_PreparationDate',
        prop: 'orderDate',
        replaceFun: (row) => {
          return row.orderDate ? This.$dayjs(row.orderDate).format('YYYY-MM-DD HH:mm:ss') : ''
        }
      },
      {
        title: 'OrderManagement_Creator',
        prop: 'contacts',
        width: '150px'
      },
      {
        title: 'OrderManagement_SupplierCode',
        prop: 'vendorCode'
      },
      {
        title: 'common_SupplName',
        prop: 'vendorName'
      },
      {
        title: 'OrderManagement_Source',
        prop: 'orderBy'
      },
      {
        title: 'common_Operate',
        prop: 'operation',
        fixed: 'right',
        width: '120',
        operation: true,
        buttonArr: [
          {
            iconClass: 'el-icon-edit-outline',
            text: 'common_Edit',
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
            text: 'common_Del',
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
