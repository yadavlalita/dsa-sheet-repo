// src/pages/Progress.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Progress.css';
import Footer from '../components/Footer';

function Progress() {
  const [progress, setProgress] = useState(null);

  const fetchProgress = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:5000/api/topics/progress', {
      headers: { Authorization: token }
    });
    console.log("res-",res);
    const transformedData = [
      { level: "Easy", percentage: res.data.easy },
      { level: "Medium", percentage: res.data.medium },
      { level: "Hard", percentage: res.data.hard },
    ];
    setProgress(transformedData);
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  return (
    // <div className="progress-page page-container">
    //   <h1 className="progress-title">Progress Reports</h1>
    //   <div className="progress-list">
    //     <div className="progress-item">Easy: {progress.easy}%</div>
    //     <div className="progress-item">Medium: {progress.medium}%</div>
    //     <div className="progress-item">Hard: {progress.hard}%</div>
    //   </div>
    // </div>
    <div className="progress-grid">
      {progress && progress.length > 0 && (
        progress.map((item, index) => (
          <div className="progress-card" key={index}>
            <h3 className="level">{item.level}</h3>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
            <p className="percentage">{item.percentage}%</p>
          </div>
        ))
      )}
  </div>
);
}

export default Progress;
