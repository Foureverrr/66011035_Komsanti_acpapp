# Dockerfile for Next.js Frontend

# Use the official Node.js image as the base image
FROM node:20.17-alpine3.20

# Set the working directory inside the container
WORKDIR /src

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Verify that dayjs is installed correctly
RUN npm list dayjs

# Copy the rest of the application code to the container
COPY . .

# Disable Next.js telemetry
RUN npx next telemetry disable

# Expose the default Next.js port
EXPOSE 3000

# Start the Next.js development server
CMD ["npm", "run", "dev"]
