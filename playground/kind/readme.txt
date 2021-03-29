This playground has kubectl, vim, git and openssh.

The kube context for your Kuberenetes in Docker can be found in ~/.kube/, but the kubectl should already recognize this (~/.profile).

Your K8s cluster contains:
  - A kubectl container, with address {id}
  - A master node, with address {id}-cluster-master
  - A worker node, with address {id}-cluster-worker-0
  - A worker node, with address {id}-cluster-worker-1
  - A worker node, with address {id}-cluster-worker-2

NOTE: Given this current url, anyone can see this environment. Therefore please do not put any credentials on this service. 
NETWORK: Worker nodes have their port 30000 reverse proxied from {id}-cluster-worker-{i}.project-calcifer.ml, for NodePorts

Try:

Deploying containers with a deployment and NodePort service
https://www.notion.so/Kubernetes-NodePort-e59f249af3d74aafbedf5d8d1f49c0f7

Deploying Kubernetes Dashboard and creating a ServiceAccount 
https://www.notion.so/Kubernetes-Dashboard-710b98e4d7d94c51b4d6032ac48a2c8e