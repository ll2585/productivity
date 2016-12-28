import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';

import { CountdownService, countdownData, countdownOptions } from './countdown.service';

@Component({
	moduleId: module.id,
	selector: 'countdown',
	templateUrl: './countdown.component.html'
})

export class CountdownComponent implements OnInit, OnChanges {
	private format: string;
	@Input() minutes: number;
	@Input() seconds: number;
	@Input() autoStart: boolean;
	@Output() onStart = new EventEmitter<countdownData>();
	@Output() onComplete = new EventEmitter<countdownData>();
	private remainingSeconds: number;
	private timer: any;
	private theme: string;
	private countdown: countdownData;
	private date: string;
	private isPaused: boolean;

	constructor(private _countdownService: CountdownService) {
		this.isPaused = false;
	}
	ngOnInit() {
		this.initCountdown();
		let countdownOptions: countdownOptions;
		countdownOptions = this._countdownService.getCountdwnOptions();
		console.log( this.autoStart)
		if('autoStart' in countdownOptions && countdownOptions.autoStart){
			this.startCountDown();
		}
		
	}
	ngOnChanges() {
		//this.startCountDown()
	}
	isFunction(obj: any) {
		return typeof obj === "function";
	}
	initCountdown(){
		let countdownOptions: countdownOptions;
		countdownOptions = this._countdownService.getCountdwnOptions();
		if (this.autoStart != null) {
			this._countdownService.setAutoStart(this.autoStart);
		}
		this.countdown = {
			seconds    : this.minutes*60+this.seconds,
			format  : countdownOptions.format,
			theme    : countdownOptions.theme + '-countdown-timer',
			onStart    : countdownOptions.onStart && this.isFunction(countdownOptions.onStart) ? countdownOptions.onStart : null,
			onComplete : countdownOptions.onComplete && this.isFunction(countdownOptions.onComplete) ? countdownOptions.onComplete : null,
			autoStart: this.autoStart
		};
		this.remainingSeconds = this.countdown.seconds;
		this.date = this._countdownService.dhms(this.remainingSeconds, this.countdown.format);
		

	}
	startCountDown () {
		let countdownOptions: countdownOptions;
		countdownOptions = this._countdownService.getCountdwnOptions();
		this.onStart.emit(this.countdown);
		if (countdownOptions.onStart && this.isFunction(countdownOptions.onStart)) {
			countdownOptions.onStart.call(this, this.countdown);
		}
		this.remainingSeconds = this.countdown.seconds;
		this.startTimer();
	}

	pauseCountDown(){
		clearInterval(this.timer);
	}

	resumeCountDown(){
		this.startTimer();
	}

	startTimer(){
		let countdownOptions: countdownOptions;
		countdownOptions = this._countdownService.getCountdwnOptions();
		var that = this;
		this.timer = setInterval(function() {
			if (that.remainingSeconds == 0) {
				if (countdownOptions.onComplete && that.isFunction(countdownOptions.onComplete)) {
					countdownOptions.onComplete.call(that, that.countdown);
				}
				that.onComplete.emit(that.countdown);
				clearInterval(that.timer);
			}
			else {
				that.remainingSeconds = that.remainingSeconds - 1;
				that.date = that._countdownService.dhms(that.remainingSeconds, that.countdown.format);
			}
		}, 1000)
	}

	wtf(){
		console.log('wtf');
	}
}
