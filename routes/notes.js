const express = require('express');
const db = require('../db/db.json');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

app = express();
app.use(express.static('public'));

// GET request for all requested notes
// below we just have '/' because in our server we are pointing '/api/notes'
router.get('/', (req, res) => {
  // log our request to terminal
  console.info(`${req.method} request for notes received`);
  // returns requested data
  return res.status(200).json(db);
});

// GET request for a specific note
router.get('/:id', (req, res) => {
  const requestedNote = req.params.id;

  db.forEach((noteData) => {
    if (requestedNote === noteData.id) {
      console.info(`A request to get ${noteData.title} has been received`);
      res.status(200).json(noteData);
    } else {
      res.status(404).json('Note not found');
    }
  });
});

// POST request
router.post('/', (req, res) => {
  // shows the that a POST req was received
  console.info(`${req.method} request received to save new note`);

  // destructure title and text props from request body
  const { title, text } = req.body;
  if (title && text) {
    // creates a new note
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    // Read and append new notes to site
    fs.readFile('./db/db.json', 'utf8', (err, noteData) => {
      if (err) {
        console.error(err);
      } else {
        const notesJson = JSON.parse(noteData);
        notesJson.push(newNote);
        const newData = JSON.stringify(notesJson);
        fs.writeFile('./db/db.json', newData, (err) =>
          err ? console.error(err) : console.log('Successfully Saved Note')
        );
      }
    });
    // pushes newly created not to database
    // creates a  message
    const response = {
      status: 'Success',
      body: newNote,
    };
    console.info(response);
    db.push(newNote);
    return res.status(200).json(db);
  } else {
    res.status(500).json('error saving note');
  }
});

// Delete request
router.delete('/:id', (req, res) => {
  console.info(`${req.method} request received`);
  // deconstruct id from request params
  const { id } = req.params;

  db.forEach((scannedNote) => {
    // scan db and check if request matches any note ID. If not throw error
    if (id === scannedNote.id) {
      // res.status(200).json(`Removing ${scannedNote.title} from notes`);
      // Read File adn writes file
      fs.readFile('./db/db.json', 'utf8', (err) => {
        if (err) {
          console.error(err);
        } else {
          // Remove selected note from db and update db
          // db.splice(db.indexOf(scannedNote.id));
          fs.writeFile('./db/db.json', JSON.stringify(db), (err) =>
            err ? console.error(err) : console.info('Successfully removed note')
          );
        }
      });
      db.splice(db.indexOf(scannedNote.id));
      return res.status(200).json(db)
    } else {
      // will show you each note in db side by side id you are trying to delete
      console.error(`${scannedNote.id} doesn't match ${id}`);
    }
  });
});

module.exports = router;
