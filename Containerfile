
FROM fedora:35

RUN dnf update -y && dnf install -y libgo && dnf clean all

ADD serve /usr/local/bin/serve
ADD dist/stage /usr/local/web/

WORKDIR /usr/local/web/
CMD /usr/local/bin/serve 0.0.0.0:8080 api.dev.accountsmachine.io https ./
EXPOSE 8080

