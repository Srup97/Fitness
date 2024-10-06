// src/routes/membresiaRoutes.js

import express from 'express';
import { DatosMembresia } from '../models/index.js';
import authMiddleware from '../functions/authMiddleware.js';
import sequelize from '../db.js';
import { MembresiaUsuario } from '../models/index.js';

const router = express.Router();

router.post('/pago_membresia', authMiddleware, async (req, res) => {
  const { 
    membershipId,
    tipo_factura,
    userId,
    devuelta,
    selectedUser 
  } = req.body;

  try {
    console.log('Request body:', req.body);

    const results = await sequelize.query('CALL factura_membresia(:producto_id, :tipo, :user_id, :devuelta, :usuario_id)', {
      replacements: { 
        producto_id: membershipId,
        tipo: tipo_factura,
        user_id: userId,
        devuelta: devuelta,
        usuario_id: selectedUser
      },
    });

    console.log('Procedure results:', results);

    res.status(201).json(results);
  } catch (error) {
    console.error('Error executing procedure:', error);
    res.status(500).json({ error: error.message });
  }
});



router.get('/getStatusMembership/:usuario_id', async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const results = await sequelize.query('CALL getStatusMembership(:usuario_id)',  {
      replacements: { usuario_id },
    });
    res.status(201).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/active/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    // console.log('Fetching active membership for user:', userId);
    const membership = await MembresiaUsuario.findOne({
      where: { user_id: userId, status: 'activa' }
    });
    if (membership) {
      // console.log('Membership found:', membership);
      res.json(membership);
      console.log(membership);
    } else {
      console.log('No active membership found for this user.');
      res.status(404).json({ message: 'No active membership found for this user.' });
    }
  } catch (error) {
    console.error('Error fetching active membership:', error);
    res.status(500).json({ message: 'Error fetching active membership.' });
  }
});

router.get('/getMembresiaUser/:usuario_id', async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const results = await sequelize.query('CALL getMembresiaUser(:usuario_id)',  {
      replacements: { usuario_id },
    });
    if (Array.isArray(results[0])) {
      res.json(results[0]); // Envía solo el primer elemento que contiene los datos
    } else {
      res.json(results); // Maneja el caso donde no es un array
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/sin_membresia', async (req, res) => {
  try {
    const results = await sequelize.query(`
    SELECT u.*, CONCAT(p.nombre, ' ', p.apellido) AS nombre_completo FROM usuario u
    INNER JOIN persona p ON u.persona_id = p.id
     WHERE NOT EXISTS
      ( SELECT 1 FROM membresia_usuario mu WHERE mu.user_id = u.id );
    `);
    if (Array.isArray(results[0])) {
      res.json(results[0]); // Envía solo el primer elemento que contiene los datos
    } else {
      res.json(results); // Maneja el caso donde no es un array
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/getAllMembresias', authMiddleware, async (req, res) => {
    try {
      const results = await sequelize.query('CALL getAllMembresiaUser()');
      if (Array.isArray(results[0])) {
        res.json(results[0]); // Envía solo el primer elemento que contiene los datos
      } else {
        res.json(results); // Maneja el caso donde no es un array
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

// Crear una nueva membresía
router.post('/datos_membresia', async (req, res) => {
  try {
    const { nombre, descripcion, costo, modalidad } = req.body;
    const nuevaMembresia = await DatosMembresia.create({ nombre, descripcion, costo, modalidad });
    res.status(201).json(nuevaMembresia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todas las membresías
router.get('/datos_membresia', async (req, res) => {
  try {
    const membresias = await DatosMembresia.findAll();
    res.status(200).json(membresias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener una membresía por ID
router.get('/datos_membresia/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const membresia = await DatosMembresia.findByPk(id);
    if (membresia) {
      res.status(200).json(membresia);
    } else {
      res.status(404).json({ message: 'Membresía no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar una membresía
router.put('/datos_membresia/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, costo, modalidad } = req.body;
    const membresia = await DatosMembresia.findByPk(id);
    if (membresia) {
      membresia.nombre = nombre;
      membresia.descripcion = descripcion;
      membresia.costo = costo;
      membresia.modalidad = modalidad;
      await membresia.save();
      res.status(200).json(membresia);
    } else {
      res.status(404).json({ message: 'Membresía no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar una membresía
router.delete('/datos_membresia/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const membresia = await DatosMembresia.findByPk(id);
    if (membresia) {
      await membresia.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Membresía no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
