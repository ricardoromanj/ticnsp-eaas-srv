import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import evangelizo from 'evangelizo';

import api from '@/server/api.js';
import evangelizoRouter from '@/server/evangelizo';
import evangelioRouter  from '@/server/evangelio';
import logger from '@/config/logger';
import settings from '@/config/settings';

// Evangelio MicroService
const app = express();

// Middleware
app.use(bodyParser.json());

app.use('*', cors());

app.use('/evangelizo', evangelizoRouter);
app.use(evangelioRouter);

app.use(function (err, req, res, next) {
  logger.error(err.stack);
  res.status(500).json({ error: "There was an error" });
});

app.get('/health', (req, res) => {
  logger.info(`${req.ip} requested health status`);
  res.status(200).send('OK');
});


app.listen(settings.port, () => {
    api.getLiturgy().then((result) => {
        logger.info(result.content.saint + ` is listening on port ${settings.port}` );
    }, (err) => {
        logger.error(err);
        process.exit();
    });
});
