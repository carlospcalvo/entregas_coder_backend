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
  
  - Modo: default = fork
  ```
  node index.js --cluster // corre en modo cluster en el puerto 8080
  ```

Tener en cuenta que si bien se puede cambiar el puerto del servidor via CLI, el frontend va a seguir consultando al puerto 8080 salvo que se configure Nginx para balancear las cargas.
