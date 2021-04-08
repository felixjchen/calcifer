Alpine container with kubectl, docker, vim, git and curl. Port 80 on your playground is reverse proxied from https://{id}.project-calcifer.ml, see the share tab.

Your K8s cluster contains:
  - A kubectl container, with address {id}
  - Worker node 0, with address {id}-cluster-worker-0
  - Worker node 1, with address {id}-cluster-worker-1
  - Worker node 2, with address {id}-cluster-worker-2
  - A master node

The kube context for your Kuberenetes in Docker can be found in ~/.kube/, but kubectl should already recognize this (~/.profile).

NETWORK: Worker nodes have their port 30000 reverse proxied from {id}-cluster-worker-{i}.project-calcifer.ml for NodePorts

WARNING: Given the edit link, anyone can see this environment, please do not put any credentials on this service. 

Try:

Deploying containers with a deployment and NodePort service
https://github.com/UTSCC09/project-calcifer/wiki/Kubernetes-NodePort

Deploying Kubernetes Dashboard and creating a ServiceAccount 
https://github.com/UTSCC09/project-calcifer/wiki/Kubernetes-Dashboard