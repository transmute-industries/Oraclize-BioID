FROM node:8.2.1
WORKDIR /usr/src/app

COPY package.json .
# COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]