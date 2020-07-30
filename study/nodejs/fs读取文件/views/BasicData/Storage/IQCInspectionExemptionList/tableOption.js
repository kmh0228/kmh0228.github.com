export let tableOption = This => {
  return {
    style: {
      width: '100%'
    },
    highlightCurrentRow: true,
    tableTitle: [
      {
        title: 'IQCInspecExp_MaterCodeCannBe',
        prop: 'materialNo'
      },
      {
        title: 'common_MaterialName',
        prop: 'materialName'
      },
      {
        title: 'IQCInspecExp_SupplCode',
        prop: 'mwmsVendorCode'
      },
      {
        title: 'common_SupplName',
        prop: 'mwmsVendorName'
      },
      {
        title: 'common_Operate',
        prop: 'operation',
        fixed: 'right',
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
              This.deletetableData([row.mwmsIqcExtId])
            }
          }
        ]
      }
    ]
  }
}
