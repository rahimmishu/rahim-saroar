# 1. Base Image
FROM node:18-alpine

# 2. Working Directory
WORKDIR /app

# 3. Copy package.json
COPY package*.json ./

# 4. Install Dependencies
RUN npm install

# 5. Copy Source Code
COPY . .

# 6. Build the project
RUN npm run build

# 7. Expose Port
EXPOSE 3000

# 8. Start Command
CMD ["npm", "start"]
