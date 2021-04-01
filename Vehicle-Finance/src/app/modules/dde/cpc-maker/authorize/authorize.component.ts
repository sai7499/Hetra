import { getMatScrollStrategyAlreadyAttachedError } from "@angular/cdk/overlay/typings/scroll/scroll-strategy";
import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CreateLeadDataService } from "@modules/lead-creation/service/createLead-data.service";
import { SharedService } from "@modules/shared/shared-service/shared-service";
import { ApplicantService } from "@services/applicant.service";
import { Base64StorageService } from "@services/base64-storage.service";
import { CpcRolesService } from "@services/cpc-roles.service";
import { DraggableContainerService } from "@services/draggable.service";
import { LabelsService } from "@services/labels.service";
import { LoginStoreService } from "@services/login-store.service";
import { ToasterService } from "@services/toaster.service";
import { UploadService } from "@services/upload.service";

@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.css']
})
export class AuthorizeComponent implements OnInit {

  applicantDetails: any = [];

  isSendCredit: boolean;
  isSendToMaker: boolean;

  addressDetails: any = {};
  newAddressDetails: any = {};

  sendCreModalDetails: any;
  sendCreModalButtons: any;

  sendMakModalDetails: any;
  sendMakModalButtons: any;

  authorizeForm: FormGroup;
  leadId: any;
  userId: string;
  roleType: any;

  taskId: any;
  leadSectionData: any;


  setCss = {
    top: '',
    left: '',
  };

  showDraggableContainer: {
    imageUrl: string;
    imageType: string;
  };


  constructor(private _fb: FormBuilder, private applicantService: ApplicantService, private draggableContainerService: DraggableContainerService,
    private route: ActivatedRoute, private toasterService: ToasterService, private createLeadDataService: CreateLeadDataService,
    private cpcService: CpcRolesService, private router: Router, private sharedService: SharedService, private base64StorageService: Base64StorageService,
    private loginStoreService: LoginStoreService, private labelsService: LabelsService, private uploadService: UploadService,) { }

  async ngOnInit() {
    this.leadId = (await this.getLeadId()) as number;

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    let roles = roleAndUserDetails.roles;
    this.roleType = roles[0].roleType;

    this.authorizeForm = this._fb.group({
      applicantFormArray: this._fb.array([])
    })

    this.leadSectionData = this.createLeadDataService.getLeadSectionData();

    this.getAuthorizeDetails();

    this.labelsService.getModalDetails().subscribe((data) => {
      const details = data.pdcDetials;

      this.sendMakModalDetails = data.checkList.sendToMaker.modalDetails;
      this.sendMakModalButtons = data.checkList.sendToMaker.modalButtons;

      this.sendCreModalDetails = details.sendToCredit.modalDetails;
      this.sendCreModalButtons = details.sendToCredit.modalButtons;
    })

    this.sharedService.taskId$.subscribe((val: any) => (this.taskId = val ? val : ''));
  }

