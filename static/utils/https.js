import Vue from 'vue'
import axios from 'axios'
import Notify from './../../wxcomponents/vant/notify/notify';
import qs from 'qs'

const instance = axios.create({
  baseURL:'http://192.168.31.67:8282',
  //baseURL:'http://localhost:8282',
  //baseURL:'http://10.10.49.3:8282',
  timeout:6000,
  crossDomain: true,
  'Content-type': 'application/json;charset=UTF-8'
})

instance.interceptors.request.use(config => {
  //showLoading()
  if (uni.getStorageSync('token')) config.headers.Authorization = uni.getStorageSync('token')
  // if (config.method === 'post') {
  //   config.data = qs.stringify(config.data);
  //   console.log(config.data);
  // }
  return config;
}, error =>{
  // 对请求错误做些什么
  Promise.reject(error);
  })
  
  //配置成功后的拦截器
   //响应拦截器
 instance.interceptors.response.use((response) => {
   return response.data;
 }, error => {
   console.log(error)
   //响应错误
   if (error.response && error.response.status) {
       const status = error.response.status
       let message;
       switch (status) {
           case 400:
               message.error('请求错误');
               break;
           case 401:
               message.error('请求错误')
               break;
           case 404:
               message.error('请求地址出错')
               break;
           case 408:
               message.error('请求超时')
               break;
           case 500:
               message.error('服务器内部错误!')
               break;
           case 501:
               message.error('服务未实现!')
               break;
           case 502:
               message.error('网关错误!')
               break;
           case 503:
               message.error('服务不可用!')
               break;
           case 504:
               message.error('网关超时!')
               break;
           case 505:
               message.error('HTTP版本不受支持')
               break;
           default:
               message.error('请求失败')
       }
	   //this.$notify({ type: 'danger', message});
       //ElMessage.error(message);
       return Promise.reject(error);
   }
   return Promise.reject(error);
 });
 
 instance.defaults.adapter = function(config) {
 	return new Promise((resolve, reject) => {
 		//console.log(config)
 		var settle = require('axios/lib/core/settle');
 		var buildURL = require('axios/lib/helpers/buildURL');
 		uni.request({
 			method: config.method.toUpperCase(),
 			url: config.baseURL + buildURL(config.url, config.params, config.paramsSerializer),
 			header: config.headers,
 			data: config.data,
 			dataType: config.dataType,
 			responseType: config.responseType,
 			sslVerify: config.sslVerify,
 			complete: function complete(response) {
 				//console.log("执行完成：", response)
 				response = {
 					data: response.data,
 					status: response.statusCode,
 					errMsg: response.errMsg,
 					header: response.header,
 					config: config
 				};
  
 				settle(resolve, reject, response);
 			}
 		})
 	})
 }

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

 export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    instance.get(url, params
    ).then(response => {
      resolve(response);
    }).catch(err => {
      reject(err);
    });
  });
}

/**
 * 封装post方法
 * @param url
 * @param data
 * @returns {Promise}
 */

 export function post(url, params = {}) {
  return new Promise((resolve, reject) => {
    instance.post(url,params
    ).then(response => {
      resolve(response);
    }).catch(err => {
      reject(err);
    });
  });
}