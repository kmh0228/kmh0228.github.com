<template>
  <div class="mes-main mes-work-order">
    <div class="mes-main-tabs">
      <el-tabs v-model="tabAciveName">
        <el-tab-pane label="数据同步" name="dataAsync">
          <data-async />
        </el-tab-pane>
        <el-tab-pane label="权限配置" name="authority">
          <authority />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import dataAsync from './dataAsync'
import authority from './authority'
export default {
  data () {
    return {
      tabAciveName: 'dataAsync'
    }
  },
  methods: {},
  components: {
    dataAsync, authority
  }
}
</script>
