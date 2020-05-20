import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class DataService {

    private _url: string = 'https://jsonplaceholder.typicode.com/todos/1';

    constructor(private http: HttpClient) { 
        this.init();
    }

    init() {
        return this.http.get(this._url)
    }

}