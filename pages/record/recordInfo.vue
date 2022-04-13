<template>
	<view class="main">
		<van-toast id="van-toast" />
		<view class="backgroung-color"></view>
		<van-nav-bar
		  title="考试详情"
		  left-text="返回"
		  left-arrow
		  @click-left="back()"
		/>
		<view style="height: 30rpx;"></view>
		<van-cell-group>
		  <van-cell title="考试信息" />
		  <van-cell title="考试名称" :value="record.exam.examName" />
		  <van-cell title="类型" :value="record.exam.specifyTime ? '不定时':'定时'" />
		  <van-cell title="考试时长" :value="record.exam.duration+'分钟'" />
		  <van-cell title="开始时间" :value="record.exam.beginTime" />
		  <van-cell title="结束时间" :value="record.exam.endTime" />
		  <van-cell title="通过分数" :value="record.exam.passScore+'分'" />
		</van-cell-group>
		<view style="height: 30rpx;"></view>
		<van-cell-group>
		  <van-cell title="我的"/>
		  <van-cell title="开始考试时间" :value="record.beginTime" />
		  <van-cell title="交卷时间" :value="record.endTime" />
		  <van-cell title="状态" :value="record.marking === 0 ? '已阅':'待阅卷'" />
		  <van-cell title="分数" :value="record.marking === 0 ? record.score+'分':'---'" />
		  <van-cell v-if='record.marking === 0' title="我的答卷" is-link :url="'./paper?examId='+record.exam.id"/>
		</van-cell-group>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				record:'',
				examId:''
			};
		},
		methods: {
			back(){
				uni.navigateBack();
			},
			async getSelfAllRecord() {
				const toast = this.$toast.loading({
				  duration: 0, // 持续展示 toast
				  forbidClick: true
				});
				let params = {
					pageNumber: 1,
					pageSize: 1,
					param: {
						examId:this.examId,
						userId: uni.getStorageInfoSync('user').id
					}
				};
				let res = await this.$post('/exam/record/list', params);
				if (res.status === 1000) {
					this.record = res.data.list[0];
				}
				toast.clear();
			}
		},
		onPullDownRefresh() {
			this.getSelfAllRecord();
		},
		onShow(){
			this.getSelfAllRecord();
		},
		onLoad(param){
			this.examId = param.examId;
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
