# Frontend Dockerfile
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy application source code
COPY . .

# Install dependencies
RUN npm install

# Build the production-ready frontend
RUN npm run build
