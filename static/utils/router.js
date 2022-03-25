// router.js
import {
	RouterMount,
	createRouter
} from 'uni-simple-router';
import Notify from './../../wxcomponents/vant/notify/notify';
const routes = [

]
const router = createRouter({
	platform: process.env.VUE_APP_PLATFORM,
	routes: [...ROUTES],
	applet: {
		animationDuration: 300 //默认 300ms  v2.0.6+
	},
});
//手动跳转的页面白名单
const whiteList = ['/pages/login/login', '/404', '/403'];
//全局路由前置守卫
router.beforeEach((to, from, next) => {
	//document.title = `Admin Frame | ${to.meta.title}`; //添加title
	const user = uni.getStorageSync('token'); //获取token to.path !== '/login'
	//NProgress.start();// 路由跳转前钩子函数中 - 执行进度条开始加载
	if (user) {
		if (to.path === '/') {
			next();
		} else {
			next();
		}
	} else {
		if (whiteList.includes(to.path)) { //如果是白名单无须token则直接进入
			next();
		} else {
			Notify({
				type: 'danger',
				message:'无登陆凭证,无法访问,请先登陆!'
			});
			next('pages/login/login')
		}
	}
});
// 全局路由后置守卫
router.afterEach((to, from) => {
	console.log('跳转结束')
})

export {
	router,
	RouterMount
}
