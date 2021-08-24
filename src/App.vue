<template>
  <div id="app">
    <keep-alive exclude="Detail">
      <router-view />
    </keep-alive>
    <main-tab-bar />
  </div>
</template>

<script>
import MainTabBar from "components/content/mainTabBar/MainTabBar.vue";
export default {
  name: "App",
  components: {
    MainTabBar
  }
};
</script>

<style scoped>
/* @import url(); 引入css类 */
@import url("assets/css/base.css");
</style>
