# Track 369 - Servicio de gestión de guías

Este proyecto es un servicio API REST para gestionar las guías en la aplicación Track 369. El servicio se encarga de la creación, consulta, actualización y eliminación de guías, así como la asignación y seguimiento de las mismas en entregas y recolecciones.

## Requisitos

- Node.js v14.x o superior
- MySQL 8.x o superior

## Instalación

1. Clona este repositorio en tu máquina local:

   `git clone https://github.com/your-username/track-369-guide-management.git`

2. Cambia al directorio del proyecto:

   `cd track-369-guide-management`

3. Instala las dependencias del proyecto:

   `npm install`

4. Copia el archivo de configuración de ejemplo y ajusta las variables de entorno según tus necesidades:

   `cp .env.example .env`

   A continuación, configura las variables de entorno en el archivo `.env`:

   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=myuser
   DB_PASS=mypassword
   DB_NAME=mydatabase
   JWT_SECRET=mysecret
   JWT_EXPIRATION=86400
   LOG_LEVEL=info
   LOG_LABEL=myapp
   APP_PAGESIZE=10

El servidor se iniciará en el puerto especificado en el archivo `.env`. Por defecto, se utiliza el puerto 3000. La API estará disponible en `http://localhost:3000`.

## Documentación

La documentación de la API se encuentra disponible a través de Swagger bajo la ruta `/api/docs`.

## Endpoints

- `POST /api/guides`: Crear una nueva guía
- `GET /api/guides`: Listar guías
- `GET /api/guides/:id`: Obtener detalles de una guía
- `PUT /api/guides/:id`: Actualizar una guía
- `DELETE /api/guides/:id`: Eliminar una guía
- `POST /api/guides/:id/assign`: Asignar una guía a un repartidor
- `POST /api/guides/:id/track`: Registrar un evento de seguimiento para una guía
