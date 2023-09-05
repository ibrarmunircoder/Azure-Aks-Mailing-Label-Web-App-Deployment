FROM node:16-alpine as builder

LABEL author="IBRAR MUNIR"

WORKDIR /app

COPY ./package*.json ./

RUN npm install --only=prod

COPY ./ ./ 

RUN npm run build

FROM nginx

EXPOSE 80

COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /var/www/html

CMD ["npm", "run", "start"]