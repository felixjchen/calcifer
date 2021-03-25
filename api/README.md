## Description

The api service is responsible for the creation and deletion of playgrounds, therefore this service needs to be able to create/delete at the host level (`/var/run/docker.sock:/var/run/docker.sock` gives this container the hosts's docker socket, where the docker daemon [listens](https://stackoverflow.com/questions/35110146/can-anyone-explain-docker-sock#:~:text=139-,docker.,defaults%20to%20use%20UNIX%20socket.&text=There%20might%20be%20different%20reasons,Docker%20socket%20inside%20a%20container.)).

## Sources

- https://github.com/nestybox/kindbox
