<template>
  <el-dropdown placement="bottom" size="medium" class="language_container">
    <div class="content">
      <mes-icon :icon="icon" className="header-icon" size="1.2vw" suffix="svg" style="cursor:pointer;"></mes-icon>
      <span class="label" style="width:70px;" v-if="showLabel">{{$t(languageName)}}</span>
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="(lang,i) in langs" :key="i" @click.native="changeLang(lang.key)">{{$t(lang.name)}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
export default {
  props: {
    showLabel: { // 是否显示右侧label框
      type: Boolean,
      default: false
    },
    icon: { // svg图标。需要在svg文件中有对应图片
      type: String,
      default: 'language'
    }
  },
  data () {
    return {
      langs: [
        { name: 'common_zh_cn', key: 'zh-CN' }, { name: 'common_zh_tw', key: 'zh-TW' }, { name: 'common_english', key: 'en' }
      ]
    }
  },
  computed: {
    ...mapState(['language']),
    languageName () {
      let cur = this.langs.filter(item => item.key === this.language)
      return cur[0] ? cur[0]['name'] : ''
    }
  },
  methods: {
    ...mapMutations(['CHANGE_LANGE']),
    changeLang (lange) {
      this.CHANGE_LANGE(lange)
      this.$i18n.locale = lange
    }
  }
}
</script>
<style lang="scss" scoped>
.language_container {
  .content {
    cursor: pointer;
    .header-icon {
      float: left;
    }
    .label {
      color: #fff;
      float: left;
      line-height: 1.2vw;
      margin-left: 0.2vw;
    }
  }
  .content:after {
    content: "";
    display: block;
    clear: both;
  }
}
</style>
