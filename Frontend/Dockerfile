FROM node:20-alpine as build

LABEL authors="yusufokr0"

WORKDIR /app

# ACTUALLY NO NEED FOR THEESE TWO LINE BUT JUST STAY HERE FOR NOW
ARG VITE_APP_BACKEND_URL
ENV VITE_APP_BACKEND_URL=$VITE_APP_BACKEND_URL

COPY package.json ./
COPY package-lock.json ./

RUN npm install


COPY . ./

RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8091

CMD ["nginx", "-g", "daemon off;"]