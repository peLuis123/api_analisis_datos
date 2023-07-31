const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'API de Análisis de Datos',
        version: '1.0.0',
        description: 'Una API para realizar análisis de datos y generar informes para este ejemplo se uso el dataset de iris',
    },
    servers: [
        {
            url: 'http://localhost:3000',
        },
    ],
    paths: {
        '/hola': {
            get: {
                summary: 'Saludar',
                description: 'Saluda al usuario con un mensaje de "Hola mundo".',
                responses: {
                    200: {
                        description: 'Respuesta exitosa',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            example: 'Hola mundo',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/count_sheets': {
            post: {
                summary: 'Contar hojas en un archivo Excel',
                description: 'Cuenta el número de hojas en un archivo Excel cargado en la solicitud.',
                requestBody: {
                    required: true,
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                properties: {
                                    excel: {
                                        type: 'string',
                                        format: 'binary',
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Respuesta exitosa',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        cantidadHojas: {
                                            type: 'integer',
                                            example: 3,
                                        },
                                        hojas: {
                                            type: 'array',
                                            items: {
                                                type: 'string',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: 'Solicitud incorrecta',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            example: 'El archivo Excel no contiene hojas.',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },

        '/convertir-y-guardar-clases': {
            post: {
                summary: 'Convertir archivo Excel a JSON y guardar por clases en Firebase Firestore',
                description: 'Convierte un archivo Excel en formato XLSX a JSON y guarda los datos en Firebase Firestore. Los datos se agrupan por clases (etiquetas) en colecciones separadas.',
                requestBody: {
                    required: true,
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                properties: {
                                    excel: {
                                        type: 'string',
                                        format: 'binary',
                                    },
                                    sheetNumber: {
                                        type: 'integer',
                                        description: 'El número de la hoja a procesar en el archivo Excel, siempre comenzando desde 0',
                                        example: 0,
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Respuesta exitosa',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        cantidadObjetos: {
                                            type: 'integer',
                                            example: 10,
                                        },
                                        datos: {
                                            type: 'object',
                                            example: {
                                                etiqueta1: [
                                                    { Campo1: 'Valor1', Campo2: 'Valor2' },
                                                    { Campo1: 'Valor3', Campo2: 'Valor4' },
                                                ],
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    500: {
                        description: 'Error interno del servidor',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            example: 'Error al guardar en Firebase Firestore.',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/convertir-y-guardar-clases": {
            "post": {
                "summary": "Convertir archivo Excel a JSON y guardar por clases en Firebase Firestore",
                "description": "Convierte un archivo Excel en formato XLSX a JSON y guarda los datos en Firebase Firestore. Los datos se agrupan por clases (etiquetas) en colecciones separadas.",
                "requestBody": {
                    "required": true,
                    "content": {
                        "multipart/form-data": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "excel": {
                                        "type": "string",
                                        "format": "binary"
                                    },
                                    "sheetNumber": {
                                        "type": "integer",
                                        "description": "El número de la hoja a procesar en el archivo Excel, siempre comenzando desde 0",
                                        "example": 0
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Respuesta exitosa",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "cantidadObjetos": {
                                            "type": "integer",
                                            "example": 10
                                        },
                                        "datos": {
                                            "type": "object",
                                            "example": {
                                                "etiqueta1": [
                                                    { "Campo1": "Valor1", "Campo2": "Valor2" },
                                                    { "Campo1": "Valor3", "Campo2": "Valor4" }
                                                ],
                                                "etiqueta2": [
                                                    { "Campo1": "Valor5", "Campo2": "Valor6" },
                                                    { "Campo1": "Valor7", "Campo2": "Valor8" }
                                                ]

                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Error interno del servidor",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "error": {
                                            "type": "string",
                                            "example": "Error al guardar en Firebase Firestore."
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

        },
        "/convertir-y-guardar": {
            "post": {
                "summary": "Convertir archivo Excel a JSON y guardar en Firebase Firestore",
                "description": "Convierte un archivo Excel en formato XLSX a JSON y guarda los datos en Firebase Firestore.",
                "requestBody": {
                    "required": true,
                    "content": {
                        "multipart/form-data": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "excel": {
                                        "type": "string",
                                        "format": "binary"
                                    },
                                    "sheetNumber": {
                                        "type": "integer",
                                        "description": "El número de la hoja a procesar en el archivo Excel, siempre comenzando desde 0",
                                        "example": 0
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Respuesta exitosa",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "cantidadObjetos": {
                                            "type": "integer",
                                            "example": 10
                                        },
                                        "datos": {
                                            "type": "array",
                                            "items": {
                                                "type": "object"

                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Error interno del servidor",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "error": {
                                            "type": "string",
                                            "example": "Error al guardar en Firebase Firestore."
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/tabla-conteo": {
            "get": {
              "summary": "Obtener tabla de conteo por etiqueta",
              "description": "Obtiene una tabla de conteo por etiqueta a partir de los datos almacenados en Firebase Firestore.",
              "responses": {
                "200": {
                  "description": "Respuesta exitosa",
                  "content": {
                    "application/json": {
                      "schema": {
                        "type": "object",
                        "additionalProperties": {
                          "type": "integer"
                        }
                      },
                      "example": {
                        "etiqueta1": 5,
                        "etiqueta2": 10,

                      }
                    }
                  }
                },
                "500": {
                  "description": "Error interno del servidor",
                  "content": {
                    "application/json": {
                      "schema": {
                        "type": "object",
                        "properties": {
                          "error": {
                            "type": "string",
                            "example": "Error en el análisis de datos."
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "/grafico-circular": {
            "get": {
              "summary": "Generar gráfico circular",
              "description": "Genera un gráfico circular (pie chart) basado en los datos almacenados en Firebase Firestore que contienen etiquetas. El gráfico muestra la distribución de clases en el conjunto de datos.",
              "responses": {
                "200": {
                  "description": "Respuesta exitosa",
                  "content": {
                    "application/json": {
                      "schema": {
                        "type": "object",
                        "properties": {
                          "image": {
                            "type": "string",
                            "format": "byte",
                            "description": "La imagen del gráfico en formato base64."
                          }
                        }
                      }
                    }
                  }
                },
                "500": {
                  "description": "Error interno del servidor",
                  "content": {
                    "application/json": {
                      "schema": {
                        "type": "object",
                        "properties": {
                          "error": {
                            "type": "string",
                            "example": "Error en el análisis de datos."
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "/grafico-linea/{caracteristica}": {
    "get": {
      "summary": "Genera un gráfico de línea basado en una característica específica en el tiempo.",
      "parameters": [
        {
          "in": "path",
          "name": "caracteristica",
          "required": true,
          "description": "Nombre de la característica para la cual se generará el gráfico.",
          "schema": {
            "type": "string"
          }
        }
      ],
      "responses": {
        "200": {
          "description": "Imagen generada del gráfico de línea.",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "image": {
                    "type": "string",
                    "format": "binary"
                  }
                }
              }
            }
          }
        },
        "500": {
          "description": "Error en el análisis de datos.",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "error": {
                    "type": "string"
                  }
                }
              }
            }
          }
        }
      }
    }}
    },
};

module.exports = swaggerDocument;
