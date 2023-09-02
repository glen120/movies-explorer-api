require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');

const router = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { urls } = require('./utils/urls');

const app = express();

const {
  PORT = 3000,
  DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb',
} = process.env;

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log(`Connect to database ${DB_URL}`);
  })
  .catch((err) => {
    console.log('Connection failed');
    console.log(err);
  });

app.use(express.json());

app.use(cors({ origin: urls, credentials: true }));

app.use(requestLogger);

app.use(helmet());

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
