
VERSION=0.0.3
DIST=dist

all:

stage: KIND=stage
stage: build

build: serve
	rm -rf ${DIST}/${KIND}
	mkdir -p ${DIST}/${KIND}
	ng build -c ${KIND} --output-path ${DIST}/${KIND}
	cp 404.html ${DIST}/${KIND}

serve: serve.go
	go build serve.go

NAME=accounts-web
REPO=europe-west2-docker.pkg.dev/accounts-machine-dev/accounts-machine
CONTAINER=${REPO}/${NAME}

container: all
	podman build -f Containerfile -t ${CONTAINER}:${VERSION} \
	    --format docker

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
