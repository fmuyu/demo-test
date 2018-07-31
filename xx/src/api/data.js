import axios from 'axios'

import uri from './config'



var url = {
 
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
/**
 * @desp 所有的接口都需要参数terminal:4 .country:1<中国,待定.>
 *     放在url的query参数里.
 */
var qs = require('qs');


/**
 * @desp 注意,后期需要优化此结构....
 */
export default {

  logout(){
    return axios({
      url: url.logout,
      method: 'post',
      withCredentials: true,
      params: {}
    })
  },




  /**
   * @desp 创建地址.
   */
  addAddress(addPrams){
    return axios({
      url:url.addAddr,
      method:'post',
      withCredentials:true,
      params:addPrams,
      headers:{
        'Content-Type':'application/x-www-form-urlencoded'
      }
    })
  }


}
