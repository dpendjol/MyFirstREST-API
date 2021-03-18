const express = require("express");
// const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({
   extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todoDB", { useNewUrlParser: true, useUnifiedTopology: true});

const todoItemSchema = new mongoose.Schema({
    name: String,
    content: String,
});

const todoItem = mongoose.model('TodoItem', todoItemSchema)

app.get('/api', function(req, res){
    /*
        getting data from the API
    */
    todoItem.find(function(err, result) {
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
    const name = req.body.name;
    const content = req.body.content;

    const newItem = new todoItem({
        name: name,
        content: content
    });

    res.send(newItem)
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});