#Establecer imagen base
FROM node:18.16.0

#Crear y establecer el entorno de mi contenedor
WORKDIR /backend

#Agrego argumento para el .env por defecto en desarrollo
ARG ENV_FILE=.env.development

#Para ejecutar en produccion : docker build --build-arg ENV_FILE=.env.production -t index.js:production

#Copio todos los archivos de /src y package.json
COPY src ./src
COPY package*.json ./
COPY $ENV_FILE ./

#Instalar las dependencias
RUN npm install

#Establecer el puerto de mi App
EXPOSE 6000

#Comando para iniciar mi aplicacion
CMD ["node","src/index.js"]

# Copia el archivo .env a la raíz del contenedor
# COPY .env . funciona si hay un unico .env

#Comando para compilar: docker build -t index.js . 
#Comando para ejecutar: docker run -p 6000:6000 index.js

