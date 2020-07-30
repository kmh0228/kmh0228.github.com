<template>
  <el-tabs v-model="activetab" class="abormal-rules">
    <el-tab-pane :label="chartType" name="info">
      <el-row>
        <el-col>
          <el-checkbox v-model="checked1" ></el-checkbox>
          <el-input v-model="value1" style="width:45px" disabled ></el-input>
          {{this.$t('controltermM_MoreThanSampPoin')}}±3σ
        </el-col>
        <el-col>
          <el-checkbox v-model="checked2" ></el-checkbox>
          {{$t('controltermM_conti')}}
          <el-input v-model="value2" style="width:45px" ></el-input>
          {{$t('controltermM_pointIsOnSideCent')}}
        </el-col>
        <el-col>
          <el-checkbox v-model="checked3" ></el-checkbox>
          {{$t('controltermM_conti')}}
          <el-input v-model="value3" style="width:45px" ></el-input>
          {{$t('controltermM_ThereAre')}}
          <el-input v-model="value4" style="width:45px" ></el-input>
          {{$t('controltermM_PointOver')}}±2σ
        </el-col>
        <el-col>
          <el-checkbox v-model="checked4" ></el-checkbox>
          {{$t('controltermM_conti')}}
          <el-input v-model="value5" style="width:45px" ></el-input>
          {{$t('controltermM_ThereAre')}}
          <el-input v-model="value6" style="width:45px" ></el-input>
          {{$t('controltermM_PointOver')}}±1σ
        </el-col>
        <el-col>
          <el-checkbox v-model="checked5" ></el-checkbox>
          {{$t('controltermM_conti')}}
          <el-input v-model="value7" style="width:45px" ></el-input>
          {{$t('controltermM_PointUpOrDown')}}
        </el-col>
        <el-col>
          <el-checkbox v-model="checked6" ></el-checkbox>
          {{$t('controltermM_conti')}}
          <el-input v-model="value8" style="width:45px" ></el-input>
          {{$t('controltermM_ClickUpAndDown')}}
        </el-col>
        <el-col>
          <el-checkbox v-model="checked7" ></el-checkbox>
          {{$t('controltermM_conti')}}
          <el-input v-model="value9" style="width:45px" ></el-input>
          {{$t('controltermM_OnBothSideCent')}}
        </el-col>
        <el-col>
          <el-checkbox v-model="checked8" ></el-checkbox>
          {{$t('controltermM_conti')}}
          <el-input v-model="value10" style="width:45px" ></el-input>
          {{$t('controltermM_OnBothSideButNone')}}
        </el-col>
      </el-row>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  data () {
    return {
      activetab: 'info',
      checked1: true,
      checked2: false,
      checked3: false,
      checked4: false,
      checked5: false,
      checked6: false,
      checked7: false,
      checked8: false,
      value1: 1,
      value2: 9,
      value3: 3,
      value4: 2,
      value5: 5,
      value6: 4,
      value7: 6,
      value8: 14,
      value9: 15,
      value10: 8
    }
  },
  props: {
    chartType: String,
    value: String
  },
  computed: {
    ruleParameter () {
      let params = ''
      const { checked1, checked2, checked3, checked4, checked5, checked6, checked7, checked8 } = this
      const { value1, value2, value3, value4, value5, value6, value7, value8, value9, value10 } = this
      if (checked1) {
        params += `1:${value1}`
      }
      if (checked2) {
        params = params ? params + `;2:${value2}` : params + `2:${value2}`
      }
      if (checked3) {
        params = params ? params + `;3:${value3},${value4}` : params + `3:${value3},${value4}`
      }
      if (checked4) {
        params = params ? params + `;4:${value5},${value6}` : params + `4:${value5},${value6}`
      }
      if (checked5) {
        params = params ? params + `;5:${value7}` : params + `5:${value7}`
      }
      if (checked6) {
        params = params ? params + `;6:${value8}` : params + `6:${value8}`
      }
      if (checked7) {
        params = params ? params + `;7:${value9}` : params + `7:${value9}`
      }
      if (checked8) {
        params = params ? params + `;8:${value10}` : params + `8:${value10}`
      }
      return params
    }
  },
  methods: {
    setDefaultValue () {
      const { value } = this
      if (value) {
        const splitValue = value.split(';')
        splitValue.forEach(val => {
          const item = val.split(':')
          const itemIndex = item[0]
          const itemValue = item[1]
          const key = 'checked' + itemIndex
          this[key] = true
          if (itemIndex < 3) {
            const valueKey = 'value' + itemIndex
            this[valueKey] = itemValue
          } else if (itemIndex === '3') {
            const itemValue3 = itemValue.split(',')
            this.value3 = itemValue3[0]
            this.value4 = itemValue3[1]
          } else if (itemIndex === '4') {
            const itemValue4 = itemValue.split(',')
            this.value5 = itemValue4[0]
            this.value6 = itemValue4[1]
          } else if (itemIndex > 4) {
            const valueIndex = Number(itemIndex) + 2
            const valueKey = 'value' + valueIndex
            this[valueKey] = itemValue
          }
        })
      }
    },
    emitNewValue () {
      const { ruleParameter } = this
      this.$emit('input', ruleParameter)
    }
  },
  created () {
    this.setDefaultValue()
  }
}
</script>

<style lang="scss" scoped>
.abormal-rules {
  .el-row {
    .el-col {
      margin-bottom: 15px;
    }
  }
}
</style>
