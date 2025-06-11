const express = require('express')
const { getDisplays, addLikes } = require('./db')

const app = express()

app.use(express.static('public'));

app.get('/displays', (_, res) => {
    res.json(getDisplays())
})

app.post('/displays/:id', (req, res) => {
    res.send(addLikes(req.params.id, req.query.count))
})

app.listen(8097, () => {
    console.log('Server listening @ port 8097')
})
