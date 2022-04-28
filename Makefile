
VERSION=0.9.4
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

SERVICE=accounts-web
PROJECT=accounts-machine-${KIND}
REGION=europe-west1
TAG=v$(subst .,-,${VERSION})

upgrade-dev: KIND=dev
upgrade-dev: upgrade

upgrade-stage: KIND=stage
upgrade-stage: upgrade

upgrade-prod: KIND=prod
upgrade-prod: upgrade

upgrade:
	gcloud run services update ${SERVICE} \
	    --project ${PROJECT} --region ${REGION} \
	    --image ${CONTAINER}:${VERSION} \
	    --tag ${TAG}

