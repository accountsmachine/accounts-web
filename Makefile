
VERSION=0.0.1

NAME=vat-test-service

REPO=europe-west2-docker.pkg.dev/accounts-machine-dev/accounts-machine
CONTAINER=${REPO}/vat-test-service

all: stage

stage: KIND=stage
stage: build

prod: KIND=prod
prod: build

build:
	rm -rf deploy/${KIND}/public/
	mkdir -p deploy/${KIND}/public/
	ng build -c ${KIND} --output-path deploy/${KIND}/public/
	cp 404.html deploy/${KIND}/public

