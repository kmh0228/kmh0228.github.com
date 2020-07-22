export let tableOption = (This) => {
  return {
    style: {
      width: '100%'
    },
    tableTitle: [
      {
        title: '工厂',
        prop: 'factoryName',
        width: '120px'
      },
      {
        title: '部门',
        prop: 'officeName',
        width: '120px'
      },
      {
        title: '产品系列',
        prop: 'productSeriesName',
        width: '120px'
      },
      {
        title: '产品料号',
        prop: 'productNumberName',
        width: '120px'
      },
      {
        title: '线别名称',
        prop: 'lineName',
        width: '120px'
      },
      {
        title: '设备名称',
        prop: 'eqpName',
        width: '120px'
      },
      {
        title: '检查排配时间',
        prop: 'recordTime',
        width: '180px'
      },
      {
        title: '检查人',
        prop: 'lastEditor',
        width: '120px'
      },
      {
        title: '检查完成时间',
        prop: 'confirmDt',
        width: '180px'
      },
      {
        title: '确认人',
        prop: 'confirmer',
        width: '120px'
      },
      {
        title: '状态',
        prop: 'status',
        replaceFun: (row) => {
          let status = ''
          status = { '0': '未提交', '1': '已提交', '2': '待确认', '3': '已确认', '4': '退回' }[row.status]
          return status
        }
      }
    ]
  }
}
