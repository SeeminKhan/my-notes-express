const express = require("express");
require('dotenv').config();
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const { getNotes, saveNote, deleteNote, initializeDatabase } = require('./db');

const app = express();
const port = process.env.APP_PORT || 3000;

// Configure Nunjucks
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.set('view engine', 'njk');
app.use(express.static("public"));

app.use(
    session({
        secret: process.env.KEY || 'secret',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 60000 }
    })
);

app.use(flash());
app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    const notes = await getNotes();
    res.render('index', { notes });
});

app.get("/new", (req, res) => {
    res.render('new');
});

app.post("/save", async (req, res) => {
    const content = req.body.content;
    if (!content) {
        req.flash('error', 'Content cannot be empty.');
        return res.redirect('/new');
    }
    await saveNote(content);
    req.flash('success', 'Added successfully.');
    res.redirect('/');
});

app.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await deleteNote(id);
    req.flash('success', 'Note deleted successfully.');
    res.redirect('/');
});

// ✅ Initialize DB then start server
initializeDatabase()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server started on http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.error("Failed to start server:", err);
    });
