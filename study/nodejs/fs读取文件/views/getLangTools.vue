<!-- 开发临时使用的工具，语言开发完成后请删除此文件和 router/index.js中第78-86行lang路径的配置-->
<template>
  <div>
    <el-row style="margin-top:20px;">
      <el-col :span="7" :offset="1">
        <el-input type="textarea" v-model="html" rows="40"></el-input>
      </el-col>
      <el-col :span="7" :offset="1">
        <el-input type="textarea" v-model="html2" rows="40"></el-input>
      </el-col>
      <el-col :span="7" :offset="1" style="margin-top:10px;">
        <el-row>
          <el-col :span="5" :offset="1"><el-button @click="btnClick">获取需要翻译的中文</el-button></el-col>
        </el-row>
        <el-row>
          <h3 style="margin-top:5px;">中英文</h3>
          <el-row>
            <el-col :span="11"><el-input type="textarea" v-model="langAdd" rows="17"></el-input></el-col>
            <el-col :span="11"><el-input type="textarea" v-model="langEnglishAdd" rows="17"></el-input></el-col>
          </el-row>
          <el-row style="margin-top:5px;">
          <el-col :span="10"><el-input v-model="pageName" placeholder="页面名称"></el-input></el-col>
          <el-button style="margin-left:5px;" @click="btnClick2">获取翻译json</el-button>
          <el-button style="margin-left:5px;" @click="btnClick3">html初步格式化</el-button>
        </el-row>
          <h3 style="margin-top:5px;">需要添加的翻译json</h3>
          <el-input type="textarea" v-model="laddAddJson" rows="17"></el-input>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import commonLan from '../i18n/commonLanguage'
import workder from '../i18n/viewLanguage/Production/WorkOrder'
export default {
  data () {
    return {
      name: '',
      list: [],
      html: '',
      html2: '',
      pageName: 'scaningRule',
      langAdd: '',
      langEnglishAdd: '',
      laddAddJson: '',
      newLang: [],
      addJson: {}
    }
  },
  computed: {
    commonLangFor () {
      let commonLang = { ...commonLan }
      let langKeys = ['en', 'zh-CN', 'zh-TW']
      langKeys.forEach(key => { commonLang[key] = { ...commonLang[key], ...workder[key] } })
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
      let reg = /[\u4e00-\u9fa5，？！：（）]*/g
      let reg2 = /(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)/g
      let str = this.html
        .replace(/(<!--.*?-->)/g, '') // 去除html注释
        .replace(reg2, '') // 去除js注释
      let pageChinaArr = Array.from(new Set(str.match(reg).filter(item => !!item)))
      // 检测文字是否在公用语言翻译中存在
      this.newLang = pageChinaArr.filter(item => !this.commonLangFor[item])
      // 输出要添加的中文
      this.langAdd = this.newLang.join('\n')
    },
    enToKey (english) {
      let arr = english.split(' ')
      let del = { of: true, the: true, to: true, please: true }
      let arrDelOld = arr.filter(en => !del[en.toLowerCase()]).map(en => {
        if ((/^[a-zA-Z]+$/).test(en)) {
          return en
        } else {
          return en.match(/[a-zA-Z0-9]/g).join('')
        }
      })
      let arrDelLength = arrDelOld.length
      let arrDel
      if (arrDelLength > 5) {
        arrDel = arrDelOld.filter((item, i) => i < 3 || i > arrDelLength - 3)
      } else {
        arrDel = arrDelOld
      }
      let result = ''
      arrDel.forEach((en, i) => {
        let len = en.length
        if (i) {
          result += en[0].toUpperCase() + en.slice(1, len > 4 ? 4 : len)
        } else {
          result += en.slice(0, len > 5 ? 5 : len)
        }
      })
      // return result.length > 18 ? result.slice(0, 18) : result
      return result
    },
    btnClick2 () {
      let jsonAdd = ``
      let addJson = {}
      this.langEnglishAdd.split(/\n/g).filter(item => item !== '').forEach((english, i) => {
        let key = this.pageName + `_` + this.enToKey(english)
        jsonAdd += key + `: {
  zhCN: '` + this.newLang[i] + `',
  en: '` + english + `'
},
`
        addJson[this.newLang[i]] = {
          key: key,
          en: english,
          'zh-CN': this.newLang[i]
        }
      })
      // 输出需要添加到配置中的json
      this.laddAddJson = jsonAdd
      this.addJson = addJson
    },
    btnClick3 () {
      // 格式化html
      let sumJson = { ...this.commonLangFor, ...this.addJson }
      let sumKeys = Object.keys(sumJson)
      let html2 = this.html
      sumKeys.forEach(zhcn => {
        // dom 转换
        html2 = html2.replace(new RegExp('>' + zhcn + '<', 'g'), ">{{$t('" + sumJson[zhcn]['key'] + "')}}<")
        // js 转换
        html2 = html2.replace(new RegExp('\'' + zhcn + '\'', 'g'), "this.$t('" + sumJson[zhcn]['key'] + "')")
        // label转换
        html2 = html2.replace(new RegExp('label="' + zhcn + '"', 'g'), ':label="$t(\'' + sumJson[zhcn]['key'] + '\')"')
        // placeholder转换
        html2 = html2.replace(new RegExp('placeholder="' + zhcn + '"', 'g'), ':placeholder="$t(\'' + sumJson[zhcn]['key'] + '\')"')
        // tipText转换
        html2 = html2.replace(new RegExp('tipText="' + zhcn + '"', 'g'), ':placeholder="$t(\'' + sumJson[zhcn]['key'] + '\')"')
        // title转换
        html2 = html2.replace(new RegExp('title="' + zhcn + '"', 'g'), ':title="$t(\'' + sumJson[zhcn]['key'] + '\')"')
      })
      this.html2 = html2
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
