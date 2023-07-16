# Establecer la imagen base de Node.js
FROM --platform=linux/amd64 node:14-alpine

# Crear un directorio para la aplicación
WORKDIR /usr/src/app

# Actualizar los repositorios y las dependencias del sistema, e instalar Chromium y sus dependencias
RUN apk update && apk upgrade && apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ttf-freefont \
    libstdc++ \
    libx11 \
    libxcomposite \
    libxdamage \
    libxext \
    libxrender \
    libxtst \
    cups-libs \
    cairo \
    pango \
    gdk-pixbuf \
    gtk+3.0 \
    at-spi2-core

# Establecer la variable de entorno para Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    CHROME_BIN=/usr/bin/chromium-browser

# Copiar el package.json y el package-lock.json (si está presente)
COPY package*.json ./

# Instalar las dependencias de la aplicación
RUN npm install

# Si estás en un entorno de desarrollo, instala las dependencias de desarrollo
# RUN npm ci --only=development

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto en el que se ejecutará la aplicación
EXPOSE 3000

# Iniciar la aplicación
CMD [ "node", "index.js" ]
