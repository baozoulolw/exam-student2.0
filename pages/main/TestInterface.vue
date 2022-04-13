<template>
	<view class="main">
		<van-dialog id="van-dialog" />
		<van-toast id="van-toast" />
		<van-popup :show="leftPopShow" position="left" custom-class='leftPopCustom' @close="leftPopClose">
			<view>
				<van-collapse :value="activeNames" @change="leftCollSpanChange" accordion>
					<van-collapse-item v-for="(item,dex) in types" :key="item.value" :name="item.value"
						content-class='questions'>
						<view slot="title">
							{{`${item.label} (${item.questions.filter(i => i.myAnswer.answered).length}/${item.questions.length})`}}
						</view>
						<view :class="['question-cicle',qItem.myAnswer.answered ? 'completed':'unfinished']"
							v-for="(qItem,index) in item.questions" :key='item.id' @click="jumpTo(dex,index)">
							{{index + 1}}
						</view>
					</van-collapse-item>
				</van-collapse>
			</view>
		</van-popup>
		<van-nav-bar fixed placeholder bind:click-left="onClickTitleLeft" title-class='nav-bar-title'>
			<view slot='left'>
				<van-icon style='font-size: 45rpx; top:15rpx;position: relative;' name="apps-o" color="#ff7675"
					@click='openLeftPop' />
			</view>
			<van-count-down :time="time" auto-start class="control-count-down" slot='title' />
		</van-nav-bar>
		<view style="display: flex;">
			<van-button style='margin-right: auto;' type="default" @click='jump(-1)' v-if='showQuestionIndex !== 1'>上一题
			</van-button>
			<van-button type="default" style='margin-left: auto;' @click='jump(1)'
				v-if='showQuestionIndex < questionsNumber'>下一题</van-button>
			<van-button type="default" @click='finish'>交卷</van-button>
		</view>
		<view v-if='types[typesIndex].questions[questionIndex] && !isLoad' class="answer-body">
			<view class="title">
				{{`${showQuestionIndex}. ${types[typesIndex].questions[questionIndex].question.topic}`}}
			</view>
			<view v-if='types[typesIndex].questions[questionIndex].question.type === 0' class="answers">
				<van-radio-group :value="types[typesIndex].questions[questionIndex].myAnswer.content"
					@change="answerChange">
					<van-radio class='radio-item' :name="item.option"
						v-for='(item,index) in JSON.parse(types[typesIndex].questions[questionIndex].question.options)'
						:key="index">{{item.value}}</van-radio>
				</van-radio-group>
			</view>
			<view v-if='types[typesIndex].questions[questionIndex].question.type === 1' class="answers">
				<van-checkbox-group :value="types[typesIndex].questions[questionIndex].myAnswer.content"
					@change="answerChange">
					<van-checkbox class='check-item' :name="item.option"
						v-for='(item,index) in JSON.parse(types[typesIndex].questions[questionIndex].question.options)'
						:key="index" shape="square">{{item.value}}</van-checkbox>
				</van-checkbox-group>

			</view>
			<view v-if='types[typesIndex].questions[questionIndex].question.type === 2' class="answers">
				<van-radio-group :value="showQuestion.myAnswer.content" @change="answerChange">
					<van-radio class='radio-item' :name="0">
						<van-tag mark type="success">正确</van-tag>
					</van-radio>
					<van-radio class='radio-item' :name="1">
						<van-tag mark type="danger">错误</van-tag>
					</van-radio>
				</van-radio-group>
			</view>
			<view v-if='types[typesIndex].questions[questionIndex].question.type === 3' class="answers">
				<van-cell-group>
					<van-field v-for="(item,index) in types[typesIndex].questions[questionIndex].myAnswer.content"
						:key='index' :label="`填空${index+1}`" :model:value="item.value" :border="false"
						@input="val => inputChange(val,index)" :ref='`input${index}`' />
				</van-cell-group>
			</view>
			<view v-if='types[typesIndex].questions[questionIndex].question.type === 4' class="answers">
				<van-cell-group>
					<van-field v-for="(item,index) in types[typesIndex].questions[questionIndex].myAnswer.content"
						:key='index' label="解答:" type="textarea" autosize :model:value="item.value" :border="false"
						@input="val => inputChange(val,index)" />
				</van-cell-group>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				examId: '',
				exam: {
					duration: '120'
				},
				totalScore: 0,
				types: [{
						value: 0,
						label: '单选题',
						questions: []
					},
					{
						value: 1,
						label: '多选题',
						questions: []
					},
					{
						value: 2,
						label: '判断题',
						questions: []
					},
					{
						value: 3,
						label: '填空题',
						questions: []
					},
					{
						value: 4,
						label: '简答题',
						questions: []
					},
				],
				leftPopShow: false,
				activeNames: '',
				showQuestionIndex: 1,
				isLoad: false,
				questionIndex: 0,
				typesIndex: 0,
				testInput: '12314',
				showInput: [],
				param: {
					examId: '',
					score: 0,
					beginTime: '',
					endTime: '',
					finish: 0,
					answer: '',
					marking: 0
				},
				time:''
				//showQuestion:{}
			};
		},
		computed: {
			showQuestion() {
				let level1 = this.types[0].questions.length;
				let level2 = this.types[1].questions.length + level1;
				let level3 = this.types[2].questions.length + level2;
				let level4 = this.types[3].questions.length + level3;
				let level5 = this.types[4].questions.length + level4;
				let arr = [level1, level2, level3, level4, level5];
				let arrIndex = 0;
				arr.some((item, index) => {
					if (this.showQuestionIndex <= item && (index === 4 || this.showQuestionIndex <= arr[index +
							1])) {
						arrIndex = index;
						this.typesIndex = arrIndex;
						return true;
					}
				});
				if (arrIndex === 0) {
					this.questionIndex = this.showQuestionIndex - 1;
					return this.types[arrIndex].questions[this.showQuestionIndex - 1];
				} else {
					this.questionIndex = this.showQuestionIndex - 1 - arr[arrIndex - 1];
					return this.types[arrIndex].questions[this.showQuestionIndex - 1 - arr[arrIndex - 1]];
				}
			},
			questionsNumber() {
				return this.types.reduce((pre, {
					questions
				}) => {
					pre += questions.length;
					return pre;
				}, 0)
			}
		},
		methods: {
			async joinExam() {
				let res = await this.$get(`/exam/join/${this.examId}`);
				if (res.status === 1000) {
					this.exam = res.data;
					let {
						questions
					} = this.exam.paper;
					this.types.forEach(type => {
						type.questions = questions.filter(item => {
							if (item.question.type === type.value) {
								if (type.value === 3 || type.value === 4) {
									let content = JSON.parse(item.question.answer).map(i => {
										value: ''
									})
									item.myAnswer = {
										answered: false,
										content,
										score: 0
									}
									if (type.value === 4) {
										item.myAnswer.marking = true;
										item.myAnswer.markTeacher = '';
									}
								} else {
									item.myAnswer = {
										answered: false,
										content: '',
										score: 0
									}
								}
								this.totalScore += item.score;
								return true;
							}
						}).sort((v1, v2) => v1.sort - v2.sort);
						this.questionChange();
						this.param.examId = this.exam.id;
					});
				}
			},
			leftPopClose() {
				this.leftPopShow = false;
			},
			openLeftPop() {
				this.leftPopShow = true;
			},
			leftCollSpanChange(val) {
				this.activeNames = val.detail
			},
			jump(num) {
				this.isLoad = true;
				this.showQuestionIndex += num;
				this.questionChange();
				this.isLoad = false;
				this.$forceUpdate();
				this.$nextTick(() => {
					this.$forceUpdate();
				})
			},
			questionChange() {
				let level1 = this.types[0].questions.length;
				let level2 = this.types[1].questions.length + level1;
				let level3 = this.types[2].questions.length + level2;
				let level4 = this.types[3].questions.length + level3;
				let level5 = this.types[4].questions.length + level4;
				let arr = [level1, level2, level3, level4, level5];
				let arrIndex = 0;
				arr.some((item, index) => {
					if (this.showQuestionIndex <= item && (index === 4 || this.showQuestionIndex <= arr[index +
							1])) {
						arrIndex = index;
						this.typesIndex = arrIndex;
						return true;
					}
				});
				if (arrIndex === 0) {
					this.questionIndex = this.showQuestionIndex - 1;
					//this.showQuestion =  this.types[arrIndex].questions[this.showQuestionIndex-1];
				} else {
					this.questionIndex = this.showQuestionIndex - 1 - arr[arrIndex - 1];
					//this.showQuestion = this.types[arrIndex].questions[this.showQuestionIndex- 1 - arr[arrIndex-1]];
				}
			},
			jumpTo(dex, index) {
				let level1 = this.types[0].questions.length;
				let level2 = this.types[1].questions.length + level1;
				let level3 = this.types[2].questions.length + level2;
				let level4 = this.types[3].questions.length + level3;
				let level5 = this.types[4].questions.length + level4;
				let arr = [level1, level2, level3, level4, level5];
				if (dex === 0) {
					this.showQuestionIndex = index + 1
				} else {
					this.showQuestionIndex = arr[dex - 1] + index + 1;
				}
				this.questionChange();
				this.leftPopClose();
			},
			answerChange(val) {
				console.log(this.showQuestion);
				this.$set(this.types[this.typesIndex].questions[this.questionIndex].myAnswer, 'content', val.detail)
				this.$set(this.types[this.typesIndex].questions[this.questionIndex].myAnswer, 'answered', true)
				/* if(this.types[this.typesIndex].label === '单选题') {
					if(val.detail.toUpperCase() === this.types[this.typesIndex].questions[this.questionIndex].question.trim()){
						this.$set(this.types[this.typesIndex].questions[this.questionIndex].myAnswer, 'score', this.types[this.typesIndex].questions[this.questionIndex].score);
					}else
				} */
				console.log(val);
				console.log(this.showQuestion);
				this.$forceUpdate();
			},
			inputChange(val, index) {
				console.log(val);
				this.$nextTick(() => {
					let copy = JSON.parse(JSON.stringify(this.types[this.typesIndex].questions[this.questionIndex]
						.myAnswer));
					copy.content[index] = {
						value: val.detail
					};
					let answer = JSON.parse(this.types[this.typesIndex].questions[this.questionIndex].question
						.answer)[index].value;
					//if(val.detail.trim() = answer.trim())
					copy.answered = val.detail.trim() !== '';
					copy.score = this.types[this.typesIndex].questions[this.questionIndex].score;
					this.$set(this.types[this.typesIndex].questions[this.questionIndex], 'myAnswer', copy)
				})
			},
			computedScore() {
				let result = 0;
				console.log(this.types);
				this.types.forEach(({
					questions
				}) => {
					questions.forEach(({
						myAnswer,
						question,
						score
					}) => {
						let {
							score: myScore,
							content
						} = myAnswer;
						let {
							answer,
							type
						} = question;
						let check = false;
						if (type === 0) {
							check = content.trim().toUpperCase() === answer.trim();
						} else if (type === 1) {
							let parseAnswer = JSON.parse(answer);
							if(content !== ''){
								check = content.every(i => parseAnswer.some(a => a === i))
							}
						} else if (type === 2) {
							check = content === Number(answer)
						}else if(type === 3){
							let parseAnswer = JSON.parse(answer);
							if(content !== ''){
								check = content.every((i,index) => String(parseAnswer[index].value).trim() === String(i).trim());
							}
						}
						if (check) {
							result += score;
							myAnswer.score = score;
						} else {
							myAnswer.score = 0;
						}
					})
				})
				return result;
			},
			finish() {
				let check = this.types.every(i => i.questions.every(ai => ai.myAnswer.answered));
				let confirm;
				if (!check) {
					confirm = this.$dialog.confirm({
						title: '提示',
						message: '您还有题目未完成，是否继续交卷',
					})
				} else {
					confirm = this.$dialog.confirm({
						title: '提示',
						message: '已完成所有题目，是否交卷',
					})
				}
				confirm.then(async () => {
						this.param.endTime = this.formattime(new Date());
						this.param.finish = 1;
						/* if (this.types.slice(-1)[0].questions.length > 0) {
							this.param.marking = 1;
						} */
						let mark = this.types.filter(i => {
							i.value === 4
						});
						console.log(this.types);
						this.param.marking = this.types[4].questions.length > 0 ? 1:0;
						let score = this.computedScore();
						this.param.score = score;
						this.param.answer = JSON.stringify(this.types);
						let res = await this.$post('/exam/submit', this.param);
						//let res = await this.$post('/exam/submit',{finish:0});
						if (res.status === 1000) {
							this.$toast.success({
								message: '提交成功',
								duration: 0, // 持续展示 toast
								forbidClick: true,
							});
							setTimeout(() => {
								this.$toast.clear();
								uni.navigateBack();
							}, 3000)
						}
					})
					.catch(() => {

					});
			},
			formattime(date) {
				var date = new Date(date);
				var YY = date.getFullYear() + '-';
				var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
				var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
				var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
				var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
				var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
				return YY + MM + DD + " " + hh + mm + ss;
			}
		},
		async onLoad(param) {
			const toast = this.$toast.loading({
			  duration: 0, // 持续展示 toast
			  forbidClick: true,
			  message: '加载中',
			});
			this.examId = param.examId;
			await this.joinExam();
			let now = new Date();
			this.param.beginTime = this.formattime(now);
			if(this.exam.specifyTime === 0){
				this.time = exam.duration * 60 *1000
			}else{
				let d = new Date();
				let s = this.exam.endTime;
				d.setYear(parseInt(s.substring(0,4),10));
				d.setMonth(parseInt(s.substring(5,7)-1,10));
				d.setDate(parseInt(s.substring(8,10),10));
				d.setHours(parseInt(s.substring(11,13),10));
				d.setMinutes(parseInt(s.substring(14,16),10));
				d.setSeconds(parseInt(s.substring(17,19),10));
				this.time = d.getTime() - now.getTime();
			}
			const countDown = this.selectComponent('.control-count-down');
			countDown.reset();
			toast.clear();
		},
	}
</script>

<style lang="less" scoped>
	.main {
		/deep/.nav-bar-title {
			padding-top: 30rpx;
		}

		/deep/.leftPopCustom {
			height: 90%;
			width: 55%;
			/* padding: 20px; */
			margin-left: 5%;
			margin-top: 5%;
			border-radius: 10px;
			margin-bottom: 10%;

			.questions {
				display: flex;
				flex-wrap: wrap;

				.question-cicle {
					height: 30px;
					width: 30px;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 50%;
					margin-right: 11px;
					margin-bottom: 10px;
					color: #2c3e50;
				}

				.question-cicle:nth-child(5n+5) {
					margin-right: 0;
				}

				.unfinished {
					background: #ecf0f1;
				}

				.completed {
					background: #2ecc71;
				}
			}
		}

		.answer-body {
			padding: 20rpx;

			.title {
				margin-bottom: 30rpx;
			}

			.answers {
				padding: 20rpx;

				.radio-item {
					/deep/ .van-radio {
						margin-bottom: 20rpx;
					}
				}

				.check-item {
					/deep/ .van-checkbox {
						margin-bottom: 20rpx;
					}
				}
			}
		}
	}
</style>
