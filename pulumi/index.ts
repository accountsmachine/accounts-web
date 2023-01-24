
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

const provider = new gcp.Provider(
    "gcp",
    {
	project: process.env.GCP_PROJECT,
	region: process.env.GCP_REGION,
    }
);

/*

const enableCloudRun = new gcp.projects.Service(
    "enable-cloud-run",
    {
	service: "run.googleapis.com",
    },
    {
	provider: provider
    }
);

const enableComputeEngine = new gcp.projects.Service(
    "enable-compute-engine",
    {
	service: "compute.googleapis.com",
    },
    {
	provider: provider
    }
);

const enableCloudDns = new gcp.projects.Service(
    "enable-cloud-dns",
    {
	service: "dns.googleapis.com",
    },
    {
	provider: provider
    }
);

const enableArtifactRegistry = new gcp.projects.Service(
    "enable-artifact-registry",
    {
	service: "artifactregistry.googleapis.com",
    },
    {
	provider: provider
    }
);

const enableIAM = new gcp.projects.Service(
    "enable-iam",
    {
	service: "iam.googleapis.com",
    },
    {
	provider: provider
    }
);

*/

const repo = process.env.ARTIFACT_REPO;

const artifactRepo = new gcp.artifactregistry.Repository(
    "artifact-repo",
    {
	description: "repository for " + process.env.ENVIRONMENT,
	format: "DOCKER",
	location: process.env.ARTIFACT_REPO_REGION,
	repositoryId: process.env.ARTIFACT_NAME,
    },
    {
	provider: provider,
	dependsOn: enableArtifactRegistry,
    }
);

const localImageName = "accounts-web" + imageVersion;

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
	dependsOn: [taggedImage, artifactRepo],
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
			resources: {
                            limits: {
				cpu: "1000m",
				memory: "256Mi",
                            }
			},
		    }
		],
            },
	},
    },
    {
	provider: provider,
	dependsOn: [image],
    }
);

//const apiUrl = service.statuses[0].url;

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
	    namespace: process.env.GCP_PROJECT,
	},
	spec: {
	    routeName: service.name,
	}
    },
    {
	provider: provider
    }
);

// Get rrdata from domain mapping.
export const host = domainMapping.statuses.apply(
    x => x[0].resourceRecords
).apply(
    x => x ? x[0] : { rrdata: "" }
).apply(
    x => x.rrdata
);

const zone = new gcp.dns.ManagedZone(
    "zone",
    {
	name: process.env.DNS_DOMAIN_DESCRIPTION,
	description: process.env.DOMAIN,
	dnsName: process.env.DOMAIN,
	labels: {
	},
    },
    {
	provider: provider,
	dependsOn: [enableCloudDns],
    }
);

const recordSet = new gcp.dns.RecordSet(
    "web-record",
    {
	name: process.env.HOSTNAME + ".",
	managedZone: zone.name,
	type: "CNAME",
	ttl: 300,
	rrdatas: [host],
    },
    {
	provider: provider,
	dependsOn: zone,
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
	displayName: "API service (" + process.env.ENVIRONMENT + ")",
	serviceId: "api-service-" + process.env.ENVIRONMENT + "-mon",
	userLabels: {
	    "service": service.name,
	    "application": "accounts-svc",
	    "environment": process.env.ENVIRONMENT,
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
	sloId: "api-service-" + process.env.ENVIRONMENT + "-latency-slo",
	displayName: "API latency (" + process.env.ENVIRONMENT + ")",
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
	sloId: "api-service-" + process.env.ENVIRONMENT + "-availability-slo",
	displayName: "API availability (" + process.env.ENVIRONMENT + ")",
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
