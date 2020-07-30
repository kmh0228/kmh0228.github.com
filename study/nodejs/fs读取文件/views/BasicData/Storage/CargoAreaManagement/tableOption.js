export let tableOption = This => {
  return {
    style: {
      width: '100%'
    },
    highlightCurrentRow: true,
    tableTitle: [
      {
        title: 'common_AreaCode',
        prop: 'mWmsWarehouseAreaCode'
      },
      {
        title: 'warehouse_AreaName',
        prop: 'mWmsWarehouseAreaName'
      },
      {
        title: 'cargoAreaMana_Funct',
        prop: 'fName'
      },
      {
        title: 'cargoAreaMana_StoraEnvi',
        prop: 'cName'
      },
      {
        title: 'cargoAreaMana_StoraValuType',
        prop: 'vName'
      },
      {
        title: 'common_UsageStorSpac',
        prop: 'mWmsWarehouseAreaUse'
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
              This.areaForm = {
                ...row
              }
              This.dialogVisible = true
            }
          },
          {
            iconClass: 'el-icon-delete',
            iconColor: '#f56c6c',
            text: 'common_Del',
            operationClick (row) {
              This.deleteArea([row.mWmsWarehouseAreaId])
            }
          }
        ]
      }
    ]
  }
}
