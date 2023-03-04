const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.port || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// goes to the note page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);


app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'db/db.json'))
});

// receives note to save to db.json and return it to show on html
app.post('/api/notes', (req, res) => {
  const {title, text} = req.body;
      const note = {
          title,
          text,
          id: uuidv4()
      }
      fs.readFile('db/db.json', 'utf-8', (err, data) => {
            const savednotes = JSON.parse(data);
            savednotes.push(note)
            fs.writeFileSync('db/db.json', JSON.stringify(savednotes) 
            )
          res.json(note); 
  })
}
)

// deletes notes based on id
app.delete('/api/notes/:id', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('db/db.json'))
  const deletenotes = notes.filter(data => data.id !== req.params.id);
  fs.writeFileSync('db/db.json', JSON.stringify(deletenotes));
  res.json(deletenotes);
})

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);