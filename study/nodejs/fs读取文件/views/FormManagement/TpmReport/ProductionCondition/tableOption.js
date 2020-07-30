export let tableOption = This => {
  return {
    style: {
      width: '100%'
    },
    tableTitle: [
      {
        title: 'common_Factory',
        prop: 'shortName',
        width: '120px'
      },
      {
        title: 'common_Department',
        prop: 'officeName',
        width: '120px'
      },
      {
        title: 'common_ProduSeries',
        prop: 'productSeries',
        width: '120px'
      },
      {
        title: 'common_ProduPartNumb',
        prop: 'productNumber',
        width: '120px'
      },
      {
        title: 'common_EquipName',
        prop: 'eqpName',
        width: '120px'
      },
      {
        title: 'productCondit_RecorTime',
        prop: 'createdDt',
        width: '180px',
        replaceFun: row => {
          return row.createdDt
            ? This.$dayjs(row.createdDt).format('YYYY-MM-DD HH:mm:ss')
            : ''
        }
      },
      {
        title: 'common_opera',
        prop: 'lastEditor',
        width: '120px'
      },
      {
        title: 'productCondit_Confi',
        prop: 'confirmer',
        width: '120px'
      },
      {
        title: 'productCondit_ConfiTime',
        prop: 'confirmDt',
        width: '180px',
        replaceFun: row => {
          return row.confirmDt
            ? This.$dayjs(row.confirmDt).format('YYYY-MM-DD HH:mm:ss')
            : ''
        }
      },
      {
        title: 'productCondit_ConfiStat',
        prop: 'status',
        width: '120px',
        replaceFun: row => {
          let status = ''
          status = {
            0: '未提交',
            1: '已提交',
            2: '待确认',
            3: '已确认',
            4: '退回'
          }[row.status]
          return status
        }
      }
    ]
  }
}
