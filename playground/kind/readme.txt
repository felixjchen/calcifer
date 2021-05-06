Alpine container with kubectl, docker, vim, git and curl. 

Your K8s cluster contains:
  - A kubectl container, with subdomain {ID}
  - Worker node 0, with subdomain {ID}-cluster-worker-0
  - Worker node 1, with subdomain {ID}-cluster-worker-1
  - Worker node 2, with subdomain {ID}-cluster-worker-2
  - A master node

The kube context for your Kuberenetes in Docker can be found in ~/.kube/, but kubectl should already recognize this (~/.profile).

ID: The playground ID can be found in the current URL, it should be an adjective-animal
NETWORK: Port 80 on your playground is reverse proxied from https://{ID}.project-calcifer.ml, see the share tab.
NETWORK: Worker nodes have their port 30000 reverse proxied from {ID}-cluster-worker-{i}.project-calcifer.ml for NodePorts
WARNING: Given the edit link, anyone can see this environment, please do not put any credentials on this service. 

Try:

Deploying containers with a deployment and NodePort service
https://github.com/felixjchen/calcifer/wiki/Kubernetes-NodePort

Deploying Kubernetes Dashboard and creating a ServiceAccount 
https://github.com/felixjchen/calcifer/wiki/Kubernetes-Dashboard