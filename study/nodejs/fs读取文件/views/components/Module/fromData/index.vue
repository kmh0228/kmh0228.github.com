<template>
<div>
  <el-form :model="formData" ref="fromData" :rules="rules" :label-width="labelWidth" label-position="left" class="el-row mes-form-rule">
  <el-form-item v-for="(option,i) in formData" :key="i" :label="option.label" :prop="option.key" :class="rowClass" style="padding-left:2vw">
    <el-input v-model="form[option.key]" size="mini"></el-input>
  </el-form-item>

</el-form>

  <el-button @click="ggg">ssss</el-button>
</div>

</template>

<script>
export default {
  data () {
    return {
      form: {},
      rowClass: ''
    }
  },
  methods: {
    setRow () {
      let row = 24 / this.rowNumber
      this.rowClass = `el-col el-col-${row}`
    },
    ggg () {
      console.log(this.form)
    }
  },
  props: {
    formData: {
      type: Array
    },
    rules: {
      type: Object
    },
    labelWidth: {
      type: String,
      default: '120px'
    },
    rowNumber: {
      type: Number
    }
  },
  created () {
    this.setRow()
  }

}
</script>
