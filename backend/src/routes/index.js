//src/models/index.js
import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

const __dirname = path.resolve();
const routesPath = path.join(__dirname, 'src', 'routes');

// Lee todos los archivos en el directorio de rutas, excepto este archivo index.js
fs.readdirSync(routesPath).forEach(async (file) => {
  if (file !== 'index.js' && file !== 'routes.test.js') { // Asegúrate de excluir el archivo de pruebas
    const module = await import(`./${file}`);
    const route = module.default;
    const routeName = file.split('.')[0];
    console.log(`Loading route: /${routeName} from file: ${file}`);
    router.use(`/${routeName}`, route);
  }
});

// // Registrar las rutas cargadas
// router.stack.forEach((layer) => {
//   console.log(`Registered route: ${layer.regexp}`);
// });

export default router;
