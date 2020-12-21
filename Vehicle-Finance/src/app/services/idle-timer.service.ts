import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class IdleTimerService {

    timeout: number;
    callback: Function;
    interval: any;
    eventHandler: any

    $timer = new BehaviorSubject(null);



    constructor() {
    }


    getTimerObservable() {
        return this.$timer;
    }

    startTimer(timeout, callback) {
        this.timeout = timeout;
        this.callback = callback;
        this.eventHandler = this.updateExpiredTime.bind(this);
        //this.tracker();
        this.startInterVal();
    }

    againAddTimer() {
        //this.tracker();
        this.startInterVal();
    }

    private startInterVal() {
        this.updateExpiredTime();
        this.interval = setInterval(() => {
            console.log('timer 1');
            const expiredTime = Number(localStorage.getItem('_expiredTime'));
            // console.log('hi');
            // console.log('alert', expiredTime - (5 * 1000));
            // console.log('new date', Date.now())

            if(Date.now()   >= expiredTime - (5 * 1000)) {
                this.$timer.next('alert');
                this.cleanUp();
            }

            if (expiredTime < Date.now()) {
                console.log('time out');
                this.callback();
                this.cleanUp();
            }
        }, 1000);
    }

    updateExpiredTime() {
        console.log(Date.now())
        console.log('timeout',this.timeout)
        console.log(Date.now() + this.timeout * 1000);
        localStorage.setItem('_expiredTime', String(Date.now() + this.timeout * 1000));
    }

    private tracker() {
        window.addEventListener('mousemove', this.eventHandler);
        window.addEventListener('scroll', this.eventHandler);
        window.addEventListener('keydown', this.eventHandler);
    }

    cleanUp() {
        clearInterval(this.interval);
        window.removeEventListener('mousemove', this.eventHandler);
        window.removeEventListener('scroll', this.eventHandler);
        window.removeEventListener('keydown', this.eventHandler);
    }

}