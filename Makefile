
VERSION=0.10.3
DIST=dist

all: serve

BUILD=FIXME
KIND=FIXMES

dist-dev: BUILD=dev
dist-dev: build

dist-stage: BUILD=stage
dist-stage: build

dist-prod: BUILD=prod
dist-prod: build

everything-dev:
	make dist-dev
	make container-dev
	make push-dev
	make run-upgrade KIND=dev

everything-stage:
	make dist-stage
	make container-stage
	make push-stage
	make run-upgrade KIND=stage

everything-prod:
	make dist-prod
	make container-prod
	make push-prod
	make run-upgrade KIND=prod

build:
	rm -rf ${DIST}/${BUILD}
	mkdir -p ${DIST}/${BUILD}
	ng build -c ${BUILD} --output-path ${DIST}/${BUILD}
	cp 404.html ${DIST}/${BUILD}

serve: serve.go
	go build serve.go

NAME=accounts-web
REPO=europe-west2-docker.pkg.dev/accounts-machine-${KIND}/accounts-machine
CONTAINER=${REPO}/${NAME}

container-dev: KIND=dev
container-dev: all container

container-stage: KIND=stage
container-stage: all container

container-prod: KIND=prod
container-prod: all container

container: all
	podman build -f Containerfile -t ${CONTAINER}:${VERSION} \
	    --format docker --build-arg DIST=dist/${KIND}

login:
	gcloud auth print-access-token | \
	    podman login -u oauth2accesstoken --password-stdin \
	        europe-west2-docker.pkg.dev

push-dev: KIND=dev
push-dev: push

push-stage: KIND=stage
push-stage: push

push-prod: KIND=prod
push-prod: push

push:
	podman push --remove-signatures ${CONTAINER}:${VERSION}

start:
	podman run -d --name ${NAME} \
	    -p 8080:8080 \
	    ${CONTAINER}:${VERSION}

stop:
	podman rm -f ${NAME}

clean:
	rm -rf dist

PROJECT=accounts-machine-${KIND}
SERVICE_ACCOUNT=accounts-web
SERVICE_ACCOUNT_FULL=${SERVICE_ACCOUNT}@${PROJECT}.iam.gserviceaccount.com
CONFIG=${PROJECT}
ACCOUNT=mark@accountsmachine.io

GCLOUD_OPTS=\
    --configuration=${CONFIG} \
    --project=${PROJECT}

create-service-account:
	gcloud ${GCLOUD_OPTS} iam service-accounts create \
	    --description 'Accounts web' \
	    --display-name 'Accounts web' \
	    ${SERVICE_ACCOUNT}

SERVICE=accounts-web
REGION=europe-west1
TAG=v$(subst .,-,${VERSION})
DOMAIN=app.${KIND}.accountsmachine.io

run-list:
	gcloud \
	    --configuration=${CONFIG} \
	    --project ${PROJECT} \
	    run services list

gcloud-setup:
	-gcloud config configurations delete ${CONFIG}
	gcloud config configurations create ${CONFIG} \
	    --account ${ACCOUNT} --project ${PROJECT}
	gcloud --configuration=${CONFIG} auth login 

run-deploy:
	gcloud \
	    ${GCLOUD_OPTS} \
	    run deploy ${SERVICE} \
	    --image=${CONTAINER}:${VERSION} \
	    --allow-unauthenticated \
	    --service-account=${SERVICE_ACCOUNT_FULL} \
	    --concurrency=80 \
	    --cpu=1 \
	    --memory=256Mi \
	    --min-instances=0 \
	    --max-instances=1 \
	    --region=${REGION} \
	   --command='/usr/local/bin/serve' \
	   --args='0.0.0.0:8080,api.${KIND}.accountsmachine.io,https,./'

run-domain:
	gcloud \
	    ${GCLOUD_OPTS} \
	    beta run domain-mappings create \
	        --service=${SERVICE} \
		--domain=${DOMAIN} \
	        --region=${REGION}

run-upgrade:
	gcloud run services update ${SERVICE} \
	    --project ${PROJECT} --region ${REGION} \
	    --image ${CONTAINER}:${VERSION} \
	    --tag ${TAG}
