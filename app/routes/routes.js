var mongoose = require('mongoose');
var express = require('express');
var mongoosastic = require('mongoosastic');
var router = express.Router();

var url = 'mongodb://admin:admin@ds019970.mlab.com:19970/dansketest';

var Todo = require('../models/todo');

module.exports = function(app, passport) {
    
    // API Get all todos
    app.get('/api/todos', function(req, res) {
        Todo.find(function(err, todos) {
            if(!err) {
              res.json(200, todos );  
            } else {
              res.json(500, err );
            }
        });
    });

    // API Get(UPDATE) todo
    app.post('/api/todos/:todo_id/:completed', function(req, res) {
        var inv = req.params.completed;
        Todo.update({ _id : req.params.todo_id }, { $set: { completed: inv }},function(err, todo) {
            console.log("todo: ", todo);
            if (err) res.json(500, err );
            Todo.find(function(err, todos) {
                if (err) res.json(500, err );
                res.json(200, todos );
            });
        });
    });

    // API POST todo
    app.post('/api/todos', function(req, res) {
        Todo.create({
            text : req.body.text,
            completed : false
        }, function(err, todo) {
            if (err) res.json(500, err );
            Todo.find(function(err, todos) {
                if (err) rres.json(500, err );
                res.json(200, todos);
            });
        });

    });

    // API DELETE todo
    app.delete('/api/todos/:todo_id', function(req, res) {
        Todo.remove({
            _id : req.params.todo_id
        }, function(err, todo) {
            if (err) res.json(500, err );
            Todo.find(function(err, todos) {
                if (err) res.json(500, err );
                res.json(200, todos);
            });
        });
    });

    // GET Index route
    app.get('/', function(req, res) {
        res.sendfile('./views/index.html');
    });

};
