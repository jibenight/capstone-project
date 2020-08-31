const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const errorhandler = require('errorhandler');
const morgan = require('morgan');
const apiRouter = require('./api/api');

const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(errorhandler());
app.use(cors());
app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Server is ready at http://localhost:${PORT}`);
});

module.exports = app;
