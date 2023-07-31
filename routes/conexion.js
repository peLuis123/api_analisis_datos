const express = require('express');
const XLSX = require('xlsx');
const multer = require('multer');
const os = require('os');
var admin = require("firebase-admin");
const _ = require('lodash');
const PDFDocument = require('pdfkit');
const Chart = require('chart.js');
const { Matrix } = require('ml-matrix');
const { createCanvas } = require('canvas');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
var serviceAccount = require("../serviceAccountKey.json");
const canvasRenderService = new ChartJSNodeCanvas({ width: 400, height: 400 });




admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://apidatos-default-rtdb.firebaseio.com"
});


const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const tempDir = os.tmpdir();
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });
router.get('/hola', (req, res) => {
    console.log('hola mundo')
})
//ruta para procesar el numero de hojas del archivo y dar la opcion de procesar cualquier hoja sin ser necesariamente la primera
router.post('/count_sheets', upload.single('excel'), (req, res) => {
    const excelFilePath = req.file.path;
    const workbook = XLSX.readFile(excelFilePath);
    const hojas = workbook.SheetNames;
    const cantidadHojas = hojas.length;


    if (cantidadHojas === 0) {
        res.status(400).json({ error: 'El archivo Excel no contiene hojas.' });
    } else {
        res.json({ cantidadHojas, hojas });
    }
});

//esta ruta nos ayuda a guardar los datos del xlsx en firestore pero en este caso se esta separando por clases o etiquetas

router.post('/convertir-y-guardar-clases', upload.single('excel'), async (req, res) => {
    const excelFilePath = req.file.path;
    const sheetNumber = req.body.sheetNumber;
    const workbook = XLSX.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[sheetNumber];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const cantidadObjetos = sheetData.length;
    try {
        const datosPorEtiqueta = {};
        sheetData.forEach((data) => {
            const etiqueta = data['Etiqueta'];
            if (etiqueta) {
                if (!datosPorEtiqueta[etiqueta]) {
                    datosPorEtiqueta[etiqueta] = [];
                }
                datosPorEtiqueta[etiqueta].push(data);
            }
        });
        const db = admin.firestore();
        const batch = db.batch();
        Object.entries(datosPorEtiqueta).forEach(([etiqueta, datos]) => {
            const collectionRef = db.collection(etiqueta);
            datos.forEach((data) => {
                const docRef = collectionRef.doc();
                batch.set(docRef, data);
            });
        });
        await batch.commit();
        const cantidadObjetos = sheetData.length;
        res.json({ cantidadObjetos, datos: datosPorEtiqueta });
    } catch (error) {
        console.error('Error al guardar en Firebase Firestore:', error);
        res.status(500).json({ error: 'Error al guardar en Firebase Firestore' });
    }
});

router.post('/convertir-y-guardar', upload.single('excel'), async (req, res) => {
    const excelFilePath = req.file.path;
    const sheetNumber = req.body.sheetNumber;
    const workbook = XLSX.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[sheetNumber];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    try {
        const db = admin.firestore();
        const batch = db.batch();
        sheetData.forEach((data) => {
            const docRef = db.collection('datos').doc();
            batch.set(docRef, data);
        });

        await batch.commit();
        const cantidadObjetos = sheetData.length;
        res.json({ cantidadObjetos, datos: sheetData });
    } catch (error) {
        console.error('Error al guardar en Firebase Firestore:', error);
        res.status(500).json({ error: 'Error al guardar en Firebase Firestore' });
    }
});

router.get('/tabla-conteo', async (req, res) => {
    try {
      const db = admin.firestore();
      const collectionRef = db.collection('datos');
      const snapshot = await collectionRef.get();
      const sheetData = snapshot.docs.map(doc => doc.data());

      const conteoClases = _.countBy(sheetData, 'Etiqueta');

      res.json(conteoClases);
    } catch (error) {
      console.error('Error en el análisis de datos:', error);
      res.status(500).json({ error: 'Error en el análisis de datos' });
    }
  });

  router.get('/grafico-circular', async (req, res) => {
    try {
        const db = admin.firestore();
        const collectionRef = db.collection('datos');
        const snapshot = await collectionRef.get();
        const sheetData = snapshot.docs.map(doc => doc.data());
        const conteoClases = _.countBy(sheetData, 'Etiqueta');
        const labels = Object.keys(conteoClases);
        const data = Object.values(conteoClases);

        const configuration = {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                    ],
                }],
            },
            options: {
                title: {
                    display: true,
                    text: 'Distribución de Clases en el Conjunto de Datos',
                    fontSize: 20,
                    fontColor: '#333',
                },
            },
        };
        const image = await canvasRenderService.renderToDataURL(configuration);

        res.json({ image });
    } catch (error) {
        console.error('Error en el análisis de datos:', error);
        res.status(500).json({ error: 'Error en el análisis de datos' });
    }
});
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
router.get('/grafico-linea/:caracteristica', async (req, res) => {
  try {
    const caracteristica = req.params.caracteristica;

    const db = admin.firestore();
    const collectionRef = db.collection('datos');
    const snapshot = await collectionRef.get();
    const sheetData = snapshot.docs.map(doc => doc.data());

    const dataPorClaseYTiempo = {};
    sheetData.forEach(data => {
      const etiqueta = data['Etiqueta'];
      const tiempo = data['Fecha'];
      const valorCaracteristica = data[caracteristica];
      if (!dataPorClaseYTiempo[etiqueta]) {
        dataPorClaseYTiempo[etiqueta] = [];
      }
      dataPorClaseYTiempo[etiqueta].push({ tiempo, valor: valorCaracteristica });
    });

    const labels = Object.keys(dataPorClaseYTiempo[Object.keys(dataPorClaseYTiempo)[0]]);
    const datasets = Object.entries(dataPorClaseYTiempo).map(([etiqueta, datos]) => ({
      label: etiqueta,
      data: datos.map(item => item.valor),
      borderColor: getRandomColor(),
      fill: false,
    }));

    const configuration = {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: `Evolución de ${caracteristica} en el tiempo`,
          fontSize: 20,
          fontColor: '#333',
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Tiempo',
              fontColor: '#333',
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: caracteristica,
              fontColor: '#333',
            },
          },
        },
      },
    };

    // Generar el gráfico como imagen en formato base64
    const image = await canvasRenderService.renderToDataURL(configuration);

    res.json({ image });
  } catch (error) {
    console.error('Error en el análisis de datos:', error);
    res.status(500).json({ error: 'Error en el análisis de datos' });
  }
});



module.exports = router;
