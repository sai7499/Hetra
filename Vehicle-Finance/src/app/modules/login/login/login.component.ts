import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

import { LabelsService } from "src/app/services/labels.service";
import { LoginStoreService } from '../../../services/login-store.service';

import {GoogleMapsAPIWrapper} from '@agm/core';

import { GpsService } from "src/app/services/gps.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  direction: any;
  
  labels: any = {};


  loginForm: FormGroup;

  loginData: {
    email: string,
    password: string
  }

  lat: any;
  lng: any;
  zoom: any;
  flag: boolean;

  geoLocationError = {
    1 : "PERMISSION_DENIED",
    2 : "POSITION_UNAVAILABLE",
    3 : "TIMEOUT"
  }

  constructor(
    private loginService: LoginService,
    private router: Router,
    private labelsData: LabelsService,
    private loginStoreService: LoginStoreService,
    private gmapsApi: GoogleMapsAPIWrapper,
    private gpsService: GpsService
  ) { }

  ngOnInit() {

    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
        // console.log(this.labels)
      },
      error => {
        console.log(error);
      }
    );

    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });

    /* Get latitude and longitude from mobile */

    this.gpsService.initLatLong().subscribe((res) =>{
      if(res){
        this.gpsService.getLatLong().subscribe((position) =>{
          console.log("login position", position);
        });  
      }else {
        console.log(res);
      }
    });
  }

  login() {
    this.loginData = this.loginForm.value;
    this.loginService.getLogin(this.loginData).subscribe((res: any) => {
      const response = res;
      if (response.status) {
        const token = response.token;
        console.log('token', token);
        localStorage.setItem('token', token);
        localStorage.setItem('email', this.loginData.email)

        this.loginService.getUserDetails().subscribe((res: any) => {
          const response = res;
          if (response.Error === '0') {
            const roles = response.ProcessVariables.roles;
            const userDetails = response.ProcessVariables.userDetails;
            this.loginStoreService.setRolesAndUserDetails(roles, userDetails);
            this.router.navigateByUrl('/activity-search');
            // const role = response.ProcessVariables.roles[0].name;
            // if (role === 'Sales Officer') {
            //   this.router.navigateByUrl('/activity-search');
            // }
          }
        })
      }
    },
      err => {
        alert('Invalid Login')
        this.loginForm.reset()
      })
  }

  showMap() {
    this.flag = true;
    this.lat = 12.963134;
    this.lng = 80.198337;
    //google maps zoom
    this.zoom = 14;
  
    this.direction = {
      origin: { lat: 12.963134, lng: 80.198337 },
      destination: { lat: 12.990884, lng: 80.242167 }
    }
  }

  openMap() {

    let dirUrl = "https://www.google.com/maps/dir/?api=1&origin=12.963134,80.198337&destination=12.990884,80.242167"
    window.open(dirUrl, "_blank", "location=yes");


  }

}

