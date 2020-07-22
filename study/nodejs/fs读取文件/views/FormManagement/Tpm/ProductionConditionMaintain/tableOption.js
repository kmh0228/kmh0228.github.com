export let tableOption = (This) => {
  return {
    style: {
      width: '100%'
    },
    highlightCurrentRow: true,
    tableTitle: [
      {
        title: '工厂',
        prop: 'factoryName',
        width: '150'
      },
      {
        title: '部门',
        prop: 'officeName',
        width: '120'
      },
      {
        title: '产品系列',
        prop: 'productSeriesName',
        width: '120'
      },
      {
        title: '产品料号',
        prop: 'productNumberName',
        width: '150'
      },
      {
        title: '线别名称',
        prop: 'lineName',
        width: '150'
      },
      {
        title: '设备代码',
        prop: 'eqpCode',
        width: '120'
      },
      {
        title: '设备名称',
        prop: 'eqpName',
        width: '150'
      },
      {
        title: '料管直径',
        prop: 'pipeDiameter',
        width: '120'
      },
      {
        title: '备注',
        prop: 'recordDesc',
        width: '200'
      },
      {
        title: '最后编辑时间',
        prop: 'lastEditedDt',
        width: '200'
      },
      {
        title: '最后编辑人',
        prop: 'lastEditorName',
        width: '200'
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
            text: '删除',
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
