# Injección de NoSQL, caso practico/didactico
    Caso practico y didactico: Simple login en alguna plataforma que use una base de datos NoSQL, 
    en esta caso MongoDB. Si hay un sistema de contramedida para inyección de NoSQL no se va a poder
    logear el atacante. Si no existe alguna contramedida el atacante puede vulnerar el sistema con una simple
    operación de mongoDB en la query.

    Debemos aprender a estar un paso adelante y realizar un código limpio y seguro.

# # # Prerequisitos, tener instalado:
    * mongodb
    * nodejs

# # Primer paso: iniciar instancia de mongod

# # Segundo paso en la terminar apuntando al directorio donde esta app.js ejecutar: 
   * npm install
   * npm install mongoose --save
   * npm install express --save
   * npm install mongo-sanitize --save

# # Tercer paso elegir si utilizar una query segura o no segura seteando la variable "security" como true o false respectivamente. 
    Nota: Si es la primera vez que ejecuta el programa colocar la variable seed en true, luego volverla a false despues de la primera ejecución.

# # Cuarto paso en el directorio de app.js ejecutar: node app

# # Quinto paso con Postman realizar:
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