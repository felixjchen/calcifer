Alpine container with ng, node, npm, docker, vim, git and curl. 

ID: The playground ID can be found in the current URL, it should be an adjective-animal
NETWORK: Port 80 on your playground is reverse proxied from https://{ID}.project-calcifer.ml, see the share tab.
WARNING: Given the edit link, anyone can see this environment, please do not put any credentials on this service. 

Try:
ng new my-app
cd my-app 
ng serve --port 80 --host "0.0.0.0" --public-host {ID}.project-calcifer.ml
* view the service link from the share tab *