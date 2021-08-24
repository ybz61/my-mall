<template>
  <div class="tab-bar-item" @click="itemClick">
    <!-- slot外层包装div，用来设置样式 -->
    <!-- 用div包裹着slot插槽，因为插槽始终会被替代，所以里面的属性就不复存在 -->
    <div v-if="!isActive">
      <slot name="item-icon"></slot>
    </div>
    <div v-else>
      <slot name="item-icon-active"></slot>
    </div>
    <div :style="activeStyle">
      <slot name="item-text"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "TabBarItem",
  props: {
    path: String,
    activeColor: {
      type: String,
      default: "#f10125"
    }
  },
  data () {
    return {
      // isActive: true,
    };
  },
  computed: {
    isActive () {
      return this.$route.path.indexOf(this.path) !== -1;
    },
    activeStyle () {
      return this.isActive ? { color: this.activeColor } : {};
    }
  },
  methods: {
    itemClick () {
      // console.log('itemClick');
      this.$router.replace(this.path);
    }
  }
};
</script>

<style scoped>
/* @import url(); 引入css类 */
.tab-bar-item {
  /* flex布局平分TabBar */
  flex: 1;
  text-align: center;
  height: 49px;
  font-size: 14px;
}

.tab-bar-item img {
  width: 24px;
  height: 24px;
  margin-top: 3px;
  vertical-align: middle;
  margin-bottom: 2px;
}
</style>
