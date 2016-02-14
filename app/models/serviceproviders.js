var mongoose = require('mongoose'),
    mongoosastic=require("mongoosastic");

// Define the schema for the Service Provider model
var spSchema = mongoose.Schema({

    email: { type: String, unique: true, lowercase: true },
    password: String,
    name: { type: String, default: '' },
    address: { type: String, default: '' },
    zip: { type: String, default: '', es_indexed:true },
    city: { type: String, default: '', es_indexed:true },
    phone: { type: String, default: '' },
    website: {type: String, default: '' },
    customerEmail: {type: String, default: ''},
    service: {
        service1: { name: { type: String, default: '' }, price : {type: String, default: '' } },
        service2: { name: { type: String, default: '' }, price : {type: String, default: '' } },
        service3: { name: { type: String, default: '' }, price : {type: String, default: '' } }
    },
    hours: {
        mon: { type: String, default: '' },
        tue: { type: String, default: '' },
        web: { type: String, default: '' },
        thur: { type: String, default: '' },
        fri: { type: String, default: '' },
        sat: { type: String, default: '' },
        sund: { type: String, default: '' }
    },
    photos: {
        photo1 : { url : String },
        photo2 : { url : String },
        photo3 : { url : String },
        photo4 : { url : String },
        photo5 : { url : String }
    },
    reviews: {
        r1: { comment: { type: String, default: '' }, pq : {type: String, default: '' }, ambiance: { type: String, default: '' }, service : {type: String, default: '' } }
    },
    thumb: { type: String, default: ''},
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

// Create the model for service providers and expose it to our app
module.exports = mongoose.model('ServiceProviders', spSchema);
