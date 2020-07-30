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
        title: 'common_ProduSeries',
        prop: 'productSeriesName',
        width: '120px'
      },
      {
        title: 'common_ProduPartNumb',
        prop: 'productNumberName',
        width: '120px'
      },
      {
        title: 'common_LineName',
        prop: 'lineName',
        width: '120px'
      },
      {
        title: 'common_EquipName',
        prop: 'eqpName',
        width: '120px'
      },
      {
        title: 'prodectMaint_CheckScheTime',
        prop: 'recordTime',
        width: '180px'
      },
      {
        title: 'prodectMaint_Inspe',
        prop: 'lastEditor',
        width: '120px'
      },
      {
        title: 'prodectMaint_InspeCompTime',
        prop: 'confirmDt',
        width: '180px'
      },
      {
        title: 'prodectMaint_Confi',
        prop: 'confirmer',
        width: '120px'
      },
      {
        title: 'common_Status',
        prop: 'status',
        replaceFun: row => {
          let status = ''
          status = {
            '0': '未提交',
            '1': '已提交',
            '2': '待确认',
            '3': '已确认',
            '4': '退回'
          }[row.status]
          return status
        }
      }
    ]
  }
}
