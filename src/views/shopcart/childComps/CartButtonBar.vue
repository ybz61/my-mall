<template>
  <div class="button-bar">
    <!-- 全选/全不选按钮 -->
    <div class="check-content">
      <check-button
        class="check-button"
        :is-checked="isSelectAll"
        @click.native="checkClick"
      ></check-button>
      <span>全选</span>
    </div>

    <!-- 合计 -->
    <div class="price">合计:{{ totalPrice }}</div>

    <!-- 已选件数 -->
    <div class="calculate" @click="calcClick">已选:{{ checkLength }}</div>
  </div>
</template>

<script>
import CheckButton from "components/content/checkButton/CheckButton";

export default {
  name: "CartButtonBar",
  components: {
    CheckButton
  },
  computed: {
    totalPrice() {
      return (
        "￥" +
        this.$store.state.cartList
          .filter(item => {
            return item.checked;
          })
          .reduce((preValue, item) => {
            return preValue + item.price * item.count;
          }, 0)
          .toFixed(2)
      );
    },
    checkLength() {
      return this.$store.state.cartList.filter(item => item.checked).length;
    },
    isSelectAll() {
      //  return !(this.$store.state.cartList.filter(item => !item.checked).length)
      if (this.$store.state.cartList.length === 0) {
        return false;
      } else {
        /* 方法一：高阶函数find方法的使用 */
        return !this.$store.state.cartList.find(item => !item.checked);

        /* 方法二：普通遍历 */
        /*         for (let item of this.$store.state.cartList) {
          if(!item.checked){
            return false
          }
        }
        return true */
      }
    }
  },
  methods: {
    checkClick() {
      // console.log("---");
      if (this.isSelectAll) {
        // 全选
        this.$store.state.cartList.forEach(item => (item.checked = false));
      } else {
        // 部分或者全不选
        this.$store.state.cartList.forEach(item => (item.checked = true));
      }
    },
    calcClick() {
      if (!this.isSelectAll) {
        this.$toast.show("请选择购买的商品", 2000);
      }
    }
  }
};
</script>

<style scoped>
/* @import url(); 引入css类 */
.button-bar {
  position: relative;
  display: flex;
  height: 49px;
  line-height: 49px;
  background-color: #eee;
}

.check-content {
  display: flex;
  align-items: center;
  margin-left: 10px;
  width: 60px;
}

.check-button {
  width: 20px;
  height: 20px;
  line-height: 20px;
  margin-right: 5px;
}
.price {
  margin-left: 100px;
  flex: 1;
}
.calculate {
  width: 90px;
  background-color: #f01025;
  color: #fff;
  text-align: center;
}
</style>
