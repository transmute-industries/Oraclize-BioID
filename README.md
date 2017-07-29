# Oraclize-BioID

## Dependencies

* [Azure CLI](https://github.com/Azure/azure-cli)
* [Conda](https://www.continuum.io/downloads)
* [Provisioning a Docker Swarm with Azure Container ](https://www.youtube.com/watch?v=DPpQcmIM9Gs)


### Installing the Azure CLI

```
$ conda create --name Oraclize-BioID
$ source activate Oraclize-BioID
$ pip install azure-cli==2.0.12
```

### Preparing your Azure Container Service

You will want to update `azuredeploy.parameters.json` before proceeding.

You can find replace `ti-acs-swarm` to `your-app-acs-swarm`. Please omit this change in any PRs.


### Creating your Azure Container Service

```
$ az login
$ az acs list
$ az group create --name "ti-acs-swarm-rg" --location "southcentralus"
$ az group deployment create -g ti-acs-swarm-rg -n ti-acs-swarm --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-acs-swarm/azuredeploy.json --parameters ./azure/azuredeploy.parameters.json

```

### Establishing an SSH tunnel to your Azure Container Service

Before we proceed, please read this:

```
These instructions focus on tunneling TCP traffic over SSH. 
You can also start an interactive SSH session with one of the internal cluster management systems, but we don't recommend this. 
Working directly on an internal system risks inadvertent configuration changes.
```

```
# ssh -fNL LOCAL_PORT:localhost:REMOTE_PORT -p 2200 [USERNAME]@[DNSPREFIX]mgmt.[REGION].cloudapp.azure.com
$ ssh -fNL 2375:localhost:2375 -p 2200 or13@ti-acs-swarmmgmt.southcentralus.cloudapp.azure.com

# if you encounter errors these may help
# find what is using port 2375
$ lsof -i :2375
$ kill <PID>

$ export DOCKER_HOST=:2375
```

### Building / Starting your dockerized app

```
$ docker-compose up

# if all went well, you should be able to visit your new docker swarm app hosted on azure at something like:

http://ti-acs-swarmagents.southcentralus.cloudapp.azure.com:8080/

# You can find the exact url using azure Resource Explorer

```

### Further reading

* [kubernetes-vs-docker-swarm-vs-dc-os](https://blog.netsil.com/kubernetes-vs-docker-swarm-vs-dc-os-may-2017-orchestrator-shootout-fdc59c28ec16)
* [container-service-docker-swarm](https://docs.microsoft.com/en-us/azure/container-service/dcos-swarm/container-service-docker-swarm)
* [Oraclize-Tutorial](https://github.com/johnhckuo/Oraclize-Tutorial)

