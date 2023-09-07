FROM node:16-alpine As build

WORKDIR /usr/src/app

USER node

COPY --chown=node:node package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node . .

# Run the build command which creates the production bundle
RUN npm run build


FROM node:16-alpine As production
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# Start the server using the production build
CMD [ "node", "dist/main.js" ]