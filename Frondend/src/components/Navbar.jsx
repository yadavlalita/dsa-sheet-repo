import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // detect current page

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Dashboard</div>
      <div className="navbar-links">
        <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>Profile</Link>
        <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>Topics</Link>
        <Link to="/progress" className={`nav-link ${location.pathname === '/progress' ? 'active' : ''}`}>Progress</Link>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
