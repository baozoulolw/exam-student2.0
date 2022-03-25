<template>
	<view class="main">
		<view class="backgroung-color"></view>
		<van-toast id="custom-selector" />
		<van-dialog id="van-dialog" />
		<van-nav-bar
		  :title="Number(this.specifyTime) ? '定时任务列表':'限时任务列表'"
		  left-text="返回"
		  left-arrow
		  @click-left="back()"
		/>
		<view style="height: 30rpx;"></view>
		<view v-for='item in onSchedule' :key="item.id" style="margin-bottom: 30rpx;">
		<van-cell-group inset custom-class='type-item'>
			<van-cell :title="item.examName" icon="notes-o" is-link />
			<van-cell :border="false" use-label-slot>
				<view slot="label">
					<view class="van-cell-text">考试时长: {{item.duration}}分钟</view>
					<view class="van-cell-text">总分: {{item.paper.totalScore}}</view>
					<view class="van-cell-text">通过分数: {{item.passScore}}</view>
					<view class="van-cell-text">考试时间: {{item.beginTime}} ~ {{item.endTime}}</view>
					<view class="van-cell-text">状态: 考试进行中(待完成)</view>
				</view>
			</van-cell>
		</van-cell-group>
		</view>
		<view style="margin-bottom: 30rpx;" v-for='item in timingIncomplete' :key="item.id">
			<van-cell-group inset custom-class='type-item'>
				<van-cell :title="item.examName" icon="notes-o" is-link value="立即开始" @click='openPop(item)'/>
				<van-cell :border="false" use-label-slot>
					<view slot="label">
						<view class="van-cell-text">考试时长: {{item.duration}}分钟</view>
						<view class="van-cell-text">总分: {{item.paper.totalScore}}</view>
						<view class="van-cell-text">通过分数: {{item.passScore}}</view>
						<view class="van-cell-text">考试完成期限: {{item.beginTime}} ~ {{item.endTime}}</view>
						<view class="van-cell-text">状态: 考试待完成</view>
					</view>
				</van-cell>
			</van-cell-group>
		</view>
		<view  v-for='item in timingNotStarted' :key="item.id" style="margin-bottom: 30rpx;">
			<van-cell-group inset custom-class='type-item'>
				<van-cell :title="item.examName" icon="notes-o" is-link />
				<van-cell :border="false" use-label-slot>
					<view slot="label">
						<view class="van-cell-text">考试时长: {{item.duration}}分钟</view>
						<view class="van-cell-text">总分: {{item.paper.totalScore}}</view>
						<view class="van-cell-text">通过分数: {{item.passScore}}</view>
						<view class="van-cell-text">考试时间: {{item.beginTime}} ~ {{item.endTime}}</view>
						<view class="van-cell-text">状态: 考试未开始</view>
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
				exams:[],
				specifyTime:'',
				onSchedule:[],
				timingIncomplete:[],
				timingNotStarted:[],
				popShow:false,
				popMessage:''
			};
		},
		methods:{
			back(){
				uni.navigateBack();
			},
			async getExams(){
				const toast = this.$toast.loading({
				  duration: 0, // 持续展示 toast
				  forbidClick: true,
				  message: '加载中',
				  selector: '#custom-selector',
				});
				let res = await this.$get(`/exam/one?specifyTime=${this.specifyTime}`);
				this.$toast.clear(toast);
				if(res.status === 1000){
					this.onSchedule = res.data.onSchedule ? res.data.onSchedule:[]
					this.timingIncomplete = res.data.timingIncomplete ? res.data.timingIncomplete:[]
					this.timingNotStarted = res.data.timingNotStarted ? res.data.timingNotStarted:[]
				}
			},
			openPop(item){
				this.$dialog.confirm({
				  title: '提示',
				  message: `本次考试时长${item.duration}分钟,中途不可退出，是否继续？`,
				})
				  .then(() => {
				    uni.navigateTo({
				    	url:`./TestInterface?examId=${item.id}`
				    })
				  })
				  .catch(() => {
				    // on cancel
				  });
			},
			popColos(){
				this.popShow = false;
			}
		},
		mounted(){
			
		},
		onShow(){
			this.getExams();
		},
		onLoad(param){
			this.specifyTime = param.specifyTime;
			this.getExams();
		},
	}
</script>

<style lang="less">
.main{
	//padding-top: 20rpx;
	.backgroung-color{
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: #ff7675;; // 这个就是你想设置的背景颜色
			z-index: -1;
		}
}
</style>
