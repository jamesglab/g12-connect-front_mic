// export const environment = {
//   production: true,
//   appVersion: 'v710demo1', //METRONIC
//   USERDATA_KEY: 'authf649fc9a5f55', // METRONIC
//   isMockEnabled: false, // METRONIC
//   apiUrl: 'https://plataforma.mci12.com:444/', //.NETAPI
//   apiUrlG12Connect: 'https://api.g12connect.com/api/v2/'
// };

// // This file can be replaced during build by using the `fileReplacements` array.
// // `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// // The list of file replacements can be found in `angular.json`.
//NEW FORMAT VARIABLES
export const environment = {
  production: true,
  appVersion: 'v710demo1', //METRONIC
  USERDATA_KEY: 'authf649fc9a5f55', // METRONIC
  isMockEnabled: false, // METRONIC
  apiUrl: 'http://51.79.78.171:7003/', //.NETAPI
  // apiUrlG12Connect: 'https://dev-api.g12connect.com/api/v2/',
  apiUrlG12Connect: {
    donations: 'https://api.g12connect.com/api/v2/donations',
    managment: 'https://api.g12connect.com/api/v2/managment',
    users: 'https://api.g12connect.com/api/v2/users',
    payments: 'https://api.g12connect.com/api/v2/payments',
    paymentsv3: 'https://api.g12connect.com/api/v3/payments',
    reports: 'https://api.g12connect.com/api/v2/reports',
  },
  SECRETENCRYPT: 'G12jk5FQg6bu8zWSECURITY#wB9jPyURESPONSE',
  url_response: 'https://app.mci12.com/g12events/proof-payment',
  reports_lamda:
    'https://f492-2800-484-3690-6500-4994-1ecd-317b-5594.ngrok.io/dev',
  url_change_password: 'https://mci12.com/auth/change-password',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
