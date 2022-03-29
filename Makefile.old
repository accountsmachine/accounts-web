
VERSION=0.0.2

DIST=dist

all: stage

stage: KIND=stage
stage: build

production: KIND=production
production: build

deploy-stage: KIND=stage
deploy-stage: deploy

deploy-production: KIND=production
deploy-production: deploy

build:
	rm -rf ${DIST}/${KIND}/public/
	mkdir -p ${DIST}/${KIND}/public/
	ng build -c ${KIND} --output-path ${DIST}/${KIND}/public/
	cp 404.html ${DIST}/${KIND}/public

deploy:
	(cd dist/${KIND} && firebase deploy --only hosting)

