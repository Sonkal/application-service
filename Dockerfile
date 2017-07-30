FROM sandrokeil/typescript

USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

ADD package.json /home/node/app/package.json
RUN cd /home/node/app && npm install --production

COPY . /home/node/app
RUN npm run-script build

CMD ["node", "dist/index.js"]