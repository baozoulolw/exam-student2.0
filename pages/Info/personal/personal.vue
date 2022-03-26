<template>
	<view class='main'>
		<van-nav-bar
		  title="个人资料"
		  left-text="返回"
		  left-arrow
		  @click-left="back()"
		/>
		<view class="backgroung-color"></view>
		<view style="height:40rpx"></view>
		<van-cell title="头像" is-link :url="'./avatar?url='+ showUser.avatarUrl"/>
		<!-- <van-cell title='姓名' :value='showUser.realName' is-link @click='realnameShow'></van-cell>
		<van-cell title='性别' :value='showUser.gender' is-link @click='realnameShow'></van-cell>
		<van-cell title='住址' :value='showAddress' is-link @click='realnameShow'></van-cell>
		<van-cell title='电话号码' :value='showUser.phone' is-link @click='realnameShow'></van-cell>
		<van-cell title='电子邮箱' :value='showUser.email' is-link @click='realnameShow'> -->
		</van-cell>
		<van-cell is-link @click='realnameShow'>
			<view slot="title" style="display: flex;">
				<view class="van-cell-text" style="margin-right: 120rpx;">姓名</view>
				<text>{{showUser.realName}}</text>
			</view>
		</van-cell>
		<van-popup :show="namePopShow" position="bottom" closeable custom-style="height: 40%;" @close="relaNameClose">
			<view style="height: 100rpx;"></view>
			<van-cell-group>
				<van-field :model:value="editUser.realName" placeholder="请输入姓名" :border="false" />
			</van-cell-group>
			<van-button plain type="primary" style='position: relative;top: 100rpx;left: 600rpx;'
				@click="confirm('realName')">确定</van-button>
		</van-popup>
		<van-cell is-link @click='genderSelect=true'>
			<view slot="title" style="display: flex;">
				<view class="van-cell-text" style="margin-right: 120rpx;">性别</view>
				<text>{{showUser.gender}}</text>
			</view>
		</van-cell>
		<van-action-sheet :show="genderSelect" :actions="genderActions" cancel-text="取消" @close="genderOnClose"
			@cancel="genderOnClose" @select='genderSelected'/>
		<van-cell is-link>
			<view slot="title" style="display: flex;">
				<view class="van-cell-text" style="margin-right: 120rpx;">住址</view>
				<text>{{showAddress}}</text>
			</view>
		</van-cell>
		<van-cell is-link @click='phoneShow'>
			<view slot="title" style="display: flex;">
				<view class="van-cell-text" style="margin-right: 70rpx;">电话号码</view>
				<text>{{showUser.phone}}</text>
			</view>
		</van-cell>
		<van-popup :show="phonePopShow" position="bottom" closeable custom-style="height: 40%;" @close="phoneClose">
			<view style="height: 100rpx;"></view>
			<van-cell-group>
				<van-field :model:value="editUser.phone" placeholder="请输入电话" :border="false" />
			</van-cell-group>
			<van-button plain type="primary" style='position: relative;top: 100rpx;left: 600rpx;'
				@click="confirm('phone')">确定</van-button>
		</van-popup>
		<van-cell is-link @click='emailShow'>
			<view slot="title" style="display: flex;">
				<view class="van-cell-text" style="margin-right: 70rpx;">电子邮箱</view>
				<text>{{showUser.email}}</text>
			</view>
		</van-cell>
		<van-popup :show="emailPopShow" position="bottom" closeable custom-style="height: 40%;" @close="emailClose">
			<view style="height: 100rpx;"></view>
			<van-cell-group>
				<van-field :model:value="editUser.email" placeholder="请输入邮箱" :border="false" />
			</van-cell-group>
			<van-button plain type="primary" style='position: relative;top: 100rpx;left: 600rpx;'
				@click="confirm('email')">确定</van-button>
		</van-popup>
	</view>
</template>

<script>
	import { areaList } from '@vant/area-data';
	import {regionData, CodeToText} from 'element-china-area-data'
	
	export default {
		data() {
			return {
				showUser: {
					avatar: '',
					realName: '',
					gender: '',
					email: '',
					phone: '',
					address: '',
					id: '',
					username: '',
					avatarUrl:''
				},
				editUser: {},
				genderSelect: false,
				namePopShow: false,
				phonePopShow: false,
				emailPopShow: false,
				genderActions: [{
						name: '男',
					},
					{
						name: '女',
					}
				],
				areaList,
				regionData,
				CodeToText,
				showAddress:''
			};
		},
		computed:{
		},
		methods: {
			back(){
				uni.navigateBack();
			},
			async getSelfInfo() {
				let res = await this.$get('/user/self');
				if (res.status === 1000) {
					let {
						avatar,
						realName,
						gender,
						email,
						phone,
						address,
						id,
						username,
						avatarUrl
					} = res.data;
					this.showUser = {
						avatar,
						realName,
						gender,
						email,
						phone,
						id,
						username,
						avatarUrl
					};
					this.showAddress = this.getAdressString(JSON.parse(address));
					this.$set(this.showUser,'address',JSON.parse(address));
					this.editUser = JSON.parse(JSON.stringify(this.showUser));
				} else {
					ElMessage.error(res.desc);
				}
			},
			genderOnClose() {
				this.genderSelect = false;
			},
			genderSelected(val){
				this.editUser.gender = val.detail.name;
				this.confirm('gender');
			},
			getAdressString(arr){
				if (arr.length === 0) {
				  return '---'
				} else {
				  return arr.reduce((p, i) => p += this.CodeToText[i], '');
				}
			},
			relaNameClose() {
				this.namePopShow = false;
			},
			realnameShow() {
				this.namePopShow = true;
				this.editUser.realName = JSON.parse(JSON.stringify(this.showUser.realName));
			},
			phoneClose() {
				this.phonePopShow = false;
			},
			phoneShow() {
				this.phonePopShow = true;
				this.editUser.realName = JSON.parse(JSON.stringify(this.showUser.phone));
			},
			emailClose() {
				this.emailPopShow = false;
			},
			emailShow() {
				this.emailPopShow = true;
				this.editUser.realName = JSON.parse(JSON.stringify(this.showUser.email));
			},
			async confirm(key) {
				let param = {
					[key]: this.editUser[key],
					id: this.editUser.id
				}
				let res = await this.$post('/user/edit', param);
				if (res.status === 1000) {
					this.getSelfInfo();
					this.closeEdit();
				}
			},
			closeEdit() {
				this.genderSelect = false;
				this.namePopShow = false;
				this.phonePopShow = false;
				this.emailPopShow = false;
			}
		},
		onShow() {
			this.getSelfInfo();
		},
		async onPullDownRefresh() {
			await this.getSelfInfo();
			uni.stopPullDownRefresh();
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
