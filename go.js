const express = require('express');
const app = express();

app.use(express.static('webpage'));

app.listen(18080);