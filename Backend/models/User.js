const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: { type: String },
  completedTopics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
  completedSubTopics: [{
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
    subTopicIndex: Number
  }]
});

module.exports = mongoose.model('User', UserSchema);
