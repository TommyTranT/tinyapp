// Express is our web framework for our server
const express = require("express"); 
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
}

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase); // < Shows urlDatabase obj on new site/page.
});

app.listen(PORT, () => {
  console.log(`Server is listeing on port ${PORT}`);
});