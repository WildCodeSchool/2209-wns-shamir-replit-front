FROM node:18 as base

WORKDIR /front
COPY package*.json /front
EXPOSE 3000

FROM base as production
ENV NODE_ENV=production
RUN npm install --force
COPY src /front/src
COPY public /front/public
COPY .env /front/.env
COPY tsconfig.json /front/
RUN npm run build
RUN npm install -g serve
CMD ["echo", "baltringue"]

FROM base as dev
ENV NODE_ENV=development
RUN npm install --force
COPY src /front/src
COPY public /front/public
COPY .env /front/.env
COPY tsconfig.json /front/
CMD ["react-scripts", "start"]
