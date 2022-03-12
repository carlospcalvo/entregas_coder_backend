# Instalación de dependencias

```
npm install
```

# Inicio del servidor

Proveer un archivo `.env` con la variable `MONGO_URL` y el string de conexión para poder conectarse a la(s) bases de datos.

El archivo `index.js` se puede definir las siguientes variables: 

  - Puerto: default = 8080
  ```
  node index.js --PORT 8081  // corre en modo fork en el puerto 8081
  ```
  ```
  node index.js --PORT=8081  // corre en modo fork en el puerto 8081
  ```
