# API de Análisis de Datos

Esta es una API que permite realizar análisis de datos a partir de archivos Excel y generar gráficos circulares basados en los datos almacenados en Firebase Firestore.

## Tabla de contenidos

- [Instalación](#instalación)
- [Configuración](#configuración)
- [Rutas](#rutas)
- [Uso](#uso)
- [Ejemplos](#ejemplos)

## Instalación

1. Clona este repositorio en tu máquina local.


git clone https://github.com/tu-usuario/api-analisis-datos.git
cd api-analisis-datos


2. Instala las dependencias ejecutando el siguiente comando:


npm install


## Configuración

Antes de ejecutar la API, asegúrate de haber realizado la configuración necesaria:

1. Crea una nueva base de datos en Firebase Firestore y asegúrate de tener las credenciales correctas en el archivo serviceAccountKey.json.

## Rutas

La API cuenta con las siguientes rutas:

- POST /convertir-y-guardar: Convierte un archivo Excel (XLSX) a formato JSON y guarda los datos en Firebase Firestore en la colección "datos".

- POST /convertir-y-guardar-clases: Convierte un archivo Excel (XLSX) a formato JSON y guarda los datos en Firebase Firestore, agrupándolos por etiquetas en colecciones separadas.

- GET /tabla-conteo: Obtiene un conteo de la cantidad de elementos por etiqueta a partir de los datos almacenados en Firebase Firestore.

- GET /grafico-circular: Genera un gráfico circular (pie chart) que muestra la distribución de clases en el conjunto de datos almacenados en Firebase Firestore.

- GET /grafico-linea/{caracteristica}: Esta ruta permite generar un gráfico lineal que muestra la evolución de una característica específica a lo largo del tiempo para diferentes etiquetas o clases.

## Uso

Para convertir un archivo Excel a formato JSON y guardar los datos en Firebase Firestore, utiliza las rutas /convertir-y-guardar o /convertir-y-guardar-clases. Asegúrate de enviar el archivo Excel en la solicitud y especificar el número de hoja a procesar (en caso de ser necesario).

Para obtener un conteo de la cantidad de elementos por etiqueta a partir de los datos almacenados en Firebase Firestore, utiliza la ruta /tabla-conteo.

Para generar un gráfico circular que muestre la distribución de clases en el conjunto de datos almacenados en Firebase Firestore, utiliza la ruta /grafico-circular. El gráfico se devolverá en formato base64.

Para generar un gráfico lineal que muestra la evolución de una característica específica a lo largo del tiempo para diferentes etiquetas o clases, utiliza la ruta /grafico-linea/{caracteristica}. La característica puede ser dato1, dato2, dato3 o dato4 según la base de datos utilizada.

## Ejemplos

A continuación se presentan algunos ejemplos de cómo usar la API:

- Convertir y guardar un archivo Excel en formato JSON en Firebase Firestore:


POST /convertir-y-guardar

Body:

excel: archivo.xlsx
sheetNumber: 0


- Convertir y guardar un archivo Excel en formato JSON en Firebase Firestore, agrupando los datos por etiquetas:


POST /convertir-y-guardar-clases

Body:
excel: archivo.xlsx
sheetNumber: 1

- Obtener un conteo de la cantidad de elementos por etiqueta:


GET /tabla-conteo


- Generar un gráfico circular con las etiquetas encontradas en la base de datos:


GET /grafico-circular


- Generar un gráfico lineal para la característica "dato1":


GET /grafico-linea/dato1


## Documentación con Swagger

La documentación de la API se encuentra disponible en la siguiente URL:

http://localhost:4000/api-docs



![Descripción de la imagen](./images/swagger.png)

POST /convertir-y-guardar

![Descripción de la imagen](./images/ruta2.png)

base de datos de POST /convertir-y-guardar

![Descripción de la imagen](./images/ruta2bd.png)


GET /grafico-linea/dato1

![Descripción de la imagen](./images/dato1.png)

GET /grafico-linea/dato2

![Descripción de la imagen](./images/dato2.png)
