FROM node:20-slim as builder
WORKDIR /usr/src/app
COPY . .
RUN npm ci
RUN npx quartz build

FROM nginx:latest

COPY --from=builder /usr/src/app/public/ /usr/share/nginx/html
COPY docker/default.conf /etc/nginx/conf.d/default.conf
