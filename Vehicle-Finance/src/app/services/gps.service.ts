import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { Geolocation } from '@ionic-native/geolocation/ngx';

import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';




declare var AdvancedGeolocation: any;

@Injectable({
  providedIn: 'root'
})
export class GpsService {

  geoLocationError = {
    1 : "PERMISSION_DENIED",
    2 : "POSITION_UNAVAILABLE",
    3 : "TIMEOUT"
  }

  constructor(private locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation) { 
    this.initLatLong();
  }

  initLatLong() {

    const obs = new Observable(observer => {

      this.locationAccuracy.canRequest().then((canRequest: boolean) => {

        if(canRequest) {
          // the accuracy option will be ignored by iOS
          this.locationAccuracy.
          request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() =>{
              console.log('Request successful');
              var obj = {
                "result": true
              }
              observer.next(obj);
              observer.complete();    
            },
            error => {
              var obj = {
                "result": false,
                "error": error
              }
              console.log('Error requesting location permissions', error);
              observer.next(obj);
              observer.complete();    
            }
          )}
      
      });

    });

    return obs;

    
  }

  getBrowserLatLong() {

    const obs = new Observable(observer => {

      var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
      
      function success(pos) {
        var crd = pos.coords;
      
        console.log('Your current position is:');
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);

        if(crd["latitude"]){
          let gps = {
            "latitude": crd["latitude"],
            "longitude": crd["longitude"]
          }
          observer.next(gps);
          observer.complete();
        }

        
      }
      
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        observer.next(err);
        observer.complete();
    }
      
      navigator.geolocation.getCurrentPosition(success, error, options);

    });
    return obs;
  }

  getLatLong() {

    let that = this;

    const obs = new Observable(observer => {

      let options =  { 
        maximumAge: 3000,
        timeout: 5000,
        enableHighAccuracy: false 
      };
  
      this.geolocation.getCurrentPosition(options).then((position) => {
        let coords = position.coords;
       

        if(coords["latitude"]){
          let gps = {
            "latitude": coords["latitude"],
            "longitude": coords["longitude"]
          }
          observer.next(gps);
          observer.complete();
        }           
      }).catch((error) => {
        console.log("Code", error["code"]);
        let code = error["code"];
        switch(code){
          case 1://PERMISSION_DENIED
              console.log('Error', this.geoLocationError[code]);
            break;
          case 2://POSITION_UNAVAILABLE
              console.log('Error', this.geoLocationError[code]);
              that.advanceGPSLocation(observer);
            break;
          case 3://TIMEOUT
              console.log('Error', this.geoLocationError[code]);
              that.advanceGPSLocation(observer);
            break;
        }
         console.log('Error getting location', error);
      });
  
    });

    return obs;

    // that.advanceGPSLocation();

    
  }


  advanceGPSLocation(observer) {
    // Implement this in `deviceready` event callback
    AdvancedGeolocation.start(function(success){


      try{
          var jsonObject = JSON.parse(success);
          
          let gps = {
            "latitude": jsonObject["latitude"],
            "longitude": jsonObject["longitude"]
          }
          observer.next(gps);
          observer.complete();
          
          AdvancedGeolocation.stop();

          switch(jsonObject.provider){
              case "gps":
                   //TODO
                   console.log("GPS", jsonObject);
                  break;

              case "network":
                   //TODO
                  console.log("Network", jsonObject);
                  break;

              case "satellite":
                   //TODO
                   console.log("Satellite", jsonObject);
                  break;
                  
              case "cell_info":
                //TODO
                console.log("Cell_info", jsonObject);
                break;
                
              case "cell_location":
                //TODO
                console.log("cell_location", jsonObject);
                break;  
              
              case "signal_strength":
                //TODO
                console.log("signal_strength", jsonObject);
                break;              	
          }
      }
      catch(exc){
          console.log("Invalid JSON: " + exc);
      }
  },
  function(error){
      console.log("ERROR! " + JSON.stringify(error));
      observer.next(error);
      observer.complete();  

  },
  ////////////////////////////////////////////
  //
  // REQUIRED:
  // These are required Configuration options!
  // See API Reference for additional details.
  //
  ////////////////////////////////////////////
  {
      "minTime":500,         // Min time interval between updates (ms)
      "minDistance":1,       // Min distance between updates (meters)
      "noWarn":true,         // Native location provider warnings
      "providers":"all",     // Return GPS, NETWORK and CELL locations
      "useCache":true,       // Return GPS and NETWORK cached locations
      "satelliteData":false, // Return of GPS satellite info
      "buffer":false,        // Buffer location data
      "bufferSize":0,        // Max elements in buffer
      "signalStrength":false // Return cell signal strength data
  });
}



}