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
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.ts'],
}

const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec;
