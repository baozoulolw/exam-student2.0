<template>
	<view class="main">
		<view class="backgroung-color"></view>
		<van-nav-bar title="修改头像" left-text="返回" left-arrow @click-left="back()" />
		<view class="body">
			<view style="margin-bottom: 30rpx;">
				<van-image width="400" height="400" :src="url" />
			</view>
			<van-uploader :file-list="file" @after-read="afterRead">
				<view class="ubutton">更换头像</view>
				<!-- <van-button icon="photo" type="primary">更改头像</van-button> -->
			</van-uploader>
		</view>
	</view>
</template>

<script>
	import qs from 'qs'
	import FormData from 'static/formdata/formData.js'
	export default {
		data() {
			return {
				url: '',
				file: ''
			};
		},
		methods: {
			back() {
				uni.navigateBack();
			},
			async afterRead(event) {
				const {
					file
				} = event.detail;
				console.log(file)
				console.log(event)
				let avatar = new FormData();
				avatar.appendFile('avatar', file);
				console.log(avatar, '1111')
				let str = '\r\n--XXX' +
					'\r\nContent-Disposition: form-data; name="avatar"' +
					'\r\n' +
					'\r\n' + file +
					'\r\n--XXX';
				let res = await this.$post('/user/avatar/add', avatar);
				if (res.status === 1000) {
					let param = {
						avatar: res.data,
						id: uni.getStorageSync('user').id
					}
					let res1 = await this.$post('/user/edit', param);
					if (res1.status === 1000) {
						await this.updateSelfInfo();
					}
				} else {
					ElMessage.error(res.desc)
				}
			},
			async updateSelfInfo() {
				let res = await this.$get('/user/self');
				if (res.status === 1000) {
					this.url = res.data.avatarUrl;
				}
			}
		},
		onLoad(param) {
			console.log(param)
			this.url = param.url
		}
	}
</script>

<style lang="less" scoped>
	.main {

		.backgroung-color {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: black;
			; // 这个就是你想设置的背景颜色
			z-index: -1;
		}

		.body {
			margin-top: 30rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		.ubutton {
			color: white;
			width: 400rpx;
			height: 40px;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 6px;
			background: rgba(255, 255, 255, 0.2);
		}
	}
</style>
