import { Injectable } from '@angular/core';

export interface countdownOptions {
  theme?: string;
  format?: string;
  onStart?: Function;
  onComplete?: Function;
  autoStart?: boolean;
}

export interface countdownData {
    seconds: number;
    theme: string;
    format: string;
    onStart: Function;
    onComplete: Function;
    autoStart: boolean;
}

@Injectable()
export class CountdownService {
    
    static THEMES: Array<string> = ['default', 'material', 'bootstrap'];
    private uniquecountdown: number = 0;
    private countdownOptions: countdownOptions;

    constructor() {
        this.countdownOptions = {
            theme: "default",
            format: "hh : mm : ss"
        }
    }
    setAutoStart(autoStart: boolean){
        this.countdownOptions.autoStart = autoStart;
    }
    setCountdownOptions(options: countdownOptions) {
        let countdownOptions: countdownOptions;
        countdownOptions = options;
        countdownOptions = countdownOptions || {
            theme: "default",
            format: "hh : mm : ss"
        };
        let theme: string;
        if (countdownOptions.theme) {
            theme = CountdownService.THEMES.indexOf(countdownOptions.theme) > -1 ? countdownOptions.theme : "defult";
        } else {
            theme = "default";
        }

        let format: string;
        if (!countdownOptions.format) {
            format = "hh : mm : ss"
        }
        else {
            format = countdownOptions.format;
        }
        this.countdownOptions =  countdownOptions;
    }
    getCountdwnOptions() {
        return this.countdownOptions;
    }
    dhms(s: number, f: string) { // seconds, format
        var d = 0;
        var h = 0;
        var m = 0;
        switch (true) {
        case (s > 86400):
            d = Math.floor(s/86400);
            s -= d * 86400;
        case (s > 3600):
            h = Math.floor(s / 3600);
            s -= h * 3600;
        case (s > 60):
            m = Math.floor(s/60);
            s -= m * 60;
        } 
        if (f != null) {
            var f = f.replace('dd', String((d < 10) ? "0" + d : d));
            f = f.replace('d', String(d));
            f = f.replace('hh', String((h < 10) ? "0" + h : h));
            f = f.replace('h', String(h));
            f = f.replace('mm', String((m < 10) ? "0" + m : m));
            f = f.replace('m', String(m));
            f = f.replace('ss', String((s < 10) ? "0" + s : s));
            f = f.replace('s', String(s));
        } 
        else {
            f = d + ':' + h + ':' + m + ':' + s;
        }
        return f; // :) omg...
    }
}