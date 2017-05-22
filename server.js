/**
 * Created by andreivinogradov on 15.02.17.
 */

const express = require('express');
const path = require('path');

const port = 3000;
const app = express();

const staticPath = path.join(__dirname, 'static');

app.use(express.static(staticPath));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(staticPath, 'index.html'));
});

app.listen(port);
