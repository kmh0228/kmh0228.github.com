export let tableOption = (This) => {
  return {
    style: {
      width: '100%'
    },
    highlightCurrentRow: true,
    tableTitle: [
      {
        title: 'LabelManagement_barcode',
        prop: 'mWmsPkgidPkgid',
        width: '150px'
      },
      // {
      //   title: '上一级条码',
      //   prop: 'name'
      // },
      {
        title: 'common_Status',
        prop: 'mWmsPkgidStatus',
        width: '100px',
        replaceFun: (row) => {
          return {
            '1': This.$t('LabelManagement_found'),
            '2': This.$t('LabelManagement_takeDelivery'),
            '3': This.$t('LabelManagement_OnTheShelf'),
            '4': This.$t('LabelManagement_picking'),
            '5': This.$t('LabelManagement_WarehouseOut')
          }[row.mWmsPkgidStatus]
        }
      },
      {
        title: 'LabelManagement_MaterialBatchNumber',
        prop: 'mWmsPkgidMaterialLot',
        width: '150px'
      },
      {
        title: 'LabelManagement_MaterialCode',
        prop: 'materialCode',
        width: '150px'
      },
      {
        title: 'common_MaterialName',
        prop: 'materialName',
        width: '150px'
      },
      {
        title: 'LabelManagement_ParentBarcode',
        prop: 'parentpkgCode',
        width: '150px'
      },
      {
        title: 'LabelManagement_Num',
        prop: 'mWmsPkgidQty',
        width: '100px'
      },
      {
        title: 'LabelManagement_MainUnit',
        prop: 'uomCode',
        width: '150px'
      },
      {
        title: 'LabelManagement_dateOfManufacture',
        prop: 'produceDate',
        width: '180px'
      },
      {
        title: 'LabelManagement_ExpirationDate',
        prop: 'invalidDate',
        width: '180px'
      },
      {
        title: 'LabelManagement_ProductionBatch',
        prop: 'mWmsPkgidLot',
        width: '150px'
      },
      {
        title: 'LabelManagement_DateOfReceipt',
        prop: 'receiveTime',
        width: '180px'
      },
      {
        title: 'LabelManagement_StockInNo',
        prop: 'mWmsPkgidSourceno',
        width: '180px'
      },
      {
        title: 'LabelManagement_DetailLineNumber',
        prop: 'mWmsPkgidSourceitem',
        width: '150px'
      },
      {
        title: 'LabelManagement_IsItScrapped',
        prop: 'isScrapped',
        width: '150px',
        replaceFun: (row) => {
          return row.isScrapped ? This.$t('common_Yes') : This.$t('common_No')
        }
      },
      {
        title: 'LabelManagement_PrintingTimes',
        prop: 'mWmsPkgidPrintTimes',
        width: '150px'
      }
    ],
    cellClick (row) {
      This.mWmsPkgidId = row.mWmsPkgidId
      This.showTabs = true
    }
  }
}
