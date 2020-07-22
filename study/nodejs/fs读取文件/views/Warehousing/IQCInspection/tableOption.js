export let tableOption = (This) => {
  return {
    style: {
      width: '100%'
    },
    highlightCurrentRow: true,
    tableTitle: [
      {
        title: 'IQC检验单号',
        prop: 'iqcNo',
        width: '180px'
      },
      {
        title: '入库单号',
        prop: 'entrylistNo',
        width: '180px'
      },
      {
        title: '入库单行',
        prop: 'entrylistDetailItem',
        width: '150px'
      },
      {
        title: '料号',
        prop: 'materialNo',
        width: '150px'
      },
      {
        title: '供应商代码',
        prop: 'vendorCode',
        width: '150px'
      },
      {
        title: '采购订单',
        prop: 'poNo',
        width: '150px'
      },
      {
        title: '来料批次',
        prop: 'lotCode',
        width: '150px'
      },
      {
        title: '生产批次',
        prop: 'produceLotCode',
        width: '150px'
      },
      {
        title: '生产日期',
        prop: 'produceDate',
        width: '180px'
      },
      {
        title: '收货日期',
        prop: 'receiveDate',
        width: '180px'
      },
      {
        title: '检验数量',
        prop: 'checkQty',
        width: '150px'
      },
      {
        title: '检验状态',
        prop: 'checkStatus',
        width: '180px',
        replaceFun: (row) => {
          return {
            '0': '未检验',
            '1': '已检验'
          }[row.checkStatus]
        }
      },
      {
        title: '检验结果',
        prop: 'checkResult',
        width: '150px',
        replaceFun: (row) => {
          return {
            '1': '合格',
            '2': '不合格'
          }[row.checkResult]
        }
      },
      {
        title: '合格数量',
        prop: 'acceptQty',
        width: '150px'
      },
      {
        title: '不合格数',
        prop: 'rejectQty',
        width: '150px'
      },
      {
        title: '处理结果',
        prop: 'handleResult',
        width: '150px',
        replaceFun: (row) => {
          return {
            '0': '特采',
            '1': '挑选',
            '2': '报废',
            '3': '退货'
          }[row.handleResult]
        }
      }
    ]
  }
}
