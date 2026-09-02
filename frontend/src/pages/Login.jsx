import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Radar from '../components/Radar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const { user, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await login(id, pw);
    if (!result.ok) {
      setError(result.error || 'Login failed. Please check your details.');
      return;
    }
    setError('');
    showToast('Welcome back — logged in successfully');
    navigate('/dashboard');
  }

  return (
    <div className="auth-shell">
      <div className="auth-visual">
        <div className="eyebrow" style={{ color: 'var(--amber)' }}>Welcome back</div>
        <Radar
          center="✦"
          dots={[
            { top: '30%', left: '70%' },
            { top: '65%', left: '35%', variant: 'v2' },
          ]}
        />
        <p className="auth-quote">
          "The best communities aren't found. <span>They're discovered, one event at a time.</span>"
        </p>
      </div>
      <div className="auth-form-side">
        <div className="auth-card">
          <div className="eyebrow">Sign in</div>
          <h2>Good to see you</h2>
          <p className="sub">Log in with your email, username, or mobile number.</p>

          <div className={`form-alert error${error ? ' show' : ''}`}>
            ⚠️ <span>{error}</span>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="loginId">Email, username, or mobile</label>
              <input
                type="text"
                id="loginId"
                placeholder="you@community.com"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="loginPw">Password</label>
              <div className="input-wrap">
                <input
                  type={showPw ? 'text' : 'password'}
                  id="loginPw"
                  placeholder="••••••••"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  required
                />
                <button type="button" className="pw-toggle" onClick={() => setShowPw((s) => !s)}>
                  {showPw ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Login
            </button>
          </form>
          <p className="auth-switch">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
