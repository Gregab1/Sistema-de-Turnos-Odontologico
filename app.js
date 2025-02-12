const express = require('express');
const path = require('path'); // Importar módulo path para rutas
const app = express();
const port = process.env.PORT || 3000;
const db = require('./conexion/db'); // Importa tu archivo de conexión

//---------------------------------------------------------------

//---------------------------------------------------------------

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'vista')); // Ruta de las vistas

// Middleware para analizar JSON
app.use(express.json());

// Middleware para analizar datos enviados desde formularios HTML
app.use(express.urlencoded({ extended: true })); // Este middleware es crucial para formularios HTML
// Ruta base
// Verifica la conexión a la base de datos al iniciar
db.testConnection().then(success => {
    if (success) {
        console.log('Conexión a la base de datos exitosa.');
    } else {
        console.error('Error al conectar con la base de datos.');
        process.exit(1); // Finaliza el proceso si no se puede conectar
    }
});

app.use('/',require('./Routes/home.routes.js'))//Rutas del menu

// Mostrar puerto
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}/`);
});
