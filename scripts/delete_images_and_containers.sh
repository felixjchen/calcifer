docker container rm $(docker container ls -aq) -f
docker rmi -f $(docker images -a -q)
yes Y | docker system prune