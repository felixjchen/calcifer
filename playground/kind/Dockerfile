FROM alpine:3.13

# Quality of life
# https://platformengineer.com/install-vi-bash-curl-on-alpine-linux/
RUN apk --update add --no-cache curl vim git docker

# Kubectl
# https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/#install-kubectl-binary-with-curl-on-linux
RUN curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
RUN install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
RUN mkdir ~/.kube

# SSH
# https://github.com/arvindr226/alpine-ssh/blob/master/Dockerfile
RUN apk --update add --no-cache openssh\
  && sed -i s/#PermitRootLogin.*/PermitRootLogin\ yes/ /etc/ssh/sshd_config \
  && echo "root:playgroundpwWXuHbdwcwEVmyhnJVpYt" | chpasswd  
RUN sed -ie 's/#Port 22/Port 22/g' /etc/ssh/sshd_config
RUN /usr/bin/ssh-keygen -A
RUN ssh-keygen -t rsa -b 4096 -f  /etc/ssh/ssh_host_key

# Ports
EXPOSE 80 
ENV VIRTUAL_PORT=80

# Start ssh
COPY entrypoint.sh . 
COPY readme.txt /root/ 
CMD ["./entrypoint.sh"]
