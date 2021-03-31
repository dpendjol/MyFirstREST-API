const express = require("express");
const ejs = require("ejs");
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const key = fs.readFileSync('../key.pem');
const cert = fs.readFileSync('../cert.pem');
const https = require('https');
const app = express();
const server = https.createServer({key: key, cert: cert}, app);

require('dotenv').config('~/.env');

const user = process.env.db_user
const pass = process.env.db_pass
const host = process.env.db_host
const port = process.env.db_port
const db = process.env.db_name

app.set('view engine', 'ejs');

app.use(cors());

app.use(express.json({}));

app.use(express.static("public"));

connection_string = mongoose.connect(`mongodb://${user}:${pass}@${host}:${port}/${db}?authSource=${db}`, { useNewUrlParser: true, useUnifiedTopology: true})
	.then(() => console.log('connecting'))
	.catch(err => console.error('something went wrong', err));

const todoItemSchema = new mongoose.Schema({
    description: String,
    done: Boolean,
});

todoItemSchema.set("timestamps", {
    createdAt: "_createdOn",
    updatedAt: "_updatedOn"
});

const songItemSchema = new mongoose.Schema({
    title: String,
    artist: String,
    genre: String,
    rating: Number,
});

songItemSchema.set("timestamps", {
    createdAt: "_createdOn",
    updatedAt: "_updatedOn"
});

const todoItem = mongoose.model('TodoItem', todoItemSchema)
const songItem = mongoose.model('SongItem', songItemSchema)

/* TODO LIST ITEM */

app.get('/api', function(req, res){
    /*
        getting data from the API
    */

    let queryResult = ''
    if (req.query.sort) {
        const sorting = req.query.sort;
        if (sorting[0] === '-') {
            field = sorting.slice(1)

            sortBy = {[field]: -1}
        } else {

            sortBy = {[sorting]: 1}
        }
        queryResult = todoItem.find().sort(sortBy)
    } else {
        queryResult = todoItem.find()
    }

    queryResult.exec(function(err, result) {
        if (!err) {
            res.send(result);
        } else {
            res.send(err);
        }
    })
});


app.post('/api', (req, res) => {
    /*
    Handeling post request to the server
    */

    const newItem = new todoItem(req.body);

    newItem.save(function(err, result){
        if (!err) {
            res.send(result);
        } else {
            res.send(err);
        }
    })
});

app.delete('/api', function(req, res) {
    todoItem.deleteMany({}, function(err, result) {
        if (!err) {
            res.send(result);
        } else {
            res.send(err);
        }
    })
});

app.route('/api/:id')
    .get(function(req, res) {
        todoItem.findOne({_id: req.params.id}, function(err, result) {
            if (result) {
                res.send(result);
            } else {
                res.send("Nothing found")
            }
        });
    })
    .put(function(req, res){
        todoItem.update({_id: req.params.id}, req.body, {overwrite: true}, function(err, result) {
            if (!err) {
                res.send('Correcty updated')
            }
        })
    })
    .patch(function(req, res){
        todoItem.update({_id: req.params.id}, {$set: req.body}, function(err, result) {
            if (!err) {
                res.send('Correcty updated')
            }
        })
    })
    .delete(function(req, res) {
        myid = req.params.id;
        todoItem.deleteOne({_id: req.params.id}, function(err) {
            if (!err) {
                res.send('Deleted item')
            }
        });
    });

/********** Songs ****************/

app.get('/songs', function(req, res){
    /*
        getting data from the API
    */

    const queryResult = songItem.find()

    queryResult.exec(function(err, result) {
        if (!err) {
            res.send(result);
        } else {
            res.send(err);
        }
    })
});


app.post('/songs', (req, res) => {
    /*
    Handeling post request to the server
    */

    const newItem = new songItem(req.body);

    newItem.save(function(err, result){
        if (!err) {
            res.send(result);
        } else {
            res.send(err);
        }
    })
});

app.delete('/songs', function(req, res) {
    songItem.deleteMany({}, function(err, result) {
        if (!err) {
            res.send(result);
        } else {
            res.send(err);
        }
    })
});

/* SPECIFIC ITEMS */

app.route('/songs/:id')
    .get(function(req, res) {
        songItem.findOne({_id: req.params.id}, function(err, result) {
            if (result) {
                res.send(result);
            } else {
                res.send("Nothing found")
            }
        });
    })
    .put(function(req, res){
        songItem.update({_id: req.params.id}, req.body, {overwrite: true}, function(err, result) {
            if (!err) {
                res.send('Correcty updated')
            }
        })
    })
    .patch(function(req, res){
        songItem.update({_id: req.params.id}, {$set: req.body}, function(err, result) {
            if (!err) {
                res.send('Correcty updated')
            }
        })
    })
    .delete(function(req, res) {
        myid = req.params.id;
        songItem.deleteOne({_id: req.params.id}, function(err) {
            if (!err) {
                res.send('Deleted item')
            }
        });
    });

app.listen(3000, function() {
  console.log("HTTP Server started on port 3000");
});

server.listen(3001, function() {
    console.log("HTTPS Server started on port 3001");
  });

