export let tableOption = (This) => {
  return {
    style: {
      width: '100%'
    },
    highlightCurrentRow: true,
    selection: false,
    tableTitle: [
      {
        title: 'common_MaterCode',
        prop: 'materialCode'
      },
      {
        title: 'common_MaterialName',
        prop: 'materialName'
      },
      {
        title: 'BatchInventory_WarehouseCode',
        prop: 'warehouseCode'
      },
      {
        title: 'BatchInventory_LocationCode',
        prop: 'areaCode'
      },
      {
        title: 'BatchInventory_MaterialLotNo',
        prop: 'stockLotCode'
      },
      {
        title: 'BatchInventory_OnHand',
        prop: 'onhandQty'
      },
      {
        title: 'BatchInventory_AvailableQuantity',
        prop: 'availableQty'
      },
      {
        title: 'BatchInventory_OccupiedQuantity',
        prop: 'assignQty'
      },
      {
        title: 'BatchInventory_FrozenQuantity',
        prop: 'holdQty'
      }
    ],
    cellClick (row) {
      This.stockLotId = row.stockLotId
      This.showTabs = true
    }
  }
}
