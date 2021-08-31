<template>
  <div class="cart">
    <!-- 导航 -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{ length }})</div>
    </nav-bar>

    <!-- 商品列表 -->
    <cart-list></cart-list>

    <!-- 底部汇总 -->
    <cart-button-bar></cart-button-bar>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import CartList from "./childComps/CartList";
import CartButtonBar from "./childComps/CartButtonBar";

import { mapGetters } from "vuex";

export default {
  name: "Shopcart",
  components: {
    NavBar,
    CartList,
    CartButtonBar
  },
  computed: {
    ...mapGetters({
      length: "cartLength"
      // list: "cartList"
    })

    // ...mapGetters(['cartLength','cartList'])

    // cartLength() {
    //   // return this.$store.state.cartList.length;
    //   return this.$store.getters.cartLength;
    // }
  }
};
</script>

<style scoped>
/* @import url(); 引入css类 */
.cart {
  height: 100vh;
}
.nav-bar {
  background-color: var(--color-tint);
  color: #fff;
  font-weight: 700;
}
</style>
