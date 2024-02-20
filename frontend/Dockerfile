FROM node:21-alpine

WORKDIR /frontend

COPY . /frontend

RUN yarn --pure-lockfile

CMD [ "yarn", "start" ]