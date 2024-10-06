import express from 'express';
import Email from '../models/usuarios/email.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const emails = await Email.findAll();
    res.json(emails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const email = await Email.findByPk(req.params.id);
    if (email) {
      res.json(email);
    } else {
      res.status(404).json({ error: 'Email not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const email = await Email.create(req.body);
    res.status(201).json(email);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const email = await Email.findByPk(req.params.id);
    if (email) {
      await email.update(req.body);
      res.json(email);
    } else {
      res.status(404).json({ error: 'Email not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const email = await Email.findByPk(req.params.id);
    if (email) {
      await email.destroy();
      res.json({ message: 'Email deleted' });
    } else {
      res.status(404).json({ error: 'Email not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