  getLeadId() {
    return new Promise((resolve, reject) => {
      this.route.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }

  getAuthorizeDetails() {

    let data = {
      "leadId": this.leadId,
      "userId": localStorage.getItem('userId')
    }

    this.applicantService.getAuthorizeDetails(data).subscribe((res: any) => {
      console.log('res', res)

      if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
        this.applicantDetails = res.ProcessVariables.ckycDetails ? res.ProcessVariables.ckycDetails : [];
        if (res.ProcessVariables.error.message !== 'Success') {
          this.toasterService.showInfo(res.ProcessVariables.error.message, '')
        }

        let formArray = (this.authorizeForm.get('applicantFormArray') as FormArray);

        formArray.controls = [];

        if (res.ProcessVariables.ckycDetails && res.ProcessVariables.ckycDetails.length > 0) {

          this.applicantDetails.forEach((element, index) => {

            // console.log(JSON.parse(element.documents.ID_PROOF))

            let address = this.addressDetails[element.applicantId];
            let newAddress = this.newAddressDetails[element.applicantId];

            let documents = element.documents;
            let ID_PROOF = [627913]
            let ADDRESS_PROOF = [628666, 628667]

            address = {
              city: [],
              country: [],
              district: [],
              state: []
            }

            newAddress = {
              city: [],
              country: [],
              district: [],
              state: []
            }

            address.city = [{
              key: element.exCityCode,
              value: element.exCityName
            }]

            address.country = [{
              key: element.exCountryCode,
              value: element.exCountryName
            }]

            address.district = [{
              key: element.exDistrictCode,
              value: element.exDistrictName
            }]

            address.state = [{
              key: element.exStateCode,
              value: element.exStateName
            }]

            newAddress.city = [{
              key: element.nwCityCode,
              value: element.nwCityName
            }]

            newAddress.country = [{
              key: element.nwCountryCode,
              value: element.nwCountryName
            }]

            newAddress.district = [{
              key: element.nwDistrictCode,
              value: element.nwDistrictName
            }]

            newAddress.state = [{
              key: element.nwStateCode,
              value: element.nwStateName
            }]

            this.addressDetails[element.applicantId] = address;
            this.newAddressDetails[element.applicantId] = newAddress;

            formArray.push(
              this._fb.group({
                applicantId: element.applicantId,
                applicantType: element.applicantType,
                applicantTypeDesc: element.applicantTypeDesc,
                entityType: element.entityType,
                entityTypeDesc: element.entityTypeDesc,
                exAddressLn1: element.exAddressLn1,
                exAddressLn2: element.exAddressLn2,
                exAddressLn3: element.exAddressLn3,
                exAddressType: element.exAddressType,
                exCityCode: element.exCityCode,
                exCityName: element.exCityName,
                exCountryCode: element.exCountryCode,
                exCountryName: element.exCountryName,
                exDistrictCode: element.exDistrictCode,
                exDistrictName: element.exDistrictName,
                exLandLine: element.exLandLine,
                exLandMark: element.exLandMark,
                exMobile: element.exMobile,
                exPinCode: element.exPinCode,
                exStateCode: element.exStateCode,
                exStateName: element.exStateName,
                existingAadhar: element.existingAadhar,
                existingMobile: element.existingMobile,
                isAadharUpdate: element.isAadharUpdate,
                isAddressUpdate: element.isAddressUpdate,
                isMobileUpdate: element.isMobileUpdate,
                newAadhar: element.newAadhar,
                newMobile: element.newMobile,
                nwAddressLn1: element.nwAddressLn1,
                nwAddressLn2: element.nwAddressLn2,
                nwAddressLn3: element.nwAddressLn3,
                nwAddressType: element.nwAddressType,
                nwCityCode: element.nwCityCode,
                nwCityName: element.nwCityName,
                nwCountryCode: element.nwCountryCode,
                nwCountryName: element.nwCountryName,
                nwDistrictCode: element.nwDistrictCode,
                nwDistrictName: element.nwDistrictName,
                nwLandLine: element.nwLandLine,
                nwLandMark: element.nwLandMark,
                nwMobile: element.nwMobile,
                nwPinCode: element.nwPinCode,
                nwStateCode: element.nwStateCode,
                nwStateName: element.nwStateName,
                ucic: element.ucic,
                aadharProof: [ID_PROOF],
                addressProof: [ADDRESS_PROOF],
                // aadharProof: JSON.parse(documents.ID_PROOF).length > 0 ? documents.ID_PROOF : ID_PROOF,
                // addressProof: JSON.parse(documents.ADDRESS_PROOF).length > 0 ? documents.ADDRESS_PROOF : ADDRESS_PROOF,
                documents: element.documents
              })
            )
          });

          this.authorizeForm.disable()

        }
      } else {
        this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, '')
      }
    })
  }

