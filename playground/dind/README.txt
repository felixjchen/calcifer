This is your playground environment, it comes with Docker, Docker-Compose, Vim, Git and Curl. 
Use Alpine's apk for package management. 

Port 80 on your playground is reverse proxied from https://{id}.project-calcifer.ml, this link can be found in the share tab.

NOTE: Given this current url, anyone can see this environment. Therefore please do not put any credentials on this service. 

Try:
docker run -d -p 80:80 felixchen1998/icecream:latest
