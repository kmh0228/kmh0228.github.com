<template>
    <dialogTableSelect ref="dialogTableSelect" v-model="content" class="mes-form-item" :contentValue="materialNoVersion" :selectId="selectkey" :searchPlaceholder="$t('common_PleaseSelectPN')" :searchForm="materialSearch" searchKey="materialNo" :showKey="['materialNo','version']" :tableColumns="materialColumns" getDataFunction="getMaterialMasters" @select-change="selectChange"></dialogTableSelect>
</template>

<script>
import dialogTableSelect from '@/components/Module/DialogTableSelect/dialogTableSelect'
export default {
  data () {
    return {
      content: '',
      materialColumns: [{
        key: 'materialNo',
        label: 'common_PorN'
      }, {
        key: 'materialName',
        label: 'common_MaterialName'
      }, {
        key: 'version',
        label: 'common_Edition'
      }, {
        key: 'mComMaterialtypeCode',
        label: 'common_MaterialType'
      }],
      materialSearch: {
        materialNo: '',
        materialType: ''
      }
    }
  },
  watch: {
    content (val) {
      this.emitData()
    }
  },
  props: {
    materialNoVersion: {
      type: String,
      default: ''
    },
    clearData: {
      type: Boolean,
      default: false
    },
    selectkey: {
      type: String,
      default: 'mComMaterialId'
    }
  },
  methods: {
    emitData () {
      let { content } = this
      this.$emit('input', content)
      this.$emit('change', content)
    },
    selectChange (value) {
      this.$emit('select-change', value)
    }
  },
  components: {
    dialogTableSelect
  }
}
</script>