  async downloadDocs(documentId, index, event) {

    let el = event.srcElement;

    if (!documentId) {
      return;
    }

    let collateralId = this.leadSectionData['vehicleCollateral'] ? this.leadSectionData['vehicleCollateral'][0] : this.leadSectionData['applicantDetails'][0];

    if (!collateralId.collateralId) {
      return;
    }

    const bas64String = this.base64StorageService.getString(
      collateralId.collateralId + documentId
    );
    if (bas64String) {
      this.setContainerPosition(el);
      this.showDraggableContainer = {
        imageUrl: bas64String.imageUrl,
        imageType: bas64String.imageType,
      };
      this.draggableContainerService.setContainerValue({
        image: this.showDraggableContainer,
        css: this.setCss,
      });
      return;
    }
    const imageValue: any = await this.getBase64String(documentId);
    if (imageValue.imageType.includes('xls')) {
      this.getDownloadXlsFile(imageValue.imageUrl, imageValue.documentName, 'application/vnd.ms-excel');
      return;
    }
    if (imageValue.imageType.includes('doc')) {
      this.getDownloadXlsFile(imageValue.imageUrl, imageValue.documentName, 'application/msword');
      return;
    }
    this.setContainerPosition(el);
    this.showDraggableContainer = {
      imageUrl: imageValue.imageUrl,
      imageType: imageValue.imageType,
    };
    this.draggableContainerService.setContainerValue({
      image: this.showDraggableContainer,
      css: this.setCss,
    });
    this.base64StorageService.storeString(collateralId.collateralId + documentId, {
      imageUrl: imageValue.imageUrl,
      imageType: imageValue.imageType,
    });
  }

  getDownloadXlsFile(base64: string, fileName: string, type) {
    const contentType = type;
    const blob1 = this.base64ToBlob(base64, contentType);
    const blobUrl1 = URL.createObjectURL(blob1);

    setTimeout(() => {

      const a: any = document.createElement('a');
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = blobUrl1;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(blobUrl1);
    });
  }

  base64ToBlob(b64Data, contentType, sliceSize?: any) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  getBase64String(documentId) {
    return new Promise((resolve, reject) => {
      this.uploadService
        .getDocumentBase64String(documentId)
        .subscribe((value) => {
          const imageUrl = value['dwnldDocumentRep'].msgBdy.bsPyld;
          const documentName = value['dwnldDocumentRep'].msgBdy.docNm || '';
          const imageType = documentName.split('.')[1].toLowerCase();

          resolve({
            imageUrl,
            imageType,
            documentName
          });
        });
    });
  }

  setContainerPosition(el) {
    let offsetLeft = 0;
    let offsetTop = 0;
    while (el) {
      offsetLeft += el.offsetLeft;
      offsetTop += el.offsetTop;
      el = el.offsetParent;
    }
    this.setCss = {
      top: offsetTop + 'px',
      left: offsetLeft + 'px',
    };
  }

  sendBackToCredit() {
    const body = {
      leadId: this.leadId,
      userId: localStorage.getItem('userId'),
      isCPCMaker: false,
      isCPCChecker: false,
      sendBackToCredit: true,
      taskId: this.taskId,
    };

    this.cpcService.getCPCRolesDetails(body).subscribe((res: any) => {
      if (res.ProcessVariables.error.code == '0') {
        this.toasterService.showSuccess('Submitted Sucessfully', 'Send Back To Credit');
        this.router.navigate([`pages/dashboard`]);
      } else {
        this.toasterService.showError(res.Processvariables.error.message, '');
      }
    });
  }

  sendBackToMaker() {
    const body = {
      leadId: this.leadId,
      userId: localStorage.getItem('userId'),
      isCPCMaker: true,
      isCPCChecker: false,
      sendBackToCredit: false,
      taskId: this.taskId,
    };
    this.cpcService.getCPCRolesDetails(body).subscribe((res: any) => {

      if (res.ProcessVariables.error.code == '0') {
        this.toasterService.showSuccess('Submitted Sucessfully', 'Send Back To CPC Maker');
        this.router.navigate([`pages/dashboard`]);
      } else {
        this.toasterService.showError(res.Processvariables.error.message, '');
      }
    });
  }

  onBack() {
    if (this.roleType == '4') {
      this.router.navigate([`pages/cpc-maker/${this.leadId}/pdc-details`]);
    } else if (this.roleType == '5') {
      this.router.navigate([
        `pages/cpc-checker/${this.leadId}/disbursement`,
      ]);
    }
  }

}