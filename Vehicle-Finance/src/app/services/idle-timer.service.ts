import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ApiService } from './api.service';
import { HttpService } from './http.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class IdleTimerService {
    interval: any;
    eventHandler: any

    // MODAL_TIMER = 120 // seconds;window["env"]["expriyAlertTime"] = "30";
    MODAL_TIMER = Number(window["env"]["expriyAlertTime"]);// seconds
    // SESSION_TIMER = 15 * 60; // 15 * 60 seconds (900 seconds)window["env"]["userConfig"]
    SESSION_TIMER = Number(window["env"]["sessionTime"]) * 60;
    $timer = new BehaviorSubject(null);



    constructor(private apiService: ApiService, private httpService: HttpService) {
    }


    getModalTimer() {
        return this.MODAL_TIMER;
    }

    getSessionTimer() {
        return this.SESSION_TIMER;
    }


    getTimerObservable() {
        return this.$timer;
    }

    startTimer() {
        // this.timeout = timeout;
        // this.callback = callback;
        this.eventHandler = this.updateExpiredTime.bind(this);
        //this.tracker();
        this.startInterVal();
    }

    againAddTimer() {
        //this.tracker();
        this.updateToken()
            .subscribe((value: any) => {
                const processVariables = value.ProcessVariables || {};
                const error = processVariables.error || null;
                if(error && error.code === '0') {
                    this.startInterVal();
                }
            });

    }

    private startInterVal() {
        this.updateExpiredTime();
        this.interval = setInterval(() => {
            // console.log('timer 1');
            const expiredTime = Number(localStorage.getItem('_expiredTime'));
            if(Date.now()   >= expiredTime - (this.MODAL_TIMER * 1000)) {
                this.$timer.next('alert');
                this.cleanUp();
            }

            if (expiredTime < Date.now()) {
                console.log('time out');
                this.cleanUp();
            }
        }, 1000);
    }

    updateExpiredTime() {
        console.log(Date.now())
     
        localStorage.setItem('_expiredTime', String(Date.now() + this.SESSION_TIMER * 1000));
    }

    private tracker() {
        window.addEventListener('mousemove', this.eventHandler);
        window.addEventListener('scroll', this.eventHandler);
        window.addEventListener('keydown', this.eventHandler);
    }

    cleanUp() {
        this.$timer.next('clear');
        clearInterval(this.interval);
        window.removeEventListener('mousemove', this.eventHandler);
        window.removeEventListener('scroll', this.eventHandler);
        window.removeEventListener('keydown', this.eventHandler);
    }

    private updateToken() {
        const processId = this.apiService.api.session.processId;
        const workflowId = this.apiService.api.session.workflowId;
        const projectId = this.apiService.api.session.projectId;
        const requestEntity = {
            processId,
            ProcessVariables:  {},
            workflowId,
            projectId,
            showLoader: false
        };

        let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
 
        return this.httpService.post(url, requestEntity);
    }


}