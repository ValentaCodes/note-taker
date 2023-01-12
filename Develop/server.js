const express = require("express");
const path = require("path");
const notesRoute = require("./routes/notes.js");

const PORT = process.env.PORT || 3001;

const app = express();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// NOTE: Routes
app.use("/api/notes", notesRoute);

// retrieves the notes page
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});
// retrieves landing page
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);
// responds with 404 if page isn't available on server
app.get("*", (req, res) => res.status(404).send("Page not found"));

// Creates our server
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
