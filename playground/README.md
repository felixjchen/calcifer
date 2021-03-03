The playground environment, comes with docker, ssh, vim and curl.

Notes:

- felixchen1998/calcifer-playground:latest
- for development, docker:dind
- for production, sysbox
  ```
  https://github.com/nestybox/sysbox/blob/master/docs/quickstart/dind.md#deploy-a-system-container-with-docker-inside
  docker run --runtime=sysbox-runc -it -d --network calcifer_default --env VIRTUAL_PATH=/sandboxes/001 ee4b7c650c23
  ```
