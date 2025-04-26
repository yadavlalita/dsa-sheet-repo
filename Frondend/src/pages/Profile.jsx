// src/pages/Profile.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Profile.css';
import Footer from '../components/Footer';

function Profile() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/auth/user', {
          headers: { Authorization: token }
        });
        setEmail(res.data.email);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="profile-page page-container">
      <div className="profile-card">
      <img
          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
          alt="User Avatar"
          className="profile-avatar"
        />
        <h1 className="welcome-title">Welcome {email.split('@')[0]}</h1>
        <p className="email-text">Email: {email}</p>
      </div>
    </div>
  );
}

export default Profile;
