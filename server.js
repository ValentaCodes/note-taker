// Importing modules
const express = require('express');
const path = require('path');
const notesRoute = require('./routes/notes.js');
// creates an environment  variable for hosting service to use, if not use port 3001
const PORT = process.env.PORT || 3001;

const app = express();
// Middleware used to help code function properly
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// NOTE: Routes
// this will create a route so we can target and use our api
app.use('/api/notes', notesRoute);

// retrieves the notes page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));

});
// retrieves landing page
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);
// responds with 404 if page isn't available on server
app.get('*', (req, res) => res.status(404).send('Page not found'));

// Creates our server
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
