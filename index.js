const express = require("express");
const ejs = require("ejs");
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

user = process.env.db_user
passwd = process.env.db_passwd
host = process.env.db_host
port = process.env.db_port
db = process.env.db_name

app.set('view engine', 'ejs');

app.use(cors());

app.use(express.json({
   
}));

app.use(express.static("public"));
connection_string = 
mongoose.connect(`mongodb://${user}:${passwd}@${host}:${port}/${db}?authSource=${db}`, { useNewUrlParser: true, useUnifiedTopology: true})
	.then(() => console.log('connecting'))
	.catch(err => console.error('something went wrong', err));

const todoItemSchema = new mongoose.Schema({
    description: String,
    done: Boolean,
});
todoItem.set("timestamps", {
    createdAt: "_createdOn",
    updatedAt: "_updatedOn"
});

const todoItem = mongoose.model('TodoItem', todoItemSchema)

app.get('/api', function(req, res){
    /*
        getting data from the API
    */
    todoItem.find(function(err, result) {
        if (!err) {
	    console.log(result)
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
    console.log(req.body);

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

/////////////////// SPECIFIC ITEMS

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

app.get('/api')

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
