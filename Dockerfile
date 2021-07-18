FROM --platform=linux/x86-64 node:lts-alpine

# make the 'app' folder the current working directory
WORKDIR /app

# install simple http server for serving static content
RUN npm install -g http-server

# copy dist folder to working directory
COPY /dist/kees-dashboard . 

EXPOSE 8080
CMD [ "http-server" ]

# FROM nginx
# RUN rm /etc/nginx/conf.d/default.conf
# COPY ./default.conf /etc/nginx/conf.d
# COPY /dist/internal-erp /usr/share/nginx/html