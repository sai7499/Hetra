export const environment = {
  production: false,
  apiVersion: {
    login: "v4/",
    api: "v2/"
  },

  projectId: '74c36bec6da211eabdc2f2fa9bec3d63',

  api: {
    'getUserDetails': {
      'workflowId': '7fde429c82ea11eabdc2f2fa9bec3d63',
      'processId': '8000bb2e82ea11eabdc2f2fa9bec3d63'
    },
    'createLead': {
      'workflowId': 'f000e040845a11eabdc2f2fa9bec3d63',
      'processId': 'f0269e8e845a11eabdc2f2fa9bec3d63'
    },
    'getLOVs':{
      'workflowId': 'bd15880c904911eabdc4f2fa9bec3d63',
      'processId': '674941a2904e11eabdc4f2fa9bec3d63'
    }
  },
  host: 'http://128.199.164.250/appiyo/',

  aesPublicKey: 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJ+GJdSSEeaNFBLqyfM3DIOgQgWCwJ0INfeZZV7ITsLeuA7Yd02rrkYGIix1IWvoebWVmzhncUepYxHwK1ARCdUCAwEAAQ==',
  encryptionType: true, // Ecryption
  appiyoDrive: "/d/drive/upload/",

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
