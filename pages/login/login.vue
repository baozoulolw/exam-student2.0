<template>
	<view class="main">
		<van-notify id="van-notify" />
		<van-toast id="van-toast" />
		<van-image width="350" height="300" :src="src" />
		<text class="title">Login</text>
		<view class="username">
			<van-field left-icon='manager-o' :model:value="username" placeholder="请输入用户名" @change='usernameChange'/>
		</view>
		<view class="password">
			<van-field password left-icon='closed-eye' :model:value="password" placeholder="请输入密码" @change='passwordChange'/>
		</view>
		<van-button type="primary" @click="toLogin" class="btn">登录</van-button>
	</view>
</template>

<script>
	import study from './../../static/img/study.jpeg'
	import qs from 'qs'
	export default {
		data() {
			return {
				src: study,
				username: 'Baozoulolw',
				password: 'w2380758345'
			};
		},
		methods:{
			passwordChange(val){
				this.password = val.detail;
			},
			usernameChange(val){
				this.username = val.detail;
			},
			async toLogin(){
				let param = {
					username:this.username,
					password:this.password
				}
				const toast = this.$toast.loading({
				  message: '加载中...',
				  duration: 0, // 持续展示 toast
				  message: '加载中',
				  forbidClick: true,
				});
				let res = await this.$post('/login?platform=student', qs.stringify(param));
				this.$toast.clear(toast);
				if (res.status === 2000) {
				    //将token存入Storage
					uni.setStorageSync('token',res.data.token);
					res.data.user.id = res.data.id;
					res.data.user.operUser = res.data.operuser;
					uni.setStorageSync('user',res.data.user);
				    /* Cookies.set('token', res.data.token);
				    res.data.user.id = res.data.id;
				    res.data.user.operUser = res.data.operuser;
				    //将登录用户信息序列化进localStorage 和 vuex
				    localStorage.setItem('user', JSON.stringify(res.data.user));
				    await $store.dispatch('setUserInfo', res.data.user);
				    let path = data.radio === 'student' ? '/student_home' : '/manage_home';
				    // 将当前登录平台存入cookie
				    Cookies.set('platform', data.radio); */
				    //await router.push({path});
					//this.$notify({ type: 'success', message: '登录成功',safeAreaInsetTop:true});
					this.$toast.success('登录成功');
					uni.switchTab({
						url:'../main/main'
					})
				  } else {
					this.$toast.fail(res.desc);
					//this.$notify({ type: 'warning', message: res.desc ,safeAreaInsetTop:true});
				  }
			}
		}
	}
</script>

<style scoped lang="less">
	.main {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 170rpx;

		.img {
			margin-bottom: 20rpx;
		}

		.title {
			align-self: flex-start;
			font-weight: bold;
			font-size: 50rpx;
			margin-left: 60rpx;
			margin-bottom: 30rpx;
		}
		.username,.password{
			margin-bottom: 20px;
			width: 90%;
			/deep/ .van-field__control{
				margin-left: 30rpx;
			}
		}
		.password{
			margin-bottom: 45rpx;
		}
		.btn{
			width: 90%;
			/deep/.van-button{
				width: 100%;
				border-radius: 10px;
			}
		}
	}
</style>
