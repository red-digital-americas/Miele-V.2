# Stage 1
FROM node:12 as build-step
RUN mkdir -p /app
RUN apt-get install python2.7
WORKDIR /app
COPY package.json /app
RUN npm install --force
COPY . /app
RUN npm run build

# Stage 2
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build-step /app/dist /usr/share/nginx/html
RUN chmod -R 755 /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]