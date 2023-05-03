
// This is designed to run after the accounts-svc deploy.  Therefore, can
// assume that the artifact repo, and other services is created.  DNS domain
// exists.

import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import { local } from "@pulumi/command";
import * as fs from 'fs';

const imageVersion = process.env.IMAGE_VERSION;

if (!imageVersion)
    throw Error("IMAGE_VERSION not defined");

if (!process.env.ARTIFACT_REPO)
    throw Error("ARTIFACT_REPO not defined");

if (!process.env.ARTIFACT_REPO_REGION)
    throw Error("ARTIFACT_REPO_REGION not defined");

if (!process.env.ARTIFACT_NAME)
    throw Error("ARTIFACT_NAME not defined");

if (!process.env.HOSTNAME)
    throw Error("HOSTNAME not defined");

if (!process.env.GCP_PROJECT)
    throw Error("GCP_PROJECT not defined");

if (!process.env.GCP_REGION)
    throw Error("GCP_REGION not defined");

if (!process.env.ENVIRONMENT)
    throw Error("ENVIRONMENT not defined");

if (!process.env.CLOUD_RUN_REGION)
    throw Error("CLOUD_RUN_REGION not defined");

if (!process.env.DNS_DOMAIN_DESCRIPTION)
    throw Error("DNS_DOMAIN_DESCRIPTION not defined");

if (!process.env.DOMAIN)
    throw Error("DOMAIN not defined");

if (!process.env.MIN_SCALE)
    throw Error("MIN_SCALE not defined");

if (!process.env.MAX_SCALE)
    throw Error("MAX_SCALE not defined");

if (!process.env.API_HOSTNAME)
    throw Error("API_HOSTNAME not defined");

const environment = process.env.ENVIRONMENT;
const project = process.env.GCP_PROJECT;

const provider = new gcp.Provider(
    "gcp",
    {
	project: project,
	region: process.env.GCP_REGION,
    }
);

const repo = process.env.ARTIFACT_REPO;

const enableApiKeys = new gcp.projects.Service(
    "enable-api-keys",
    {
	service: "apikeys.googleapis.com",
    },
    {
	provider: provider
    }
);

let sites : string[] = [];
let authDomain : string = "";
let siteProjectId : string = "";
let features : string[] = [];

if (environment == "dev") {
    sites = [ "app.dev.accountsmachine.io" ];
    authDomain = "accounts-machine-dev.firebaseapp.com";
    siteProjectId = "accounts-machine-dev";
    features = [
	"vat", "corptax", "accounts", "vat-submit", "corptax-submit",
	"accounts-submit", "crypto"
    ];
} else if (environment == "stage") {
    sites = [ ];
    authDomain = "accounts-machine-dev.firebaseapp.com";
    siteProjectId = "accounts-machine-dev";
    features = [
	"vat", "vat-submit"
    ];
} else if (environment == "prod") {
    sites = [
	"accounts-machine-prod.firebaseapp.com",
	"app.accountsmachine.io",
	"app.prod.accountsmachine.io",
	"app.stage.accountsmachine.io"
    ];
    authDomain = "accounts-machine-prod.firebaseapp.com";
    siteProjectId = "accounts-machine-prod";
    features = [
	"vat", "vat-submit"
    ];
} else {
    throw Error("Environment " + environment + " not valid.");
}

const apiKey = new gcp.projects.ApiKey(
    "api-key",
    {
	name: "web-client",
	displayName: "Web client on " + environment,
	restrictions: {
	    apiTargets: [
		{
		    service: "securetoken.googleapis.com",
		},
		{
		    service: "identitytoolkit",
		}
	    ],
	    browserKeyRestrictions: {
		allowedReferrers: sites
	    },
	},
    },
    {
	provider: provider,
	dependsOn: enableApiKeys,
    }
);

const config = {
    firebase: {
	apiKey: apiKey.keyString,
	authDomain: authDomain,
	projectId: siteProjectId,
    },
    features: features
};

const secret = new gcp.secretmanager.Secret(
    "secret",
    {
	secretId: "accounts-web-config",
	replication: {
	    automatic: true
	},
    },
    {
	provider: provider,
    }
);

const secretVersion = new gcp.secretmanager.SecretVersion(
    "secret-version",
    {
	secret: secret.id,
	secretData: pulumi.jsonStringify(config).apply(x => atob(x)),
    },
    {
	provider: provider,
    }
);

export const thing = config;
pulumi.jsonStringify(config).apply(console.log);
pulumi.jsonStringify(config).apply(x => atob(x)).apply(console.log);

const artifactRepo = gcp.artifactregistry.getRepository(
    {
	location: process.env.ARTIFACT_REPO_REGION,
	repositoryId: process.env.ARTIFACT_NAME,
    },
    {
	provider: provider,
    }
);

const localImageName = "accounts-web:" + imageVersion;

const imageName = repo + "/accounts-web:" + imageVersion;

const taggedImage = new local.Command(
    "docker-tag-command",
    {
	create: "docker tag " + localImageName + " " + imageName,
    }
);

const image = new local.Command(
    "docker-push-command",
    {
	create: "docker push " + imageName,
    },
    {
	dependsOn: [taggedImage],
    }
);

const svcAccount = new gcp.serviceaccount.Account(
    "service-account",
    {
	accountId: "accounts-web",
	displayName: "Accounts Web",
	description: "Accounts Web",
    },
    {
	provider: provider,
	dependsOn: [],
    }
);

