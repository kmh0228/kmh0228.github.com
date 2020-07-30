export let tableOption = This => {
  return {
    style: {
      width: '100%'
    },
    highlightCurrentRow: true,
    tableTitle: [
      {
        title: 'common_code',
        prop: 'code',
        width: '120px'
      },
      {
        title: 'common_Name',
        prop: 'name',
        width: '120px'
      },
      {
        title: 'materialBathS_BatchCodiRule',
        prop: 'batchCodeType',
        width: '150px'
      },
      {
        title: 'materialBathS_IsItEffe',
        prop: 'isInvalid',
        width: '120px',
        replaceFun: row => {
          return row.isInvalid ? '有效' : '无效'
        }
      },
      {
        title: 'common_Creator',
        prop: 'creatorName',
        width: '120px'
      },
      {
        title: 'common_CreateTime',
        prop: 'createdDt',
        width: '180px',
        replaceFun: row => {
          return row.createdDt
            ? This.$dayjs(row.createdDt).format('YYYY-MM-DD HH:mm:ss')
            : ''
        }
      },
      {
        title: 'common_ModifBy',
        prop: 'lastEditorName',
        width: '120px'
      },
      {
        title: 'common_LastModiTime',
        prop: 'lastEditedDt',
        width: '180px',
        replaceFun: row => {
          return row.lastEditedDt
            ? This.$dayjs(row.lastEditedDt).format('YYYY-MM-DD HH:mm:ss')
            : ''
        }
      },
      {
        title: 'common_Operate',
        prop: 'operation',
        fixed: 'right',
        width: '120',
        operation: true,
        buttonArr: [
          {
            iconClass: 'el-icon-edit-outline',
            text: 'common_Edit',
            operationClick (row) {
              This.popType = 'update'
              This.addForm = {
                mwmsMaterialBatchProgramId: row.mwmsMaterialBatchProgramId,
                code: row.code,
                name: row.name,
                batchCodeType: row.batchCodeType,
                isInvalid: row.isInvalid
              }
              This.addVisible = true
            }
          },
          {
            iconClass: 'el-icon-delete',
            iconColor: '#f56c6c',
            text: 'common_Del',
            operationClick (row) {
              This.deleteBatchProgram([row.mwmsMaterialBatchProgramId])
            }
          }
        ]
      }
    ],
    cellClick (row, column, cell, event) {
      This.showTabs = true
      This.batchData = row.detail
    }
  }
}
export let popBatchData = [
  {
    code: 'LOT_ATT01',
    name: '生产日期',
    description: '生产日期（D/C）',
    fieldType: '0',
    inputType: '0',
    receiveVerification: false,
    outVerification: false
  },
  {
    code: 'LOT_ATT02',
    name: '生产批次',
    description: '生产批次（L/C）',
    fieldType: '1',
    inputType: '0',
    receiveVerification: false,
    outVerification: false
  },
  {
    code: 'LOT_ATT03',
    name: '失效日期',
    description: '失效日期',
    fieldType: '0',
    inputType: '2',
    receiveVerification: false,
    outVerification: false
  },
  {
    code: 'LOT_ATT04',
    name: '收货日期',
    description: '收货日期',
    fieldType: '0',
    inputType: '1',
    receiveVerification: false,
    outVerification: false
  },
  {
    code: 'LOT_ATT05',
    name: '批次属性05',
    description: '批次属性05',
    fieldType: '1',
    inputType: '3',
    receiveVerification: false,
    outVerification: false
  },
  {
    code: 'LOT_ATT06',
    name: '批次属性06',
    description: '批次属性06',
    fieldType: '1',
    inputType: '3',
    receiveVerification: false,
    outVerification: false
  }
]
