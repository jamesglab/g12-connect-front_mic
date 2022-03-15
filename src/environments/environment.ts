// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appVersion: 'v710demo1', //METRONIC
  USERDATA_KEY: 'authf649fc9a5f55', // METRONIC
  isMockEnabled: false, // METRONIC
  apiUrl: 'http://51.79.78.171:7003/', //.NETAPI
  // dev.apiUrlG12Connect: 'https://dev.api.g12connect.com/dev.api/v2/',
  apiUrlG12Connect: {
    donations: 'https://dev-api.g12connect.com/api/v2/donations',
    managment: 'https://dev-api.g12connect.com/api/v2/managment',
    users: 'http://localhost:3004/api/v2/users',
    payments: 'https://dev-api.g12connect.com/api/v2/payments',
    paymentsv3: 'https://dev-api.g12connect.com/api/v3/payments',
    reports: 'https://dev-api.g12connect.com/api/v2/reports',
  },
  SECRETENCRYPT: 'G12jk5FQg6bu8zWSECURITY#wB9jPyURESPONSE',
  url_response: 'https://dev.mci12.com/g12events/proof-payment',
  reports_lamda:
    'https://1cd3-2800-484-3690-6500-197e-9881-56e6-162.ngrok.io/dev',
};
