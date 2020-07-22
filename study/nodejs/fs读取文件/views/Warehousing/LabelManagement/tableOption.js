export let tableOption = (This) => {
  return {
    style: {
      width: '100%'
    },
    highlightCurrentRow: true,
    tableTitle: [
      {
        title: '条码号',
        prop: 'mWmsPkgidPkgid',
        width: '150px'
      },
      // {
      //   title: '上一级条码',
      //   prop: 'name'
      // },
      {
        title: '状态',
        prop: 'mWmsPkgidStatus',
        width: '100px',
        replaceFun: (row) => {
          return {
            '1': '创建',
            '2': '收货',
            '3': '上架',
            '4': '拣货',
            '5': '出库'
          }[row.mWmsPkgidStatus]
        }
      },
      {
        title: '物料批次号',
        prop: 'mWmsPkgidMaterialLot',
        width: '150px'
      },
      {
        title: '物料编码',
        prop: 'materialCode',
        width: '150px'
      },
      {
        title: '物料名称',
        prop: 'materialName',
        width: '150px'
      },
      {
        title: '父条码',
        prop: 'parentpkgCode',
        width: '150px'
      },
      {
        title: '数量',
        prop: 'mWmsPkgidQty',
        width: '100px'
      },
      {
        title: '主单位',
        prop: 'uomCode',
        width: '150px'
      },
      {
        title: '生产日期',
        prop: 'produceDate',
        width: '180px'
      },
      {
        title: '失效日期',
        prop: 'invalidDate',
        width: '180px'
      },
      {
        title: '生产批次',
        prop: 'mWmsPkgidLot',
        width: '150px'
      },
      {
        title: '收货日期',
        prop: 'receiveTime',
        width: '180px'
      },
      {
        title: '入库单号',
        prop: 'mWmsPkgidSourceno',
        width: '180px'
      },
      {
        title: '明细行号',
        prop: 'mWmsPkgidSourceitem',
        width: '150px'
      },
      {
        title: '是否报废',
        prop: 'isScrapped',
        width: '150px',
        replaceFun: (row) => {
          return row.isScrapped ? '是' : '否'
        }
      },
      {
        title: '打印次数',
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
