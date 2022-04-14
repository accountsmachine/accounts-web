
VERSION=0.9.1
DIST=dist

all: serve

BUILD=FIXME
KIND=FIXMES

dist-dev: BUILD=dev
dist-dev: build

dist-stage: BUILD=stage
dist-stage: build

dist-prod: BUILD=production
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
container-dev: all dist-dev container

container-stage: KIND=stage
container-stage: all dist-stage container

container-prod: KIND=prod
container-prod: all dist-prod container

container: all
	podman build -f Containerfile -t ${CONTAINER}:${VERSION} \
	    --format docker --build-arg DIST=dist/${KIND}

login:
	gcloud auth print-access-token | \
	    podman login -u oauth2accesstoken --password-stdin \
	        europe-west2-docker.pkg.dev

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
PROJECT=accounts-machine-dev
REGION=europe-west1
TAG=v$(subst .,-,${VERSION})

deploy:
	gcloud run services update ${SERVICE} \
	    --project ${PROJECT} --region ${REGION} \
	    --image ${CONTAINER}:${VERSION} \
	    --tag ${TAG}

