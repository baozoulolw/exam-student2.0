<template>
	<view class="main">
		<van-cell-group inset custom-class='type-item'>
			<van-cell :border="false" use-label-slot>
				<view slot="label" class="info-head">
					<van-image width="70" height="70" :src="userInfo.avatarUrl" class='avatar' />
					<view class="name">
						<view class="realname">{{userInfo.realName}}</view>
						<view class="username">{{`用户名:${userInfo.username}`}}</view>
					</view>
				</view>
			</van-cell>
		</van-cell-group>
		<view style="height: 20px;"></view>
		<van-cell-group inset custom-class='type-item'>
			<van-cell :border="false" use-label-slot>
				<view slot="label" class="info-head">
					<view>{{}}</view>
				</view>
			</van-cell>
		</van-cell-group>
		<view style="height: 20px;"></view>
		<van-cell-group inset>
			<van-cell title="个人资料" icon="clock-o" is-link 
			url="/pages/Info/personal/personal"/>
			<van-cell title="修改密码" icon="clock-o" is-link 
			url="/pages/Info/personal/password"/>
		</van-cell-group>
		<view style="height: 20px;"></view>
		<van-button type="warning" class='logout' @click='logout'>退出登录</van-button>
	</view>
</template>

<script>
	export default {
		name: "Self",
		data() {
			return {
				data: 11234
			};
		},
		computed: {
			userInfo() {
				console.log(uni.getStorageSync('user'))
				return uni.getStorageSync('user');
			}
		},
		methods:{
			logout(){
				this.$dialog.confirm({
				  title: '提示',
				  message: '确认退出登录？',
				})
				  .then(() => {
				    uni.removeStorageSync('user');
				    uni.removeStorageSync('token');
					uni.reLaunch({
						url:'../login/login'
					})
				  })
				  .catch(() => {
				    // on cancel
				  });
			}
		}
	}
</script>

<style lang="less" scoped>
	.main {
		display: flex;
		flex-direction: column;
		.info-head {
			display: flex;
			height: 180rpx;
			align-items: center;

			.avatar {
				margin-right: 50rpx;
				border-radius: 10px;

				/deep/image {
					border-radius: 7px;
				}
			}

			.name {
				.realname {
					margin-bottom: 30rpx;
					font-size: 35rpx;
					color: black;
					font-weight: bold;
				}

				.username {
					font-size: 30rpx;
				}
			}
		}
		.logout{
			align-self: center;
			width: 90%;
			/deep/button{
				    width: 100%;
				    border-radius: 10px;
			}
		}
	}
</style>
