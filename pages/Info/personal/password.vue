<template>
	<view class="main">
		<van-toast id="van-toast" />
		<van-nav-bar title="密码修改" left-text="返回" left-arrow @click-left="back()" />
		<view class="backgroung-color"></view>
		<van-cell-group>
			<van-field :model:value="one" label="新密码" @blur='oneBlur' :error-message="oneError"/>
			<van-field :model:value="two" label="再次输入" :error-message="twoError" :border="false" @blur='twoBlur' />
		</van-cell-group>
		<van-button plain type="primary" style='position: relative;top: 100rpx;left: 600rpx;'
			@click="confirm()">确定</van-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				one: '',
				oneError:'',
				two: '',
				twoError:''
			};
		},
		methods: {
			back() {
				uni.navigateBack();
			},
			oneBlur() {
				if(this.one.trim() === ''){
					this.oneError = '请输入新密码';
					return;
				}
				let reg = /^(\w){6,20}$/;
				if (!reg.test(this.one)) {
					this.oneError = '请输入6-20个字母、数字、下划线的字符串'
					return;
				}
				this.oneError = '';
			},
			twoBlur() {
				if(this.two.trim() === ''){
					this.twoError = '请再此输入新密码';
					return;
				}
				if(this.two !== this.one){
					this.twoError = '请输入与第一次相同的密码';
					return;
				}
				this.twoError = '';
			},
			async confirm(){
				if(this.twoError !=='' || this.oneError !== ''){
					return;
				}
				let res = await this.$post('/user/edit/password',{password:this.one});
				      if(res.status === 1000){
				        this.$toast.success({
				        	message:'修改成功',
				        	duration: 0, // 持续展示 toast
				        	forbidClick: true,
				        });
				        setTimeout(() => {
				        	this.$toast.clear();
				        	uni.removeStorageSync('user');
				        	uni.removeStorageSync('token');
				        	uni.reLaunch({
				        		url:'../login/login'
				        	})
				        },3000)
				      }else{
				        ElMessage.error(res.desc)
				      }
			}
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
			background: #ff7675;
			; // 这个就是你想设置的背景颜色
			z-index: -1;
		}
	}
</style>
