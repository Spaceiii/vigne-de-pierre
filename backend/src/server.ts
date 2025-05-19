import express from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './swagger.config.js'
import wineRoutes from './routes/wine.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/wine', wineRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

app.listen(PORT, () => {
    console.log(`🌺 Server is running on port ${PORT}`);
    console.log(`📖 API documentation is available at http://localhost:${PORT}/api-docs`);
});