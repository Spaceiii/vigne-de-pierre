import swaggerJSDoc from 'swagger-jsdoc'

const options = {
  definition: {
    info: {
      title: 'Wine API Documentation 🍷',
      version: '1.0.0',
      description: 'API documentation for the Wine API'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de dev'
      }
    ]
  },
  apis: ['./routes/wine.ts'],
}

const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec;