# NodeJs Kubernetes & docker-compose

## 1. Getting started

[Docker](https://www.docker.com/) is recommended to be installed in your workstation

## 2. Docker-Compose

```sh
# Start the application in development mode in your docker environment (Recommended)
make dev OR docker-compose -f docker-compose-dev.yml up --build -V

# Start the application in production mode in your docker environment (Recommended)
make deploy OR docker-compose up --build
```

Once the application is running on port 3000, access the API docs using http://localhost:3000/docs

## 3. Kubernetes using Helm Charts
[kubectl](https://kubernetes.io/docs/tasks/tools/) & [helm](https://helm.sh/docs/intro/install/) cli tools are required to run the kubernetes deployment
```sh
# Before running kubernetes, make sure to build the image using the following command
docker build -t local/nodejs-kubernetes .

# Switch the directory to /helm
cd helm/nodejs-kubernetes

# Install dependencies
helm dependency update

# Run all kubernetes resources
helm install nodejs-kubernetes .

# View running pods 
helm get pods

# To delete pods
helm uninstall nodejs-kubernetes
```
Once the application is running on port 30000, access the API docs using http://localhost:30000/docs


