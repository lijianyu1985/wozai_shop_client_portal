FROM nginx:1.14.2-alpine
COPY dist/ /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
EXPOSE 443