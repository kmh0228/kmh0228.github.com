export let tableOption = This => {
  return {
    style: {
      width: '100%'
    },
    tableTitle: [
      {
        title: 'common_Factory',
        prop: 'factoryName',
        width: '120px'
      },
      {
        title: 'common_Department',
        prop: 'officeName',
        width: '120px'
      },
      {
        title: 'prductMaint_SpotChecNo',
        prop: 'docNo',
        width: '120px'
      },
      {
        title: 'common_LineName',
        prop: 'lineName',
        width: '120px'
      },
      {
        title: 'common_EquipCode',
        prop: 'resourceCode',
        width: '120px'
      },
      {
        title: 'common_EquipName',
        prop: 'resourceName',
        width: '120px'
      },
      {
        title: 'prductMaint_month',
        prop: 'month',
        width: '120px'
      },
      {
        title: 'prductMaint_cycle',
        prop: 'frequency',
        width: '120px',
        replaceFun: row => {
          let frequency = ''
          frequency = { 1: '日', 2: '周', 3: '月' }[row.frequency]
          return frequency
        }
      },
      {
        title: 'prductMaint_OperaDate',
        prop: 'endTime',
        width: '180px',
        replaceFun: row => {
          return row.createdDt
            ? This.$dayjs(row.createdDt).format('YYYY-MM-DD HH:mm:ss')
            : ''
        }
      },
      {
        title: 'common_opera',
        prop: 'operator',
        width: '120px'
      },
      {
        title: 'prductMaint_Confi',
        prop: 'confirmer',
        width: '120px'
      }
    ]
  }
}
