const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const modelRoutes = require('./routes/model')
const typeRoutes = require('./routes/type')
const materialRoutes = require('./routes/material')
require('./database/database')();
const port = 8080;
const app = express();
const cors = require('cors');
const path = require('path')

app.use(cors());

app.use(bodyParser.json({limit: '50mb'}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/auth', authRoutes);
app.use('/model', modelRoutes)
app.use('/type', typeRoutes)
app.use('/material', materialRoutes)

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
  next();
});

app.use((req,res,next) => {
  if(req.url.startsWith('/content')){
      req.url = req.url.replace('/content', '')
  }
  next()
},
express.static(path.normalize(path.join(__dirname, 'content'))))

app.listen(port, () => { console.log(`REST API listening on port: ${port}`) });