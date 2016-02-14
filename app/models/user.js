var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

function validateLenght(v) {
  return v.length <=25;
}

// Define the schema for the User model
var userSchema = mongoose.Schema({

    local : {
        email: { type: String, unique: true, lowercase: true },
        password: String,

        profile: {
            firstname: { type: String, default: '' },
            lastname: { type: String, default: '' },
            newsletter: {type: String, default: ''},
            terms: {type: String, default: ''},
            gender: { type: String, default: 'donot' },
            dobyear: { type: String, default: '' },
            dobmonth: { type: String, default: '' },
            dobday: { type: String, default: '' },
            address: { type: String, default: '' },
            zip: { type: String, default: '' },
            city: { type: String, default: '' },
            phone: { type: String, default: '' },
            language: { type: String, default: 'EN' }
        },
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        accountDeleted: { type: Boolean, default: 'false'}
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }
});

// Generating a Hash using a Salt
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Checking if the password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// Create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
