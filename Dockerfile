FROM node:22-alpine3.20
WORKDIR /usr/src/app
COPY package.json .
RUN yarn
COPY . .
RUN npx prisma generate
RUN npx prisma db push
CMD ["yarn", "start"]