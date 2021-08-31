<template>
  <nav-bar>
    <div slot="left" @click="backClick" class="back">
      <img src="~assets/img/common/back.svg" alt />
    </div>
    <div class="title" slot="center">
      <div
        class="title-item"
        v-for="(item, index) in titleInfos"
        :key="index"
        @click="itemClick(index)"
        :class="{ active: index === currentIndex }"
      >
        {{ item }}
      </div>
    </div>
  </nav-bar>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";

export default {
  name: "DetailNavBar",
  components: { NavBar },
  // props: {
  //   titleInfos: {
  //     type: Array,
  //     default: () => {
  //       return ["商品", "参数", "评论", "推荐"];
  //     }
  //   },
  //   currentIndex: {
  //     type: Number,
  //     default: 0
  //   }
  // },
  data() {
    return {
      titleInfos: ["商品", "参数", "评论", "推荐"],
      currentIndex: 0
    };
  },
  methods: {
    backClick() {
      this.$router.back();
    },
    itemClick(index) {
      this.currentIndex = index;
      this.$emit("itemClick", index);
    }
  }
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
