# Instalación de dependencias

```
npm install
```

# Inicio del servidor

Proveer un archivo `.env` con la variable `MONGO_URL` y el string de conexión para poder conectarse a la(s) bases de datos.

Ejecutar el archivo `index.js` con la variable `--PORT` para definir el puerto en el que se quiere que escuche el servidor.

```
node index.js --PORT 8081
```

Tener en cuenta que si bien se puede cambiar el puerto del servidor via CLI, el frontend va a seguir consultando al puerto 8080.
