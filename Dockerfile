### STAGE 1:BUILD ###
# Defining a node image to be used as giving it an alias of "build"
# Which version of Node image to use depends on project dependencies
# This is needed to build and compile our code
# while generating the docker image
FROM node:23-slim AS build
# Create a Virtual directory inside the docker image
WORKDIR /dist/src/app

# Activate pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Copy files to virtual directory
# COPY package.json package-lock.json ./
# Run command in Virtual directory
# RUN npm cache clean --force
# Copy files from local machine to virtual directory in docker image
COPY . .
RUN pnpm install -g @angular/cli
RUN pnpm install --frozen-lockfile
RUN pnpm run build



### STAGE 2:RUN ###
# Defining nginx image to be used
FROM nginx:latest AS ngi
# Copying compiled code and nginx config to different folder
# NOTE: This path may change according to your project's output folder
COPY --from=build /dist/src/app/dist/transient-behavior-requirement-refiner /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/default.conf
# Exposing a port, here it means that inside the container
# the app will be using Port 80 while running
EXPOSE 80
