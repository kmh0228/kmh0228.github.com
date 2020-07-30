export let tableOption = This => {
  return {
    style: {
      width: '100%'
    },
    tableTitle: [
      {
        title: 'common_Factory',
        prop: 'factoryName',
        width: '120'
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
        prop: 'productNumber',
        width: '120'
      },
      {
        title: 'common_LineName',
        prop: 'lineName',
        width: '120'
      },
      {
        title: 'common_EquipName',
        prop: 'eqpName',
        width: '120'
      },
      {
        title: 'producHarm_OperaTime',
        prop: 'createdDt',
        width: '160'
      },
      {
        title: 'producHarm_yield',
        prop: 'output',
        width: '120'
      },
      {
        title: 'common_NumbeDefe',
        prop: 'defectiveNum',
        width: '120'
      },
      {
        title: 'producHarm_DefecRate',
        prop: 'defectiveRate',
        width: '120',
        replaceFun: row => {
          return row.defectiveRate
            ? parseInt(parseFloat(row.defectiveRate) * 1000) / 100 + '%'
            : ' '
        }
      },
      {
        title: 'common_opera',
        prop: 'creatorName',
        width: '120'
      }
    ],
    cellClick (row, column, cell, event) {}
  }
}
