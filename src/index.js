const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { router } = require('./movies.routes');
require('dotenv').config();

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Router
app.use(router);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n********** Server listening on port ${PORT} **********`);
})