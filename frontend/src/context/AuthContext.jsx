import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'cned_user';
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

function toTitleCase(s) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalizeRole(role) {
  const map = {
    member: 'MEMBER',
    moderator: 'MODERATOR',
    'event organiser': 'EVENT_ORGANISER',
    'event-organiser': 'EVENT_ORGANISER',
    organiser: 'EVENT_ORGANISER',
    'community manager': 'COMMUNITY_MANAGER',
    'community-manager': 'COMMUNITY_MANAGER',
    manager: 'COMMUNITY_MANAGER',
    admin: 'ADMIN',
    guest: 'GUEST',
  };

  return map[String(role || '').trim().toLowerCase()] || 'MEMBER';
}

function normalizeDisplayRole(role) {
  const map = {
    MEMBER: 'Member',
    MODERATOR: 'Moderator',
    EVENT_ORGANISER: 'Event Organiser',
    COMMUNITY_MANAGER: 'Community Manager',
    ADMIN: 'Admin',
    GUEST: 'Guest',
  };

  return map[String(role || '').toUpperCase()] || 'Member';
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  async function login(id, password) {
    if (!id.trim() || !password.trim() || password.trim().length < 4) {
      return { ok: false, error: 'Invalid credentials. Please check your email and password.' };
    }

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: id.trim(), password: password.trim() }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        return { ok: false, error: data.message || data.error || 'Invalid credentials. Please check your email and password.' };
      }

      const nextUser = {
        id: data.userId,
        name: data.name,
        email: data.email,
        role: normalizeDisplayRole(data.role),
        token: data.token,
      };

      setUser(nextUser);
      return { ok: true, user: nextUser };
    } catch (error) {
      return { ok: false, error: 'Unable to reach the backend. Please check that the server is running.' };
    }
  }

  async function registerAccount({ name, role, email, phoneNumber, password }) {
    try {
      const payload = {
        name: name?.trim(),
        email: email?.trim(),
        phoneNumber: phoneNumber?.trim(),
        password: password,
        role: normalizeRole(role),
      };

      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        return {
          ok: false,
          error: data.message || data.error || 'Registration failed. Please review the details and try again.',
        };
      }

      // Do NOT call setUser here — let the user explicitly log in after registration.
      // Calling setUser would immediately mark them as authenticated, causing Login.jsx
      // to redirect to /dashboard before the thank-you message can be shown.
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'Unable to reach the backend. Please check that the server is running.' };
    }
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, registerAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
