export let tableOption = (This) => {
  return {
    style: {
      width: '100%'
    },
    tableTitle: [
      {
        title: '工厂',
        prop: 'factoryName',
        width: '120'
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
        prop: 'productNumber',
        width: '120'
      },
      {
        title: '线别名称',
        prop: 'lineName',
        width: '120'
      },
      {
        title: '设备名称',
        prop: 'eqpName',
        width: '120'
      },
      {
        title: '作业时间',
        prop: 'createdDt',
        width: '160'
      },
      {
        title: '产量',
        prop: 'output',
        width: '120'
      },
      {
        title: '不良数',
        prop: 'defectiveNum',
        width: '120'
      },
      {
        title: '不良率',
        prop: 'defectiveRate',
        width: '120',
        replaceFun: (row) => {
          return row.defectiveRate ? parseInt(parseFloat(row.defectiveRate) * 1000) / 100 + '%' : ' '
        }
      },
      {
        title: '作业人',
        prop: 'creatorName',
        width: '120'
      }
    ],
    cellClick (row, column, cell, event) {

    }
  }
}
