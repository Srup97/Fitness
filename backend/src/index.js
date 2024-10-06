// src/index.js

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import sequelize from './db.js'; // Ajusta la ruta según tu estructura
import routes from './routes/index.js';
import './functions/updateMembership.js'; // Importa el archivo para que se ejecute

const app = express();
const PORT = process.env.PORT || 3000; // Asegúrate de que el puerto tenga un valor por defecto

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

sequelize.authenticate()
  .then(() => console.log('Conexión a la base de datos establecida'))
  .catch(err => console.error('Error al conectar a la base de datos:', err));
