const express = require('express')
const fs = require('fs')
const https = require('https')
const { getDisplays, addLikes } = require('./db')

const PORT = 8097;

const app = express();

app.use(express.static('public'));

app.get('/displays', (_, res) => {
    res.json(getDisplays())
})

app.post('/displays/:id', (req, res) => {
    res.send(addLikes(req.params.id, req.query.count))
})

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log("DEV server is listening on port " + PORT);
  });
} else {
  const privateKey = fs.readFileSync("/var/svc/certs/privkey.pem");
  const certificate = fs.readFileSync("/var/svc/certs/cert.pem");

  https
    .createServer(
      {
        key: privateKey,
        cert: certificate,
      },
      app
    )
    .listen(PORT, () => {
      console.log("PROD server is listening on port " + PORT);
    });
}