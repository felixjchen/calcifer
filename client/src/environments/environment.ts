// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  domain: 'http://0.0.0.0:4200',
  api_url: 'http://0.0.0.0:8080',
  ssh_url: 'http://0.0.0.0:8000',
  docsync_http_url: 'http://0.0.0.0:9000',
  docsync_ws_url: 'ws://0.0.0.0:9000',
  path: '/socket.io',
  default_parameters: {
    host: '159.203.46.232',
    username: 'root',
    password: '4ULuG4J2H.Mp7Y',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
