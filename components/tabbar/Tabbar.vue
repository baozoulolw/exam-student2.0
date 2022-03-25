<template>
	<view>
		<van-tabbar :active="active" active-color="#07c160" inactive-color="#000" @change="activeChange">
			<van-tabbar-item icon="home-o">首页</van-tabbar-item>
			<van-tabbar-item icon="user-o">我的</van-tabbar-item>
		</van-tabbar>
	</view>
</template>

<script>
	export default {
		props:{
			active:Number
		},
		data() {
			return {
			};
		},
		methods: {
			activeChange(val){
				this.$emit('update:active',val.detail);
			}
		}
	}
</script>

<style lang="less" scoped>

</style>