const configIamMember = new gcp.secretmanager.SecretIamMember(
    "secret-config-iam-member",
    {
	project: process.env.GCP_PROJECT,
	secretId: secret.id,
	role: "roles/secretmanager.secretAccessor",
	member: svcAccount.email.apply(x => "serviceAccount:" + x),
	},
    {
	provider: provider,
    }
);

/*

const service = new gcp.cloudrun.Service(
    "service",
    {
	name: "accounts-web",
	location: process.env.CLOUD_RUN_REGION,
	template: {
	    metadata: {
		labels: {
		    version: "v" + imageVersion.replace(/\./g, "-"),
		},		
		annotations: {
                    "autoscaling.knative.dev/minScale": process.env.MIN_SCALE,
                    "autoscaling.knative.dev/maxScale": process.env.MAX_SCALE,
		}
	    },
            spec: {
		containerConcurrency: 1000,
		timeoutSeconds: 300,
		serviceAccountName: svcAccount.email,
		containers: [
		    {
			image: imageName,
			ports: [
                            {
				"name": "http1", // Must be http1 or h2c.
				"containerPort": 8080,
                            }
			],
			commands: [
			    "/usr/local/bin/serve",
			    "0:8080",                // Listen
			    process.env.API_HOSTNAME, // API resource
			    "https",		     // API scheme
			    "./",		     // Base
			],
			resources: {
                            limits: {
				cpu: "1000m",
				memory: "256Mi",
                            }
			},
			volumeMounts: [
			    {
				name: "accounts-web-config",
				mountPath: "/configs",
			    },
			],
		    }
		],
		volumes: [
		    {
			name: "accounts-web-config",
			secret: {
			    secretName: "accounts-web-config",
			    items: [
				{
				    key: "latest",
				    path: "config",
				}
			    ],
			}
		    },
		],
            },
	},
    },
    {
	provider: provider,
	dependsOn: [image],
    }
);

const allUsersPolicy = gcp.organizations.getIAMPolicy(
    {
	bindings: [{
            role: "roles/run.invoker",
            members: ["allUsers"],
	}],
    },
    {
	provider: provider,
    }
);

const noAuthPolicy = new gcp.cloudrun.IamPolicy(
    "no-auth-policy",
    {
	location: service.location,
	project: service.project,
	service: service.name,
	policyData: allUsersPolicy.then(pol => pol.policyData),
    },
    {
	provider: provider,
    }
);

const domainMapping = new gcp.cloudrun.DomainMapping(
    "domain-mapping",
    {
	"name": process.env.HOSTNAME,
	location: process.env.CLOUD_RUN_REGION,
	metadata: {
	    namespace: project,
	},
	spec: {
	    routeName: service.name,
	}
    },
    {
	provider: provider
    }
);

// Special domain mapping for prod, the web is also mapped to
// app.accountsmachine.io.
if (environment === "prod") {

    const domainMapping2 = new gcp.cloudrun.DomainMapping(
	"domain-mapping-2",
	{
	    "name": "app.accountsmachine.io",
	    location: process.env.CLOUD_RUN_REGION,
	    metadata: {
		namespace: project,
	    },
	    spec: {
		routeName: service.name,
	    }
	},
	{
	    provider: provider
	}
    );

}

// Get rrdata from domain mapping.
export const host = domainMapping.statuses.apply(
    x => x[0].resourceRecords
).apply(
    x => x ? x[0] : { rrdata: "" }
).apply(
    x => x.rrdata
);

const zone = gcp.dns.getManagedZone(
    {
	name: process.env.DNS_DOMAIN_DESCRIPTION,
    },
    {
	provider: provider,
    }
);

const recordSet = new gcp.dns.RecordSet(
    "resource-record",
    {
	name: process.env.HOSTNAME + ".",
	managedZone: zone.then(zone => zone.name),
	type: "CNAME",
	ttl: 300,
	rrdatas: [host],
    },
    {
	provider: provider,
    }
);

const serviceMon = new gcp.monitoring.GenericService(
    "service-monitoring",
    {
	basicService: {
            serviceLabels: {
		service_name: service.name,
		location: process.env.CLOUD_RUN_REGION,
            },
            serviceType: "CLOUD_RUN",
	},
	displayName: "Web service (" + environment + ")",
	serviceId: "web-service-" + environment + "-mon",
	userLabels: {
	    "service": service.name,
	    "application": "accounts-web",
	    "environment": environment,
	},
    },
    {
	provider: provider,
    }
);

const latencySlo = new gcp.monitoring.Slo(
    "latency-slo",
    {
	service: serviceMon.serviceId,
	sloId: "web-service-" + environment + "-latency-slo",
	displayName: "Web latency (" + environment + ")",
	goal: 0.95,
	rollingPeriodDays: 5,
	basicSli: {
	    latency: {
		threshold: "2s"
	    }
	},
    },
    {
	provider: provider,
    }
);

const availabilitySlo = new gcp.monitoring.Slo(
    "availability-slo",
    {
	service: serviceMon.serviceId,
	sloId: "web-service-" + environment + "-availability-slo",
	displayName: "Web availability (" + environment + ")",
	goal: 0.95,
	rollingPeriodDays: 5,
	windowsBasedSli: {
	    windowPeriod: "3600s",
	    goodTotalRatioThreshold: {
		basicSliPerformance: {
		    availability: {
		    }
		},
		threshold: 0.9,
	    }
	}
    },
    {
	provider: provider,
    }
);

*/
