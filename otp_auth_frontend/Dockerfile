# Step 1: Use a Node.js image to build the React app
FROM node:21-alpine as build

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json for dependency installation
COPY package.json package-lock.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Build the React app for production
RUN npm run build

# Step 7: Use NGINX to serve the static files
FROM nginx:stable-alpine

# Step 8: Copy the build files to the NGINX web directory
COPY --from=build /app/build /usr/share/nginx/html

# Step 9: Expose the port the frontend listens on
EXPOSE 80

# Step 10: Start NGINX
CMD ["nginx", "-g", "daemon off;"]
