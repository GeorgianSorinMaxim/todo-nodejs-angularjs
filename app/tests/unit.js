var assert = require("assert");
var should = require("should");
var supertest = require("supertest");

var Todo = require('../models/todo').Todo; 

var server = supertest.agent("http://localhost:3000");
 
describe('Unit test for the Todo model', function() {

  it("should return all todos",function(done){
    server
    .get("/api/todos")
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
      done();
    });
  });

  it("should create a todo",function(done){
    server
    .post("/api/todos")
    .send({text : "Mocha Test ToDo" })
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
      done();
    });
  });

  // USE A VALID TODO ID
  it("should update an existent todo",function(done){
    server
    .post("/api/todos/570b8aeeb847f6640c497a92/true")
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
      done();
    });
  });

  // USE A VALID TODO ID
  it("should delete an existent todo",function(done){
    server
    .del("/api/todos/570b914e0cea6ea40dd3bf82")
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
      done();
    });
  });
 
});
