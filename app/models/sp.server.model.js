'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Validation
 */
function validateLength (v) {
  // a custom validation function for checking string length to be used by the model
  return v.length <= 15;
}

/**
 * Category Schema
 */
var ServiceProviderSchema = new Schema({
    // the property name
     created: {
         // types are defined e.g. String, Date, Number (http://mongoosejs.com/docs/guide.html)
         type: Date,
         // default values can be set
         default: Date.now
     },
     description: {
         type: String,
         default: '',
         // types have specific functions e.g. trim, lowercase, uppercase (http://mongoosejs.com/docs/api.html#schema-string-js)
         trim: true
     },
     name: {
         type: String,
         default: '',
         trim: true,
         unique : true,
         // make this a required field
         required: 'name cannot be blank',
         // wires in a custom validator function (http://mongoosejs.com/docs/api.html#schematype_SchemaType-validate).
         validate: [validateLength, 'name must be 15 chars in length or less']
     },
     email: { type: String, unique: true, lowercase: true },
     password: String,
     address: { type: String, default: '', es_indexed:true },
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

      // email: {
      //   type: String,
      //   lowercase: true,
      //   default: ''
      // },
      // password: {
      //   type: String,
      //   default: ''
      // },
      // created: {
      //   type: Date,
      //   default: Date.now
      // },
      // name: {
      //   type: String,
      //   default: '',
      //   trim: true
      // },
      // description: {
      //   type: String,
      //   default: ''
      // },
      // address: {
      //   type: String,
      //   default: ''
      // },
      // zip: {
      //   type: String,
      //   default: ''
      // },
      // city: {
      //   type: String,
      //   default: ''
      // },
      // phone: {
      //   type: String,
      //   default: ''
      // },
      // website: {
      //   type: String,
      //   default: ''
      // },
      // customerEmail: {
      //   type: String,
      //   default: ''
      // },
      // tratmentName: {
      //   type: String,
      //   default: ''
      // },
      // tratmentPrice: {
      //   type: String,
      //   default: ''
      // },
      // hoursmon: {
      //   type: String,
      //   default: ''
      // },
      // hourstue: {
      //   type: String,
      //   default: ''
      // },
      // hourswed: {
      //   type: String,
      //   default: ''
      // },
      // hoursthur: {
      //   type: String,
      //   default: ''
      // },
      // hoursfri: {
      //   type: String,
      //   default: ''
      // },
      // hourssat: {
      //   type: String,
      //   default: ''
      // },
      // hourssund: {
      //   type: String,
      //   default: ''
      // },
      // photoUrl: {
      //   type: String,
      //   default: ''
      // },
      // reviewComment: {
      //   type : String,
      //   default: ''
      // },
      // reviewPriceQualityScore: {
      //   type : String,
      //   default: ''
      // },
      // reviewAmbianceScore: {
      //   type : String,
      //   default: ''
      // },
      // reviewServiceScore: {
      //   type : String,
      //   default: ''
      // },
      // resetPasswordToken: {
      //   type: Boolean,
      //   default: false
      // },
      // resetPasswordExpires: {
      //   type: Date,
      //   default: ''
      // }
});

// Expose the model to other objects (similar to a 'public' setter).
mongoose.model('ServiceProvider', ServiceProviderSchema);
