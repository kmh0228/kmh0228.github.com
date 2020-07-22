<!-- 开发临时使用的工具，语言开发完成后请删除此文件和 router/index.js中第78-86行lang路径的配置-->
<template>
  <div>
    <el-row style="margin-top:20px;">
      <el-col :span="11" :offset="1">
        <el-input type="textarea" v-model="html" rows="30"></el-input>
      </el-col>
      <el-col :span="11" :offset="1">
        <el-row>
          <el-col :span="10"><el-input v-model="pageName" placeholder="页面名称"></el-input></el-col>
          <el-col :span="5" :offset="1"><el-button @click="btnClick">获取需要翻译的中文</el-button></el-col>
        </el-row>
        <el-row>
          <h3 style="margin-top:5px;">中英文</h3>
          <el-row>
            <el-col :span="11"><el-input type="textarea" v-model="langAdd" rows="12"></el-input></el-col>
            <el-col :span="11"><el-input type="textarea" v-model="langEnglishAdd" rows="12"></el-input></el-col>
          </el-row>
          <el-button @click="btnClick2">获取翻译json</el-button>
          <h3 style="margin-top:5px;">需要添加的翻译json</h3>
          <el-input type="textarea" v-model="laddAddJson" rows="12"></el-input>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import commonLang from '../i18n/commonLanguage'
export default {
  data () {
    return {
      name: '',
      list: [],
      html: '',
      pageName: 'scaningRule',
      langAdd: '',
      langEnglishAdd: '',
      laddAddJson: '',
      newLang: []
    }
  },
  computed: {
    commonLangFor () {
      let keys = Object.keys(commonLang['zh-CN'])
      let result = {}
      keys.forEach(key => {
        result[commonLang['zh-CN'][key]] = {
          key: key,
          en: commonLang.en[key],
          'zh-CN': commonLang['zh-CN'][key],
          'zh-TW': commonLang['zh-TW'][key]
        }
      })
      return result
    }
  },
  methods: {
    btnClick () {
      // 获取html中的文字
      let reg = /[\u4e00-\u9fa5，？]*/g
      let str = this.html
      let pageChinaArr = Array.from(new Set(str.match(reg).filter(item => !!item)))
      // 检测文字是否在公用语言翻译中存在
      this.newLang = pageChinaArr.filter(item => !this.commonLangFor[item])
      this.langAdd = this.newLang.join('\n')
    },
    enToKey (english) {
      let arr = english.split(' ')
      let del = { of: true, the: true, to: true }
      var arrDel = arr.filter(en => !del[en])
      let result = ''
      arrDel.forEach((en, i) => {
        let len = en.length
        if (i) {
          result += en[0].toUpperCase() + en.slice(1, len > 4 ? 4 : len)
        } else {
          result += en.slice(0, len > 5 ? 5 : len)
        }
      })
      return result.length > 15 ? result.slice(0, 15) : result
    },
    btnClick2 () {
      let jsonAdd = ``

      this.langEnglishAdd.split(/\n/g).filter(item => item !== '').forEach((english, i) => {
        jsonAdd += this.pageName + `_` + this.enToKey(english) + `: {
  zhCN: '` + this.newLang[i] + `',
  en: '` + english + `'
},
`
      })
      this.laddAddJson = jsonAdd
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
