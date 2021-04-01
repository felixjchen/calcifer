cd client 
ng build --configuration=stage
docker build -t felixchen1998/calcifer-client:markl -f DockerfileDev .
docker push felixchen1998/calcifer-client:markl