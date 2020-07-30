export let tableOption = This => {
  return {
    style: {
      width: '100%'
    },
    highlightCurrentRow: true,
    tableTitle: [
      {
        title: 'common_code',
        prop: 'code'
      },
      {
        title: 'common_Name',
        prop: 'name'
      },
      {
        title: 'common_Description',
        prop: 'description'
      },
      {
        title: 'common_Status',
        prop: 'isInvalid',
        replaceFun: row => {
          return { '0': '不可用', '1': '可用' }[row.isInvalid]
        }
      },
      {
        title: 'common_type',
        prop: 'reasonType',
        replaceFun: row => {
          let json = { '0': '成本中心', '1': '退货原因', '2': '退料原因' }
          return json[row.reasonType]
        }
      },
      {
        title: 'busnessRea_MovinDire',
        prop: 'moveDirection',
        replaceFun: row => {
          return { '1': '入库', '2': '出库', '3': '移动' }[row.moveDirection]
        }
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
              This.deletetableData([row.mWmsTransactionReasonId])
            }
          }
        ]
      }
    ]
  }
}
