# Azure-Aks-Web-App-Deployment

## Challenges:

These are the following challenges that we will be resolving after the hands on lab:

1. ✅ Run containerization app on different hosts (Physical or virtual)
2. ✅ Deploy app into those host (Physical or virtual) without ssh to individual host
3. ✅ Implement Self Healing Capability (Allows container to be restarted or re-provisioned to different host if host has an insufficient capacity or hardware issue)
4. ✅ Improve High Availability of the application
5. ✅ Implement Auto Scaling

## 🔍🎯 Learning Objectives:

After the lab, you will be able to:

1. ✅ Deploy kubernetes by using Azure Aks Service
2. ✅ Explore the different configuration options available into Azure Aks Service
3. ✅ Dockerize frontend and backend applications
4. ✅ learn how to kubernetes manifest files which is a declarative way to construct kubernetes objects
5. ✅ Map External DNS Zone into Azure Public DNS Zone
6. ✅ Enable HTTP Context-based Routing into the cluster
7. ✅ Enable External DNS feature into the cluster
8. ✅ Enable SSL/TLS support
9. ✅ learn Azure CLI
10. ✅ Create Azure Virtual Network and Subnets

### ⚙ Tools & Technologies Used:

![HTML5](https://img.shields.io/badge/-HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/-CSS3-1572B6?style=flat-square&logo=css3)
![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/-JavaScript-black?style=flat-square&logo=javascript)
![Nodejs](https://img.shields.io/badge/-Nodejs-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/-React-black?style=flat-square&logo=react)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=flat-square&logo=kubernetes&logoColor=white)
![Microsoft Azure](https://img.shields.io/badge/Microsoft%20-0078D4?style=flat-square&logo=microsoftazure)
![NestJs](https://img.shields.io/badge/Nestjs-E0234E?style=flat-square&logo=nestjs)
![Yaml](https://img.shields.io/badge/YAML-CB171E?style=flat-square&logo=yaml)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)

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

### Step 7: Dockerize frontend app

```dockerfile
FROM node:16-alpine

LABEL author="IBRAR MUNIR"

WORKDIR /app

COPY  ./package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY ./ ./

CMD ["npm", "run", "start"]
```

### Step 7: Dockerize Admin app

```dockerfile
FROM node:16-alpine

LABEL author="IBRAR MUNIR"

WORKDIR /app

COPY  ./package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY ./ ./

CMD ["npm", "run", "start"]
```

### Step 6: Dockerize backend app

```dockerfile
FROM node:16-alpine As build

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm ci --omit=dev

COPY . .

RUN npm run build


FROM node:16-alpine As production
COPY --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]
```

### Step 7: Create Container Registry of Azure ACR

```cmd
ACR_REGISTRY_NAME=mailingapp
az acr create --resource-group ${AKS_RESOURCE_GROUP} \
  --name ${ACR_REGISTRY_NAME} --sku Basic
```

### Step 8: Configure ACR integration for existing AKS clusters

```cmd
az aks update -n ${AKS_CLUSTER} -g ${AKS_RESOURCE_GROUP} --attach-acr ${ACR_REGISTRY_NAME}
```

### Attach AKS System Identity as User Identity to ACR Repo

![Identity Attached](/images/image-22.png)

Once you have attached ACR Repository to AKS Cluster, open the management console and enable username and password by going into the access keys tab under settings.

![Enable User Credentials](/images/image-7.png)

### Step 9: Login with ACR Repository

```cmd
docker login mailingapp.azurecr.io
```

![Login Succeeded](/images/image-8.png)

### Step 10: Build docker image of frontend

```cmd
# Run this command under the frontend folder
docker build -t mailingapp.azurecr.io/frontendapp/frontend:latest .
```

![frontend image build](/images/image-9.png)

### Step 11: Build docker image of admin

```cmd
# Run this command under the admin folder
docker build -t mailingapp.azurecr.io/adminapp/admin:latest .
```

### Step 12: Build docker image of backend

```cmd
# Run this command under the frontend folder
docker build -t mailingapp.azurecr.io/backend:latest .
```

### Step 13: Host your DNS Zone file in azure DNS Zone

- Select the subscription
- Select the resource group
- Add your domain name
- Click review + create

![Create Public DNS Zone](/images/image-10.png)

### Step 14: Update Your DNS Registrar Name server with Azure Public Zone Name Server

![Registrar](/images/image-11.png)
![Azure Name Servers](/images/image-13.PNG)
![Update Records](/images/image-12.png)

### Step 15: Create Ingress Namespace

```cmd
kubectl get ns
kubectl create namespace ingress
kubectl get ns
```

![ingress namespace](/images/image-14.png)

### Step 16: Create Ingress Static IP

```cmd
# Get the resource group name of the AKS cluster
AKS_NODE_RG=$(az aks show --resource-group aks-prod --name aksprod1 --query nodeResourceGroup -o tsv)
# TEMPLATE - Create a public IP address with the static allocation
az network public-ip create --resource-group ${AKS_NODE_RG} --name ingress-ip --sku Standard --allocation-method static --query publicIp.ipAddress -o tsv
```

![ingress ip](/images/image-15.png)

### Step 17: Install Ingress Controller

```cmd
# Add the official stable repository
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

# Replace Static IP captured in Step-16
helm install ingress-nginx ingress-nginx/ingress-nginx \
    --namespace ingress \
    --set controller.replicaCount=2 \
    --set controller.nodeSelector."kubernetes\.io/os"=linux \
    --set defaultBackend.nodeSelector."kubernetes\.io/os"=linux \
    --set controller.service.externalTrafficPolicy=Local \
    --set controller.service.loadBalancerIP="172.178.15.188"

# List Pods
kubectl get pods -n ingress
kubectl get all -n ingress
```

### Step 18: Create External DNS Manifests

- External-DNS needs permissions to Azure DNS to modify (Add, Update, Delete DNS Record Sets)
- We can provide permissions to External-DNS pod in two ways in Azure
  - Using Azure Service Principal
  - Using Azure Managed Service Identity (MSI)
- We are going to use `MSI` for providing necessary permissions here which is latest and greatest in Azure as on today.

### Gather Information Required for azure.json file

```t
# To get Azure Tenant ID
az account show --query "tenantId"

# To get Azure Subscription ID
az account show --query "id"
```

![tenant id and subscription id](/images/image-16.png)

### Create Manged Service Identity (MSI)

- Go to All Services -> Managed Identities -> Add
- Resource Name: aksdemo1-externaldns-access-to-dnszones
- Subscription: Pay-as-you-go
- Resource group: aks-rg1
- Location: Central US
- Click on **Create**

### Add Azure Role Assignment in MSI

- Opem MSI -> aksdemo1-externaldns-access-to-dnszones
- Click on **Azure Role Assignments** -> **Add role assignment**
- Scope: Resource group
- Subscription: Pay-as-you-go
- Resource group: dns-zones
- Role: Contributor

### Make a note of Client Id and update in azure.json

- Go to **Overview** -> Make a note of \*\*Client ID"
- Update in **azure.json** value for **userAssignedIdentityID**

```
  "userAssignedIdentityID": "de836e14-b1ba-467b-aec2-93f31c027ab7"
```

![MSI](/images/image-17.png)

## Step-04: Associate MSI in AKS Cluster VMSS

- Go to All Services -> Virtual Machine Scale Sets (VMSS) -> Open aksdemo1 related VMSS (aks-agentpool-27193923-vmss)
- Go to Settings -> Identity -> User assigned -> Add -> aksdemo1-externaldns-access-to-dnszones

![Attached VMSS](/images/image-21.png)

![Associate](/images/image-18.png)

### Create azure.json file

```json
{
  "tenantId": "ebbdef88-0d9e-489c-aabe-be94339ff03b",
  "subscriptionId": "63bfb3d2-54e2-42ee-884b-334e2ab70b82",
  "resourceGroup": "aks-prod",
  "useManagedIdentityExtension": true,
  "userAssignedIdentityID": "ca623f34-5698-46fa-bf19-1a71a0f27c2a"
}
```

### Step 19: Create Kubernetes Secret and Deploy ExternalDNS

```cmd
# Create Secret
cd kube-manifests/01-ExteranlDNS
kubectl create secret generic azure-config-file --from-file=azure.json

# List Secrets
kubectl get secrets
```

![secrete](/images/image-19.png)

### Step 20: Deploy External DNS Deployment

### Review external-dns.yml manifest

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: external-dns
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: external-dns
rules:
  - apiGroups: ['']
    resources: ['services', 'endpoints', 'pods', 'nodes']
    verbs: ['get', 'watch', 'list']
  - apiGroups: ['extensions', 'networking.k8s.io']
    resources: ['ingresses']
    verbs: ['get', 'watch', 'list']
  - apiGroups: ['']
    resources: ['nodes']
    verbs: ['list']
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: external-dns-viewer
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: external-dns
subjects:
  - kind: ServiceAccount
    name: external-dns
    namespace: default
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: external-dns
spec:
  strategy:
    type: Recreate
  selector:
    matchLabels:
      app: external-dns
  template:
    metadata:
      labels:
        app: external-dns
    spec:
      serviceAccountName: external-dns
      containers:
        - name: external-dns
          image: k8s.gcr.io/external-dns/external-dns:v0.11.0
          args:
            - --source=service
            - --source=ingress
            #- --domain-filter=example.com # (optional) limit to only example.com domains; change to match the zone created above.
            - --provider=azure
          #- --azure-resource-group=externaldns # (optional) use the DNS zones from the specific resource group
          volumeMounts:
            - name: azure-config-file
              mountPath: /etc/kubernetes
              readOnly: true
      volumes:
        - name: azure-config-file
          secret:
            secretName: azure-config-file
```

```cmd
# Verify ExternalDNS Logs
 kubectl apply -f external-dns.yaml

kubectl logs -f $(kubectl get po | egrep -o 'external-dns[A-Za-z0-9-]+')
```

![Deployed](/images/image-20.png)

## Step 21: Review Ingress Resource

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: mailing-app-ingress-service
spec:
  ingressClassName: nginx
  rules:
    - host: frontend.ibrarmunir.co
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-service
                port:
                  number: 80
    - host: admin.ibrarmunir.co
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: admin-service
                port:
                  number: 80
    - host: api.ibrarmunir.co
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: backend-service
                port:
                  number: 80
```

## Step 22: Apply Kubernetes Manifests

```cmd
kubectl apply -f azure-file-storage-sc.yaml

kubectl apply -f pg-pvc.yaml

kubectl apply -f pg-password.yaml

kubectl apply -f backend-config-map.yaml

kubectl apply -f frontend-admin-config-map.yaml

kubectl apply -f pg-deployment.yaml

kubectl apply -f .
```

![Applied Manifests](/images/image-23.png)

## Step 23: Create SuperAdmin User to Access Admin Panel

```url
http://api.ibrarmunir.co/api/auth/admin/register
```

```json
{
  "firstName": "Super Admin",
  "lastName": "Mailing label",
  "email": "superadmin@gmail.com",
  "password": "12345678",
  "role": "superadmin"
}
```

![Super Admin](/images/image-24.png)

## Step 24: Mailing Label Form

```url
http://frontend.ibrarmunir.co/
```

![Frontend Form](/images/image-26.png)

## Step 24: Admin Panel

```url
http://admin.ibrarmunir.co/
```

![Frontend Form](/images/image-27.png)
![Frontend Form](/images/image-28.png)

![DNS Records](/images/image-25.png)

Let's enable SSL/TLS support for the secure communication

## Step 25: Update Ingress Resource

```yam
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: mailing-app-ingress-service
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt
spec:
  ingressClassName: nginx
  rules:
    - host: frontend.ibrarmunir.co
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-service
                port:
                  number: 80
    - host: admin.ibrarmunir.co
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: admin-service
                port:
                  number: 80
    - host: api.ibrarmunir.co
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: backend-service
                port:
                  number: 80
  tls:
    - hosts:
        - frontend.ibrarmunir.co
      secretName: frontend-ibrarmunir-secret
    - hosts:
        - admin.ibrarmunir.co
      secretName: admin-ibrarmunir-secret
    - hosts:
        - api.ibrarmunir.co
      secretName: api-ibrarmunir-secret
```

## Step 26: Create Cluster Issuer

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt
spec:
  acme:
    # The ACME server URL
    server: https://acme-v02.api.letsencrypt.org/directory
    # Email address used for ACME registration
    email: ibrarmunir009@gmail.com
    # Name of a secret used to store the ACME account private key
    privateKeySecretRef:
      name: letsencrypt
    solvers:
      - http01:
          ingress:
            ingressClassName: nginx
```

## Step 27: Install Cert Manager

```t
# Label the ingress-basic namespace to disable resource validation
kubectl label namespace ingress cert-manager.io/disable-validation=true

# Add the Jetstack Helm repository
helm repo add jetstack https://charts.jetstack.io

# Update your local Helm chart repository cache
helm repo update

# Install the cert-manager Helm chart
helm install \
  cert-manager jetstack/cert-manager \
  --namespace ingress-basic \
  --version v1.12.4 \
  --set installCRDs=true

## SAMPLE OUTPUT
Kalyans-MacBook-Pro:12-ExternalDNS-for-AzureDNS-on-AKS kdaida$ helm install \
>   cert-manager jetstack/cert-manager \
>   --namespace ingress-basic \
>   --version v1.8.2 \
>   --set installCRDs=true
NAME: cert-manager
LAST DEPLOYED: Mon Jul 11 17:26:31 2022
NAMESPACE: ingress-basic
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
cert-manager v1.8.2 has been deployed successfully!

In order to begin issuing certificates, you will need to set up a ClusterIssuer
or Issuer resource (for example, by creating a 'letsencrypt-staging' issuer).

More information on the different types of issuers and how to configure them
can be found in our documentation:

https://cert-manager.io/docs/configuration/

For information on how to configure cert-manager to automatically provision
Certificates for Ingress resources, take a look at the `ingress-shim`
documentation:

https://cert-manager.io/docs/usage/ingress/
Kalyans-MacBook-Pro:12-ExternalDNS-for-AzureDNS-on-AKS kdaida$


# Verify Cert Manager pods
kubectl get pods --namespace ingress

# Verify Cert Manager Services
kubectl get svc --namespace ingress
```

![Cert Manager](/images/image-29.png)

### Step 28: Deploy Cluster Issuer

```t
# Deploy Cluster Issuer
kubectl apply -f cluster-issuer.yml

# List Cluster Issuer
kubectl get clusterissuer

# Describe Cluster Issuer
kubectl describe clusterissuer letsencrypt
```

## Step 29: Verify certificates

- Certificate Request, Generation, Approal and Download and be ready might take from 1 hour to couple of days if we make any mistakes and also fail.
- For me it took, only 5 minutes to get the certificate from **https://letsencrypt.org/**

```t
# Verify Cert Manager Pod Logs
kubectl get pods -n ingress-basic
kubectl  logs -f <cert-manager-55d65894c7-sx62f> -n ingress-basic #Replace Pod name

# Verify SSL Certificates (It should turn to True)
kubectl get certificate
```

![Certificates](/images/image-30.png)
![frontend certificate](/images/image-31.png)
![admin certificate](/images/image-32.png)
