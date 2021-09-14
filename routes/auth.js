const { copyFile } = require("fs");

const express     = require("express"),
      user        = require("../models/user"),
      passport    = require("passport"),
      token_      = require("../models/token"),
      node_mailer = require("nodemailer"),
      Route       = express.Router({mergeParams: true}),
      transport   = node_mailer.createTransport({
          service:"gmail",
          auth:{
              user: "safidafi10@gmail.com",
              pass: "safiville10"
          }
      }),
      options = {
          from: "safidafi10@gmail.com",
          to: "riadox41@gmail.com",
          subject: "test_nodemailer",
          text: "nodemailer test message!" 
      };
Route.get("/login", (req, res)=>{
    res.render("login");
});
Route.post("/login",
    passport.authenticate("local"),
    (req, res)=>{
          if(req.isAuthenticated() && req.user.active && req.user.verified ){
              res.send ({
                  user: req.user
              })
              console.log("active and logged in!");
          }if( ! req.user.active){
            res.status(403).send({
                message: "account disabled."
            });         
        }if( ! req.user.verified){
                res.status(403).send({
                    message: "mail adress not verified."
                });
          }
});
Route.get("/send", (req, res)=>{
    transport.sendMail(options, (err, msg)=>{
        if(err)
            console.log(err);
        else
            console.log("sent!!!");
    });
});
// Route.get("/", (req, res)=>{
    
//             console.log(tmp_token);
//     res.send("ok");
// });
Route.post("/signup", (req, res)=>{
    user.register(new user({username: req.body.username,
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        telephone: req.body.telephone,
        active: true,
        verified: false
    }), req.body.password, (err, user)=>{
        if(err){
            res.send(err);
            // res.redirect("/auth/signup");
        }
        else{
            console.log(user);
            let tmp_token = require("crypto-js").HmacSHA256("test", "token_key").toString(require("crypto-js").enc.Hex);
            console.log(tmp_token);
            token_.create({user_id: user._id, token: tmp_token}, (err, token)=>{
                console.log("token created!");
            });
            passport.authenticate("local")(req, res, ()=>{
                console.log(req.isAuthenticated());
                res.send("register success");
            });
        }
    });
});
Route.post("/logout", (req, res)=>{
    req.logout();
    res.send("logout");
});
Route.post("/validate/:token", (req, res)=>{
    token_.find({token:req.params.token}, (err, token)=>{
        console.log(token);
        console.log(token[0].user_id);
        let obj = {verified: true};
        user.findByIdAndUpdate(token[0].user_id, obj , (err, user)=>{
            console.log(user);
        });
        token_.remove({token: req.params.token}, (err, token)=>{
            res.send("removed!");
        });
    });
});
module.exports = Route;


//mailing + role in user + attributs