import request from 'supertest';
import express from 'express';
import routes from './index.js'; // Ajusta la ruta según la ubicación de tu archivo

const app = express();
app.use('/api', routes);

describe('GET /api/persona', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).get('/api/persona');
    expect(res.statusCode).toEqual(200);
  });
});
