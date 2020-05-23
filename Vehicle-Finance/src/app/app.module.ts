import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { DeviceDetectorService } from 'ngx-device-detector';
import { HTTP } from '@ionic-native/http/ngx';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './modules/header/header.component';
// import { LeadSectionModule } from './modules/lead-section/lead-section.module';
import { LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor.service';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule} from './modules/shared/shared.module';
import { LovResolverService } from '@services/Lov-resolver.service';
import { CommomLovService } from '@services/commom-lov-service';
import { UtilityService } from '@services/utility.service';
import { Authguard } from '@services/authguard';
import { LoginService } from './modules/login/login/login.service';
import { LoginModule } from './modules/login/login.module';
import { CommonDataService } from '@services/common-data.service';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';            // @agm/core
import { AgmDirectionModule } from 'agm-direction';   // agm-direction
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Camera } from '@ionic-native/camera/ngx';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    LoginModule,
    AgmCoreModule.forRoot({ // @agm/core
      apiKey: 'AIzaSyDJ9TZyUZNB2uY_267eIUQCV72YiYmArIw',
    }),
    AgmDirectionModule,     // agm-direction
  ],
  providers: [
    HTTP,
    DeviceDetectorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {  provide : LocationStrategy,
      useClass: HashLocationStrategy
    },
    CollapseModule,
    BrowserAnimationsModule,
    CommonModule,
    LovResolverService,
    CommomLovService,
    UtilityService,
    Authguard,
    LoginService,
    CommonDataService,
    GoogleMapsAPIWrapper,
    LocationAccuracy,
    Geolocation,
    Camera
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
