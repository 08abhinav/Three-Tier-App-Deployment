FROM node:14

WORKDIR app

COPY package*.json ./

npm install

COPY . .
CMD ["npm", "start"]

