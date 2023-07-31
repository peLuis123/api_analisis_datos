const request = require('supertest'); // Agrega esta línea para importar supertest
const app = require('../app.js'); // Prueba unitaria para la ruta '/hola'
describe('GET /hola', () => {
  it('debe responder con el mensaje "hola mundo"', async () => {
    const response = await request(app).get('/hola');
    expect(response.status).toBe(200);
    expect(response.text).toEqual('hola mundo\n'); // Suponiendo que la ruta envía "hola mundo" con un salto de línea al final
  });
});