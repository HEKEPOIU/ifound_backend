#Build stage
#This is because of typescrpit need build with dev dependence
#So WE sperate the Dockerfile to Multi-Stage.
#And it Can use in dev
#Reference
#https://chinwendu.medium.com/how-to-dockerize-your-typescript-application-with-multi-stage-build-a-step-by-step-guide-56e7c4274088
FROM node:20 AS build

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

#Production stage
FROM node:20 AS production

WORKDIR /app

COPY package*.json .

RUN npm ci --only=production

COPY --from=build /app/dist ./dist

CMD ["node", "dist/index.js"]
