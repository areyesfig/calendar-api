const express = require('express');
const { dbConnection } = require('./database/config');
require('dotenv').config();
const cors = require('cors');

//Creando servidor de express
const app = express();

//Base dde datos
dbConnection();

//Cors
app.use(cors())

//Lectura y parseo de body
app.use(express.json());

//Directorio Publico
app.use( express.static('public'));

//Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

//Escuchar peticion
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`)
});