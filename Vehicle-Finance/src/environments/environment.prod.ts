export const environment = {
  production: true,
  version: '0.2.3',
  buildDate: '25/06/2020',
  apiVersion: {
    login: 'v3/',
    api: 'v2/',
  },

  projectIds: {
    salesProjectId: '8bfa8dba945b11eabdcaf2fa9bec3d63',
    externalApi: 'db2732f4ab4811ea82f8f2fa9bec3d63',
    // salesCreditScore: 'db2732f4ab4811ea82f8f2fa9bec3d63'
  },
  // hostingEnvironment: 'DEV',
  // hostingEnvironment: 'UAT',
  hostingEnvironment: 'Production',

  //host: '/appiyo/',
   host: 'http://128.199.164.250/appiyo/',

  // tslint:disable-next-line: max-line-length
  aesPublicKey:
    'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJ+GJdSSEeaNFBLqyfM3DIOgQgWCwJ0INfeZZV7ITsLeuA7Yd02rrkYGIix1IWvoebWVmzhncUepYxHwK1ARCdUCAwEAAQ==',
  encryptionType: true, // Ecryption
  appiyoDrive: '/d/drive/upload/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
