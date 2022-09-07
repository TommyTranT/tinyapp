// SETUP

const express = require("express"); 
const morgan = require('morgan')
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

//-----------------------------------------------------------------------------------
// Original Object
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
}

// Random ID generator
const generateRandomString = () => {
  let result = (Math.random() + 1).toString(36).substring(6);
  return result;
}

// Routes
// Homepage of tinyapp: lists all urls
app.get("/urls", (req, res) => { // -> urls refers to our original object

  const templateVars = { 
    urls: urlDatabase
  }
  
  console.log(urlDatabase)

  res.render("urls_index", templateVars); // -> Take this template and this data and mash them together
})

// New URL Page: lets make a new short url
app.get("/urls/new", (req, res) => { 
  res.render("urls_new"); // -> Take this page and render it
});

// Gives new longURL a new ID and adds to our object
app.post("/urls", (req, res) => {
  const id = generateRandomString(); // -> id is a random string with our helper function
  urlDatabase[id] = req.body.longURL  // -> let our object[new id key] to equal the new longURL we made from our post request
  res.redirect("/urls") // -> redirect us back to display all of our urls
});

// Make a variable page for each different "id" in our object
app.get("/urls/:id", (req, res) => { // -> ":id" is our variable for our different keys
  
  const templateVars = { 
    id: req.params.id, // -> our page will go to whatever 'id' they inputed. 
    longURL: urlDatabase[req.params.id]};  // < obj[key] will get our longURL value
   
  res.render("urls_show", templateVars); // -> take that template and this data and mash them together
});

// Edit GET
// app.get("/urls/:id", (req, res) => { // -> ":id" is our variable for our different keys
  
//   const templateVars = { 
//     id: req.params.id, // -> our page will go to whatever 'id' they inputed. 
//     longURL: urlDatabase[req.params.id]};  // < obj[key] will get our longURL value
   
//     res.redirect('/urls'); // -> take that template and this data and mash them together
// });

// Edit POST
app.post('/urls/:id', (req, res) => {
  const id = req.params.id;

  const newLongURL = req.body.newLongURL; 

  urlDatabase[id] = newLongURL

  console.log(urlDatabase);

  res.redirect(`/urls`);
})

// DELETE - POST /breads/:breadId/delete
app.post('/urls/:id/delete', (req, res) => {
  const id = req.params.id; // -> the button should correspond with the id key

  delete urlDatabase[id]; // -> deletes the key that matches our database

  res.redirect('/urls'); // -> redirect back to urls
})

//-----------------------------------------------------------------------------------
// Listening
app.listen(PORT, () => {
  console.log(`Server is listeing on port ${PORT}`);
});

//-----------------------------------------------------------------------------------
// Notes
// Add a homepage?
// Delete button is not in the right position
// Short url is hyperlink but doesnt take me anywhere