export class Pomodoro {
  id: number;
  title: string;
  initial_estimate: number;
  reestimate_1: number;
  reestimate_2: number;
  pomodoros_completed: number;
  finished: boolean;
  internal_interruptions: number;
  external_interruptions: number;
}