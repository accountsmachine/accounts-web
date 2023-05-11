
FROM alpine:3.17 AS build

ARG KIND=KIND

RUN apk add --update --no-cache --no-progress go npm make

COPY 404.html /root/build/
COPY Makefile /root/build/
COPY angular.json package.json package-lock.json /root/build/
COPY karma.conf.js serve.go tsconfig*.json /root/build/
COPY src /root/build/src/

WORKDIR /root/build

RUN npm install
RUN npm install -g @angular/cli@15
RUN make serve

RUN make build BUILD=${KIND}

RUN cp 404.html dist/${KIND}/

FROM alpine:3.17

ARG KIND=KIND

RUN apk add --update --no-cache --no-progress libgo
COPY --from=build /root/build/dist/${KIND} /usr/local/web/
COPY --from=build /root/build/serve /usr/local/bin/serve

RUN rm -f /usr/local/web/assets/config.json
RUN ln -s /configs/config /usr/local/web/assets/config.json

WORKDIR /usr/local/web/
CMD /usr/local/bin/serve 0.0.0.0:8080 api.dev.accountsmachine.io https ./
EXPOSE 8080


