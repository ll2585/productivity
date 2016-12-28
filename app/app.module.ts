import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

import { AppComponent }  from './app.component';
import { PomodoroComponent }  from './pomodoro.component';
import { PomodoroTimerComponent }  from './pomodoro-timer.component';
import { CountdownComponent } from './countdown/countdown.component';
import { CountdownService, countdownData, countdownOptions } from './countdown/countdown.service';

import { NumberPromptModalComponent } from './modals/number-prompt-modal.component';

@NgModule({
  imports:      [ BrowserModule, ModalModule.forRoot(), BootstrapModalModule ],
  declarations: [ AppComponent, PomodoroComponent, PomodoroTimerComponent, CountdownComponent, NumberPromptModalComponent ],
  bootstrap:    [ AppComponent ],
  providers: [ CountdownService],
  entryComponents: [ NumberPromptModalComponent ]
})
export class AppModule { }
