// src/pages/Topics.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css'; // make sure your Topics.css exists
import Footer from '../components/Footer';

function Topics() {
  const [topics, setTopics] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [completedSubTopics, setCompletedSubTopics] = useState([]);
  const [expanded, setExpanded] = useState(null); // Accordion open/close
  const [loadingSubtopics, setLoadingSubtopics] = useState([]); // For spinner during API call

  const fetchTopics = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:5000/api/topics', {
      headers: { Authorization: token }
    });
    setTopics(res.data.topics);
    setCompleted(res.data.completedTopics);
    setCompletedSubTopics(res.data.completedSubTopics || []);
  };

  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  const markSubTopicComplete = async (topicId, subTopicIndex, isChecked) => {
    const token = localStorage.getItem('token');
    const subId = `${topicId}-${subTopicIndex}`;
    setLoadingSubtopics((prev) => [...prev, subId]);

    try {
      if (isChecked) {
        await axios.post(`http://localhost:5000/api/topics/complete-subtopic/${topicId}/${subTopicIndex}`, {}, {
          headers: { Authorization: token }
        });
      } else {
        await axios.delete(`http://localhost:5000/api/topics/uncomplete-subtopic/${topicId}/${subTopicIndex}`, {
          headers: { Authorization: token }
        });
      }
      fetchTopics();
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSubtopics((prev) => prev.filter(id => id !== subId));
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  return (
    <div className="topics-page page-container">
      <h1 className="topics-title">Topics</h1>
      <p className="topics-subtitle">Explore these exciting topics!</p>

      {topics.map((topic, idx) => {
        const isTopicDone = topic.subtopics.every((_, subIdx) =>
          completedSubTopics.some(subItem => subItem.topicId === topic._id && subItem.subTopicIndex === subIdx)
        );

        return (
          <div key={topic._id} className="accordion-section">
            <div className="accordion-header" onClick={() => toggleExpand(idx)}>
              <div>{topic.title}</div>
              <div className={`status-badge ${isTopicDone ? 'done' : 'pending'}`}>
                {isTopicDone ? 'DONE' : 'PENDING'}
              </div>
            </div>

            {expanded === idx && (
              <div className="accordion-content">
                <table className="subtopics-table">
                  <thead>
                    <tr>
                      <th>✅</th>
                      <th>Name</th>
                      <th>LeetCode</th>
                      <th>YouTube</th>
                      <th>Article</th>
                      <th>Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topic.subtopics.map((sub, subIdx) => (
                      <tr key={subIdx}>
                        <td>
                          <input
                            type="checkbox"
                            checked={completedSubTopics.some(subItem => subItem.topicId === topic._id && subItem.subTopicIndex === subIdx)}
                            disabled={loadingSubtopics.includes(`${topic._id}-${subIdx}`)}
                            onChange={(e) => markSubTopicComplete(topic._id, subIdx, e.target.checked)}
                          />
                          {loadingSubtopics.includes(`${topic._id}-${subIdx}`) && (
                            <div className="loader"></div>
                          )}
                        </td>
                        <td>{sub.name}</td>
                        <td><a href={sub.leetcodeLink} target="_blank">Practice</a></td>
                        <td><a href={sub.youtubeLink} target="_blank">Watch</a></td>
                        <td><a href={sub.articleLink} target="_blank">Read</a></td>
                        <td><span className={`level-badge ${sub.level.toLowerCase()}`}>{sub.level}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Topics;
