<template>
  <el-scrollbar style="height:100%;">
    <div class="second-nav-title">{{ secondNavTitle }}</div>
    <el-menu class="menu-content" :default-active="secondActiveIndex" @select="selectMenu" unique-opened active-text-color="#3B6F9A">
      <template v-for="(item,i) in secondMenuList">
        <el-submenu :key="i" :index="item.id" v-if="item.children">
          <template slot="title">
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item v-for="(list,j) in item.children" :key="j" :index="list.id" @click="toPage(list)">{{ list.title }}</el-menu-item>
        </el-submenu>
        <el-menu-item :key="i" :index="item.id" v-else @click="toPage(item)">
          <span slot="title">{{ item.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script>
export default {
  data () {
    return {
      secondActiveIndex: ''
    }
  },
  props: {
    secondMenuList: Array,
    secondNavTitle: String
  },
  methods: {
    selectMenu (index) {
      this.secondActiveIndex = index
    },
    toPage (info) {
      if (info.url) {
        this.$router.push(info.url)
      }
    }
  }
}
</script>
