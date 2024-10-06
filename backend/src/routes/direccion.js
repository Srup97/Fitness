import express from 'express';
import Direccion from '../models/usuarios/direccion.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const direcciones = await Direccion.findAll();
    res.json(direcciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const direccion = await Direccion.findByPk(req.params.id);
    if (direccion) {
      res.json(direccion);
    } else {
      res.status(404).json({ error: 'Direccion not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const direccion = await Direccion.create(req.body);
    res.status(201).json(direccion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const direccion = await Direccion.findByPk(req.params.id);
    if (direccion) {
      await direccion.update(req.body);
      res.json(direccion);
    } else {
      res.status(404).json({ error: 'Direccion not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const direccion = await Direccion.findByPk(req.params.id);
    if (direccion) {
      await direccion.destroy();
      res.json({ message: 'Direccion deleted' });
    } else {
      res.status(404).json({ error: 'Direccion not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
