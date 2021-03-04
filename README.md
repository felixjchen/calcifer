![Docker Build](https://github.com/UTSCC09/project-calcifer/actions/workflows/ssh.yml/badge.svg)
![Docker Build](https://github.com/UTSCC09/project-calcifer/actions/workflows/playground.yml/badge.svg)
![Docker Build](https://github.com/UTSCC09/project-calcifer/actions/workflows/api.yml/badge.svg)

## Title

Calcifer

## Team Members

- Felix Chen (1003331628)
- Aleksander Bodurri (1003406806)

## Description

On demand sandbox Docker environments for prototyping Docker images. Includes:

- Browser IDE (terminal, file explorer and code editor)
- Docker environment to run Alpine linux commands, build images and run containers
- Path on the domain, to test out containerized services (e.g. https://www.calcifer.com/playground/001)
- Sharing, given a link users can see a playground's code, files, etc.
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
  - execute Docker (build run) commands
- File System
  - navigate the file system within the playground environment
  - CRUD files and directories
- Code editor
  - edit code and have changes propagate to the filesystem
  - Syntax highlighting

## Final

For the final deliverable, we plan to have:

- Sharing
  - sessions can be retrieved by url
  - sessions persist for a few days and are cleaned up
- Cooperative Realtime
  - users can see each other's changes if they share session
- Improved Security
  - Docker in Docker sessions without the privileged flag
  - restrict terminal executions

## Technology

- TypeScript, Express, SocketIO and SSH2 on our backend services
- SocketIO and Angular for our frontend
- MongoDB for our database
- Docker Compose for services
- Docker in Docker and Sysbox Runtime for playgrounds
- JWilder’s Nginx-Proxy for dynamic routes
- Google Cloud Platform Virtual Machine
- Namecheap domain

## Challenges

- Docker playgrounds on demand. We will have to spin up a Docker in Docker container for every playground that is created, create a route and have SSH working.
- Terminal: we will need to create some sort of HTTP to SSH style adapter, syncing commands with the backend services will require keeping track of where the user is executing commands from on the virtual browser terminal.
- Code Editor: Developing a nice UI for the code editor and the backend routes to sync up virtual files on the browser with the actual files inside the playground environment. Virtual files would also have to be synced to other sessions so that changes appear on the fly to enable collaborative programming.
- File explorer: Similar challenges as the ones for the Code Editor. We would also have to implement a way for files to be created and deleted on the virtual browser and then have that sync with the filesystem inside the playground environment.
- Realtime: Collaborative realtime between users, syncing the code editor, file browser and terminal between users
- Docker in Docker without the --privileged flag, this is a security issue since this option gives the child container’s access to the host’s resources
