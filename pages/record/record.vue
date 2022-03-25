<template>
	<view class="main">
		<van-toast id="van-toast" />
		<view class="backgroung-color"></view>
		<view style="margin-bottom: 30rpx;" v-for='item in records' :key='item.id'>
			<van-cell-group inset>
				<van-cell :title="item.exam.examName" value="详情" is-link :url="'./recordInfo?examId='+item.exam.id"/>
				<van-cell :border="false" use-label-slot>
					<view slot="label">
						<view class="van-cell-text">状态：{{item.marking === 0 ? '已阅':'待阅卷'}}</view>
						<view class="van-cell-text">分数：{{item.marking === 0 ? item.score:'---'}}</view>
						<view class="van-cell-text" v-if='item.marking === 0'>结果: {{item.score >= item.exam.score ? '通过':'未通过'}}</view>
						<view class="van-cell-text">开始考试时间: {{item.beginTime}}</view>
						<view class="van-cell-text">交卷时间: {{item.endTime}}</view>
					</view>
				</van-cell>
			</van-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				records:[]
			};
		},
		methods: {
			async getSelfAllRecord() {
				const toast = this.$toast.loading({
				  duration: 0, // 持续展示 toast
				  forbidClick: true
				});
				let params = {
					pageNumber: 1,
					pageSize: 99999,
					param: {
						userId: uni.getStorageInfoSync('user').id
					}
				};
				let res = await this.$post('/exam/record/list', params);
				if (res.status === 1000) {
					this.records = res.data.list;
				}
				toast.clear();
			}
		},
		onPullDownRefresh() {
			this.getSelfAllRecord();
		},
		onShow(){
			this.getSelfAllRecord();
		}
	}
</script>

<style lang="less" scoped>
	.main {
		padding-top: 150rpx;

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
