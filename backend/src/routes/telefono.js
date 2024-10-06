import express from 'express';
import Telefono from '../models/usuarios/telefono.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const telefonos = await Telefono.findAll();
    res.json(telefonos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const telefono = await Telefono.findByPk(req.params.id);
    if (telefono) {
      res.json(telefono);
    } else {
      res.status(404).json({ error: 'telefono not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const telefono = await Telefono.create(req.body); 
    res.status(201).json(telefono);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const telefono = await Telefono.findByPk(req.params.id)
    if (direccion) {
      await telefono.update(req.body);
      res.json(telefono);
    } else {
      res.status(404).json({ error: 'telefono not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const telefono = await Telefono.findByPk(req.params.id);
    if (telefono) {
      await telefono.destroy();
      res.json({ message: 'telefono deleted' });
    } else {
      res.status(404).json({ error: 'telefono not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
