# Azure-Aks-Web-App-Deployment-Practice

## Challenges:

These are the following challenges that we will be resolving after the hands on lab:

1. Run containerization app on different hosts (Physical or virtual)
2. Deploy app into those host (Physical or virtual) without ssh to individual host
3. Implement Self Healing Capability (Allows container to be restarted or re-provisioned to different host if host has an insufficient capacity or hardware issue)
4. Improve High Availability of the application
5. Implement Auto Scaling

## Learning Objectives:

After the lab, you will be able to:

1. Deploy kubernetes by using Azure Aks Service
2. Explore the different configuration options available into Azure Aks Service
3. Dockerize frontend and backend applications
4. learn how to kubernetes manifest files which is a declarative way to construct kubernetes objects
5. Map External DNS Zone into Azure Public DNS Zone
6. Enable HTTP Context-based Routing into the cluster
7. Enable External DNS feature into the cluster
8. Enable SSL/TLS support
9. learn Azure CLI
10. Create Azure Virtual Network and Subnets

### Step 1:

Create a resource group into the us-east region. Use the following command to create a resource group.

```cmd
# Edit export statements to make any changes required as per your environment
# Execute below export statements
AKS_RESOURCE_GROUP=aks-prod
AKS_REGION=eastus
echo $AKS_RESOURCE_GROUP, $AKS_REGION

# Create Resource Group
az group create --location ${AKS_REGION} \
                --name ${AKS_RESOURCE_GROUP}
```

![Resource Group Created](/images/image-1.png)

### Step 2: Create Virtual Network and Subnets

```cmd
# Edit export statements to make any changes required as per your environment
# Execute below export statements
AKS_VNET=aks-vnet
AKS_VNET_ADDRESS_PREFIX=10.0.0.0/16
AKS_VNET_SUBNET_DEFAULT=aks-subnet-default
AKS_VNET_SUBNET_DEFAULT_PREFIX=10.0.0.0/24

# Create Virtual Network & default Subnet
az network vnet create -g ${AKS_RESOURCE_GROUP} \
                       -n ${AKS_VNET} \
                       --address-prefix ${AKS_VNET_ADDRESS_PREFIX} \
                       --subnet-name ${AKS_VNET_SUBNET_DEFAULT} \
                       --subnet-prefix ${AKS_VNET_SUBNET_DEFAULT_PREFIX}
```

![VNet with default Subnet Created](/images/image-2.png)

Note that we need subnet id while creating the cluster. Get the default subnet id and store it inside the variable for later use

```cmd
# Get Virtual Network default subnet id
AKS_VNET_SUBNET_DEFAULT_ID=$(az network vnet subnet show \
                           --resource-group ${AKS_RESOURCE_GROUP} \
                           --vnet-name ${AKS_VNET} \
                           --name ${AKS_VNET_SUBNET_DEFAULT} \
                           --query id \
                           -o tsv)
echo ${AKS_VNET_SUBNET_DEFAULT_ID}
```

![Subnet Id](/images/image-3.png)

### Step 3: Create SSH Key

```cmd
# Create Folder
mkdir $HOME/.ssh/aks-prod-sshkeys

# Create SSH Key
ssh-keygen \
    -m PEM \
    -t rsa \
    -b 4096 \
    -C "ibrarmunir009@gmail.com" \
    -f ~/.ssh/aks-prod-sshkeys/aksprodsshkey \
    -N mypassphrase

# List Files
ls -lrt $HOME/.ssh/aks-prod-sshkeys

# Set SSH KEY Path
AKS_SSH_KEY_LOCATION=~/.ssh/aks-prod-sshkeys/aksprodsshkey.pub
echo $AKS_SSH_KEY_LOCATION
```

![SSH key generated and saved into a variable](/images/image-4.png)

Reference for [Create SSH Key](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/create-ssh-keys-detailed)

### Step 4: Create Log Analytics Workspace

```cmd
# Create Log Analytics Workspace
AKS_MONITORING_LOG_ANALYTICS_WORKSPACE_ID=$(az monitor log-analytics workspace create               --resource-group ${AKS_RESOURCE_GROUP} \
                                           --workspace-name aksprod-loganalytics-workspace1 \
                                           --query id \
                                           -o tsv)

echo $AKS_MONITORING_LOG_ANALYTICS_WORKSPACE_ID
```

![Workspace Created](/images/image-5.png)

### Step 5: Create Cluster with System Node Pool

```cmd
echo $AKS_CLUSTER
# Set Cluster Name
AKS_CLUSTER=aksprod1

# Create AKS cluste
az aks create --resource-group ${AKS_RESOURCE_GROUP} \
              --name ${AKS_CLUSTER} \
              --enable-managed-identity \
              --ssh-key-value  ${AKS_SSH_KEY_LOCATION} \
              --admin-username ibrar \
              --node-count 1 \
              --enable-cluster-autoscaler \
              --min-count 1 \
              --max-count 5 \
              --network-plugin azure \
              --service-cidr 10.0.1.0/24 \
              --dns-service-ip 10.0.1.10 \
              --docker-bridge-address 172.17.0.1/16 \
              --vnet-subnet-id ${AKS_VNET_SUBNET_DEFAULT_ID} \
              --node-osdisk-size 30 \
              --node-vm-size Standard_DS2_v2 \
              --nodepool-labels nodepool-type=system nodepoolos=linux app=system-apps \
              --nodepool-name systempool \
              --nodepool-tags nodepool-type=system nodepoolos=linux app=system-apps \
              --enable-addons monitoring \
              --workspace-resource-id ${AKS_MONITORING_LOG_ANALYTICS_WORKSPACE_ID} \
              --enable-ahub \
              --zones {1,2,3}
```

### Step 6: Configure Credentials & test

```cmd
# Configure Credentials
az aks get-credentials --name ${AKS_CLUSTER}  --resource-group ${AKS_RESOURCE_GROUP}

# List Nodes
kubectl get nodes

# Cluster Info
kubectl cluster-info

# List Node Pools
az aks nodepool list --cluster-name ${AKS_CLUSTER} --resource-group ${AKS_RESOURCE_GROUP} -o table

# List which pods are running in system nodepool from kube-system namespace
kubectl get pod -o=custom-columns=NODE-NAME:.spec.nodeName,POD-NAME:.metadata.name -n kube-system
```

![Cluster Created](/images/image-6.png)

Deploying web application into kubernetes cluster
