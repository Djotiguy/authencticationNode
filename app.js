//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption');
const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));

require('dotenv').config()

// BDD
// Connexion à la BDD
mongoose.connect(process.env.BDD);

// Message en cas d'erreur
mongoose.connection.on("error", () => {
  console.log("Erreur lors de la connexion à la base de données");
});

// Message en cas de succès
mongoose.connection.on("open", () => {
  console.log("Connexion à la base de données établie");
});

// schéma du user
const userSchema = new mongoose.Schema({
  email:String,
  password: String,
});

// Cryptage du mot de passe
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);

// ROUTES
app.get('/', function(_, res){
    res.render('home')
})
app.get('/login', function(_, res){
    res.render('login')
})
app.get('/register', function(_, res){
    res.render('register')
})

app.post("/register", function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(console.log(`Compte ${newUser.email} crée avec succès`))
    res.render("secrets")

  });
app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username})
  .then(foundUser => {
    if(foundUser){
      if(foundUser.password === password){
        console.log(`Connexion au compte de ${username} réussi`);
        res.render("secrets")
      }
    }
  })
  .catch(err => {
    console.log(err);
  });

})
// PORT
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log("Server running at http://localhost:" + PORT);
  });
  
