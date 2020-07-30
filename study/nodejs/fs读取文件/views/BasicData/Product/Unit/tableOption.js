export let tableOption = This => {
  return {
    style: {
      width: '100%'
    },
    highlightCurrentRow: true,
    tableTitle: [
      {
        title: 'common_code',
        prop: 'uomCode'
      },
      {
        title: 'common_Name',
        prop: 'uomName'
      },
      {
        title: 'common_type',
        prop: 'uomCategoryName'
      },
      {
        title: 'unit_accur',
        prop: 'standardPrecision'
      },
      {
        title: 'common_CreateTime',
        prop: 'createdDt',
        replaceFun: row => {
          return row.createdDt
            ? This.$dayjs(row.createdDt).format('YYYY-MM-DD HH:mm:ss')
            : ''
        }
      },
      {
        title: 'common_Creator',
        prop: 'creatorName'
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
              This.deletetableData([row.mComUomId])
            }
          }
        ]
      }
    ]
  }
}
