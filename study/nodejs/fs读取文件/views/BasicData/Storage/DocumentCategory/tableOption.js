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
        title: '分类',
        prop: 'functionType'
      },
      {
        title: '是否上传',
        prop: 'isUpload',
        replaceFun: (row) => {
          return { '0': '否', '1': '是' }[row.isUpload]
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
                ...row,
                isUpload: row.isUpload === '1'
              }
              This.addVisible = true
            }
          },
          {
            iconClass: 'el-icon-delete',
            iconColor: '#f56c6c',
            text: '删除',
            operationClick (row) {
              This.deletetableData([row.mWmsBillSubcategoryId])
            }
          }
        ]
      }
    ]
  }
}
