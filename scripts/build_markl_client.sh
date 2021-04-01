cd client 
ng build --configuration=production
docker build -t felixchen1998/calcifer-client:markl -f DockerfileDev .
docker push felixchen1998/calcifer-client:markl