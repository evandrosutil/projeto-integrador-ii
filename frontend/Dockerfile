FROM node:22.11-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app
COPY package-lock.json /app
RUN npm install
RUN npm install react-scripts@3.4.1 -g --silent

COPY . /app

CMD ["npm", "start"]