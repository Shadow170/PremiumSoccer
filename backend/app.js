import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import fancyRoutes from "./routes/fancy.js";
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(compression());
app.use(bodyParser.json('application/json'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});

app.use('/api/fancy', fancyRoutes);

export default app;