export const environment = {
  production: true,
  version: '0.17.2',
  buildDate: '22/09/2020',
  apiVersion: {
    login: 'v3/',
    api: 'v2/',
  },

  projectIds: {
    salesProjectId: '8bfa8dba945b11eabdcaf2fa9bec3d63',
    otpProjectId: 'db2732f4ab4811ea82f8f2fa9bec3d63',
    salesCreditScore: 'db2732f4ab4811ea82f8f2fa9bec3d63',
    creditProjectId: '6cc61c5ca7e811ea800cf2fa9bec3d63',
    externalApi: 'db2732f4ab4811ea82f8f2fa9bec3d63',
    reinitiatePdApi: '403a8a12b79511ea8afff2fa9bec3d63',
    camProjectId: '74c36bec6da211eabdc2f2fa9bec3d63',
    submitToCredit: '403a8a12b79511ea8afff2fa9bec3d63',
    viabilityApi: '0d888054a7e811ea800bf2fa9bec3d63',
    wrapperPanValidation : 'db2732f4ab4811ea82f8f2fa9bec3d63',
    wrapperBiometriceKYC : 'db2732f4ab4811ea82f8f2fa9bec3d63',
    supervisorProId:'ed58f72ea9a811ea824bf2fa9bec3d63',//supervisorRelated
    reinititateFiApi: '403a8a12b79511ea8afff2fa9bec3d63',
    retrieveAadharData : 'db2732f4ab4811ea82f8f2fa9bec3d63',
    validateSRNumber : '8bfa8dba945b11eabdcaf2fa9bec3d63'
  },
  hostingEnvironment: 'DEV',
  // hostingEnvironment: 'UAT',
  // hostingEnvironment: 'Production',

  host: '/appiyo/',
  // host: "https://hetrauat.equitasbank.com/appiyodev/",
  //host: 'http://128.199.164.250/appiyo/',
  // host: 'http://10.101.10.153/appiyo/',
  //host: "https://hetrauat.equitasbank.com/appiyo/",

  baseUrl: window.location.origin,
  // tslint:disable-next-line: max-line-length
  aesPublicKey:
    'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJ+GJdSSEeaNFBLqyfM3DIOgQgWCwJ0INfeZZV7ITsLeuA7Yd02rrkYGIix1IWvoebWVmzhncUepYxHwK1ARCdUCAwEAAQ==',
  encryptionType: true, // Ecryption
  appiyoDrive: '/d/drive/upload/',
  
  mobileBaseUrl: "https://hetrauat.equitasbank.com",
  isMobile: false,
  isMaas360Enabled: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
