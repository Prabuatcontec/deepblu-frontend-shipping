FROM node:16-alpine

WORKDIR /app

COPY package.json .

RUN npm install react-router-dom

COPY . .

EXPOSE 3000
# required for docker desktop port mapping

CMD ["npm", "start"]