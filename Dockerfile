FROM node:18

WORKDIR /app

# Install necessary tools including the PostgreSQL client
# RUN apt-get update && apt-get install -y netcat-openbsd postgresql-client

COPY package*.json ./

COPY . .

RUN npm install && npm run build

# COPY entrypoint.sh /app/

EXPOSE 3000

# ENTRYPOINT ["./entrypoint.sh"]

CMD ["node", "dist/main.js"]
