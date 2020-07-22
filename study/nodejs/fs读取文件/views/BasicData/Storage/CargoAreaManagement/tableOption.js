export let tableOption = (This) => {
  return {
    style: {
      width: '100%'
    },
    highlightCurrentRow: true,
    tableTitle: [
      {
        title: '区域代码',
        prop: 'mWmsWarehouseAreaCode'
      },
      {
        title: '区域名称',
        prop: 'mWmsWarehouseAreaName'
      },
      {
        title: '功能作用',
        prop: 'fName'
      },
      {
        title: '存储环境',
        prop: 'cName'
      },
      {
        title: '存储贵重类型',
        prop: 'vName'
      },
      {
        title: '储位使用情况',
        prop: 'mWmsWarehouseAreaUse'
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
              This.areaForm = {
                ...row
              }
              This.dialogVisible = true
            }
          },
          {
            iconClass: 'el-icon-delete',
            iconColor: '#f56c6c',
            text: '删除',
            operationClick (row) {
              This.deleteArea([row.mWmsWarehouseAreaId])
            }
          }
        ]
      }
    ]
  }
}
