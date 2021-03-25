FROM alpine:3.7

# Quality of life
# https://platformengineer.com/install-vi-bash-curl-on-alpine-linux/
RUN apk --update add --no-cache curl vim git docker-compose

# Kubectl
# https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/#install-kubectl-binary-with-curl-on-linux
RUN curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
RUN install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl