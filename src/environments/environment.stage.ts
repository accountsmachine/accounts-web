
export const environment = {
    production: true,
    useEmulators: false,
    firebase: {
        // Stage uses the prod backends and auth, but stage-hosted
	// app and api.
//	apiKey: "AIzaSyBD9stQwa1BX3CIN1YjEktA-bRWHqM3FfA",
//	authDomain: "accounts-machine-prod.firebaseapp.com",
//	projectId: "accounts-machine-prod",

	apiKey: "AIzaSyA1m3XnFvLIZu7CWKHOjGv1N3o3pmRFtEY",
	authDomain: "accounts-machine-dev.firebaseapp.com",
	projectId: "accounts-machine-dev",


    },
    features: [
	"vat",
	"corptax",
	"accounts"
	"vat-submit",
	"corptax-submit",
	"accounts-submit",
    ],
};

