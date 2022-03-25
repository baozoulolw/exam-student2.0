<template>
	<view class="main">
		<view class="backgroung-color"></view>
		<Self></Self>
		<van-dialog id="van-dialog" />
	</view>
</template>

<script>
	import examPlan from '../../components/examPlan/examPlan'
	import Self from '../../components/Self/Self'
	export default {
		data() {
			return {
				active: 0
			}
		},
		methods: {

		},
		components: {
			examPlan,
			Self
		},
		computed: {
			examShow() {
				return this.active === 0
			},
			selfShow() {
				return this.active === 1
			}
		}
	}
</script>

<style lang="less" scoped>
	.main {
		padding-top: 170rpx;
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
