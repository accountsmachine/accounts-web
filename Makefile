
VERSION=0.0.1

NAME=vat-test-service

REPO=europe-west2-docker.pkg.dev/accounts-machine-dev/accounts-machine
CONTAINER=${REPO}/vat-test-service

DIST=dist/

all: stage

stage: KIND=stage
stage: build

prod: KIND=prod
prod: build

deploy-stage: KIND=stage
deploy-stage: deploy

deploy-prod: KIND=prod
deploy-prod: deploy

build:
	rm -rf ${DIST}/${KIND}/public/
	mkdir -p ${DIST}/${KIND}/public/
	ng build -c ${KIND} --output-path ${DIST}/${KIND}/public/
	cp 404.html ${DIST}/${KIND}/public

deploy:
	echo Deploying ${KIND}...

