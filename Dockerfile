# Use a slim Node base
FROM node:16-slim

# Install wkhtmltopdf + deps
USER root
RUN apt-get update \
 && apt-get install -y wkhtmltopdf \
    libxrender1 libxext6 libfontconfig1 libjpeg62-turbo \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

# Copy app
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY server.js ./

# Drop to non-root
USER node

EXPOSE 3000
CMD ["node", "server.js"]
