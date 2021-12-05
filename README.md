# Auth mock config

### Definir en `controllers/auth/auth.controllers.js` si se quiere ejecutar como admin o no

```js
const admin = true | false; // Por defecto es true
```

# Correr el proyecto localmente

### Ejecutar el archivo `index.js` especificando la base de datos a utilizar:

-   Usando node:

```
node index.js mongo | firebase | archivo | memoria
```

-   Usando nodemon especificando la base de datos a utilizar:

```
nodemon index.js mongo | firebase | archivo | memoria
```
