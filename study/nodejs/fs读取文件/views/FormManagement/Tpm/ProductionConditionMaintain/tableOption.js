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
        width: '120'
      },
      {
        title: 'common_ProduSeries',
        prop: 'productSeriesName',
        width: '120'
      },
      {
        title: 'common_ProduPartNumb',
        prop: 'productNumberName',
        width: '150'
      },
      {
        title: 'common_LineName',
        prop: 'lineName',
        width: '150'
      },
      {
        title: 'common_EquipCode',
        prop: 'eqpCode',
        width: '120'
      },
      {
        title: 'common_EquipName',
        prop: 'eqpName',
        width: '150'
      },
      {
        title: 'productCondM_TubeDiam',
        prop: 'pipeDiameter',
        width: '120'
      },
      {
        title: 'common_remarks',
        prop: 'recordDesc',
        width: '200'
      },
      {
        title: 'common_Lastedittime',
        prop: 'lastEditedDt',
        width: '200'
      },
      {
        title: 'common_Lasteditor',
        prop: 'lastEditorName',
        width: '200'
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
                mmomEqpConditionrecordId: row.mmomEqpConditionrecordId,
                officeCode: row.fullOffice ? row.fullOffice.split(',') : [],
                fullOffice: row.fullOffice,
                productSeries: row.productSeries,
                productSeriesName: row.productSeriesName,
                productNumberName: row.productNumberName,
                productNumber: row.productNumber,
                eqpCode: row.eqpCode,
                eqpName: row.eqpName,
                lineName: row.lineName,
                cavQty: row.cavQty,
                colour: row.colour,
                ecnNo: row.ecnNo,
                fileNo: row.fileNo,
                pipeDiameter: row.pipeDiameter,
                rawPartno: row.rawPartno,
                rawPartname: row.rawPartname,
                recordDesc: row.recordDesc,
                revNo: row.revNo,
                smapType: row.smapType,
                swrNo: row.swrNo
              }
              This.addVisible = true
            }
          },
          {
            iconClass: 'el-icon-delete',
            iconColor: '#f56c6c',
            text: 'common_Del',
            operationClick (row) {
              This.deletetableData([row.mmomEqpConditionrecordId])
            }
          }
        ]
      }
    ],
    cellClick (row, column, cell, event) {
      This.showTabs = true
      This.mmomEqpConditionrecordId = row.mmomEqpConditionrecordId
    }
  }
}
