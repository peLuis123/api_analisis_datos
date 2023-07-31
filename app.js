const express = require("express")
const cors = require('cors');
const bodyParser = require('body-parser');
const verificacionRouter = require('./routes/conexion.js');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./routes/swagger.js');
app = express()
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// const corsOptions = {
//     origin: 'http://localhost:8080',
//     optionsSuccessStatus: 200
// };
app.use(cors());
// app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', verificacionRouter);
app.use('', verificacionRouter);

const port = 3000;
app.get('/hola', (req, res) => {
    console.log('hola mundo')
})
app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}`);
});

module.exports = app;