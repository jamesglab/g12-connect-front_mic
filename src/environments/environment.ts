// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appVersion: 'v710demo1', //METRONIC
  USERDATA_KEY: 'authf649fc9a5f55', // METRONIC
  isMockEnabled: false, // METRONIC
  apiUrl: 'http://51.79.78.171:7003/', //.NETAPI
  // apiUrlG12Connect: 'https://dev-api.g12connect.com/api/v2/',
  apiUrlG12Connect: {
    donations: 'https://dev-api.g12connect.com/api/v2/donations',
    managment: 'https://dev-api.g12connect.com/api/v2/managment',
    users: 'https://dev-api.g12connect.com/api/v2/users',
    payments: 'https://dev-api.g12connect.com/api/v2/payments',
    paymentsv3: 'https://dev-api.g12connect.com/api/v3/payments',
    reports: 'https://dev-api.g12connect.com/api/v2/reports'
  },
  SECRETENCRYPT:"G12jk5FQg6bu8zWSECURITY#wB9jPyURESPONSE",
  url_response: 'https://dev.mci12.com/g12events/proof-payment',
  // production: true,
  // appVersion: 'v710demo1', //METRONIC
  // USERDATA_KEY: 'authf649fc9a5f55', // METRONIC
  // isMockEnabled: false, // METRONIC
  // apiUrl: 'http://51.79.78.171:7003/', //.NETAPI
  // // apiUrlG12Connect: 'https://dev-api.g12connect.com/api/v2/',
  // apiUrlG12Connect: {
  //   donations: 'https://api.g12connect.com/api/v2/donations',
  //   managment: 'https://api.g12connect.com/api/v2/managment',
  //   users: 'https://api.g12connect.com/api/v2/users',
  //   payments: 'https://api.g12connect.com/api/v2/payments',
  //   reports : 'https://3e07-200-122-253-43.ngrok.io/api/v2/reports'
  // },
  // SECRETENCRYPT:"G12jk5FQg6bu8zWSECURITY#wB9jPyURESPONSE"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
