import axios from 'axios'

export function request (config) {
  // 1 创建axios的实例
  const instance = axios.create({
    baseURL: 'http://152.136.185.210:7878/api/m5',
    timeout: 5000
  })

  // 2 axios的拦截器 interceptors
  // 2.1请求拦截的过程
  instance.interceptors.request.use(config => {
    //  console.log(config);
    return config
  }, err => {
    //  console.log(err);
  })

  //  2.2响应拦截的过程
  instance.interceptors.response.use(res => {
    return res.data
  }, err => {
    console.log(err);
  })

  // 3 发送真正的网络请求
  // 本身返回的就是Promise  AxiosPromise
  return instance(config)
}
