export let tableOption = This => {
  return {
    style: {
      width: '100%'
    },
    highlightCurrentRow: true,
    selection: false,
    tableTitle: [
      {
        title: 'common_code',
        prop: 'code'
      },
      {
        title: 'common_Name',
        prop: 'name'
      },
      {
        title: 'common_Description',
        prop: 'description'
      },
      {
        title: 'common_Status',
        prop: 'isInvalid',
        replaceFun: row => {
          return { '0': '无效', '1': '有效' }[row.isInvalid]
        }
      },
      {
        title: 'documentType_TradiDire',
        prop: 'transactionDirection'
      },
      {
        title: 'common_CreateTime',
        prop: 'createdDt'
      },
      {
        title: 'common_ModifBy',
        prop: 'lastEditor'
      }
    ],
    cellClick (row, column, cell, event) {
      This.showTabs = true
      This.mWmsBillCategoryId = row.mWmsBillCategoryId
    }
  }
}
