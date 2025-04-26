// backend/models/Topic.js
const mongoose = require('mongoose');

const SubTopicSchema = new mongoose.Schema({
  name: String,
  leetcodeLink: String,
  youtubeLink: String,
  articleLink: String,
  level: { type: String, enum: ['Easy', 'Medium', 'Hard'] }
});

const TopicSchema = new mongoose.Schema({
  title: { type: String, required: true },    // Main Topic title
  subtopics: [SubTopicSchema]                  // Array of SubTopics
});

module.exports = mongoose.model('Topic', TopicSchema);
