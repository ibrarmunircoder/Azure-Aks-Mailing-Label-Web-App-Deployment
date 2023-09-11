FROM node:16-alpine

LABEL author="IBRAR MUNIR"

WORKDIR /app

COPY  ./package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY ./ ./ 

CMD ["npm", "run", "start"]