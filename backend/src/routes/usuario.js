import express from 'express';
import bcrypt from 'bcryptjs';
import sequelize from '../db.js';
import authMiddleware from '../functions/authMiddleware.js';
import { MembresiaUsuario, Persona, Usuario, DatosMembresia, Telefono, Direccion } from '../models/index.js';


const router = express.Router();


router.get('/datos_usuario/:id', authMiddleware, async (req, res) => {
  const { id } = req.params; // Obtenemos el id del usuario desde los parámetros de la ruta

  try {
    const usuario = await Usuario.findOne({
      where: { id }, // Condición para buscar por id
      include: [
        {
          model: Persona,
          as: 'persona',
          include: [
            {
              model: Telefono,
              as: 'telefonos',
            },
            {
              model: Direccion,
              as: 'direccion',
            }
          ]
        },
      ],
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Error al obtener datos del usuario' });
  }
});

router.get('/membresia_user',authMiddleware, async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      include: [
        {
          model: Persona,
          as: 'persona',
          include: [
            {
              model: Telefono,
              as: 'telefonos',
            },
            {
              model: Direccion,
              as: 'direccion',
            }
          ] // Alias coincidente con la asociación
        },
        {
          model: MembresiaUsuario,
          as: 'membresias', // Alias coincidente con la asociación
          include: [
            {
              model: DatosMembresia,
              as: 'datosMembresia', // Alias coincidente con la asociación
            },
          ],
        },
      ],
    });

    // Modificar los resultados para incluir el estado basado en membresias
    const result = usuarios.map(usuario => {
      const hasMembresia = usuario.membresias && usuario.membresias.length > 0;
      return {
        ...usuario.toJSON(),
        membresiaEstado: hasMembresia ? 'con membresia' : 'sin membresia',
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Ruta pública para cambiar la contraseña
router.post('/change-password', async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;

  try {
    const [results] = await sequelize.query('SELECT * FROM usuario WHERE username = :username', {
      replacements: { username }
    });

    if (results.length === 0) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña antigua incorrecta' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await sequelize.query('UPDATE usuario SET password = :newPassword WHERE username = :username', {
      replacements: { newPassword: hashedPassword, username }
    });

    res.status(200).json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error en el servidor:', error.message);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta para obtener todos los usuarios, requiere autenticación
router.get('/getAllUser', authMiddleware, async (req, res) => {
  try {
    const results = await sequelize.query('CALL getAllUserData()');
    if (Array.isArray(results[0])) {
      res.json(results[0]); // Envía solo el primer elemento que contiene los datos
    } else {
      res.json(results); // Maneja el caso donde no es un array
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener un usuario por su nombre de usuario, requiere autenticación
router.get('/getUser/:username', authMiddleware, async (req, res) => {
  const { username } = req.params;

  try {
    const [results, metadata] = await sequelize.query('CALL getUserData(:username)', {
      replacements: { username },
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rutas para activar/desactivar usuarios, requieren autenticación
router.put('/deactivate/:usuario_id', authMiddleware, async (req, res) => {
  const { usuario_id } = req.params;
  // console.log(usuario_id);
  try {
    const [results, metadata] = await sequelize.query('CALL desactivar(:usuario_id)', {
      replacements: { usuario_id },
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/activate/:usuario_id', authMiddleware, async (req, res) => {
  const { usuario_id } = req.params;
  // console.log(usuario_id);
  try {
    const [results, metadata] = await sequelize.query('CALL activar(:usuario_id)', {
      replacements: { usuario_id },
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener datos de usuario por parámetro de búsqueda, requiere autenticación
router.get('/getUserdata/:searchParam', authMiddleware, async (req, res) => {
  const { searchParam } = req.params;

  try {
    // console.log('Search Param:', searchParam); // Depura el parámetro de búsqueda

    // Ejecuta el procedimiento almacenado sin especificar el tipo de consulta
    const results = await sequelize.query('CALL getUserData(:searchParam)', {
      replacements: { searchParam },
      type: sequelize.QueryTypes.RAW, // O puedes omitir esto por completo
    });

    // console.log('Results:', results); // Imprime los resultados en la consola
    if (Array.isArray(results[0])) {
      res.json(results[0]); // Envía el array de resultados
    } else {
      res.json(results); // En caso de que los resultados no sean un array anidado
    }
  } catch (error) {
    console.error('Error:', error); // Añade un console.error para mayor visibilidad del error
    res.status(500).json({ error: error.message });
  }
});


// Endpoint de registro de usuario
router.post('/registerUser', async (req, res) => {
  const {
    nombre,
    apellido,
    fecha_nacimiento,
    genero,
    calle,
    ciudad,
    pais,
    telefono_tipo,
    telefono_numero,
    tipo_identificacion,
    numero_identificacion,
    email,
    username,
    password,
  } = req.body;

  try {
    // Verificar si el nombre de usuario ya existe
    const [existingUser] = await sequelize.query('SELECT * FROM usuario WHERE username = :username', {
      replacements: { username },
    });

    const [existingDNI] = await sequelize.query('SELECT * FROM identificacion WHERE numero = :numero_identificacion', {
      replacements: { numero_identificacion },
    });

    if (existingDNI.length > 0) {
      return res.status(400).json({ error: 'El DNI ya está en uso' });
    }

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
    }

    // Obtener el id del rol
    const [role] = await sequelize.query('SELECT id FROM roles WHERE name = :name', {
      replacements: { name: 'user' },
      type: sequelize.QueryTypes.SELECT,
    });

    // Asegúrate de que el rol existe
    if (!role) {
      return res.status(400).json({ error: 'El rol no existe' });
    }

    // Llamar al procedimiento almacenado
    await sequelize.query('CALL RegisterUser(:nombre, :apellido, :fecha_nacimiento, :genero, :calle, :ciudad, :pais, :telefono_tipo, :telefono_numero, :numero_identificacion, :tipo_identificacion, :email, :username, :password, :id_role)', {
      replacements: {
        nombre,
        apellido,
        fecha_nacimiento,
        genero,
        calle,
        ciudad,
        pais,
        telefono_tipo,
        telefono_numero,
        numero_identificacion,
        tipo_identificacion,
        email,
        username,
        password,
        id_role: role.id, // Asignar el rol al usuario
      },
    });

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});



// Rutas CRUD para usuarios, requieren autenticación
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ error: 'Usuario not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const usuario = await Usuario.create(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (usuario) {
      await usuario.update(req.body);
      res.json(usuario);
    } else {
      res.status(404).json({ error: 'Usuario not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (usuario) {
      await usuario.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Usuario not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
