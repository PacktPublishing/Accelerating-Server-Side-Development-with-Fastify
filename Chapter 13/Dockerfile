FROM node:16-alpine

# set envs
ENV HOME=/home/app
ENV APP_HOME=$HOME/node/
ENV NODE_ENV=production

# add app dependencies
COPY package.json $APP_HOME
COPY package-lock.json $APP_HOME

# change workgin dir and install deps
WORKDIR $APP_HOME
RUN npm ci --only=production

# copy all app files
COPY --chown=node:node . $APP_HOME

# dumb-init registers signal handlers for every signal that can be caught
RUN apk update && apk add --no-cache dumb-init

# run app with low permissions level user
USER node

EXPOSE 3000
ENTRYPOINT ["dumb-init"]
CMD ["npm", "start"]
