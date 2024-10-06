import express from 'express';
import Persona from '../models/usuarios/persona.js';

const router = express.Router();

router.get('/', async (req, res) => {
  console.log("funciona?");
  try {
    const personas = await Persona.findAll();
    res.json(personas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {  
  try {
    const persona = await Persona.findByPk(req.params.id);
    if (persona) {
      res.json(persona);
    } else {
      res.status(404).json({ error: 'Persona not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const persona = await Persona.create(req.body);
    res.status(201).json(persona);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {  
  try {
    const persona = await Persona.findByPk(req.params.id);
    if (persona) {
      await persona.update(req.body);
      res.json(persona);
    } else {
      res.status(404).json({ error: 'Persona not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {  
  try {
    const persona = await Persona.findByPk(req.params.id);
    if (persona) {
      await persona.destroy();
      res.json({ message: 'Persona deleted' });
    } else {
      res.status(404).json({ error: 'Persona not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
