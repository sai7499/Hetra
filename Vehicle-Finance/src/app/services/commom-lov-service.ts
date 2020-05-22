import { Injectable } from '@angular/core';

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