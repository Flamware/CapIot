# Stage 1: Build the React application
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Pass VITE_API_URL as a build argument
ARG VITE_API_URL

# Build the React application with the API URL
RUN VITE_API_URL=$VITE_API_URL npm run build

# Stage 2: Serve the built application with Nginx
FROM nginx:alpine

# Copy the build files from the builder stage to Nginx's public directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration if necessary
# Ensure you have a custom nginx.conf file in your project directory
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the default HTTP port
EXPOSE 80

# Run Nginx in the foreground to serve the app
CMD ["nginx", "-g", "daemon off;"]