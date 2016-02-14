'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongoosastic = require('mongoosastic');


/**
 * Validation
 */
function validateLength (v) {
  // a custom validation function for checking string length to be used by the model
  return v.length <= 40;
}

/**
 * Booking Schema
 */
var BookingSchema = new Schema({
    serviceprovider: {
        type: Schema.Types.ObjectId,
        ref: 'ServiceProvider',
        required: 'Invalid service provider!'
    },
    bookingId: {
      type: String,
      default: ''
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    created: {
        type: Date,
        default: Date.now
    },
    date: {
        type: String,
        default: ''
    },
    hour: {
        type: String,
        default: ''
    },
    duration: {
        type: Number,
        default: ''
    },
    subtotalPrice: {
        type: Number,
        default: 0
    },
    totalPrice: {
        type: Number,
        default: 0
    },
    cancelled: {
        type: Boolean,
        default: false
    },
    reviewed: {
        type: Boolean,
        default: false
    },
    service: {
        type: String,
        default: ''
    },
    comments: {
        type: String,
        default: ''
    },
    review: {
      title: { type: String, default: '' },
      comment: { type: String, default: '' },
      value: {type: String, default: ''},
      ambiance: {type: String, default: ''},
      service: {type: String, default: ''},
      average: {type: String, default: ''},
      date: {type: String, default: ''},
      author: {type: String, default: ''}
    },
    customerToken: {
        type: String,
        default: ''
    },
    chargeId:{
      type: String,
      default: ''
    }
});

module.exports = mongoose.model('Booking', BookingSchema);
