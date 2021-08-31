<template>
  <div>
    <swiper class="detail-swiper">
      <swiper-item v-for="item in topImages">
        <img :src="item" alt />
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperItem } from "components/common/swiper";

export default {
  name: "DetailSwiper",
  components: { Swiper, SwiperItem },
  props: {
    topImages: {
      type: Array,
      default() {
        return [];
      }
    }
  }
};
</script>

<style scoped>
/* @import url(); 引入css类 */
.detail-swiper {
  height: 300px;
  overflow: hidden;
}
</style>
