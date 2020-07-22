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
        title: '点检单号',
        prop: 'docNo',
        width: '120px'
      },
      {
        title: '线别名称',
        prop: 'lineName',
        width: '120px'
      },
      {
        title: '设备代码',
        prop: 'resourceCode',
        width: '120px'
      },
      {
        title: '设备名称',
        prop: 'resourceName',
        width: '120px'
      },
      {
        title: '月份',
        prop: 'month',
        width: '120px'
      },
      {
        title: '周期',
        prop: 'frequency',
        width: '120px',
        replaceFun: (row) => {
          let frequency = ''
          frequency = { 1: '日', 2: '周', 3: '月' }[row.frequency]
          return frequency
        }
      },
      {
        title: '作业日期',
        prop: 'endTime',
        width: '180px',
        replaceFun: (row) => {
          return row.createdDt ? This.$dayjs(row.createdDt).format('YYYY-MM-DD HH:mm:ss') : ''
        }
      },
      {
        title: '作业人',
        prop: 'operator',
        width: '120px'
      },
      {
        title: '确认人',
        prop: 'confirmer',
        width: '120px'
      }
    ]
  }
}
