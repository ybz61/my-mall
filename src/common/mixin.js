import { debounce } from "./utils"

export const itemListenerMixin = {
  data () {
    return {
      itemImgListener: null
    }
  },
  mounted () {
    const refresh = debounce(this.$refs.scroll.refresh);
    this.itemImgListener = () => {
      // 在mounted生命周期函数中使用 this.$refs.scroll而不是created中
      refresh();
    };
    this.$bus.$on("itemImageLoad", this.itemImgListener);
    // console.log('我是混入的内容');
  },
  components: {},
  methods: {}
}

/* backTop 回到顶部的混入封装 */
export const backTopMixin = {
  data: function () {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backTop: function () {
      this.$refs.scroll.scrollTo(0, 0, 1000);
    }
  }
}
