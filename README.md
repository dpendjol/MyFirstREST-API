# API for ToDo list app

---
## Settings
---
` `  
` `  
### In file system
---
Create a `.env` file in the home directory of the user running the service.
This file needs to contain the following information:
```
db_user=[ user with read/write acces to MongoDB database ]
db_pass=[ pass for the user ]
db_host=[ hostname or ip-address running the MongoDB server ]
db_port=[ port on which the server is running]
db_name=[ name of the database ]
```

### On mongo db
---
Create a user in the MongoDB database with the following steps. For more information about user management and authentication [click here (MongoDB Security)](https://docs.mongodb.com/manual/tutorial/enable-authentication/)

1. Start MongoDB
    - `mongod --port 27017 --dbpath /var/lib/mongodb`
2. Connect to instance
    - `mongo --port 27017`
3. Create user and let it have a minimal of read and write acces to the database you want to use
    ``` 
    use {db_name}
        db.createUser(
            {
            user: "chooseUsername",
            pwd: passwordPrompt(),
            roles: [ { role: "readWrite", db: "{db_name}" } ]
            }
        )
      ```
4. Restart database
    - System independed. But you can use the following method
      - Shut down the mongod instance. For example, from the mongo shell, issue the following command:
      `db.adminCommand( { shutdown: 1 } )` 
      - Start the mongod with access control enabled.
      `mongod --auth --port 27017 --dbpath /var/lib/mongodb`

Use the user, password and db_name credentials you just filled in, in your `.env` file. If you changed the portnumber you have to adjust the `db_port` variable to match.

