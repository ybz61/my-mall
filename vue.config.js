module.exports = {
  configureWebpack: {
    resolve: {
      /* extensions 扩展名后缀省略的配置 这里已默认配置过 */
      // extensions: ['.js' , '.css' , '.vue'],
      
      /* alias 别名的配置 */
      alias: {
        // '@': 'src', /* 这里已默认配置过 */
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views'
      }
    }
  }
}
