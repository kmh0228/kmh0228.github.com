<template>
  <div class="mes-main mes-work-order mes-material">
    <h3 class="mes-main-title">{{$t('orderSched_WorkOrdeScheMana')}}</h3>
    <div class="mes-material-handle mes-table-handle" style="border-top:none;">
      <div class="mes-btn-group">
        <div v-if="!isStartScheduling">
          <el-button size="mini" icon="el-icon-setting" @click="showParmas = true">{{$t('orderSched_ParamSett')}}</el-button>
          <span class="split-line">|</span>
          <!-- <el-button size="mini" :disabled="editBtnDisabled" @click="editApsScheduling">{{$t('common_Edit')}}</el-button>
          <span class="split-line">|</span> -->
          <el-button size="mini" icon="el-icon-date" @click="startApsScheduling">{{$t('orderSched_StartSche')}}</el-button>
           <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-delete-solid" @click="delApsScheduling('')">{{$t('common_Delete')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-lock" @click="lockApsScheduling('')">{{$t('orderSched_BatchLock')}}</el-button>
          <span class="split-line">|</span>
          <el-button size="mini" icon="el-icon-upload2" @click="importDialog = true">{{$t('common_Impor')}}</el-button>
        </div>
        <div v-else>
          <el-button size="mini" type="primary" plain @click="saveApsScheduling">{{$t('common_save')}}</el-button>
          <span class="split-line">|</span>
           <el-button size="mini" @click="cannelApsScheduling">{{$t('common_cancel')}}</el-button>
        </div>
      </div>
    </div>
    <div class="mes-table">
      <el-table :data="dataList" border size="mini" :row-style="rowStyle" @selection-change="orderSelectChange">
        <el-table-column type="selection" width="50" align="center" fixed="left"></el-table-column>
        <el-table-column type="index" :label="$t('common_Number')" align="center" fixed="left"></el-table-column>
        <el-table-column :label="$t('common_WorkOrdeNo')" align="center" width="140" sortable>
          <template slot-scope="scope">
            <!-- :draggable="isDraggable(scope.row)" -->
            <div :draggable="isDraggable(scope.row)" @dragstart="dragScheduling(scope.row)" @dragend="dragSchedulingEnd(scope.row)">
              {{ scope.row.docNo }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="materialNo" :label="$t('common_PorN')" align="center" width="120" sortable></el-table-column>
        <el-table-column prop="requestQty" :label="$t('orderSched_WorkOrdeDemaQuan')"  width="120" align="center" sortable></el-table-column>
        <el-table-column prop="docStatus" :label="$t('common_Status')" width="80" align="center"></el-table-column>
        <el-table-column prop="apsStartDt" width="180" :label="$t('orderSched_SchedChenStarTime')" align="center" sortable>
          <template slot-scope="scope">
             <el-date-picker v-if="isStartScheduling" v-model="scope.row.apsStartDt" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" size="mini" default-time="08:00:00" style="width:95%;">
            </el-date-picker>
            <p v-else>{{ scope.row.apsStartDt }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="apsFinishDt" width="180" :label="$t('orderSched_SchedEndTime')" align="center" sortable>
          <template slot-scope="scope">
            <el-date-picker v-if="isStartScheduling" v-model="scope.row.apsFinishDt" type="datetime" format="yyyy-MM-dd HH:mm"  value-format="yyyy-MM-dd HH:mm" default-time="08:00:00" size="mini" style="width:95%;">
            </el-date-picker>
            <p v-else>{{ scope.row.apsFinishDt }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="estDeliveryDt" :label="$t('orderSched_ExpecDeliDate')" align="center"  width="150" sortable></el-table-column>
        <el-table-column prop="resuorceCode" :label="$t('orderSched_resou')" align="center" width="120" sortable>
          <template slot-scope="scope">
            <el-select v-if="isStartScheduling" size="mini" v-model="scope.row.mpsmResourceId">
              <el-option v-for="item in scope.row.resourceList" :key="item.resourceId" :label="item.resourceCode" :value="item.resourceId"></el-option>
            </el-select>
            <p v-else>{{ scope.row.resourceCode }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="isScheduled" :label="$t('orderSched_PartiInProdSche')" width="100" align="center" sortable>
          <template slot-scope="scope">
            <el-select v-if="isStartScheduling" size="mini" v-model="scope.row.isScheduled">
              <el-option :label="$t('common_Yes')" :value="true"></el-option>
              <el-option :label="$t('common_No')" :value="false"></el-option>
            </el-select>
            <el-tag v-else :type="setTagColor(scope.row.isScheduled)" size="mini">{{scope.row.isScheduled | formaterInvalid}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isSchIncluded" :label="$t('orderSched_Sched')" width="100"  align="center" sortable>
          <template slot-scope="scope">
            <el-tag :type="setTagColor(scope.row.isSchIncluded)" size="mini">{{scope.row.isSchIncluded | formaterInvalid}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isSchLock" :label="$t('orderSched_locki')" width="80" align="center" sortable>
          <template slot-scope="scope">
            <el-tag :type="setTagColor(scope.row.isSchLock)" size="mini">{{scope.row.isSchLock | formaterInvalid}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common_Operate')" align="center" width="150" fixed="right">
          <template slot-scope="scope">
            <handle-button @click="editApsScheduling(scope.row.tPomJobOrderId)" iconClass='el-icon-edit-outline' :placeholder="$t('common_Edit')"></handle-button>
            <handle-button @click="lockApsScheduling(scope.row.tPomJobOrderId)" iconClass='el-icon-lock' :placeholder="$t('orderSched_locki')" iconColor='#E6A23C'></handle-button>
            <handle-button @click="delApsScheduling(scope.row.tPomJobOrderId)" iconClass='el-icon-delete' :placeholder="$t('common_Del')" iconColor='#f56c6c'></handle-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="mes-main-tabs">
      <el-tabs v-model="activeName">
        <el-tab-pane name="gantt" :label="$t('orderSched_SchedGantChar')">
          <div class="mes-gantt">
            <table class="gantt-table" style="width:10%;float:left">
              <tr>
                <td>{{$t('orderSched_resou')}}</td>
              </tr>
              <tr v-for="(col,i) in ganttList" :key="i" class="resource-list" :style="targetStyle(col.resourceId)">
                <td drag-target="resource-list" :drag-id="col.resourceId"><div>{{ col.resourceCode }}</div></td>
              </tr>
            </table>
            <el-scrollbar style="width:90%;float:left">
              <table class="gantt-table" style="width:270%">
                <tr>
                  <td v-for="(date,i) in ganttDateList" :key="i">{{ date }}</td>
                </tr>
                <tr v-for="(col,i) in ganttList" :key="i" class="resource-list" :style="targetStyle(col.resourceId)">
                  <td :colspan="ganttDateList.length" class="gantt-table-column" drag-target="resource-list" :drag-id="col.resourceId">
                    <Slick-list :lockToContainerEdges="true" axis="x" v-model="col.ganttOrderDtoList" lockOffset="0%" @sort-end="getChangeList" @click.native="getCurrentList(col.ganttOrderDtoList,col.resourceId)" style="display:flex;height:100%;">
                      <Slick-item v-for="(item, index) in col.ganttOrderDtoList" :index="index" :key="index" class="order-gantt-item" :style="getGanttStyle(item)">
                        <el-tooltip effect="dark" :content="item.docNo" placement="top">
                          <p>{{ item.docNo }}</p>
                        </el-tooltip>
                      </Slick-item>
                    </Slick-list>
                  </td>
                </tr>
              </table>
             </el-scrollbar>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog :visible.sync="showParmas" :title="$t('orderSched_SchedParaSett')" width="850px" class="handle-dialog">
      <el-form :model="paramsForm" ref="paramsForm" :rules="rules" label-width="120px" label-position="left" class="el-row mes-form-rule">
        <el-form-item :label="$t('orderSched_ArranMode') + ':'" prop="mode" class="el-col el-col-24">
          <dict-select style="width:100%;"  v-model="paramsForm.mode" :placeholder="$t('orderSched_selecArraMode')" dictType="SCHEDULING_MODE" clearable ></dict-select>
        </el-form-item>
        <el-form-item :label="$t('orderSched_Colla') + ':'" class="el-col el-col-24">
          <el-transfer v-model="paramsForm.sortingRule" :data="sortList" :props="{key:'dictCode',label:'dictName'}"
          @right-check-change="rightSelect" class="sorting-rule" ></el-transfer>
          <div class="move-btn-gruop">
            <div><el-button type="primary" icon="el-icon-arrow-up" :disabled="moveUpBtnDisabled" size="mini" @click="moveUp">{{$t('orderSched_MoveUp')}}</el-button></div>
            <div><el-button type="primary" icon="el-icon-arrow-down" :disabled="moveDownBtnDisabled" size="mini" @click="moveDown">{{$t('orderSched_MoveDown')}}</el-button></div>
          </div>
        </el-form-item>
        <el-form-item :label="$t('orderSched_SchedStarTime') + ':'" prop="durationStart" class="el-col el-col-11">
          <el-date-picker v-model="paramsForm.durationStart" type="date" :placeholder="$t('orderSched_SetScheStarTime')" size="mini" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm" style="width:100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('orderSched_MaximScheDays') + ':'" prop="duration" class="el-col el-col-11 el-col-offset-1">
          <el-input v-model.trim="paramsForm.duration" size="mini"></el-input>
        </el-form-item>
        <el-form-item :label="$t('orderSched_ExpecLeadTime') + ':'" prop="advanceDay" class="el-col el-col-11">
          <el-input v-model.trim="paramsForm.advanceDay" size="mini"></el-input>
        </el-form-item>
        <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
          <el-button type="warning" size="mini" @click="setApsSchedulingParams">{{$t('orderSched_setDefa')}}</el-button>
          <el-button type="primary" size="mini" @click="saveCurrentAps">{{$t('common_save')}}</el-button>
          <el-button size="mini" @click="showParmas= false">{{$t('common_cancel')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 导入文件 -->
    <el-dialog :title="$t('orderSched_selecJobBeImpo')" :visible.sync="importDialog" width="600px" @close="closeUploadDialog" class="handle-dialog">
      <el-upload action="" drag style="text-align:center;" :before-upload="beforeUpload">
        <mes-icon icon="excel-icon" size="67px" style="display:inline-block;margin:40px 0 16px;" v-if="fileName"></mes-icon>
        <i class="el-icon-upload" v-else></i>
        <p v-if="fileName">{{ fileName }}</p>
        <div class="el-upload__text" v-else>
          {{$t('common_DragFileHere')}}<em>{{$t('common_ClickUplo')}}</em> {{$t('common_or')}}
          <em><a href="static/download/exportScheduling.xls" style="color:#3B6F9A;text-decoration:none;" :download="$t('orderSched_ImporWorkOrdeScheTemp') + '.xls'" @click="downloadTemplate">{{$t('common_TemplDown')}}</a></em>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="importApsScheduling">{{$t('common_ok')}}</el-button>
        <el-button @click="closeUploadDialog">{{$t('common_cancel')}}</el-button>
      </div>
    </el-dialog>
    <!-- 编辑修改状态 -->
    <el-dialog :title="$t('common_Edit')" :visible.sync="editDialog" width="600px" class="handle-dialog">
      <el-form :model="editForm" label-position="left"  label-width="130px" class="el-row mes-form-rule">
        <el-form-item :label="$t('common_WorkOrdeNo')">
          <el-input v-model="editForm.docNo" size="mini" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('common_PorN')">
          <el-input v-model="editForm.materialNo" size="mini" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('orderSched_PartiInProdSche')">
          <el-checkbox v-model="editForm.isScheduled"></el-checkbox>
        </el-form-item>
        <el-form-item :label="$t('orderSched_locki')">
          <el-checkbox v-model="editForm.isSchLock"></el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveApsSchedulingState">{{$t('common_ok')}}</el-button>
        <el-button @click="editDialog=false">{{$t('common_cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/**
 * 1 排程数据来源
 * 2 参数设定是针对所有工单配置  设置默认（是否存在多个排程参数）
 * 3 删除排程 锁定的无法删除 未参与排产的不能删除
 * 4 锁定排程
 * 5 导入排程 缺少按钮  加一个导入的按钮
 * 6 是否存在排程的分页  先不加分页
 * 7 相同料号颜色数据哪里来
 * 8 非生产时间的数据来源 休息日可以先不加
 * 9 直接拖动甘特图进行排程，拖动时只允许在料号对应资源拖动，拖动后，后续订单依次顺延
 * 10 甘特图时间开始时间和结束时间以什么为标准  排程参数来的
 * 11 同一时间段、同一资源 是否应该加入多个工单校验（也就是不允许存在多个工单，若要设置，先修改已存在的工单）
 */
import { SlickList, SlickItem } from 'vue-slicksort'
export default {
  data () {
    const durationRule = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('orderSched_enterMaxiScheDays')))
      } else {
        if (value > 30) {
          callback(new Error(this.$t('orderSched_maximScheDaysCannExce')))
        } else {
          callback()
        }
      }
    }
    return {
      showParmas: false,
      dataList: [],
      orderSelects: [],
      paramsForm: {
        mode: '',
        sortingRule: [],
        durationStart: '',
        duration: 0,
        advanceDay: ''
      },
      sortList: [],
      selectList: [],
      pickerOptions: {
        shortcuts: [{
          text: this.$t('orderSched_curreDate'),
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }]
      },
      rules: {
        mode: [{ required: true, message: this.$t('orderSched_selecArraMode') }],
        durationStart: [{ required: true, message: this.$t('orderSched_selecScheStarTime') }],
        duration: [{ required: true, validator: durationRule, trigger: 'blur' }],
        advanceDay: [{ required: true, message: this.$t('orderSched_ExpecLeadDaysBeBlan') }]
      },
      ganttList: [],
      activeName: 'gantt',
      currentList: [],
      isStartScheduling: false,
      targetResourceId: null,
      importDialog: false,
      fileName: '',
      file: '',
      editDialog: false,
      editForm: {}
    }
  },
  computed: {
    moveUpBtnDisabled () {
      const { sortingRule } = this.paramsForm
      const { selectList } = this
      const len = sortingRule.length
      if (len > 1) {
        if (selectList.length === 1) {
          const selectRule = selectList[0]
          return sortingRule.indexOf(selectRule) === 0
        } else {
          return true
        }
      } else {
        return true
      }
    },
    moveDownBtnDisabled () {
      const { sortingRule } = this.paramsForm
      const { selectList } = this
      const len = sortingRule.length
      if (len > 1) {
        if (selectList.length === 1) {
          const selectRule = selectList[0]
          return sortingRule.indexOf(selectRule) === len - 1
        } else {
          return true
        }
      } else {
        return true
      }
    },
    editBtnDisabled () {
      const { orderSelects } = this
      return orderSelects.length !== 1
    },
    saveBtnDisabled () {
      return !this.isStartScheduling
    },
    ganttDateList () {
      const { showParmas } = this
      const { durationStart, duration } = this.paramsForm
      let arr = []
      if (!showParmas) {
        for (let i = 0; i < duration; i++) {
          const date = this.$dayjs(durationStart).add(i, 'days').format('MM/DD')
          arr.push(date)
        }
      }
      return arr
    }
  },
  methods: {
    orderSelectChange (selection) {
      this.orderSelects = []
      selection.forEach(item => {
        this.orderSelects.push(item.tPomJobOrderId)
      })
    },
    async getSortList () {
      const data = {
        dictType: 'SORT_RULE',
        pageIndex: 1,
        pageSize: 100
      }
      const res = await this.$api.getDictionaryDetail(data)
      if (res.code === '200') {
        this.sortList = res.data.list
      } else {
        this.sortList = []
      }
    },
    setTagColor (value) {
      return value ? '' : 'danger'
    },
    rightSelect (selection) {
      this.selectList = selection
    },
    moveUp () {
      const { sortingRule } = this.paramsForm
      const selectRule = this.selectList[0]
      const { sortList } = this
      let index = null
      sortList.forEach((item, i) => {
        if (item.dictCode === selectRule) {
          index = i
        }
      })
      const currentRule = sortList[index]
      const prevRule = sortList[index - 1]
      this.$set(sortList, index, prevRule)
      this.$set(sortList, index - 1, currentRule)
      let selectIndex = sortingRule.indexOf(selectRule)
      const currentValue = sortingRule[selectIndex]
      const prevValue = sortingRule[selectIndex - 1]
      this.$set(sortingRule, index, prevValue)
      this.$set(sortingRule, index - 1, currentValue)
    },
    moveDown () {
      const { sortingRule } = this.paramsForm
      const selectRule = this.selectList[0]
      const { sortList } = this
      let index = null
      sortList.forEach((item, i) => {
        if (item.dictCode === selectRule) {
          index = i
        }
      })
      const currentRule = sortList[index]
      const nextRule = sortList[index + 1]
      this.$set(sortList, index, nextRule)
      this.$set(sortList, index + 1, currentRule)
      let selectIndex = sortingRule.indexOf(selectRule)
      const currentValue = sortingRule[selectIndex]
      const nextValue = sortingRule[selectIndex + 1]
      this.$set(sortingRule, index, nextValue)
      this.$set(sortingRule, index + 1, currentValue)
    },
    // 获取工单排程列表
    async getApsOrderList () {
      const data = this.paramsForm
      const res = await this.$api.getApsOrderList(data)
      if (res.code === '200') {
        this.dataList = res.data
      } else {
        this.dataList = []
      }
    },
    rowStyle ({ row, rowIndex }) {
      let style = {}
      const { apsFinishDt, estDeliveryDt } = row
      if (apsFinishDt) {
        const times1 = this.$dayjs(apsFinishDt).valueOf()
        const times2 = this.$dayjs(estDeliveryDt).valueOf()
        const diffTime = times1 - times2
        if (diffTime > 0) {
          style = {
            color: '#F56C6C'
          }
        }
      }
      return style
    },
    isDraggable (row) {
      const { isSchLock, isScheduled, isSchIncluded } = row
      return isSchLock ? false : isScheduled ? !isSchIncluded : false
    },
    // 锁定排程
    async lockApsScheduling (id) {
      const ids = id ? [id] : this.orderSelects
      if (ids.length > 0) {
        const isConfirm = await this.$myPrompt.confirm(this.$t('orderSched_AreYouSureSeleSche'))
        if (isConfirm) {
          const res = await this.$api.lockApsScheduling(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.getApsOrderList()
          })
        }
      } else {
        this.$message.warning(this.$t('orderSched_selecScheBeLockFirs'))
      }
    },
    // 删除排程
    async delApsScheduling (id) {
      const ids = id ? [id] : this.orderSelects
      if (ids.length > 0) {
        const isConfirm = await this.$myPrompt.confirm(this.$t('orderSched_AreYouSureScheChen'))
        if (isConfirm) {
          const res = await this.$api.delApsScheduling(ids)
          this.$myPrompt.handleMsg(res, () => {
            this.getApsOrderList()
          })
        }
      } else {
        this.$message.warning(this.$t('orderSched_selecScheBeDeleFirs'))
      }
    },
    // 编辑修改状态
    async editApsScheduling (id) {
      const { dataList } = this
      this.editForm = dataList.filter(item => item.tPomJobOrderId === id)[0]
      this.editDialog = true
    },
    async saveApsSchedulingState () {
      const { tPomJobOrderId, isScheduled, isSchLock } = this.editForm
      const data = { tPomJobOrderId, isScheduled, isSchLock }
      const res = await this.$api.editApsSchedulingState(data)
      this.$myPrompt.handleMsg(res, () => {
        this.editDialog = false
        this.getApsOrderList()
      })
    },
    // 获取工单排程参数
    async getApsSchedulingParams () {
      const res = await this.$api.getApsSchedulingParams()
      if (res.code === '200') {
        if (res.data) {
          this.paramsForm = res.data
        }
        this.getApsOrderList()
        this.getApsTimeAndResource()
      } else {
        this.$message.error(res.msg)
      }
    },
    // 设置工单排程参数
    async setApsSchedulingParams () {
      this.$refs['paramsForm'].validate(async valid => {
        if (valid) {
          const res = await this.$api.setApsSchedulingParams(this.paramsForm)
          this.$myPrompt.handleMsg(res, () => {
            // this.showParmas = false
          })
        }
      })
    },
    // 保存当前页面参数
    saveCurrentAps () {
      this.showParmas = false
      this.getApsOrderList()
    },
    // 查询甘特图中资源
    async getApsTimeAndResource () {
      const res = await this.$api.getApsTimeAndResource(this.paramsForm)
      if (res.code === '200') {
        const colors = ['#468ccf', '#f9d469', '#a7deb4', '#cc61a3', '#f1977c', '#7571df', '#64959f', '#f6b8a1', '#e76d71', '#7ed7e0']
        const list = res.data
        const len1 = list.length
        const arr = []
        for (let i = 0; i < len1; i++) {
          arr.push(list[i])
          const len2 = list[i].ganttOrderDtoList.length
          for (let j = 0; j < len2; j++) {
            const colorIndex = Math.round((Math.random() * 9))
            arr[i].ganttOrderDtoList[j].bgColor = colors[colorIndex]
          }
        }
        this.ganttList = res.data
      } else {
        this.ganttList = []
      }
    },
    // 开启排程
    async startApsScheduling () {
      const res = await this.$api.startOrderScheduling(this.paramsForm)
      if (res.code === '200') {
        this.dataList = res.data
        this.isStartScheduling = true
      } else {
        this.$message.error(res.msg)
      }
    },
    // 保存排程信息
    async saveApsScheduling () {
      const { dataList } = this
      const data = []
      dataList.forEach(item => {
        if (item.isScheduled) {
          data.push({
            apsFinishDt: item.apsFinishDt,
            apsStartDt: item.apsStartDt,
            mpsmResourceId: item.mpsmResourceId,
            tPomJobOrderId: item.tPomJobOrderId
          })
        }
      })
      if (data.length > 0) {
        const res = await this.$api.saveApsScheduling(data)
        this.$myPrompt.handleMsg(res, () => {
          this.cannelApsScheduling()
          this.getApsTimeAndResource()
        })
      } else {
        this.$message.warning(this.$t('orderSched_CurreTherIsProdSche'))
      }
    },
    cannelApsScheduling () {
      this.getApsOrderList()
      this.isStartScheduling = false
    },
    getGanttStyle (col) {
      const { durationStart, duration } = this.paramsForm
      const hours = duration * 24
      const apsFinishDt = this.$dayjs(col.apsFinishDt).valueOf() > this.$dayjs(durationStart).add(duration, 'days').valueOf() ? this.$dayjs(durationStart).add(duration, 'days').valueOf() : this.$dayjs(col.apsFinishDt).valueOf()
      const left = (this.$dayjs(col.apsStartDt).valueOf() - this.$dayjs(durationStart).valueOf()) / 1000 / 60 / 60 / hours * 100
      const width = (apsFinishDt - this.$dayjs(col.apsStartDt).valueOf()) / 1000 / 60 / 60 / hours * 100
      return {
        width: `${width}%`,
        left: `${left}%`,
        backgroundColor: col.bgColor
      }
    },
    getCurrentList (list, mpsmResourceId) {
      list.forEach(item => {
        item.mpsmResourceId = mpsmResourceId
      })
      this.currentList = list
    },
    // 排产插入
    async getChangeList (event) {
      const { oldIndex, newIndex } = event
      if (oldIndex !== newIndex) {
        const data = []
        data.push({
          tPomJobOrderId: this.currentList[oldIndex].tPomJobOrderId,
          apsStartDt: this.currentList[oldIndex].apsStartDt,
          apsFinishDt: this.currentList[oldIndex].apsFinishDt,
          mpsmResourceId: this.currentList[oldIndex].mpsmResourceId
        })
        data.push({
          tPomJobOrderId: this.currentList[newIndex].tPomJobOrderId,
          apsStartDt: this.currentList[newIndex].apsStartDt,
          apsFinishDt: this.currentList[newIndex].apsFinishDt,
          mpsmResourceId: this.currentList[newIndex].mpsmResourceId
        })
        const res = await this.$api.exchangeApsScheduling(data)
        this.$myPrompt.handleMsg(res, () => {
          this.cannelApsScheduling()
          this.getApsTimeAndResource()
        })
      }
    },
    targetStyle (resourceId) {
      let style = {}
      if (this.targetResourceId === resourceId) {
        style = {
          backgroundColor: '#f4f6f9'
        }
      } else {
        style = {
          backgroundColor: '#fff'
        }
      }
      return style
    },
    async dragScheduling (row) {
      document.addEventListener('dragover', overEvent => {
        const targetAttribut = overEvent.target.getAttribute('drag-target')
        if (targetAttribut === 'resource-list') {
          this.targetResourceId = overEvent.target.getAttribute('drag-id')
        }
      })
      document.addEventListener('drop', dropEvent => {
        dropEvent.stopPropagation()
      })
    },
    async dragSchedulingEnd (row) {
      const mpsmResourceId = this.targetResourceId
      const { tPomJobOrderId, mcomMaterialId, requestQty } = row
      if (mpsmResourceId) {
        const data = { mpsmResourceId, tPomJobOrderId, mcomMaterialId, requestQty }
        const res = await this.$api.moveJobOrderToGantt(data)
        this.$myPrompt.handleMsg(res, () => {
          this.targetResourceId = null
          this.cannelApsScheduling()
          this.getApsTimeAndResource()
        })
      } else {
        this.$message.warning(this.$t('orderSched_dragWorkOrdeSpecReso'))
      }
    },
    // 导入排产
    closeUploadDialog () {
      this.importDialog = false
      this.fileName = ''
      this.fileContent = ''
    },
    downloadTemplate (event) {
      event.stopPropagation()
    },
    beforeUpload (file) {
      const fileName = file.name
      const fileReg = /\.(?:xls|xlsx)$/i
      if (fileReg.test(fileName)) {
        this.fileName = fileName
        this.file = file
      } else {
        this.$message.warning(this.$t('orderSched_fileMuseExcel'))
      }
      return false
    },
    async importApsScheduling () {
      const { file } = this
      if (file) {
        const data = new FormData()
        data.append('file', file)
        const res = await this.$api.importApsScheduling(data)
        if (res.code === '200') {
          this.importDialog = false
          this.dataList = res.data
          this.isStartScheduling = true
        } else {
          this.$message.error(res.msg)
        }
      } else {
        this.$message.warning(this.$t('orderSched_uploaWorkOrdeScheFirs'))
      }
    }
  },
  created () {
    this.getSortList()
    this.getApsSchedulingParams()
  },
  components: {
    SlickList, SlickItem
  },
  mounted () {
  }
}
</script>

<style lang="scss">
.mes-main {
  .move-btn-gruop {
    width: 14%;
    display: inline-block;
  }
  .sorting-rule {
    width: 85%;
    display: inline-block;
    .el-transfer-panel__header {
      display: none;
    }
  }

  .drag-warp {
    height: 38px;
    line-height: 38px;
    background-color: #3b6f9a;
    color: #fff;
    display: none;
    position: fixed;
    z-index: 9999;
    padding: 0 8px;
    cursor: pointer;
  }

  .mes-gantt {
    position: relative;
    .gantt-charts {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 120px;
      right: 0;
    }

    .el-scrollbar {
      .el-scrollbar__wrap {
        overflow-x: scroll !important;
      }
      .el-scrollbar__bar.is-horizontal {
        display: block !important;
      }
    }

    .gantt-table {
      width: 100%;
      td {
        text-align: center;
        border: 1px solid #ebeef5;
        color: #606266;
        font-size: 14px;
        height: 38px;
        line-height: 38px;
        position: relative;
        overflow: hidden;

        &:first-child {
          // width: 120px;
          div {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 100%;
          }
        }
      }

      .gantt-table-column {
        position: relative;
        overflow: hidden;

        .order-gantt-item {
          position: absolute;
          top: 0;
          height: 100%;
          color: #333;
          cursor: pointer;

          p {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
}
</style>
