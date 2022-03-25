<template>
	<view class="main">
		<van-cell-group inset custom-class='type-item'>
			<van-cell title="定时考试" icon="clock-o" is-link url='./PlanList?specifyTime=1'/>
			<van-cell :border="false" use-label-slot>
				<view slot="label">
					<view class="van-cell-text">正在进行中: {{onScheDule.length}}</view>
					<view class="van-cell-text">未开始: {{timingNotStarted.length}}</view>
				</view>
			</van-cell>
		</van-cell-group>
		<view style="height: 20px;"></view>
		<van-cell-group inset>
			<van-cell title="限时任务" icon="clock-o" is-link url='./PlanList?specifyTime=0'/>
			<van-cell :border="false" use-label-slot>
				<view slot="label">
					<!-- <view class="van-cell-text">正在进行中：0</view> -->
					<view class="van-cell-text">待完成: {{timingIncomplete.length}}</view>
				</view>
			</van-cell>
		</van-cell-group>
	</view>
</template>

<script>
	export default {
		name: "examPlan",
		data() {
			return {
				// 定时进行中
				onScheDule:[],
				// 未定时待完成
				timingIncomplete:[],
				// 定时未开始
				timingNotStarted:[]
			};
		},
		methods: {
			async getPlans() {
				const toast = this.$toast.loading({
				  duration: 0, // 持续展示 toast
				  forbidClick: true,
				  message: '加载中',
				  selector: '#custom-selector',
				});
				let res = await this.$get('/exam/one?specifyTime=')
				this.$toast.clear(toast);
				if(res.status === 1000){
					this.onScheDule = res.data.onSchedule
					this.timingIncomplete = res.data.timingIncomplete
					this.timingNotStarted = res.data.timingNotStarted
				}
			}
		},
		mounted() {
			this.getPlans();
		},
	}
</script>

<style lang="less" scoped>
	.main {
		.type-item {
			margin-bottom: 12rpx;
		}
	}
</style>
