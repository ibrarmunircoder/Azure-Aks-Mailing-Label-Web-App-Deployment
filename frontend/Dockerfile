FROM node:16-alpine as builder

LABEL author="IBRAR MUNIR"

WORKDIR /app

USER node

COPY --chown=node:node package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node ./ ./ 

RUN npm run build

FROM nginx

EXPOSE 80

COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /var/www/html
