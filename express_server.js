// Express is our web framework for our server
const express = require("express"); 
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
}

app.get("/", (req, res) => {
  res.send("Hello!");
});


app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase} // < templateVars is now urls which = the urlDatabase obj
  res.render("urls_index", templateVars);
})

app.get("/urls.json", (req, res) => { // ?why is 'json' there?
  res.json(urlDatabase); // < Shows urlDatabase obj on new site/page.
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n"); // < World is bold
});

app.listen(PORT, () => {
  console.log(`Server is listeing on port ${PORT}`);
});
