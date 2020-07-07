import { Observable, Observer } from 'rxjs';
import { Injectable } from '@angular/core';
import { LoginStoreService } from '@services/login-store.service';
import { HttpService } from '@services/http.service';
import RequestEntity from '@model/request.entity';
import { environment } from 'src/environments/environment';
import { ApiService } from '@services/api.service';

declare var google: any;

@Injectable()
export class LoginService {
  generatedImage: string;
  constructor(
    private httpService: HttpService,
    private loginService: LoginStoreService,
    private apiService: ApiService
  ) {}

  getLogin(data) {
    const url =
      environment.host + 'account/' + environment.apiVersion.login + 'login';
    let body = {
      email: data.email,
      password: data.password,
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

  getPolyLine(origin?, destination?, fn) {
    // let url = "https://maps.googleapis.com/maps/api/directions/json?origin=12.96186,80.20078&destination=12.98714,80.17511&key=AIzaSyDJ9TZyUZNB2uY_267eIUQCV72YiYmArIw";
    // return this.httpService.get(url);
    let that =  this;

    let directionsService = new google.maps.DirectionsService();
    var request = {
      origin: new google.maps.LatLng(12.96186, 80.20078),
      destination: new google.maps.LatLng(12.98714, 80.17511),
      travelMode: 'DRIVING'
    };

    directionsService.route(request, function(result, status) {
      if (status == 'OK') {
        console.log(result);
        console.log(result.routes[0].overview_polyline);
        let polyline = result.routes[0].overview_polyline;
        let imageUrl = "https://maps.googleapis.com/maps/api/staticmap?sensor=false&size=400x400&markers=color:blue%7Clabel:S%7C12.96186,80.20078&&markers=color:red%7Clabel:C%7C12.98714,80.17511&&center=12.96186,80.20078&path=color:red|weight:3|enc:orbnAqfohNh@DKzAE%60BEjAAjADxA_C?CFClBGNGBK@g@EcAMMn@UlAOz@%5BtAo@~@i@%60AKDq@CoAE?PEf@QdBIn@Ff@?%5E%5BfB%5BrBEx@@r@Av@_@jC_@hC_AtHq@%7CFgBk@q@Kw@UcEoA_C%7B@iAe@sAa@cBm@m@UUSmBm@gEwAsCaAkA%5DwHsByCy@iBs@aCsAKCWMu@c@i@Um@Oi@KiBKiCe@s@U%5DSWOu@i@a@c@_B_AcBs@yDaBkAk@m@Yk@Ou@%5DMGWISHk@Ra@JaBTiBHkD?%7B@Du@JyCj@qCh@gANgABYA_ECm@A_DCc@Ly@j@a@%60@oAnBoB~CWX%5BJi@HoCJyI?%7DGHsBD?@A@EDG@OCCAoAz@%7DD%60DbExFrAhB%60AfAv@t@r@~@%60@j@d@z@p@~At@jBr@~AbBjErAjDlAnCpBnEhAzBj@z@fAfBnErGdEtF%60AnAj@~@ULe@%60@g@d@TXvCtDfApAVZZ%5ENH%60@j@Zd@JHXDNJ%5CXXRb@v@NZc@XRx@@F&key=AIzaSyDJ9TZyUZNB2uY_267eIUQCV72YiYmArIw";
        that.getBase64ImageFromURL(imageUrl).subscribe(base64data => {    
          console.log(base64data);
          // this is the image as dataUrl
          this.base64Image = 'data:image/jpg;base64,' + base64data;

          //that.createBlobImageFileAndShow(this.base64Image);
          return fn(this.base64Image);
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


}


