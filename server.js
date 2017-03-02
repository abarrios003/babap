// Set up
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var cors = require('cors');
 
// Configuration
mongoose.connect('mongodb://abarrios:6fovajo9@ds157809.mlab.com:57809/babapdb');
//MONGO_URL=mongodb://root:duqavOr8yv@olympia.modulusmongo.net:27017/hIpum4ab?autoReconnect=true&connectTimeoutMS=60000
 
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cors());
 
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});
 
// Models
var User = mongoose.model('users', {
	name: String,
    username: String,
    password: String,
	email: String,
	country: String,
	phone: String
});
 
// Routes
 
    // Get users
    app.get('/api/users', function(req, res) {
 
        console.log("fetching users");
 
        // use mongoose to get all users in the database
        User.find(function(err, users) {
 
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
 
            res.json(users); // return all reviews in JSON format
			console.log("Consulta OK");
			console.log(users);
        });
    });
	
    app.get('/api/username/:username', function(req, res) {
 
        console.log("fetching user ");
 
        // use mongoose to get all users in the database
        User.find({username : req.params.username},function(err, user) {
 
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
 
            res.json(user); // return all reviews in JSON format
			console.log("Consulta OK");
			console.log(user);
        });
    });
	
    app.post('/api/login', function(req, res) {
 
        console.log("login user ");
 
        // use mongoose to get all users in the database
        User.find({email : req.body.email, password: req.body.password},function(err, user) {
 
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
 
            res.json(user); // return all reviews in JSON format
			console.log("Consulta OK");
			console.log(user);
        });
    });
	
    /*app.post('/api/login', function(req, res) {
 
        console.log("fetching login");
 
        // use mongoose to get all users in the database
        User.find({email : req.body.email,password : req.body.password},function(err, user) {
 
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
 
            res.json(user); // return all reviews in JSON format
			console.log("Consulta OK");
			console.log(user);
        });
    });*/
 
    // create review and send back all reviews after creation
    app.post('/api/users', function(req, res) {
 
        console.log("creating users");
		console.log(req);
 
        // create a user, information comes from request from Ionic
        User.create({
			name : req.body.name,
            username : req.body.username,
            password : req.body.password,
            email: req.body.email,
			country : req.body.country,
            phone : req.body.phone,
            done : false
        }, function(err, user) {
            if (err)
                res.send(err);
 
            // get and return all the users after you create another
            User.find(function(err, users) {
                if (err)
                    res.send(err)
                res.json(users);
            });
        });
 
    });
 
    // delete a user
    app.delete('/api/users/:user_id', function(req, res) {
        User.remove({
            _id : req.params.user_id
        }, function(err, user) {
 
        });
    });
 
 
// listen (start app with node server.js) ======================================
app.listen(process.env.PORT);
console.log("App listening on port 8080");
