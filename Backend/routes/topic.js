// backend/routes/topic.js
const express = require('express');
const Topic = require('../models/Topic');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ msg: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(400).json({ msg: 'Token not valid' });
  }
};

// Get all topics
router.get('/', authMiddleware, async (req, res) => {
  const topics = await Topic.find();
  const user = await User.findById(req.user);

  res.json({
    topics,
    completedTopics: user.completedTopics,
    completedSubTopics: user.completedSubTopics
  });
});

// Mark topic as complete
router.post('/complete/:id', authMiddleware, async (req, res) => {
  const topicId = req.params.id;
  const user = await User.findById(req.user);
  console.log("user-",user);

  if (!user.completedTopics.includes(topicId)) {
    user.completedTopics.push(topicId);
    await user.save();
  }

  res.json({ msg: 'Topic marked as complete' });
});


// Mark a subtopic as complete
router.post('/complete-subtopic/:topicId/:subTopicIndex', authMiddleware, async (req, res) => {
  const { topicId, subTopicIndex } = req.params;
  const user = await User.findById(req.user);
  console.log("topicId, subTopicIndex -",topicId, subTopicIndex );

  const alreadyDone = user.completedSubTopics.some(
    (sub) => sub.topicId.toString() === topicId && sub.subTopicIndex === parseInt(subTopicIndex)
  );

  if (!alreadyDone) {
    user.completedSubTopics.push({
      topicId,
      subTopicIndex: parseInt(subTopicIndex)
    });
    await user.save();
  }

  res.json({ msg: 'Subtopic marked as complete' });
});

// Unmark a subtopic as completed
router.delete('/uncomplete-subtopic/:topicId/:subTopicIndex', authMiddleware, async (req, res) => {
  const { topicId, subTopicIndex } = req.params;
  const user = await User.findById(req.user);

  user.completedSubTopics = user.completedSubTopics.filter(
    (sub) => !(sub.topicId.toString() === topicId && sub.subTopicIndex === parseInt(subTopicIndex))
  );

  await user.save();

  res.json({ msg: 'Subtopic marked as incomplete' });
});

// GET user's progress
router.get('/progress', authMiddleware, async (req, res) => {
  console.log("topics-");
  try {
    const topics = await Topic.find();
    const user = await User.findById(req.user);

    let totalEasy = 0, totalMedium = 0, totalHard = 0;
    let completedEasy = 0, completedMedium = 0, completedHard = 0;

    console.log("topics-",topics);
    // Count total easy, medium, hard subtopics
    topics.forEach((topic) => {
      topic.subtopics.forEach((sub, idx) => {
        if (sub.level === 'Easy') totalEasy++;
        if (sub.level === 'Medium') totalMedium++;
        if (sub.level === 'Hard' || sub.level === 'Tough') totalHard++;

        // Check if this subtopic is completed
        const isCompleted = user.completedSubTopics.some(
          (c) => c.topicId.toString() === topic._id.toString() && c.subTopicIndex === idx
        );

        if (isCompleted) {
          if (sub.level === 'Easy') completedEasy++;
          if (sub.level === 'Medium') completedMedium++;
          if (sub.level === 'Hard' || sub.level === 'Tough') completedHard++;
        }
      });
    });

    // Calculate percentages safely (avoid division by 0)
    const easyPercent = totalEasy ? Math.round((completedEasy / totalEasy) * 100) : 0;
    const mediumPercent = totalMedium ? Math.round((completedMedium / totalMedium) * 100) : 0;
    const hardPercent = totalHard ? Math.round((completedHard / totalHard) * 100) : 0;

    res.json({
      easy: easyPercent,
      medium: mediumPercent,
      hard: hardPercent
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Something went wrong!" });
  }
});
module.exports = router;
