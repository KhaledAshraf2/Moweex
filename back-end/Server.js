const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('./db/db');
const usersRoute = require('./routes/user');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(usersRoute);

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
});
