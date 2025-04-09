# Build stage
FROM node:20-bullseye-slim AS builder

WORKDIR /usr/src/app

# Accept a build-time ARG for your CRA env variable
ARG REACT_APP_API_URL

# Make it available as an environment variable during build
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:stable-bullseye

COPY --from=builder /usr/src/app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 
