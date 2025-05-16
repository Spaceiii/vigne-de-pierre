import express from 'express'
import wineRoutes from './routes/wine.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/wine', wineRoutes);

app.listen(PORT, () => {
    console.log(`🌺 Server is running on port ${PORT}`);
});