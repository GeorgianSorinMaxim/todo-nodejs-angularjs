var mongoose = require('mongoose');

var todo = mongoose.Schema({
	text: { type: String, default: '' },
	completed: { type: Boolean, default: '0' }
});

module.exports = mongoose.model('Todo', todo);
