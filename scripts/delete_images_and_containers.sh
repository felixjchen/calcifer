docker rmi -f $(docker images -a -q)
docker container rm $(docker container ls -aq) -f