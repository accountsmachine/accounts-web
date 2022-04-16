// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    useEmulators: false,
    firebase: {
	apiKey: "AIzaSyD6SunplTX-Le2xXjFuv6EWFlxsu_WU2NE",
	authDomain: "accounts-machine-dev.firebaseapp.com",
	projectId: "accounts-machine-dev",
	storageBucket: "accounts-machine-dev.appspot.com",
	messagingSenderId: "305498129524",
	appId: "1:305498129524:web:d11bef85b87f7632a1fd21",
	measurementId: "G-CN6FHHTDLQ"
    },
    features: [
	"vat",
	"corptax",
	"accounts"
    ],
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

