# Use an official Node runtime as a parent image
FROM node:latest

# Set the working directory in the container
WORKDIR /dist/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

RUN npm cache clean --force

# Copy files from local machine to virtual directory in docker image
COPY . .
RUN npm install

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run prometheus.proxy.js when the container launches
CMD ["node", "prometheus.proxy.js", "--docker"]
