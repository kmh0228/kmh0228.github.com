export let tableOption = (This) => {
  return {
    style: {
      width: '100%'
    },
    tableTitle: [
      {
        title: '工厂',
        prop: 'shortName',
        width: '120px'
      },
      {
        title: '部门',
        prop: 'officeName',
        width: '120px'
      },
      {
        title: '产品系列',
        prop: 'productSeries',
        width: '120px'
      },
      {
        title: '产品料号',
        prop: 'productNumber',
        width: '120px'
      },
      {
        title: '设备名称',
        prop: 'eqpName',
        width: '120px'
      },
      {
        title: '记录时间',
        prop: 'createdDt',
        width: '180px',
        replaceFun: (row) => {
          return row.createdDt ? This.$dayjs(row.createdDt).format('YYYY-MM-DD HH:mm:ss') : ''
        }
      },
      {
        title: '作业人',
        prop: 'lastEditor',
        width: '120px'
      },
      {
        title: '确认人',
        prop: 'confirmer',
        width: '120px'
      },
      {
        title: '确认时间',
        prop: 'confirmDt',
        width: '180px',
        replaceFun: (row) => {
          return row.confirmDt ? This.$dayjs(row.confirmDt).format('YYYY-MM-DD HH:mm:ss') : ''
        }
      },
      {
        title: '确认状态',
        prop: 'status',
        width: '120px',
        replaceFun: (row) => {
          let status = ''
          status = { 0: '未提交', 1: '已提交', 2: '待确认', 3: '已确认', 4: '退回' }[row.status]
          return status
        }
      }
    ]
  }
}
