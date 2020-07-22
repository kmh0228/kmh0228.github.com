export let tableOption = (This) => {
  return {
    style: {
      width: '100%'
    },
    highlightCurrentRow: true,
    selection: false,
    tableTitle: [
      {
        title: '编码',
        prop: 'code'
      },
      {
        title: '名称',
        prop: 'name'
      },
      {
        title: '描述',
        prop: 'description'
      },
      {
        title: '状态',
        prop: 'isInvalid',
        replaceFun: (row) => {
          return { '0': '无效', '1': '有效' }[row.isInvalid]
        }
      },
      {
        title: '交易方向',
        prop: 'transactionDirection'
      },
      {
        title: '创建时间',
        prop: 'createdDt'
      },
      {
        title: '修改人',
        prop: 'lastEditor'
      }
    ],
    cellClick (row, column, cell, event) {
      This.showTabs = true
      This.mWmsBillCategoryId = row.mWmsBillCategoryId
    }
  }
}
