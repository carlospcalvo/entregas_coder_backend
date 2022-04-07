# Entrega Final - Backend E-commerce

## Configurar variables de entorno

Las siguientes variables de entorno son necesarias para el funcionamiento del servidor:

-   `PORT` Puerto de escucha del servidor
-   `JWT_SECRET` Clave para codificar y decodificar JWT
-   `JWT_EXPIRES_IN` Duracion del JWT en milisegundos
-   `MONGO_URL` String de conexión a la base de datos Mongo (local o MongoDB Atlas)
-   `SMTP_HOST` Host de email para mailing
-   `SMTP_PORT` Puerto a utilizar para mailing
-   `SMTP_EMAIL` Casilla de email para mailing
-   `SMTP_PASS` Contraseña de la casilla de email para mailing

## Instalar las dependencias

-   Usando npm:

```
npm install
```

-   Usando yarn

```
yarn install
```

## Ejecutar el archivo `index.js`:

-   Usando node:

```
node index.js
```

-   Usando nodemon

```
nodemon index.js
```

## Consideraciones

-   El chat fue testeado en Postman (no hay vista).
-   La vista de "info" no va a funcionar si se cambia el puerto y no se actualiza el script de la carpeta public.
