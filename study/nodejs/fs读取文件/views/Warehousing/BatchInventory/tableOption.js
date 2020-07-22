export let tableOption = (This) => {
  return {
    style: {
      width: '100%'
    },
    highlightCurrentRow: true,
    selection: false,
    tableTitle: [
      {
        title: '物料编码',
        prop: 'materialCode'
      },
      {
        title: '物料名称',
        prop: 'materialName'
      },
      {
        title: '仓库编码',
        prop: 'warehouseCode'
      },
      {
        title: '库位编码',
        prop: 'areaCode'
      },
      {
        title: '物料批次号',
        prop: 'stockLotCode'
      },
      {
        title: '现有量',
        prop: 'onhandQty'
      },
      {
        title: '可用量',
        prop: 'availableQty'
      },
      {
        title: '占用量',
        prop: 'assignQty'
      },
      {
        title: '冻结量',
        prop: 'holdQty'
      }
    ],
    cellClick (row) {
      This.stockLotId = row.stockLotId
      This.showTabs = true
    }
  }
}
