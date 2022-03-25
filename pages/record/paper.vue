<template>
	<view class="main">
		<van-toast id="van-toast" />
		<view class="backgroung-color"></view>
		<van-nav-bar title="考试详情" left-text="返回" left-arrow @click-left="back()" />
		<view style="height: 30rpx;"></view>
		<view v-for='(item,index) in showQuestion' :key='item.id' style="margin-bottom: 30rpx;">
			<van-cell :title="index+1" :value='type[item.question.type]' size="large" use-label-slot
				value-class='value-ce'>
				<view slot="label">
					<view style="margin-bottom: 30rpx;">
						<van-tag plain type="primary" style='margin-right: 15rpx;'>题目</van-tag>{{item.question.topic}}
					</view>
					<view v-if='item.question.type === 0 || item.question.type === 1'>
						<view v-for='option in JSON.parse(item.question.options)' :key='option.option' style="margin-bottom: 15rpx;">
							<van-tag style='margin-right: 15rpx;' plain type="primary">{{option.option}}</van-tag>
							<text>{{option.value}}</text>
						</view>
						<view style="margin-bottom: 20rpx;" v-if='item.question.type === 1'>
							<text>正确答案: </text>
							<van-tag v-for="right in JSON.parse(item.question.answer)" :key='right' style='margin-left: 15rpx;' plain type="success">{{right}}</van-tag>
						</view>
						<view style="margin-bottom: 20rpx;"  v-if='item.question.type === 0'>
							<text>正确答案: </text>
							<van-tag style='margin-left: 15rpx;' plain type="success">{{item.question.answer}}</van-tag>
						</view>
						<view style="margin-bottom: 20rpx;" v-if='item.question.type === 0'>
							<text>我的作答: </text>
							<van-tag style='margin-left: 15rpx;' plain type="success">{{item.myAnswer.content}}</van-tag>
						</view>
						<view style="margin-bottom: 20rpx;" v-if='item.question.type === 1'>
							<text>我的作答: </text>
							<view v-if="item.myAnswer.content !== ''">
								<van-tag style='margin-left: 15rpx;' plain type="success" v-for='myItem in JSON.parse(item.myAnswer.content)' :key='myItem'>{{myItem}}</van-tag>
							</view>
						</view>
					</view>
					<view v-if='item.question.type === 2'>
						<view style="margin-bottom: 15rpx;">
							<view style="margin-bottom: 30rpx;"> 1. <van-tag style='margin-left: 15rpx;' plain type="success">正确</van-tag></view>
							<view> 2. <van-tag style='margin-left: 15rpx;' plain type="warning">错误</van-tag></view>
						</view>
						<view style="margin-bottom: 20rpx;">
							<text>正确答案: </text>
							<van-tag style='margin-left: 15rpx;' plain :type="item.question.answer ? 'success':'warning'">{{item.question.answer ? '正确':'错误'}}</van-tag>
						</view>
						<view style="margin-bottom: 20rpx;">
							<text>我的作答: </text>
							<van-tag style='margin-left: 15rpx;' plain :type="item.myAnswer.content ? 'success':'warning'">{{item.myAnswer.content ? '正确':'错误'}}</van-tag>
						</view>
					</view>
					<view v-if='item.question.type === 3'>
						<view v-for='(reference,index) in JSON.parse(item.question.answer)' :key='index' style="display: flex;margin-bottom: 20rpx;">
							<view style="margin-right: 30rpx;">填空{{index+1}}</view>
							<view>
								<view style="margin-bottom: 12rpx;">参考答案:{{reference.value}}</view>
								<view>我的答案:{{item.myAnswer.content[index] ? item.myAnswer.content[index]:''}}</view>
							</view>
						</view>
					</view>
					<view v-if='item.question.type === 4'>
						<view v-for='(reference,index) in JSON.parse(item.question.answer)' :key='index' style="margin-bottom: 20rpx;">
								<view style="margin-bottom: 12rpx;">参考答案:{{reference.value}}</view>
								<view>我的答案:{{item.myAnswer.content[index] ? item.myAnswer.content[index]:''}}</view>
						</view>
					</view>
					<view>
						分值：{{item.score}}
					</view>
					<view>
						我的得分：{{item.myAnswer.score}}
					</view>
				</view>
			</van-cell>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				record: '',
				examId: '',
				paper: "",
				showQuestion: [],
				type: ['单选题', '多选题', '判断题', '填空题', '简答题']
			};
		},
		methods: {
			back() {
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
						examId: this.examId,
						userId: uni.getStorageInfoSync('user').id
					}
				};
				let res = await this.$post('/exam/record/list', params);
				if (res.status === 1000) {
					this.record = res.data.list[0];
					this.paper = JSON.parse(this.record.answer);
					this.showQuestion = this.paper.reduce((pre, i) => {
						pre = [...pre, ...i.questions];
						return pre;
					}, [])
				}
				toast.clear();
			}
		},
		onShow() {
			this.getSelfAllRecord();
		},
		onLoad(param) {
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

		/deep/.value-ce {
			height: 40rpx;
			position: absolute;
			right: 20rpx;
		}
	}
</style>
