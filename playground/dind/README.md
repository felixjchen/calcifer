DinD playground environment, comes with docker, ssh, vim and curl.

Notes:

- felixchen1998/calcifer-playground:latest
- for development, priveleged flag
- for production, sysbox runtime

https://github.com/nestybox/sysbox/blob/master/docs/quickstart/dind.md#deploy-a-system-container-with-docker-inside

`docker run --runtime=sysbox-runc -d --network project-calcifer_default --name=${id} --network-alias=${id} --env VIRTUAL_PATH=/${id}/ felixchen1998/calcifer-playground:latest`
