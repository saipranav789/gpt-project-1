# Use an official Node.js runtime as the base image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the entire app directory to the working directory
COPY . .

# Expose port 5173 on which the app will run
EXPOSE 5173

# Define the command to run the app during development
CMD ["npm", "run", "dev"]
