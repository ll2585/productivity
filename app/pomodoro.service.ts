import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { Pomodoro } from './pomodoro';
import { POMODOROS } from './mock-pomodoros';
@Injectable()
export class PomodoroService {
	// Observable string sources
	private pomodoroStartedSource = new Subject();
	private pomodoroPausedSource = new Subject();
	// Observable string streams
	pomodoroStarted$ = this.pomodoroStartedSource.asObservable();
	pomodoroPaused$ = this.pomodoroPausedSource.asObservable();
	// Service message commands
	startPomodoro() {
		this.pomodoroStartedSource.next();
	}
	pausePomodoro() {
		this.pomodoroPausedSource.next();
	}

	getPomodoros() : Promise<Pomodoro[]> {
  		return Promise.resolve(POMODOROS);
	}
}