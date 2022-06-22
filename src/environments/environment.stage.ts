
export const environment = {
    production: true,
    useEmulators: false,
    firebase: {

        // Stage uses the prod backends and auth, but stage-hosted
	// app and api.
	apiKey: "AIzaSyBD9stQwa1BX3CIN1YjEktA-bRWHqM3FfA",
	authDomain: "accounts-machine-prod.firebaseapp.com",
	projectId: "accounts-machine-prod",

    },
    features: [
	"vat",
	"corptax",
	"accounts",
	"vat-submit",
	"corptax-submit",
	"accounts-submit",
//	"crypto",
    ],
};

