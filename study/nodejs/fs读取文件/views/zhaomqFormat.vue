<!-- 开发临时使用的工具，语言开发完成后请删除此文件和 router/index.js中第78-86行lang路径的配置-->
<template>
  <div>
    <el-row style="margin-top:20px;">
      <el-col :span="11" :offset="1">
        <el-input type="textarea" v-model="beforeInner" rows="40"></el-input>
      </el-col>
      <el-col :span="11" :offset="1">
        <el-row>
          <el-col :span="5"><el-button @click="btnClick">格式化翻译参数&export</el-button></el-col>
        </el-row>
        <el-row>
          <el-input type="textarea" v-model="resultInner" rows="38"></el-input>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { traditional } from 'jian_fan'
export default {
  data () {
    return {
      beforeInner: `{
  badCode_BadCodeMana: {
    zhCN: '不良代码管理',
    en: 'Defect Code'
  }
}`,
      resultInner: ''
    }
  },
  computed: {

  },
  methods: {
    btnClick () {
      let language = (new Function('return ' + this.beforeInner))()
      // 格式化 & export
      let en = {}
      let zhCN = {}
      let zhTW = {}
      let keys = Object.keys(language)
      keys.forEach(e => {
        en[e] = language[e]['en']
        zhCN[e] = language[e]['zhCN']
        zhTW[e] = traditional(language[e]['zhCN'])
      })
      let result = { en, 'zh-CN': zhCN, 'zh-TW': zhTW }
      this.resultInner = 'export default ' + JSON.stringify(result)
    }
  },
  mounted () {
    // let mes = i18n.messages
    // let keys = Object.keys(mes['zh-CN'])
    // let lang = []
    // keys.forEach(key => {
    //   lang.push({
    //     key: key,
    //     zhcn: mes['zh-CN'][key],
    //     zhtw: mes['zh-TW'][key],
    //     en: mes['en'][key],
    //     js: "$t('" + key + "')",
    //     html: "{{$t('" + key + "')}}"
    //     // json: key + ':' + JSON.stringify({ zhCN: mes['zh-CN'][key], en: mes['en'][key] }) + ','
    //   })
    // })
    // this.list = lang
  }
}
</script>
