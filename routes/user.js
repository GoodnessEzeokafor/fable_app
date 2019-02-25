const router = require('express').Router()

// passport
const bcrypt = require('bcrypt')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy



// models
const UserModel = require('../models/User')

router.get("/", (req, res) => { 
    UserModel.find({}, (err, user) => {
        if(err){
            res.send({err})
        } 
        if(user.length === 0){
            res.send({message:"No user created yet!!"})
        }
        res.send(user)
    })
})


router.route("/signup")    
      .post((req, res) => {
        var username = req.body.username;
        var email = req.body.email;
        var password= req.body.password;
        var password2 = req.body.password2


        // form validator
        req.checkBody('username', 'Name field is required').notEmpty();
        req.checkBody('email', 'Email field is required').isEmail();
        req.checkBody('password', 'Username field is required').notEmpty();
        req.checkBody('password2', 'Password field is required').notEmpty();

        let errors = req.validationErrors()
        if(errors){
            res.send({errors})
        } 
        if(password != password2){
            res.send({
                error:"Password must be equal"
            })
        }
        // create new user
        let newUser = new UserModel({
            username:username,
            email:email,
            password:bcrypt.hashSync(password, 10)
        })
            newUser.save()
                   .then((user)=> {
                       res.send(user)
                   })
                   .catch((e) => {
                       res.send({
                           errorMessage:e.message,
                           errorType:e.name
                        //    errorTye
                        })
                   })
      })



passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    UserModel.findById(id, (err, user) => {
        done(err, user)
    })
})
passport.use(new LocalStrategy(
    (username, password, done)=> {
        UserModel.findOne({username: username}, (err, user) => {
            if(err){ return done(err); }
            if(!user){
                return done(null, false, {message: "Incorrect username."})
            }
            if(!bcrypt.compareSync(password, user.password)){
                console.log(password)/////
                console.log(user.password)
                return done(null, false, {message:'Incorrect password '})
            }
            return done(null, user)
        })
    }
))
// router.post("/login",passport.authenticate('local',{
//     successRedirect:'/user/',
//     failureRedirect:'/user/login'
// }),(req, res) => {
//     res.send("Login Post")
// })
router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.redirect('/login'); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.redirect('/user', {
            message
        });
      });
    })(req, res, next);
  });
  

router.get("/login", (req, res) => {
    res.send({messages})
})

module.exports = router
