<template>
  <div>
    <detail-nav-bar></detail-nav-bar>
    <detail-swiper :topImages="topImages"></detail-swiper>
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";

import { getDetail } from "network/detail.js";


export default {
  name: "Detail",
  components: { DetailNavBar, DetailSwiper },
  data() {
    return {
      iid: null,
      res: null,
      topImages: []
    };
  },
  methods: {},
  // 生命周期 - 创建完成（访问当前this实例）
  created() {
    // 1 获取并保存传入的iid
    this.iid = this.$route.params.iid;
    // 2 根据iid 请求详细数据
    getDetail(this.iid).then(res => {
      console.log(res);
      // 获取顶部的图片轮播数据
      this.topImages = res.result.itemInfo.topImages
    })
  },
  // 生命周期 - 挂载完成（访问DOM元素）
  mounted() {}
};
</script>

<style scoped>
/* @import url(); 引入css类 */
</style>
