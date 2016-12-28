import { AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Component, OnDestroy } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { CountdownComponent }  from './countdown/countdown.component';

import { PomodoroService } from './pomodoro.service';
import { CountdownService, countdownData, countdownOptions } from './countdown/countdown.service';
import { Subscription }   from 'rxjs/Subscription';

@Component({
	selector: 'pomodoro-timer',
	template: `<countdown [minutes] = "0" [seconds] = "2" [autoStart] = "false" (onComplete) = "finish()"></countdown>
	`,
})

export class PomodoroTimerComponent  implements AfterViewInit, OnDestroy, OnInit  { 
	name = 'Angular';

	@ViewChild(CountdownComponent)
	private countdownComponent: CountdownComponent;

	start() {
		this.countdownComponent.startCountDown();
	}

	private started: boolean;
	private isPaused: boolean;
	startSubscription: Subscription;
	pauseSubscription: Subscription;
	private pomodoroPhase: boolean;
	@Output() onPomodoroFinished = new EventEmitter();
	@Output() onTimerFinished = new EventEmitter();

	constructor(private _countdownService: CountdownService, private pomodoroService: PomodoroService) {
		
		let countdownOptions: countdownOptions = {
			theme: 'material',
			format: "mm:ss",
			onStart: (countdown: countdownData) => {
				console.log('count has been started!');
			},
			autoStart: true
		}
		_countdownService.setCountdownOptions(countdownOptions);

		this.startSubscription = pomodoroService.pomodoroStarted$.subscribe(
			() => {
				this.start();
			});

		this.pauseSubscription = pomodoroService.pomodoroPaused$.subscribe(
			() => {
				this.pause();
			});
	}

	ngOnInit(): void {
		this.started = false;
		this.pomodoroPhase = true;
	}

	ngAfterViewInit(): void{}
	ngOnDestroy():void{}

	startBreak():void{
		this.onPomodoroFinished.emit();
		this.countdownComponent.minutes = 0;
		this.countdownComponent.seconds = 1;
		this.countdownComponent.initCountdown();
	}

	startPomodoro():void{
		this.countdownComponent.minutes = 0;
		this.countdownComponent.seconds = 2;
		this.countdownComponent.initCountdown();
	}
	
	finish():void{
		this.onTimerFinished.emit();
		this.started = false;
		this.isPaused = false;
		this.pomodoroPhase = !this.pomodoroPhase;
		if(!this.pomodoroPhase){
			this.startBreak();
		} else {
			this.startPomodoro();
		}
	}

	pause():void{
		this.isPaused = !this.isPaused;
		if (this.isPaused){
			this.countdownComponent.pauseCountDown();
		} else {
			this.countdownComponent.resumeCountDown();
		}
	}

}
