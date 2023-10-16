
############################################################################
# Build container, creates distribution
############################################################################

FROM alpine:3.17 AS build

ARG KIND=KIND

# Want an even-numbered nodejs, odd-numbers should not be used in production
RUN apk add --update --no-cache --no-progress 'nodejs<19' go npm make

# Copy source to build area
COPY 404.html /root/build/
COPY Makefile /root/build/
COPY angular.json package.json package-lock.json /root/build/
COPY karma.conf.js serve.go tsconfig*.json /root/build/
COPY src /root/build/src/

# Setup build area
WORKDIR /root/build
RUN npm install
RUN npm install -g @angular/cli

# Build components - the web service
RUN make serve

# Build application
RUN make build BUILD=${KIND}

# Put 404 error page in the distribution
RUN cp 404.html dist/${KIND}/

############################################################################
# Target container, for deployment
############################################################################

FROM alpine:3.17

ARG KIND=KIND

RUN apk add --update --no-cache --no-progress libgo
COPY --from=build /root/build/dist/${KIND} /usr/local/web/
COPY --from=build /root/build/serve /usr/local/bin/serve

# The configuration file needs to be mounted as a volume on /configs
RUN rm -f /usr/local/web/assets/config.json
RUN ln -s /configs/config /usr/local/web/assets/config.json

# Serve on port 8080, arguments are
# 1) Address to listen on
# 2) API address
# 3) Scheme should be http or https
# 4) The directory containing local web resources
WORKDIR /usr/local/web/
CMD /usr/local/bin/serve 0.0.0.0:8080 api.dev.accountsmachine.io https ./
EXPOSE 8080

