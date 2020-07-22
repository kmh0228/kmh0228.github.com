export let tableOption = (This) => {
  return {
    style: {
      width: '100%'
    },
    highlightCurrentRow: true,
    tableTitle: [
      {
        title: '编码',
        prop: 'uomCode'
      },
      {
        title: '名称',
        prop: 'uomName'
      },
      {
        title: '类型',
        prop: 'uomCategoryName'
      },
      {
        title: '精度',
        prop: 'standardPrecision'
      },
      {
        title: '创建时间',
        prop: 'createdDt',
        replaceFun: (row) => {
          return row.createdDt ? This.$dayjs(row.createdDt).format('YYYY-MM-DD HH:mm:ss') : ''
        }
      },
      {
        title: '创建人',
        prop: 'creatorName'
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
              This.deletetableData([row.mComUomId])
            }
          }
        ]
      }
    ]
  }
}
