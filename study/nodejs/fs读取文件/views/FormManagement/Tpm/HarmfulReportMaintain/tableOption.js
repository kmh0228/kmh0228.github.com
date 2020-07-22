export let tableOption = (This) => {
  return {
    style: {
      width: '100%'
    },
    highlightCurrentRow: true,
    tableTitle: [
      {
        title: '工厂',
        prop: 'factoryName'
      },
      {
        title: '部门',
        prop: 'officeName'
      },
      {
        title: '产品系列',
        prop: 'productSeriesName'
      },
      {
        title: '产品料号',
        prop: 'productNumberName'
      },
      {
        title: '数量单位',
        prop: 'uomName'
      },
      {
        title: '设备名称',
        prop: 'eqpName'
      },
      {
        title: '描述',
        prop: 'defectiveItemDesc'
      },
      {
        title: '创建时间',
        prop: 'createdDt'
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
            text: '删除',
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
