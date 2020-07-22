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
        width: '150'
      },
      {
        title: '产品系列',
        prop: 'productSeriesName',
        width: '150'
      },
      {
        title: '产品料号',
        prop: 'productNumberName',
        width: '150'
      },
      {
        title: '线别名称',
        prop: 'lineCode',
        width: '150'
      },
      {
        title: '是否自动生产',
        prop: 'isAutoCreate',
        width: '150',
        replaceFun: (row) => {
          return row.isAutoCreate ? `是` : `否`
        }
      },
      {
        title: '频率',
        prop: 'frequency',
        width: '150'
      },
      {
        title: '检查时间',
        prop: 'checkTime',
        width: '180'
      },
      {
        title: '最后编辑时间',
        prop: 'lastEditedDt',
        width: '180'
      },
      {
        title: '最后编辑人',
        prop: 'lastEditorName',
        width: '150'
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
            text: '删除',
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
