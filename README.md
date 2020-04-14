# Injección de NoSQL, caso practico/didactico
    Caso practico y didactico: 
    La siguiente aplicación es un login simple realizado en node.js, que se utilizará como ejemplo practico 
    de Caso de Uso de alguna plataforma que use una base de datos NoSQL, en esta caso MongoDB.

    Por defecto se encuentra activado un un sistema de contramedida para inhabilitar inyección de NoSQL,
    es decir, los ataques de este tipo serán mitigados.
    
    Al ser un caso de estudio y esta aplicación de NodeJS permite desactivar las contramedidas, 
    dejando la la aplicación vulnerable a estos ataques.

    Los ataques de inyección de NoSQL consiste en que a través de los Metodos de petición HTTP a una API REST, 
    como "GET, PUT, POST, DELETE, etc", se manipule la información/datos colocada en una URL/EndPoint que 
    ejecute algun servicio en la aplicación.

    Para manipular estas URL previamente se debe tener conocimiento de la estructura basica de ellas, y en las cuales se 
    va a proceder al intercambio de información por Operadores de Consulta y Proyección, como "$eq, $gt, $gte,
    $lte, $or, $and, etc".

La siguiente aplicación de node.js se encuentra el el repositorio "https://github.com/EmitoSanti/nosqlinjectionexample",
pero se realizará la explicación de cada segmento de código, exponiendo el workflow del sistema y de los usuarios (común y 
atacante)

### Prerequisitos, tener instalado:
    * mongodb
    * nodejs
    * Postman

## Primer paso en la terminal apuntando al directorio donde esta app.js ejecutar: 
    * npm install

## Segundo paso en la terminal apuntando al directorio donde esta app.js ejecutar:
    * node app.js

## Tercer paso elegir si utilizar una query segura o no segura seteando la variable "security" como true o false respectivamente. 
    Nota: Si es la primera vez que ejecuta el programa colocar la variable seed en true, luego volverla a false despues de la primera ejecución.

## Cuarto paso en el directorio de app.js ejecutar: node app

## Quinto paso con Postman realizar:
    * un POST a http://localhost:3000/login
    * el body los parametros en RAW y JSON con alguno de estos 2 mensajes (elegir uno en cada POST):
        Inyección NoSQL:
        ```
        {
            "user" : {"$gt":""},
            "password" : {"$gt":""}
        }

        ```
        Si esta en modo seguro la la inyección falla

        ```
        Post normal y corriente: 
        {
            "user" : "david",
            "password" : "1234"
        }
        ```
    * Realizar "SEND"

Fuente: [https://scotch.io/@401/mongodb-injection-in-nodejs]


Debemos aprender a estar un paso adelante y realizar un código limpio y seguro.

Inyección NoSQL en aplicaciónes de node.Js y MongoDB
Esta es mi primera publicación en este medio, nació esta iniciativa al intentar de interpretar una practica que tiene una connotación negativa en algunos puntos de vista, lo que no esta mal; yo lo miro de un punto de vista educativo proveniente de una exposición que realice.