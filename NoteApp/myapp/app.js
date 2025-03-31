const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const notesFilePath = path.join(__dirname, 'notes.json');
let notes = [];
if (fs.existsSync(notesFilePath)) {
    const data = fs.readFileSync(notesFilePath, 'utf8');
    notes = JSON.parse(data);
}

function saveNotesToFile() {
    fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2), 'utf8');
}

app.get('/', (req, res) => {
    res.render('index', { title: 'Notes App', notes });
});

app.post('/add-note', (req, res) => {
    const { note, category, color, important } = req.body;
    if (note) {
        notes.push({
            text: note,
            timestamp: new Date().toLocaleString(),
            category: category || null,
            color: color || '#ffffff',
            important: important === 'on'
        });
        saveNotesToFile();
    }
    res.redirect('/');
});

app.post('/delete-note', (req, res) => {
    const { index } = req.body;
    if (index !== undefined) {
        notes.splice(index, 1);
        saveNotesToFile();
    }
    res.redirect('/');
});

app.post('/edit-note', (req, res) => {
    const { index, newText } = req.body;
    if (index !== undefined && newText) {
        notes[index].text = newText;
        saveNotesToFile();
    }
    res.redirect('/');
});

app.post('/toggle-important', (req, res) => {
    const { index } = req.body;
    if (index !== undefined) {
        notes[index].important = !notes[index].important;
        saveNotesToFile();
    }
    res.redirect('/');

});

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});