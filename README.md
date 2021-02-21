# project-calcifer

## Title

Calcifer

## Team Members

- Felix Chen (1003331628)
- Aleksander Bodurri (1003406806)

## Description

On demand sandbox Docker environments for prototyping and sharing Docker images. Includes:

- Browser IDE (terminal, file explorer and code editor)
- Docker environment to run Alpine linux commands, build images and run containers
- Path on the domain, to test out containerized services (e.g. https://www.calcifer/playground/001)
- Sharing, given a link users can see an environment
- Realtime, multiple user can collaboratively work on a sandbox

## Beta

For the beta we plan to complete:

- Docker environments on demand
  - Docker in Docker
  - dynamic Nginx reverse proxy
  - SSH + SFTP solution
- Terminal
  - navigate the file system
  - execute OS (alpine linux) commands
  - execute Docker commands
- File System
  - navigate the file system within the playground environment
  - CRUD files and directories
- Code editor
  - To edit code and have changes propagate to the filesystem inside the playground environment
  - Synax highlighting

## Final

For the final deliverable, we plan to have:

- Sharing
  - sessions can be retrieved by url
  - sessions persist for a few days and are cleaned up
- Cooperative Realtime
  - users can see each other's changes if they share session
- Security
  - Docker in Docker sessions without the priveleged flag
  - restrict terminal executions

## Technology

- TypeScript, Express, SocketIO and SSH2 on our backend services
- SocketIO and Angular for our frontend
- MongoDB for our database
- Docker in Docker, Docker Compose and Sysbox for playgrounds
- JWilder’s Nginx-Proxy for dynamic routes
- Google Cloud Platform Virtual Machine
- Namecheap domain

## Challenges

- Docker playgrounds on demand. We will have to spin up a Docker in Docker container for every playground that is created, create a route and attach SSH.
- Docker in Docker without the --privileged flag, this is a security issue since this option gives the child container’s access to the host’s resources (“the container can then do almost everything that the host can do.”).
- Terminal: we will need to create some sort of HTTP to SSH style adapter, syncing commands with the backend services will require keeping track of where the user is executing commands from on the virtual browser terminal.
- Code Editor: Developing a nice UI for the code editor and the backend routes to sync up virtual files on the browser with the actual files inside the playground environment. Virtual files would also have to be synced to other sessions so that changes appear on the fly to enable collaborative programming.
- File explorer: Similar challenges as the ones for the Code Editor. We would also have to implement a way for files to be created and deleted on the virtual browser and then have that sync with the filesystem inside the playground environment.


## Network Diagram
![networkdiagram](https://user-images.githubusercontent.com/31393977/108618090-32b18100-73e9-11eb-8ef6-9ff5796f62f9.png)
- red are services we need to write
- yellow are playgrounds
