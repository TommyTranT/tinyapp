// SETUP
const cookieParser = require("cookie-parser");
const express = require("express"); 
const morgan = require('morgan')
const app = express();
const PORT = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());

//-----------------------------------------------------------------------------------
// Original Object
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
}

// Set Empty Users OBJ
const users = {};

// Generates a random ID
const generateRandomString = () => {
  let result = (Math.random() + 1).toString(36).substring(6);
  return result;
}

// Routes
// GET / 
app.get('/', (req, res) => {
  const userId = req.cookies.userId; // -> Make variable equals the cookies userId

  const user = users[userId]; // -> Make user the obj users with the key that we got from the cookie

  const templateVars = { 
    user: user
  }

   // If not logged in, take them to login page. If logged in, go to urls
   if(!userId) { // -> checks to see if the cookie still exist. If cookie is deleted, userId will not exist
    return res.redirect('/login')
  }

  res.redirect('/urls')
})

// Homepage of tinyapp: lists all urls
app.get("/urls", (req, res) => { // -> urls refers to our original object

  const userId = req.cookies.userId; // -> Make variable equals the cookies userId

  const user = users[userId]; // -> Make user the obj users with the key that we got from the cookie

  const templateVars = { 
    urls: urlDatabase,
    user: user
  }
  
  console.log(urlDatabase)

  res.render("urls_index", templateVars); // -> Take this template and this data and mash them together
})

// GET /register    -> User gives us username and password info
app.get('/register', (req, res) => {
  const userId = req.cookies.userId; // -> Make variable equals the cookies userId

  const user = users[userId]; // -> Make user the obj users with the key that we got from the cookie

  const templateVars = { 
    user: user
  }

  // IF they try to go to the register page while logged in, redirect to urls
  if(userId) { // -> checks to see if the cookie still exist. If cookie is deleted, userId will not exist
    return res.redirect('/urls')
  }
  
  res.render('register', templateVars);
})

// POST /register   -> lets take the inputed data and save it in our own object
app.post('/register', (req, res) => {
  const email = req.body.email; // -> let 'email' be the input we revieved when they typed the email
  const password = req.body.password;
  const id = Math.random().toString(36).substring(2,6) // -> ID to identify this paticular user

  // Handle negatives first
  if (!email || !password) { // -> If they didnt give an email or password,
    return res.status(400).send('please enter an email address AND a password') // -> return error 400, bad request
  }

  // If they try to register with an email that already exist, return error message
  for (const userId in users) { // -> loop in each user in 'users' obj
    const user = users[userId]; // -> let variable 'user' equal our [obj][user key]
    if (user.email === email) { // -> if the email in our database is equal to what the user typed,
      return res.status(400).send('Email address already exist'); // -> variable foundUser will equal the user info that was inputed.
    }
  }

  const user = { // -> putting all of the info into an object
    id: id,
    email: email,
    password: password,
  };

  users[id] = user; // -> update our users object with this user. (updating id, email, password)
  console.log(users)

  res.redirect('/login');
});

// GET /login
app.get('/login', (req, res) => {
  const userId = req.cookies.userId; // -> Make variable equals the cookies userId

  const user = users[userId]; // -> Make user the obj users with the key that we got from the cookie

  const templateVars = { 
    user: user
  }

   // IF they try to go to the login page while logged in, redirect to urls
   if(userId) { // -> checks to see if the cookie still exist. If cookie is deleted, userId will not exist
    return res.redirect('/urls')
  }

  res.render('login', templateVars);
})

// POST /login
app.post('/login', (req, res) => {
  const email = req.body.email; // -> let email be the email they inputted
  const password = req.body.password;

  // Handle negatives first
  if (!email || !password) { // -> If they didnt give an email or password,
    return res.status(400).send('please enter an email address AND a password') // -> return error 400, bad request
  }

  // Look up the user in the users database
  let foundUser = null;
  for (const userId in users) { // -> loop in each user in 'users' obj
    const user = users[userId]; // -> let variable 'user' equal our [obj][user key]
    if (user.email === email) { // -> if the email in our database is equal to what the user typed,
      foundUser = user; // -> variable foundUser will equal the user info that was inputed.
    }
  }
  // If the user did not match
  if (!foundUser) {
    return res.status(403).send('no user with that email exists');
  }

  // Check if passwords match
  if (foundUser.password !== password) { // -> if the users password does not equal what was inputed,
    return res.status(401).send('wrong password'); // -> return error message
  }
  // We found a user, now we need to set the cookie
  res.cookie('userId', foundUser.id); // -> setting our cookie to equal the 'id' we randomly generated for each user

  // send user somewhere
  res.redirect('/urls');
});

// GET /protected
app.get('/protected', (req, res) => {
  console.log(req.cookies);
  const userId = req.cookies.userId; // -> Make variable equals the cookies userId

  const user = users[userId]; // -> Make user the obj users with the key that we got from the cookie

  const templateVars = {
    user: user // -> can use user.email, user.password, or user.id in the template file because we put the whole obj in
  };

  console.log(users);
  res.render('protected', templateVars);
});

// POST /logout  
app.post('/logout', (req, res) => {
  res.clearCookie('userId');

  res.redirect('/urls');
})

// New URL Page: lets make a new short url
app.get("/urls/new", (req, res) => { 
  const userId = req.cookies.userId; // -> Make variable equals the cookies userId

  const user = users[userId]; // -> Make user the obj users with the key that we got from the cookie

  const templateVars = { 
    user: user
  }
  // IF userId is null, redirect to login page
    if(!userId) { // -> checks to see if the cookie still exist. If cookie is deleted, userId will not exist
      res.status(403)
      return res.redirect('/login')
    }

  res.render("urls_new", templateVars); // -> Take this page and render it
});

// Gives new longURL a new ID and adds to our object
app.post("/urls", (req, res) => {
  const id = generateRandomString(); // -> id is a random string with our helper function
  urlDatabase[id] = req.body.longURL  // -> let our object[new id key] to equal the new longURL we made from our post request
  res.redirect("/urls") // -> redirect us back to display all of our urls
});

// Make a variable page for each different "id" in our object
app.get("/urls/:id", (req, res) => { // -> ":id" is our variable for our different keys
  const userId = req.cookies.userId; // -> Make variable equals the cookies userId
  const user = users[userId]; // -> Make user the obj users with the key that we got from the cookie
 
  if(!urlDatabase[req.params.id]) { // -> checks to see if the cookie still exist. If cookie is deleted, userId will not exist
    res.status(403)
    return res.status(400).send('please enter a valid short url')
  }
  
  const templateVars = { 
    user: user,
    id: req.params.id, // -> our page will go to whatever 'id' they inputed. 
    longURL: urlDatabase[req.params.id]};  // < obj[key] will get our longURL value
   
  res.render("urls_show", templateVars); // -> take that template and this data and mash them together
});

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
// Short url is hyperlink but doesnt take me anywhere