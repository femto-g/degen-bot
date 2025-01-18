# syntax=docker/dockerfile:1

FROM node:20-alpine as build
EXPOSE 3000
WORKDIR /home/app
COPY . .
RUN npm install

RUN npx prisma generate
RUN npm run build
# RUN chown -R 1001:1001 /home/app && chmod +x /home/app/scripts/start.sh && chmod -R 755 /home/app/dist

# USER 1001:1001
CMD ["sh", "scripts/prod.sh"]