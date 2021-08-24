<template>
  <div>
    <nav-bar>
      <div slot="left" @click="backClick" class="back">
        <img src="~assets/img/common/back.svg" alt />
      </div>
      <div class="title" slot="center">
        <div
          class="title-item"
          v-for="(item, index) in titles"
          @click="itemClick(index)"
          :class="{ active: index === currentIndex }"
        >
          {{ item }}
        </div>
      </div>
    </nav-bar>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";

export default {
  name: "DetailNavBar",
  components: { NavBar },
  data() {
    return {
      titles: ["商品", "参数", "评论", "推荐"],
      currentIndex: 0
    };
  },
  methods: {
    backClick() {
      this.$router.back();
    },
    itemClick(index) {
      this.currentIndex = index;
    }
  },
  // 生命周期 - 创建完成（访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（访问DOM元素）
  mounted() {}
};
</script>

<style scoped>
/* @import url(); 引入css类 */
.title {
  display: flex;
  font-size: 13px;
}
.title-item {
  flex: 1;
}
.back {
  margin-top: 8px;
}
.active {
  color: var(--color-high-text);
}
</style>
