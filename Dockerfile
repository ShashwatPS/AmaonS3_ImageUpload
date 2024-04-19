FROM node:21-alpine3.18

WORKDIR /src

COPY . .

RUN npm install

EXPOSE 3000

CMD ["node","server1.js"]