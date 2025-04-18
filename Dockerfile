# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project
COPY . .

# build appication
RUN npm run build

# run application
CMD ["node", "dist/index.js"]
