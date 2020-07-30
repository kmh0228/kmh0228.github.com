export let tableOption = This => {
  return {
    style: {
      width: '100%'
    },
    highlightCurrentRow: true,
    tableTitle: [
      {
        title: 'common_Factory',
        prop: 'factoryName',
        width: '150'
      },
      {
        title: 'common_Department',
        prop: 'officeName',
        width: '150'
      },
      {
        title: 'common_ProduSeries',
        prop: 'productSeriesName',
        width: '150'
      },
      {
        title: 'common_ProduPartNumb',
        prop: 'productNumberName',
        width: '150'
      },
      {
        title: 'common_LineName',
        prop: 'lineCode',
        width: '150'
      },
      {
        title: 'productCheckM_AutomProd',
        prop: 'isAutoCreate',
        width: '150',
        replaceFun: row => {
          return row.isAutoCreate ? `是` : `否`
        }
      },
      {
        title: 'productCheckM_frequ',
        prop: 'frequency',
        width: '150'
      },
      {
        title: 'productCheckM_InspeTime',
        prop: 'checkTime',
        width: '180'
      },
      {
        title: 'common_Lastedittime',
        prop: 'lastEditedDt',
        width: '180'
      },
      {
        title: 'common_Lasteditor',
        prop: 'lastEditorName',
        width: '150'
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
                autonomyCheckId: row.autonomyCheckId,
                officeCode: row.fullOffice ? row.fullOffice.split(',') : [],
                fullOffice: row.fullOffice,
                productSeries: row.productSeries,
                productSeriesName: row.productSeriesName,
                productNumberName: row.productNumberName,
                productNumber: row.productNumber,
                lineId: row.lineId,
                lineName: row.lineCode,
                isAutoCreate: row.isAutoCreate,
                frequency: row.frequency,
                checkTime: row.checkTime,
                ecnNo: row.ecnNo,
                revNo: row.revNo,
                remark: row.remark
              }
              This.addVisible = true
            }
          },
          {
            iconClass: 'el-icon-delete',
            iconColor: '#f56c6c',
            text: 'common_Del',
            operationClick (row) {
              This.deletetableData([row.autonomyCheckId])
            }
          }
        ]
      }
    ],
    cellClick (row, column, cell, event) {
      This.showTabs = true
      // 查询明细
      This.autonomyCheckId = row.autonomyCheckId
    }
  }
}
