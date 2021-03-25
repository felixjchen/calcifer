This playground has kubectl, vim, git and openssh.

The kube context for your Kuberenetes in Docker can be found in ~/.kube/, but the kubectl should already recognize this (~/.profile).

Your K8s cluster contains:
  - A master node, with address {id}-cluster-master
  - A worker node, with address {id}-cluster-worker-0
  - A worker node, with address {id}-cluster-worker-1
  - A worker node, with address {id}-cluster-worker-2

NOTE: Given this current url, anyone can see this environment. Therefore please do not put any credentials on this service. 

Try:
https://kubernetes.io/docs/tasks/access-application-cluster/service-access-application-cluster/
https://medium.com/google-cloud/kubernetes-nodeport-vs-loadbalancer-vs-ingress-when-should-i-use-what-922f010849e0