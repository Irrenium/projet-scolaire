const express         = require("express"),
      app             = express(),
      mongoose        = require("mongoose"),
      user            = require("./models/user"),
      passport        = require("passport"),
      local           = require("passport-local"),
      local_mongoose  = require("passport-local-mongoose"),
      method_Override = require("method-override"),
      bodyParser      = require("body-parser"); 



//------app configuration----------//


//connection avec serveur mongodb

mongoose.connect("mongodb://localhost/db_test", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

//utilisation des fichiers ejs "optionnel!!!"

  app.set("view engine", "ejs");

//utiliser le répértoire public comme un emplacement pour les fichiers js,css iùg etc...

  app.use(express.static("public"));

//pour manipuler les requetes

  app.use(bodyParser.urlencoded({ extended: false }));


  //session express


  app.use(
    require("express-session")({
      secret: " secret key",
      resave: false,
      saveUninitialized: false,
    })
  );


  //--------------------initialisation de PassportJS---------------------//

app.use(passport.initialize());
app.use(passport.session());
passport.use(new local(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

//----------------Auth-----------------//
const authRoute = require("./routes/auth"); 
app.use("/auth", authRoute);

app.listen(3000, ()=>{
    console.log("server started!");
});