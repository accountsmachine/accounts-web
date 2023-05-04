
# accounts-web

## Accounts Machine

Accounts Machine is a UK VAT filing application.  Users use gnucash
or other tools to manage their accounts, and then upload the account
files to Accounts Machine to file VAT returns with HMRC.  Accounts
Machine manages the linking of user accounts to HMRC, and the submission
of VAT return records using HMRC's MTD.

Other functionality exists for Companies House and HMRC Corporation Tax
filing, but this is incomplete and needs further work, and so is
switched off in the production application.

## Overview

This repository is the front-end for accountsmachine.io.  The backend,
[`accounts-svc`](https://github.com/accountsmachine/accounts-svc)
is a separate repository.


```
                     ,-----------------.
                     |                 |        ,--------------.
  browser ------------> proxy ----------------> | accounts-svc |
                     |    |            |        `--------------'
                     |    '-- web app  |
                     |                 |
                     |   accounts-web  |
                     `-----------------'
```

The front-end is deployed to production in a container.  The container
contains an HTTP service at the very front end.  The service serves
static web resources which make up the web application, while also proxying
HTTP requests to the back-end service so that the web browser only needs to
interact with a single origin.

## Web application

The browser application is built using Angular.

Of note:
- Firebase auth is used for accounts.  Users can register using the
  application.  Firebase ensures emails are verified.
- The firebase web API key is 'public' information and locked to the domain,
  is loaded into the container by the deployment scripts.
- Payment services are provided (everything in the shop is currently free).
  Stripe payments are implemented with a combination of code in the backend
  and front-end.

## Deployment environments

There are 4 deployment environments:
- local: For running the accounts-web and accounts-svc locally
  for development & testing.  Uses the dev account for authentication and
  storage.
- dev: Application deployment to a development account for semi-realistic
  testing.  The VAT service is a dummy one, so there is no interaction with
  HMRC live services.
- stage: Application deployment to a stage account.  The backend service
  uses the prod account for authentication and storage.  Filing is to the
  HMRC live, as for prod.  This is only for 'testing' that the live build
  works, can't be used to 'test' filing procedures as the filing backend
  is real.
- production: Deployment is to the prod account.  Uses prod auth, prod
  storage, and live filing systems.

Domain restrictions restrict who can log in to dev/stage.  Most normal
users can only access 'prod'.

## Deployment

Deployment is using Github actions and Pulumi scripts.
Actions is used to build the Angular app and create the container.
Pulumi is used to push the container to Google Cloud and run it in
Cloud Run service.  The web key used by Firebase for authentication
is created by Pulumi.  Github is authenticated with Google Cloud so there
are no 'deploy' secrets in existence.  The pipelines have full access to
the cloud environments, and so care needs to be taken to review changes
to the Github actions.

## Building the web app

Easy to build, but you need to have several components running to
see it running:
```
ng build
```

## Running locally

Build serve-local:
```
go build serve-local.go
```

Run `serve-local`:
```
./serve-local
```

Run the Angular service:
```
ng serve -c local
```

You need a web key at `src/assets/config.json`:
```
{
    "production": false,
    "firebase": {
        "apiKey": "API-KEY-GOES-HERE",
        "authDomain": "DEV-PROJECT-GOES-HERE.firebaseapp.com",
        "projectId": "DEV-PROJECT-GOES-HERE"
    },
    "features": [
        "vat",
        "vat-submit"
    ]
}
```

You also need to start the back-end locally.


