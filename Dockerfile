FROM node:lts-alpine3.19 as builder

COPY . ./

RUN npm install &&\
    npm cache clean --force &&\
    npm run compile &&\
    npm test

FROM node:lts-alpine3.19

COPY --from=builder dist dist
COPY --from=builder package.json ./
COPY --from=builder package-lock.json ./
COPY --from=builder docs docs

RUN npm install --omit=dev &&\
    npm cache clean --force &&\
    adduser -u 2004 -D docker &&\
    chown -R docker:docker /docs

CMD ["node", "dist/src/index.js"]
