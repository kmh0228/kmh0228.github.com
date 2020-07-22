export let tableOption = (This) => {
  return {
    style: {
      width: '100%'
    },
    highlightCurrentRow: true,
    tableTitle: [
      {
        title: '编码',
        prop: 'code'
      },
      {
        title: '名称',
        prop: 'name'
      },
      {
        title: '描述',
        prop: 'description'
      },
      {
        title: '状态',
        prop: 'isInvalid',
        replaceFun: (row) => {
          return { '0': '不可用', '1': '可用' }[row.isInvalid]
        }
      },
      {
        title: '类型',
        prop: 'reasonType',
        replaceFun: (row) => {
          return { '0': '成本中心', '1': '退货原因', '2': '退料原因' }[row.reasonType]
        }
      },
      {
        title: '移动方向',
        prop: 'moveDirection',
        replaceFun: (row) => {
          return { '1': '入库', '2': '出库', '3': '移动' }[row.moveDirection]
        }
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
              This.deletetableData([row.mWmsTransactionReasonId])
            }
          }
        ]
      }
    ]
  }
}
