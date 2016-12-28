import { AfterViewInit, ViewChild, OnInit, ViewContainerRef } from '@angular/core';
import { Component } from '@angular/core';
import { PomodoroService }     from './pomodoro.service';
import { Pomodoro } from './pomodoro';
import { countdownData } from './countdown/countdown.service';


import { Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';

import { NumberPromptModalComponent, AdditionCalculateWindowData } from './modals/number-prompt-modal.component';

@Component({
	selector: 'pomodoro',
	template: `
	<div class="container">
	 <div *ngIf="current_pomoodoro">
		{{current_pomoodoro.title}}
		<pomodoro-timer (onPomodoroFinished)="onPomodoroFinished($event)" (onTimerFinished) = "onTimerFinished($event)"></pomodoro-timer>
		<button *ngIf="started == false" (click)="startCountdown()">Start</button>
		<button *ngIf="started == true && paused == false" (click)="pauseCountdown()">Pause</button>
		<button *ngIf="started == true && paused == true" (click)="resumeCountdown()">Resume</button>
		<button (click)="addInternalInterruption()">Add Internal Interruption</button>
		<button (click)="addExternalInterruption()">Add External Interruption</button>
		<button (click)="reestimate1()">First Reestimate</button>
		<button (click)="reestimate2()">Second Reestimate</button>
		<button (click)="finish()">Finish</button>
	</div>
	<table class="table table-striped">
		<thead>
			<tr>
				<th>ID</th>
				<th>Task</th>
				<th>Interruptions</th>
				<th>Pomodoros</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody>
			<tr *ngFor="let pomodoro of pomodoros" [ngClass]="{'success': pomodoro.finished, 'info': pomodoro == current_pomoodoro }">
				<th>{{pomodoro.id}}</th>
				<td>{{pomodoro.title}}</td>
				<td><span *ngFor="let interruption of pomodoroInterruptions(pomodoro)" class="glyphicon" [ngClass]="{'glyphicon-thumbs-down': interruption == 'internal', 'glyphicon-exclamation-sign': interruption == 'external' }" ></span></td>
				<td>
				<div class="btn-group" data-toggle="buttons">
					<label *ngFor="let estimate of pomodoroEstimate(pomodoro)" class="btn btn-success active">
					<span class="glyphicon glyphicon-ok" [ngClass]="{'glyphicon-hide': !estimate }" ></span>
					</label>
					<label *ngFor="let estimate of pomodoroReestimate1(pomodoro)" class="btn btn-warning active">
					<span class="glyphicon glyphicon-ok" [ngClass]="{'glyphicon-hide': !estimate }" ></span>
					</label>
					<label *ngFor="let estimate of pomodoroReestimate2(pomodoro)" class="btn btn-danger active">
					<span class="glyphicon glyphicon-ok" [ngClass]="{'glyphicon-hide': !estimate }" ></span>
					</label>
					</div>
				</td>
				<td><button (click)="onSelect(pomodoro)" *ngIf="pomodoro.finished == false">Select</button></td>
				
			</tr>
		</tbody>
	</table>
	
	</div>
	`,
	providers: [PomodoroService]

})
export class PomodoroComponent implements AfterViewInit, OnInit {
	arr:Array<Object>;
	name = 'Angular';
	pomodoros: Pomodoro[];
	current_pomoodoro: Pomodoro;
	private started: boolean;
	private paused: boolean;
	private audio: Audio;
	onBreak: boolean;
	currentIteration: number;

	constructor(private pomodoroService: PomodoroService, overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal) {
		this.started = false;
		this.paused = false;
    overlay.defaultViewContainer = vcRef;
	}

	ngOnInit(): void {
		this.getPomodoros();
		this.onBreak = false;
	}

	getPomodoros() :void{
		this.pomodoroService.getPomodoros().then(pomodoros => this.pomodoros = pomodoros);
	}

	onSelect(pomodoro: Pomodoro): void {
		this.current_pomoodoro = pomodoro;
		this.currentIteration = 1;
	}

	startCountdown():void{
    this.modal.open(NumberPromptModalComponent, new AdditionCalculateWindowData(2, 3));
		this.pomodoroService.startPomodoro();
		this.started = true;
		this.audio = new Audio();
		this.audio.src = "./sounds/ticking.wav";
		this.audio.load();
		this.audio.loop = true;
		this.audio.play();
	}

	pauseCountdown():void{
		this.paused = true;
		this.audio.pause();
		this.pomodoroService.pausePomodoro();

	}

	needReestimate1():boolean{
		if(!this.current_pomoodoro.finished && !this.started){
			console.log(this.current_pomoodoro);
			return this.current_pomoodoro.initial_estimate == this.current_pomoodoro.pomodoros_completed;
		}
	}

	addInternalInterruption():void{
		this.current_pomoodoro.internal_interruptions += 1;
	}

	addExternalInterruption():void{
		this.current_pomoodoro.external_interruptions += 1;
	}


	reestimate1():void{
		let reestimate = prompt("Reestimate");
		this.current_pomoodoro.reestimate_1 = +reestimate;
	}

	reestimate2():void{
		let reestimate = prompt("Reestimate");
		this.current_pomoodoro.reestimate_2 = +reestimate;
	}

	finish():void{
		this.current_pomoodoro.finished = true;
		this.current_pomoodoro = null;
	}

	onPomodoroFinished():void{
		this.current_pomoodoro.pomodoros_completed += 1;
		this.currentIteration += 1;
	}

	onTimerFinished():void{
	  this.onBreak = !this.onBreak;
		this.started = false;
		this.paused = false;
		this.audio.pause();
		this.audio = new Audio();
		this.audio.src = "./sounds/ding.wav";
		this.audio.load();
		this.audio.play();
	}

	resumeCountdown():void{
		this.paused = false;
		this.audio.play();
		this.pomodoroService.pausePomodoro();
	}

	ngAfterViewInit() :void{

	}

	onStart(countdown: countdownData) :void{
		console.log('countdown has been started!');
	}
	onComplete(countdown: countdownData):void {
		console.log('countdown has been started!');
	}

	pomodoroEstimate(pomodoro: Pomodoro): Array<boolean>{
		let result = Array<boolean>();
		let length = pomodoro.initial_estimate;
		let total_completed = pomodoro.pomodoros_completed;
		for(let i = 0; i < length; i++){
			if(total_completed > 0){
				result.push(true);
				total_completed -= 1;
			} else {
				result.push(false);
			}
		}
		return result;
	}

	pomodoroInterruptions(pomodoro: Pomodoro): Array<string>{
		let result = Array<string>();
		let length = pomodoro.internal_interruptions + pomodoro.external_interruptions;
		for(let i = 0; i < length; i++){
			if(i < pomodoro.internal_interruptions){
				result.push('internal');
			} else {
				result.push('external');
			}
		}
		return result;
	}

	pomodoroReestimate1(pomodoro: Pomodoro): Array<boolean>{
		let result = Array<boolean>();
		let length = pomodoro.reestimate_1;
		let total_completed = pomodoro.pomodoros_completed - pomodoro.initial_estimate;
		for(let i = 0; i < length; i++){
			if(total_completed > 0){
				result.push(true);
				total_completed -= 1;
			} else {
				result.push(false);
			}
		}
		return result;
	}

	pomodoroReestimate2(pomodoro: Pomodoro): Array<boolean>{
		let result = Array<boolean>();
		let length = pomodoro.reestimate_2;
		let total_completed = pomodoro.pomodoros_completed - pomodoro.initial_estimate - pomodoro.reestimate_1;
		for(let i = 0; i < length; i++){
			if(total_completed > 0){
				result.push(true);
				total_completed -= 1;
			} else {
				result.push(false);
			}
		}
		return result;
	}



}
