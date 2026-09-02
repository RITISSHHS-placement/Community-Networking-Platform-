import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function NavBar() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('cned_theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cned_theme', theme);
  }, [theme]);

  function handleLogout() {
    logout();
    showToast('You have been logged out');
    navigate('/login');
  }

  const initials = user
    ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="nav-brand">
          <svg className="brand-mark" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="#FF6B4A" strokeWidth="1.4" opacity="0.5" />
            <circle cx="20" cy="20" r="11" stroke="#FFC857" strokeWidth="1.4" opacity="0.6" />
            <circle cx="20" cy="20" r="4" fill="#FF6B4A" />
            <circle cx="29" cy="13" r="2.4" fill="#9B8CFF" />
          </svg>
          <span className="brand-lockup">
            <span className="brand-short">
              Nearby<span style={{ color: 'var(--coral)' }}>.</span>
            </span>
            <span className="brand-full">Community Networking &amp; Events Discovery Platform</span>
          </span>
        </NavLink>

        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => 'nav-link' + (isActive ? ' nav-active' : '')}>
            Home
          </NavLink>
          {!user && (
            <NavLink to="/login" className={({ isActive }) => 'nav-link' + (isActive ? ' nav-active' : '')}>
              Login
            </NavLink>
          )}
          {!user && (
            <NavLink to="/register" className={({ isActive }) => 'nav-link' + (isActive ? ' nav-active' : '')}>
              Register
            </NavLink>
          )}
          <NavLink to="/dashboard" className={({ isActive }) => 'nav-link' + (isActive ? ' nav-active' : '')}>
            Dashboard
          </NavLink>
          <NavLink to="/discover" className={({ isActive }) => 'nav-link' + (isActive ? ' nav-active' : '')}>
            Discover
          </NavLink>
        </div>

        <div className="nav-right">
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {user ? (
            <>
              <div className="user-chip">
                <div className="user-avatar">{initials}</div>
                <div className="user-meta">
                  <div className="u-name">{user.name}</div>
                  <div className="u-role">{user.role}</div>
                </div>
              </div>
              <button className="btn btn-subtle btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className="btn btn-primary btn-sm">
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
