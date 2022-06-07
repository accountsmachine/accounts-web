
FROM fedora:36

ARG DIST=MISSING_ARG
ARG PORT=8080

RUN dnf update -y && dnf install -y libgo && dnf clean all

ADD serve /usr/local/bin/serve
ADD ${DIST} /usr/local/web/

WORKDIR /usr/local/web/
CMD /usr/local/bin/serve 0.0.0.0:${PORT} api.dev.accountsmachine.io https ./
EXPOSE ${PORT}

