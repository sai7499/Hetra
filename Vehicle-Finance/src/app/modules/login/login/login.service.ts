import { Observable, Observer } from 'rxjs';
import { Injectable } from '@angular/core';
import { LoginStoreService } from '@services/login-store.service';
import { HttpService } from '@services/http.service';
import RequestEntity from '@model/request.entity';
import { environment } from 'src/environments/environment';
import { ApiService } from '@services/api.service';


declare var google: any;

var API_KEY = "AIzaSyDJ9TZyUZNB2uY_267eIUQCV72YiYmArIw";
@Injectable()
export class LoginService {
  generatedImage: string;
  geocoder: google.maps.Geocoder;

  constructor(
    private httpService: HttpService,
    private loginService: LoginStoreService,
    private apiService: ApiService,
  ) { 
    this.geocoder = new google.maps.Geocoder();
  }

  getLogin(data) {
    const url =
      environment.host + 'account/' + environment.apiVersion.login + 'login';
    let body = {
      email: data.email,
      password: data.password,
      useADAuth: data.useADAuth
    };
    return this.httpService.post(url, body);
  }

  getUserDetails(data?) {
    const processId = this.apiService.api.getUserDetails.processId;
    const workflowId = this.apiService.api.getUserDetails.workflowId;
    const projectId = this.apiService.api.getUserDetails.projectId;

    let email = data ? data.userId : this.loginService.getEmailId();
    let objectKey = data ? 'userId' : 'loginId';
    const body: RequestEntity = {
      processId,
      ProcessVariables: {
        [objectKey]: email,
      },
      workflowId,
      projectId,
    };

    let url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  getPolyLine(fn, origin, destination) {
    let that = this;
    //  let origin = {
    //     latitude: 12.96186,
    //     longitude:  80.20078
    //   };
    // let  destination = {
    //     latitude: 12.98714,
    //     longitude: 80.17511
    //   };

    let directionsService = new google.maps.DirectionsService();
    var request = {
      origin: new google.maps.LatLng(origin.latitude, origin.longitude),
      destination: new google.maps.LatLng(destination.latitude, destination.longitude),
      travelMode: 'DRIVING'
    };

    directionsService.route(request, function (result, status) {
      if (status == 'OK') {
        console.log(result);
        console.log("distance", result.routes[0].legs[0].distance.value);
        // console.log(result.routes[0].overview_polyline);
        let polyline = result.routes[0].overview_polyline;
        // let distance = result.routes[0].legs[0].distance.value;
        // let distance = ((result.routes[0].legs[0].distance.value) / 1000);
        let distance = Number((result.routes[0].legs[0].distance.value / 1000).toFixed(2));
        let mapUrl = "https://maps.googleapis.com/maps/api/staticmap?sensor=false&size=400x400" +
          "&markers=color:blue%7Clabel:S%7C" + origin.latitude + "," + origin.longitude + "&" +
          "&markers=color:red%7Clabel:C%7C" + destination.latitude + "," + destination.longitude + "&" +
          "&center=" + origin.latitude + "," + origin.longitudes +
          "&path=color:red|weight:3|" +
          "enc:" + polyline +
          "&key="+ API_KEY;
        that.getBase64ImageFromURL(mapUrl).subscribe(base64data => {
          //console.log(base64data);
          // this is the image as dataUrl
          this.base64Image = 'data:image/jpg;base64,' + base64data;
          return fn(this.base64Image, distance);
        });

        // return encodeURI(polyline);
      }
    });

  }

  getBase64ImageFromURL(url: string) {
    return Observable.create((observer: Observer<string>) => {
      // create an image object
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      if (!img.complete) {
        // This will call another method that will create image from url
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = (err) => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  getBase64Image(img: HTMLImageElement) {
    // We create a HTML canvas object that will create a 2d image
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    // This will draw image    
    ctx.drawImage(img, 0, 0);
    // Convert the drawn image to Data URL
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

   /**
     * Reverse geocoding by location.
     *
     * Wraps the Google Maps API geocoding service into an observable.
     *
     * @param latLng Location
     * @return An observable of GeocoderResult
     */
    geocode(latLng: google.maps.LatLng): Observable<google.maps.GeocoderResult[]> {
      return Observable.create((observer: Observer<google.maps.GeocoderResult[]>) => {
          // Invokes geocode method of Google Maps API geocoding.
          this.geocoder.geocode({ location: latLng }, (
              (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
                  if (status === google.maps.GeocoderStatus.OK) {
                      observer.next(results);
                      observer.complete();
                  } else {
                      console.log('Geocoding service: geocoder failed due to: ' + status);
                      observer.error(status);
                  }
              })
          );
      });
    }

}


