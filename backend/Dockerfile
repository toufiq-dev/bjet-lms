FROM node:20

WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Ensure all dependencies are installed, including devDependencies
RUN npm install

# Install ts-node-dev and typescript globally
RUN npm install -g ts-node-dev typescript

# Copy the rest of the application code
COPY . .

CMD ["ts-node-dev", "src/server.ts"]