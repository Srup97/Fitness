// src/routes/factura.js
import express from 'express';
import sequelize from '../db.js';
import { Factura, MembresiaUsuario, DetalleFactura } from '../models/index.js';
const router = express.Router();

router.get('/getfacturas', async (req, res) => {
    const { username } = req.query;
    try {
        const results = await sequelize.query('CALL datos_factura(:username)', {
            replacements: { username: username || null }
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


router.put('/confirmar_factura/:id', async (req, res) => {
  const { id } = req.params;
  try {
    console.log(id);
    const factura = await Factura.findByPk(id);
    if (!factura) {
      return res.status(404).json({ message: 'Factura no encontrada' });
    }
    factura.estado_pago = 'pagada';
    await factura.save();

    const detalles = await DetalleFactura.findAll({ where: { factura_id: id } });
    if (!detalles || detalles.length === 0) {
      return res.status(404).json({ message: 'Detalle no encontrado' });
    }

    // Aquí asumimos que cada factura tiene un solo cliente. 
    // Si una factura puede tener múltiples clientes, necesitarías manejar eso de otra manera.
    const id_cliente = detalles[0].id_cliente;
    if (!id_cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado en los detalles de la factura' });
    }

    const membresia = await MembresiaUsuario.findOne({ where: { user_id: id_cliente } });
    if (!membresia) {
      return res.status(404).json({ message: 'Membresía no encontrada' });
    }

    membresia.status = 'activa';
    await membresia.save();

    res.status(200).json({ message: 'Factura confirmada y membresía activada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al confirmar la factura' });
  }
});



router.get('/facturas', async (req, res) => {
  try {
    const membresias = await Factura.findAll();
    res.status(200).json(membresias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/detalle_facturas', async (req, res) => {
  try {
    const membresias = await DetalleFactura.findAll();
    res.status(200).json(membresias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;
