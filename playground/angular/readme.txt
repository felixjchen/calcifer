Alpine container with ng, node, npm, vim, git and curl. Port 80 on your playground is reverse proxied from https://{id}.project-calcifer.ml, see the share tab.

WARNING: Given the edit link, anyone can see this environment, please do not put any credentials on this service. 

Try:
ng new my-app
cd my-app 
ng serve --port 80 --host "0.0.0.0" --public-host {id}.project-calcifer.ml