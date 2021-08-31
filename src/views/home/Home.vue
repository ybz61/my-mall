<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control
      :titles="['流行', '新款', '精选']"
      @tabClick="tabClick"
      ref="tabControl1"
      class="tab-control"
      v-show="isTabFixed"
    />
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
      :pull-up-load="true"
      @pullingUp="loadMore"
    >
      <home-swiper
        :banners="banners"
        @swiperImageLoad="swiperImageLoad"
      ></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl2"
      ></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
/* 按顺序导入 */
/* 相同性质的导入放到一块 */
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";
import BackTop from "components/content/backTop/BackTop";

import { getHomeMultidata, getHomeGoods } from "network/home";
import { debounce } from "common/utils";
import { itemListenerMixin } from "common/mixin";
import { BACKTOP_DISTANCE } from "common/const";

export default {
  name: "Home",
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  },
  // 混入
  mixins: [itemListenerMixin],
  data() {
    return {
      // result: null
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] }
      },
      currentType: "pop",
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0
    };
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    }
  },
  // 生命周期 - 首页组件创建完成（访问当前this实例）
  created() {
    // 1.请求多个数据
    this.getHomeMultidata();

    // 2.请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },
  // 生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    // 1.监听item中的图片加载完成
    // img标签虽然已经被挂载，但其中图片还没有占据高度
    // this.$refs.scroll.refresh 对这个函数进行防抖操作
    // const refresh = debounce(this.$refs.scroll.refresh);
    // this.itemImgListener = () => {
    //   // 在mounted生命周期函数中使用 this.$refs.scroll而不是created中
    //   // this.$refs.scroll.refresh();
    //   refresh();
    // };
    // this.$bus.$on("itemImageLoad", this.itemImgListener);
    // 2.获取tabControl的offsetTop
    // 所有的组件都有一个属性 $el：用于获取组件中的元素
    // console.log(this.$refs.tabControl);   /* 取到组件VueComponent {_uid: 18, _isVue: true, $options: {…}, _renderProxy: Proxy, _self: VueComponent, …} */
    // console.log(this.$refs.tabControl.offsetTop);   /* undefined */
    // console.log(this.$refs.tabControl.$el); /* 获取到tabControl中的元素 */
    // console.log(this.$refs.tabControl.$el.offsetTop);
  },
  destroyed() {
    // <keep-alive><router-view /></keep-alive>
    console.log("home destroyed");
  },
  activated() {
    // 设置离开时的位置
    // console.log("activated");
    this.$refs.scroll.scrollTo(0, this.saveY, 0);
    this.$refs.scroll.refresh();
  },
  deactivated() {
    // 记录离开时的位置
    // console.log("deactivated");
    // 1 保存Y值
    this.saveY = this.$refs.scroll.getScrollY();

    // 2 取消全局事件的监听
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  },
  methods: {
    /* 
    事件监听相关方法
    */
    tabClick(index) {
      //  console.log(index);
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },
    backClick() {
      // console.log('backClick');
      this.$refs.scroll.scrollTo(0, 0, 1000);
    },
    contentScroll(position) {
      // console.log(position);
      // 1.判断BackTop是否显示
      this.isShowBackTop = -position.y >= BACKTOP_DISTANCE;
      // 2.决定tabControl是否吸顶(position：fixed)
      this.isTabFixed = -position.y >= this.tabOffsetTop;
    },
    loadMore() {
      // console.log("上拉加载更多");
      this.getHomeGoods(this.currentType);
      this.$refs.scroll.refresh();
    },
    swiperImageLoad() {
      // console.log(this.$refs.tabControl.$el.offsetTop);
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },

    /* 
    网络请求相关方法
    */
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        // console.log(res);
        // console.log(res.data);
        // this.result = res;
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then(res => {
        // console.log(res);console.log(res.data);
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;

        // 完成上拉加载更多，才能继续进行上拉加载
        this.$refs.scroll.finishPullUp();
      });
    }
  }
};
</script>

<style scoped>
/* @import url(); 引入css类 */
#home {
  /* padding-top: 44px; */
  height: 100vh;
  position: relative;
}

.home-nav {
  background-color: var(--color-tint);
  color: #fff;
  position: relative;
  z-index: 9;
}

.tab-control {
  position: relative;
  z-index: 9;
}

.content {
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
</style>
