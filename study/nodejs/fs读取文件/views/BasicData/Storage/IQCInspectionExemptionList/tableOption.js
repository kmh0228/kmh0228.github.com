export let tableOption = (This) => {
  return {
    style: {
      width: '100%'
    },
    highlightCurrentRow: true,
    tableTitle: [
      {
        title: '物料编码',
        prop: 'materialNo'
      },
      {
        title: '物料名称',
        prop: 'materialName'
      },
      {
        title: '供应商编码',
        prop: 'mwmsVendorCode'
      },
      {
        title: '供应商名称',
        prop: 'mwmsVendorName'
      },
      {
        title: '操作',
        prop: 'operation',
        fixed: 'right',
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
              This.deletetableData([row.mwmsIqcExtId])
            }
          }
        ]
      }
    ]
  }
}
