import { Injectable } from '@angular/core';
import { observable, Observable } from 'rxjs';

Injectable({
    providedIn: 'root'
})
export class CommomLovService {
    lovData: any;

    setLovData(LOVsData) {
        this.lovData = LOVsData;
    }

    getLovData(){
        return this.lovData;
    }
}