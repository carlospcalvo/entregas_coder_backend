# Entrega Final - Backend E-commerce

<div style="width: 100%; display:flex; justify-content: space-around">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original-wordmark.svg" alt="Nodejs" height="100" width="200"  />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original-wordmark.svg" alt="Express" height="100" width="200" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-plain-wordmark.svg" alt="MongoDB" height="100" width="100" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original-wordmark.svg" alt="Socket.io" height="100" width="200" />        
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/handlebars/handlebars-original-wordmark.svg" alt="Handlebars" height="100" width="200" />
</div>

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

## Correr el servidor:

### Modo desarrollo

-   Usando npm:

```
npm run dev
```

-   Usando yarn

```
yarn dev
```

### Modo produccion

-   Usando npm:

```
npm start
```

-   Usando yarn

```
yarn start
```


## Consideraciones

-   El chat fue testeado en [Postman](https://learning.postman.com/docs/sending-requests/supported-api-frameworks/websocket) (no hay vista).
-   La vista de "info" no va a funcionar si se cambia el puerto y no se actualiza el script `index.js` de la carpeta public.
