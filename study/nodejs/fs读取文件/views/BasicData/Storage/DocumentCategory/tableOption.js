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
        title: 'docuCateGory_class',
        prop: 'functionType'
      },
      {
        title: 'docuCateGory_Uploa',
        prop: 'isUpload',
        replaceFun: row => {
          return { '0': '否', '1': '是' }[row.isUpload]
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
                ...row,
                isUpload: row.isUpload === '1'
              }
              This.addVisible = true
            }
          },
          {
            iconClass: 'el-icon-delete',
            iconColor: '#f56c6c',
            text: 'common_Del',
            operationClick (row) {
              This.deletetableData([row.mWmsBillSubcategoryId])
            }
          }
        ]
      }
    ]
  }
}
