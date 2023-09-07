FROM node:16-alpine As build

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm ci --omit=dev

COPY . .

RUN npm run build


FROM node:16-alpine As production
COPY --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]