<template>
  <div id="detail">
    <detail-nav-bar
      class="detail-nav"
      @itemClick="itemClick"
      ref="nav"
    ></detail-nav-bar>

    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
    >
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info
        :detail-info="detailInfo"
        @imageLoad="imageLoad"
      ></detail-goods-info>
      <detail-param-info
        :param-info="paramInfo"
        ref="param"
      ></detail-param-info>
      <detail-comment-info
        :comment-info="commentInfo"
        ref="comment"
      ></detail-comment-info>
      <goods-list :goods="recommends" ref="recommend"></goods-list>
    </scroll>
    <detail-button-bar @addCart="addToCart"></detail-button-bar>

    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>

    <!-- <toast message="我是吐司" :message="message" :show="show"></toast> -->
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailButtonBar from "./childComps/DetailButtonBar";

import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";
import BackTop from "components/content/backTop/BackTop";
// import Toast from "components/common/toast/Toast";

import {
  getDetail,
  Goods,
  Shop,
  GoodsParam,
  getRecommend
} from "network/detail";
import { debounce } from "common/utils";
import { itemListenerMixin } from "common/mixin";
import { BACKTOP_DISTANCE } from "common/const";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,
    DetailButtonBar,
    BackTop
    // Toast
  },
  // 混入
  mixins: [itemListenerMixin],
  data() {
    return {
      iid: null,
      res: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopsY: [],
      getThemeTopsY: null,
      currentIndex: 0,
      isShowBackTop: false
      // message: "",
      // show: false
    };
  },
  methods: {
    imageLoad() {
      this.$refs.scroll.refresh();
      this.getThemeTopsY();
    },
    itemClick(index) {
      // console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopsY[index], 1000);
    },
    contentScroll(position) {
      // console.log(position);

      // 1 获取y值
      const positionY = -position.y;

      // 2 positionY 和主题内容中的值 进行对比
      // [0,7938,9120,9452]

      // positionY 在 0 和 7938 之间 ， index = 0
      // positionY 在 7938 和 9120 之间 ， index = 1
      // positionY 在 9120 和 9452 之间 ， index = 2

      // positionY 超过 9452 ， index = 3

      /* 1 普通做法 */
      let length = this.themeTopsY.length;
      for (let i = 0; i < length; i++) {
        if (
          this.currentIndex !== i &&
          ((i < length - 1 &&
            positionY >= this.themeTopsY[i] &&
            positionY < this.themeTopsY[i + 1]) ||
            (i === length - 1 && positionY >= this.themeTopsY[i]))
        ) {
          this.currentIndex = i;
          // console.log(this.currentIndex);
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }

      /* hack 做法 */
      // let length = this.themeTopsY.length;
      // for (let i = 0; i < length - 1; i++) {
      //   if (
      //     this.currentIndex !== i && ( positionY >= this.themeTopsY[i] && positionY < this.themeTopsY[i + 1] )
      //   ) {
      //     this.currentIndex = i;
      //     this.$refs.nav.currentIndex = this.currentIndex;
      //   }
      // }

      // 3.判断BackTop是否显示
      this.isShowBackTop = -position.y >= BACKTOP_DISTANCE;
    },
    backClick() {
      // console.log('backClick');
      this.$refs.scroll.scrollTo(0, 0, 1000);
    },
    addToCart() {
      // 1.获取购物车需要展示的信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;
      // 2.将商品添加到购物车里
      // this.$store.cartList.push(product)
      // this.$store.commit("addCart", product);
      this.$store.dispatch("addCart", product).then(res => {
        // console.log(res);
        // this.show = true;
        // this.message = res;

        // setTimeout(() => {
        //   this.show = false;
        //   this.message = "";
        // }, 2000);
        this.$toast.show(res);
      });
    }
  },
  // 生命周期 - 创建完成（访问当前this实例）
  created() {
    // 1 获取并保存传入的iid
    this.iid = this.$route.params.iid;

    // 2 根据iid 请求详细数据
    getDetail(this.iid).then(res => {
      // console.log(res);
      // 2.1.获取顶部的图片轮播数据
      const data = res.result;
      this.topImages = data.itemInfo.topImages;

      // 2.2.获取商品信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      // 2.3.创建店铺信息的对象,获取店铺信息
      this.shop = new Shop(data.shopInfo);

      // 2.4.获取详细信息detailInfo
      this.detailInfo = data.detailInfo;

      // 2.5.获取参数信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );

      // 2.6.获取评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }

      // 第一次获取:值不对 原因：this.$refs.param.$el还没有渲染完
      /*       this.themeTopsY = [];
      this.themeTopsY.push(0);
      this.themeTopsY.push(this.$refs.param.$el.offsetTop);
      this.themeTopsY.push(this.$refs.comment.$el.offsetTop);
      this.themeTopsY.push(this.$refs.recommend.$el.offsetTop);

      console.log(this.themeTopsY); */

      // 第二次获取：值不对 需要手动刷新
      // 原因：img图片还没有加载完成
      // offsetTop值不对的原因：大部分与图片加载有关
      /*       this.$nextTick(() => {
        this.themeTopsY = [];
        this.themeTopsY.push(0);
        this.themeTopsY.push(this.$refs.param.$el.offsetTop);
        this.themeTopsY.push(this.$refs.comment.$el.offsetTop);
        this.themeTopsY.push(this.$refs.recommend.$el.offsetTop);

        console.log(this.themeTopsY);
      }); */
    });

    // 3 请求推荐数据
    getRecommend().then(res => {
      // console.log(res);
      this.recommends = res.data.list;
    });

    // 4 给getThemeTopsY赋值
    // 对给getThemeTopsY赋值的操作进行防抖
    this.getThemeTopsY = debounce(() => {
      this.themeTopsY = [];
      this.themeTopsY.push(0);
      this.themeTopsY.push(this.$refs.param.$el.offsetTop);
      this.themeTopsY.push(this.$refs.comment.$el.offsetTop);
      this.themeTopsY.push(this.$refs.recommend.$el.offsetTop);

      // console.log(this.themeTopsY);
    }, 100);
  },
  // 生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    // const refresh = debounce(this.$refs.scroll.refresh);
    // this.itemImgListener = () => {
    //   // 在mounted生命周期函数中使用 this.$refs.scroll而不是created中
    //   refresh();
    // };
    // this.$bus.$on("itemImageLoad", this.itemImgListener);
  },
  // 生命周期 - 销毁
  destroyed() {
    // 取消全局事件的监听 取消的地方不一样
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  }
};
</script>

<style scoped>
/* @import url(); 引入css类 */
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.content {
  /* height: calc(100% - 44px); */
  position: absolute;
  top: 44px;
  bottom: 58px;
  left: 0;
  right: 0;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}
</style>
