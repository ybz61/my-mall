export default {
  // mutations 的唯一目的就是修改state的状态
  // mutations 中的每个方法尽可能完成的事件单一一点
  /*     addCart (state, payload) {
        // 1.查找之前数组中是否有该商品
        let oldProduct = state.cartList.find(item => item.iid === payload.iid)
  
        // 2.判断oldProduct
        if (oldProduct) {
          oldProduct.count += 1
        } else {
          payload.count = 1
          state.cartList.push(payload)
        }
      } */

  addCounter (state, payload) {
    payload.count++
  },
  addToCart (state, payload) {
    payload.checked = true
    state.cartList.push(payload)
  }
}
