FROM node:16-alpine

LABEL author="IBRAR MUNIR"

WORKDIR /app

COPY ./package.json ./

RUN npm install --only=prod

COPY ./ ./ 

CMD ["npm", "start"]