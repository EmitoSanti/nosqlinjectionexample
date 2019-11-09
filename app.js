var express = require('express');
var app = express();
var mongoose = require('mongoose');

require('./user.js'); // User Schema
var  User =  mongoose.model('User');
var seed = false; // Para poblar la base de datos poner seed en true

/*
    Debemos validar y desinfectar los campones necesarios si son String, 
    para esto también puede usar el paquete mongo-sanitize.
*/
var sanitize = require('mongo-sanitize'); 

var bodyParser = require('body-parser');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));


// Pra ejecutar la query segura dejar la variable security entrue
security = true; // Para ejecutar la query no segura dejar security en false

app.get('/', function (req, res) {
    res.send('Buenas Buenas, Probamos inyección NoSQL y solución?');
});

// Signup of user
app.post('/signup', function (req, res) {
    var newUser = new User(req.body);

    newUser.save(function(err){
        if(err){
            res.send(err);
        }else{
            res.send('Usuario registrado exitosamente!!');
        }
    })
});
  
// Login of user with/without security
app.post('/login',function(req,res){
    if (security){
        // Se ejecuta la query segura
        // Si en los parametros del POST tiene {"$ gt": ""}, ya no podrá iniciar sesión. 
        console.log("loginSafe");
        /*
        La solución a este problema es muy simple y 
        todo lo que necesita hacer es configurar explícitamente el selector de consultas.
        */
        var user = sanitize(req.body.user);
        var password = sanitize(req.body.password);
        User.findOne({'user': { $in: [user] },'password': { $in: [password] }},function(err,data){
            // Hay q realizar una mejora para castear el mensaje de error cuando se realiza una inyección y el sistema la liquida
            if(err){
                res.send(err);
            }else if(data){
                console.log(data);
                res.send('Usuario "'+ data.user + '" logeado exitosamente');
            }else {
                console.log('You are not hacker!!');
                res.send('Usuario o password incorrecto!');
            }
        })
    }
    else {
        // Se ejecuta la query no segura
        // Si en los parametros del POST tiene {"$ gt": ""}, podrá iniciar sesión. 
        console.log("loginFake");
        /*
            El operador {"$ gt": ""} indica a DB que devuelva el correo electrónico y la contraseña mayor que "", 
            lo que da como resultado verdadero y devuelve los datos que permiten al usuario 
            para iniciar sesión sin proporcionar valores reales en los campos.
        */
        User.findOne({'user':req.body.user,'password':req.body.password},function(err,data){
            if(err){
                res.send(err);
            }else if(data){
                console.log(data);
                console.log('You are hacker!!');
                res.send('Usuario "' + data.user + '" logeado exitosamente');
            }else {
                res.send('Usuario o password incorrecto!');
            }
        })
    }
});

var server = app.listen(3000, function () {
    mongoose.connect('mongodb://localhost/nosqlinyect', { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Express app listening on port %d', server.address().port);

    if (seed) {
        // genera tres registros en la base de datos justo en la "tabla/esquema User"
        [['David', 'david', '1234'], ['Emiliano', 'emito', '1234'], ['Santiago', 'santiago', '1234']].forEach(function (cred) {
            var instance = new User();

            instance.name = cred[0];
            instance.user = cred[1];
            instance.password = cred[2];
            instance.save();
        });
    }
});