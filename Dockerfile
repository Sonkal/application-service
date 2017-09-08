#FROM sandrokeil/typescript

FROM omnijarstudio/node:8.1.2-alpine

RUN npm i -g typescript && npm cache verify


#RUN useradd -ms /bin/sh node
#RUN adduser -h /home/node -s /bin/sh node


USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

ADD package.json /home/node/app/package.json
RUN cd /home/node/app && npm install --production

COPY . /home/node/app

USER root
RUN chown -R node:node .
USER node

RUN npm run-script build

EXPOSE 3000
#CMD ["node", "dist/tmp/simple.server.js"]
CMD ["node", "dist/index.js"]