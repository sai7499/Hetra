import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';

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
import {
  LocationStrategy,
  HashLocationStrategy,
  CommonModule,
} from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthInterceptor } from './services/auth.interceptor.service';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './modules/shared/shared.module';
import { LovResolverService } from '@services/Lov-resolver.service';
import { CommomLovService } from '@services/commom-lov-service';
import { UtilityService } from '@services/utility.service';
import { Authguard } from '@services/authguard';
import { LoginService } from './modules/login/login/login.service';
import { LoginModule } from './modules/login/login.module';
import { CommonDataService } from '@services/common-data.service';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core'; // @agm/core
import { AgmDirectionModule } from 'agm-direction'; // agm-direction
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { DdeSharedModule } from './modules/dde/shared/shared.module';
import {CreditConditionModule} from './modules/dde/credit-decisions/credit-decisions.module';
import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER,
  POSITION,
  PB_DIRECTION,
} from 'ngx-ui-loader';
import { LeadDataResolverService } from './modules/lead-section/services/leadDataResolver.service';

import { setTheme } from 'ngx-bootstrap/utils';
import { DatePickerModule } from '@progress/kendo-angular-dateinputs';
import { TimePickerModule } from '@progress/kendo-angular-dateinputs';
import { ToastrModule } from 'ngx-toastr';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NumberOnlyDirective } from './services/directives/number-only.directive';
import { LettersOnlyDirective } from './services/directives/letters-only.directive';
import { CanActivateService } from '@services/can-activate.service';
import { DisbursementSectionModule } from '@modules/disbursement-section/disbursement-section.module';
import { ChildLoanModule } from '@modules/child-loan/child-loan.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { CameraPreview } from '@ionic-native/camera-preview/ngx';
import { QueryDataResolverService } from '@modules/lead-section/services/queryDataResolver.service';

import { LeadUploadDiscussionComponent } from '@modules/lead-upload-discussion/lead-upload-discussion.component';
import { LeadUploadComponent } from '@modules/lead-upload/lead-upload.component';
import { WindowModule } from '@progress/kendo-angular-dialog';

setTheme('bs4');

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: 'red',
  fgsColor: '#fa6745',
  fgsSize:80,
  bgsPosition: POSITION.bottomCenter,
  bgsSize: 100,
  bgsType: SPINNER.ballSpinClockwise, // background spinner type
  fgsType: SPINNER.ballSpinClockwise, // foreground spinner type
  pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbThickness: 5, // progress bar thickness
  overlayColor: "rgba(238,237,235,0.86)",
  
};

@NgModule({
  declarations: [AppComponent, HeaderComponent, NumberOnlyDirective, LettersOnlyDirective,LeadUploadComponent, LeadUploadDiscussionComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    SharedModule,
    // BsDatepickerModule.forRoot(),
    LoginModule,
    AgmCoreModule.forRoot({
      // @agm/core
      apiKey: 'AIzaSyDJ9TZyUZNB2uY_267eIUQCV72YiYmArIw',
    }),
    AgmDirectionModule, // agm-direction
    DdeSharedModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    DatePickerModule,
    TimePickerModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
    }),
    DateInputsModule,
    AutocompleteLibModule,
    CreditConditionModule,
    // DateInputsModule,
    DatePickerModule,
    ChildLoanModule,
    WindowModule
  ],
  providers: [
    HTTP,
    DeviceDetectorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    CollapseModule,
    CommonModule,
    LovResolverService,
    LeadDataResolverService,
    QueryDataResolverService,
    CommomLovService,
    UtilityService,
    Authguard,
    LoginService,
    CommonDataService,
    GoogleMapsAPIWrapper,
    LocationAccuracy,
    Geolocation,
    Camera,
    File,
    FileTransfer,
    FileTransferObject,
    CanActivateService,
    CameraPreview,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
