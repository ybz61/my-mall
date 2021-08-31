<template>
  <div>
    <h2>Category</h2>
  </div>
</template>

<script>
// import BScroll from "better-scroll";

export default {
  name: "Category",
  data() {
    return {
      // scroll: null
    };
  },
  mounted() {
    // this.scroll = new BScroll(document.querySelector(".wrapper"), {});
  }
};
</script>

<style scoped>
/* @import url(); 引入css类 */
.wrapper {
  height: 150px;
  background-color: red;
  overflow: hidden;
  /* overflow-y: scroll; */
}
</style>
