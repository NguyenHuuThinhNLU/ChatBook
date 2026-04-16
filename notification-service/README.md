# notification Service

### Prerequires

### MongoDB
Install MongoDB from Docker Hub

` docker pull bitnami/mongodb:latest`

Start Mongodb Server at port 27017 with root username and password: root/root

`docker run -d --name mongodb-latest -p 27017:27017 -e MONGODB_ROOT_USER=root -e MONGODB_ROOT_PASSWORD=root bitnami/mongodb:latest`

### Brevo (Sendinblue) API key
Do not put the API key in `application.yaml`. The app reads it from an environment variable `BREVO_APIKEY`.

PowerShell:

`$env:BREVO_APIKEY="YOUR_KEY"; ./mvnw spring-boot:run`

