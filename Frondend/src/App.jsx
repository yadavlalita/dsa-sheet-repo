import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Topics from './pages/Dashboard';
import Progress from './pages/Progress';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import './styles/Background.css';
import Footer from './components/Footer';

function App() {
  const token = localStorage.getItem('token');

  return (
    <div className="bubbles-background">
    <>
      {token && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Topics />
          </PrivateRoute>
        } />
        <Route path="/progress" element={
          <PrivateRoute>
            <Progress />
          </PrivateRoute>
        } />
        <Route path="*" element={<Navigate to={token ? "/profile" : "/"} />} />
      </Routes>
         {token && <Footer />}
    </>
    </div>
  );
}

export default App;
