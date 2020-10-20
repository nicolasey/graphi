FROM node:12-alpine as nest
WORKDIR /usr/src/app
COPY . . 
RUN npm install

EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]