// dependencies
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const expressValidator = require('express-validator')
const passport = require('passport')
const flash = require('connect-flash')
const session = require('express-session')

// importting files
const routes = require('./routes')

// configuration
const port = process.env.PORT || 3000
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(require('connect-flash')());


// model configuration
mongoose.connect('mongodb://localhost:27017/fable_app', { useNewUrlParser: true });



// handle sessions
app.use(session({
    secret: 'secret',
    saveUninitialized:true,
    resave:true
}))


// messages
app.use((req, res, next) =>{
    res.locals.messages = require('express-messages')(req, res)
    next()
})
// validator
app.use(expressValidator({
    errorFormatter:(param, msg, value) => {
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root

        while(namespace.length){
            formParam += '['+ namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg : msg,
            value : value
        }
    }
}))
//passport middleware

app.use(passport.initialize()) // initialize passport
app.use(passport.session())

//routes
app.use("/", routes)
app.listen(3000, () => {
    console.log(`App running on port ${port}!!!`)
})