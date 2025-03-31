const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));

let notes = [];

app.get('/', (req, res) => {
    res.render('index', { notes });
});

app.post('/add-note', (req, res) => {
    const { note } = req.body;
    if (note) {
        notes.push(note);
    }
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server started at: http://localhost:${PORT}`);
});