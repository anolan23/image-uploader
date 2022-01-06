const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const port = process.env.PORT || 8080;
const buildPath = path.join(__dirname, 'build', 'index.html');
const imagesPath = path.join(__dirname, 'images');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
  },
});

const upload = multer({ storage });

app.get('/', function (req, res) {
  res.sendFile(buildPath);
});

app.get('/api/uploads/:id', function (req, res) {
  const { id } = req.params;
  const path = `${imagesPath}/${id}`;
  res.sendFile(path);
});

app.post(
  '/api/uploads',
  upload.single('image'),
  (req, res) => {
    res.send({ fileName: req.file.filename });
  },
  (error, req, res, next) => {
    res.status(500).send({ error: error.message });
  }
);

app.use(express.static(path.join(__dirname, 'build')));

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
