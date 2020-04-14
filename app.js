var express = require('express');
var app = express(); // creación de una aplicación con express
var mongoose = require('mongoose'); // utilizamos mongoose como ODM

require('./user.js'); // Obtenemos el esquema de User
var User = mongoose.model('User'); // La variable User es difinido como un modelo de objeto de tipo User

/* Esta variable es para poblar la base de datos de forma automatica.
    Solo usar "seed = true" en la primera ejecición de la aplicación, 
    luego volverla a false en las siguientes ejecuciones  
*/
var seed = false;

/*
    Presento "mongo-sanitize" que permite mitigar la vulnerabilidad de inyección de NoSQL
    Validar y desinfecta los campones necesarios y los combierte en String.
*/
var sanitize = require('mongo-sanitize'); 

var bodyParser = require('body-parser');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));


// Esta variable es solamente utilizada para cambiar la ejecución de la aplicacion en modo seguro o no seguro
var security = true; // Para ejecutar en modo no seguro dejar security en false

app.get('/', function (req, res) {
    res.send('Buenas Buenas, Probamos inyección NoSQL y solución?');
});

// Signup of user, por si queremos crear mas usuarios.
app.post('/signup', function (req, res) {
    var newUser = new User(req.body);

    newUser.save(function(err) {
        if(err) {
            res.send(err);
        } else {
            res.send('Usuario registrado exitosamente!!');
        }
    })
});
  
// login para usuarios, revisar variable "security".
app.post('/login',function(req, res) {
    if (security) {
        // Se ejecuta en modo seguro
        // Si en los parametros del POST contiene {"$gt": ""} en los campos de la URL, no podrá iniciar sesión. 
        console.log("Ejecución de login en modo seguro");

        var user = sanitize(req.body.user);
        var password = sanitize(req.body.password);
        /*  
            Como vimos las variables user y password tienen la forma sanetizada de los datos obtenidos desde el body.
            En pocas y burdas palabras la dependencia "mongo-sanitize" convierte el contenido del body utilizado en 
            una cadena de caracteres sin el signo "$".
        */
        User.findOne({'user': { $in: [user] }, 'password': { $in: [password] }}, function(err, data) {
            // Hay que realizar una mejora para castear el mensaje de error desde mongodb.
            if(err) {
                res.send(err);
            } else if(data) {
                console.log(data);
                res.send('Usuario "'+ data.user + '" logueado exitosamente');
            } else {
                console.log('You are not hacker!!'); // Mensaje noob
                res.send('Usuario o password incorrecto!');
            }
        });
    } else {
        // Se ejecuta en modo no seguro
        // Si en los parametros del POST tiene {"$gt": ""} en los campos de la URL, podrá iniciar sesión. 
        console.log("Ejecución de login en modo no seguro");
        /*
            El operador {"$gt": ""} indica a la BD que devuelva el usuario y la contraseña mayor que "", 
            lo que da como resultado verdadero y devuelve los datos que permiten al usuario 
            para iniciar sesión sin proporcionar valores reales en los campos.
        */
        User.findOne({ 'user': req.body.user, 'password': req.body.password }, function(err, data) {
            // Hay que realizar una mejora para castear el mensaje de error desde mongodb.
            if(err) {
                res.send(err);
            } else if(data) {
                console.log(data);
                console.log('You are hacker!!'); // Mensaje noob
                res.send('Usuario "' + data.user + '" logeado exitosamente');
            } else {
                res.send('Usuario o password incorrecto!');
            }
        });
    }
});

var server = app.listen(3000, function () {
    mongoose.connect('mongodb://localhost/nosqlinject', { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Express app listening on port %d', server.address().port);

    // Creador de seeds
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