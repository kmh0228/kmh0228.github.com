export let tableOption = (This) => {
  return {
    style: {
      width: '100%'
    },
    highlightCurrentRow: true,
    tableTitle: [
      {
        title: 'IQCInspection_IQCInspectionOrderNo',
        prop: 'iqcNo',
        width: '180px'
      },
      {
        title: 'common_StockInNo',
        prop: 'entrylistNo',
        width: '180px'
      },
      {
        title: 'IQCInspection_StockInLine',
        prop: 'entrylistDetailItem',
        width: '150px'
      },
      {
        title: 'common_PorN',
        prop: 'materialNo',
        width: '150px'
      },
      {
        title: 'common_SupplCode',
        prop: 'vendorCode',
        width: '150px'
      },
      {
        title: 'IQCInspection_PurchaseOrder',
        prop: 'poNo',
        width: '150px'
      },
      {
        title: 'IQCInspection_IncomingBatch',
        prop: 'lotCode',
        width: '150px'
      },
      {
        title: 'common_ProduBatc',
        prop: 'produceLotCode',
        width: '150px'
      },
      {
        title: 'common_dateManu',
        prop: 'produceDate',
        width: '180px'
      },
      {
        title: 'IQCInspection_ReceivingDate',
        prop: 'receiveDate',
        width: '180px'
      },
      {
        title: 'IQCInspection_InspectionQuantity',
        prop: 'checkQty',
        width: '150px'
      },
      {
        title: 'IQCInspection_InspectionStatus',
        prop: 'checkStatus',
        width: '180px',
        replaceFun: (row) => {
          return {
            '0': This.$t('IQCInspection_NotInspected'),
            '1': This.$t('IQCInspection_Inspected')
          }[row.checkStatus]
        }
      },
      {
        title: 'common_TestResu',
        prop: 'checkResult',
        width: '150px',
        replaceFun: (row) => {
          return {
            '1': This.$t('common_quali'),
            '2': This.$t('IQCInspection_Unqualified')
          }[row.checkResult]
        }
      },
      {
        title: 'IQCInspection_QualifiedQuantity',
        prop: 'acceptQty',
        width: '150px'
      },
      {
        title: 'IQCInspection_UnqualifiedQuantity',
        prop: 'rejectQty',
        width: '150px'
      },
      {
        title: 'IQCInspection_ProcessingResult',
        prop: 'handleResult',
        width: '150px',
        replaceFun: (row) => {
          return {
            '0': This.$t('common_SpeciColl'),
            '1': This.$t('common_choos'),
            '2': This.$t('IQCInspection_Scrap'),
            '3': This.$t('IQCInspection_Return')
          }[row.handleResult]
        }
      }
    ]
  }
}
