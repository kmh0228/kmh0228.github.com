<template>
  <el-scrollbar style="height:100%;">
    <el-menu :default-active="activeIndex" class="mes-aside-menu" :collapse="isCollapse" collapse-transition @select="selectMenu">
      <el-menu-item v-for="(list,i) in menuList" :index="list.id" :key="i" @click="choiceMenu(list)" style="padding-left:0;">
        <i class="menu-type" :style="activeIndex === list.id?{backgroundColor:'#676665'}:{backgroundColor:list.color}"></i>
        <mes-icon :icon="list.icon" className="menu-icon" size="18px"></mes-icon>
        <span slot="title" class="menu-title">{{ list.title }}<i class="el-icon-arrow-right" v-if="activeIndex === list.id && !isCollapse"></i></span>
      </el-menu-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'mesAside',
  data () {
    return {
      activeIndex: '1000'
    }
  },
  props: {
    isCollapse: {
      type: Boolean
    }
  },
  computed: {
    ...mapGetters(['menuList'])
  },
  watch: {
    $route (val) {

    }
  },
  methods: {
    selectMenu (index) {
      this.activeIndex = index
    },
    choiceMenu (menu) {
      this.$emit('get-next-menus', menu)
    }
  }
}
</script>
