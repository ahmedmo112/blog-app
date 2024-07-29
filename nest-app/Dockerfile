FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm ci
# RUN npm install

COPY prisma ./prisma/

COPY . ./

EXPOSE 3000

RUN npx prisma generate

RUN npm run build

CMD ["npm", "run", "start:prod"]


