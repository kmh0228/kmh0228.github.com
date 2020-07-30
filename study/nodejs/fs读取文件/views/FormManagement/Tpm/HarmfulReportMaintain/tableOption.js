export let tableOption = This => {
  return {
    style: {
      width: '100%'
    },
    highlightCurrentRow: true,
    tableTitle: [
      {
        title: 'common_Factory',
        prop: 'factoryName'
      },
      {
        title: 'common_Department',
        prop: 'officeName'
      },
      {
        title: 'common_ProduSeries',
        prop: 'productSeriesName'
      },
      {
        title: 'common_ProduPartNumb',
        prop: 'productNumberName'
      },
      {
        title: 'harmfulR_UnitQuan',
        prop: 'uomName'
      },
      {
        title: 'common_EquipName',
        prop: 'eqpName'
      },
      {
        title: 'common_Description',
        prop: 'defectiveItemDesc'
      },
      {
        title: 'common_CreateTime',
        prop: 'createdDt'
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
                mmomEqpDefectiveItemId: row.mmomEqpDefectiveItemId,
                officeCode: row.fullOffice ? row.fullOffice.split(',') : [],
                fullOffice: row.fullOffice,
                productSeries: row.productSeries,
                productSeriesName: row.productSeriesName,
                productNumberName: row.productNumberName,
                productNumber: row.productNumber,
                uomName: row.uomName,
                eqpCode: row.eqpCode,
                eqpName: row.eqpName,
                defectiveItemDesc: row.defectiveItemDesc
              }
              This.addVisible = true
            }
          },
          {
            iconClass: 'el-icon-delete',
            iconColor: '#f56c6c',
            text: 'common_Del',
            operationClick (row) {
              This.deletetableData([row.mmomEqpDefectiveItemId])
            }
          }
        ]
      }
    ],
    cellClick (row, column, cell, event) {
      This.showTabs = true
      // 查询明细
      This.mmomEqpDefectiveItemId = row.mmomEqpDefectiveItemId
    }
  }
}
