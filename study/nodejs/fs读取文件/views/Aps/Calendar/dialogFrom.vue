<template>
<div>
  <el-form  class="el-row mes-form-rule"  ref="dialogFrom"  label-position="left"  label-width="120px" >
   <el-form-item  class="el-col el-col-24" :label="$t('workingTemp_TemplName') + ':'" >
        <el-input  style="width:40%" :disabled="isEdit" v-model="calendarTemplateName"></el-input>
   </el-form-item>
      <table-component ref="tableComponent"></table-component>
      <el-form-item label-width="0" class="el-col el-col-24 dialog-footer">
      <el-button type="primary" size="mini" @click="saveData">{{$t('common_save')}}</el-button>
      <el-button size="mini" @click="$emit('cannel')">{{$t('common_cancel')}}</el-button>
      <el-button v-if="isEdit" type="danger" size="mini" @click="deleteCalendarTemplate">{{$t('calendar_DeleCurrTemp')}}</el-button>
    </el-form-item>
    </el-form>
</div>
</template>

<script>
import tableComponent from './tableComponent'
export default {
  data () {
    return {
      calendarTemplateName: '',
      isEdit: false,
      editStatus: false
    }
  },
  props: {
    cannel: Function,
    onTemplate: String,
    getAllTemplate: Function,
    getDeleteAfterTemplate: Function
  },
  methods: {
    async saveData () {
      if (this.calendarTemplateName) {
        let templateData = this.$refs.tableComponent.templateData
        let len = templateData.length
        let allTime = templateData[len - 1].beginTime
        let dateNumber = templateData[len - 1].timeLength
        let number = Number(allTime.toString().slice(0, 2))
        if (dateNumber + number > 24) {
          this.$message.warning(this.$t('calendar_only24Reass'))
        } else {
          let { calendarTemplateName, isEdit } = this
          let items = templateData
          let data = Object.assign({ items, calendarTemplateName })
          let res = isEdit ? await this.$api.modifyCalendarTemplate(data) : await this.$api.saveCalendarTemplate(data)
          this.$myPrompt.handleMsg(res, () => {
            this.$emit('cannel')
            this.$emit('getAllTemplate')
          })
        }
      } else {
        this.$message.warning(this.$t('calendar_enterTemplate'))
      }
    },
    async  deleteCalendarTemplate () {
      const confirm = await this.$myPrompt.confirm(this.$t('calendar_deleCurrSele'))
      if (confirm) {
        let calendarTemplateName = this.calendarTemplateName
        let res = await this.$api.deleteCalendarTemplate({ calendarTemplateName })
        this.$myPrompt.handleMsg(res, () => {
          this.$emit('cannel')
          this.$emit('getDeleteAfterTemplate')
        })
      }
    },
    async getByTemplateName () {
      if (this.onTemplate) {
        let templateName = this.onTemplate
        let res = await this.$api.getByTemplateName({ templateName })
        if (res.code === '200') {
          this.calendarTemplateName = templateName
          this.$refs.tableComponent.templateData = res.data
          this.isEdit = true
        }
      }
    }
  },
  created () {
    this.getByTemplateName()
  },
  components: {
    tableComponent
  }

}
</script>
