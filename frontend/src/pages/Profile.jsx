import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Profile() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    bio: '',
    location: 'Coimbatore, IN',
    website: '',
    twitter: '',
    linkedin: '',
  });
  const [saving, setSaving] = useState(false);
  const [avatarColor] = useState(() => {
    const colors = ['#FF6B4A', '#9B8CFF', '#FFC857', '#5FE0B7'];
    return colors[Math.floor(Math.random() * colors.length)];
  });

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.name.trim()) { showToast('Name is required'); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    showToast('Profile updated successfully');
  }

  const initials = form.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="container" style={{ paddingTop: 44, paddingBottom: 70 }}>
      <div className="eyebrow">Account</div>
      <h2 style={{ fontSize: 26, margin: '8px 0 4px' }}>My Profile</h2>
      <p className="text-muted" style={{ fontSize: 14, marginBottom: 36 }}>
        Update your personal info, bio, and social links.
      </p>

      <div className="profile-layout">
        {/* ── Left: avatar + role card ── */}
        <div className="profile-sidebar">
          <div className="profile-avatar-card panel">
            <div
              className="profile-avatar-lg"
              style={{ background: `linear-gradient(135deg, ${avatarColor}, #1D2040)` }}
            >
              {initials || '?'}
            </div>
            <div className="pa-name">{form.name || 'Your name'}</div>
            <div className="pa-role">{user?.role || 'Member'}</div>
            <div className="pa-email">{form.email}</div>
            <div className="pa-stats">
              <div><strong>6</strong><span>Communities</span></div>
              <div><strong>3</strong><span>Events</span></div>
              <div><strong>12</strong><span>Posts</span></div>
            </div>
          </div>
        </div>

        {/* ── Right: form ── */}
        <form className="profile-form panel" onSubmit={handleSave} noValidate>
          <h3 className="profile-section-title">Personal information</h3>

          <div className="profile-row">
            <div className="field">
              <label htmlFor="pName">Full name</label>
              <input id="pName" type="text" value={form.name}
                onChange={(e) => set('name', e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="pEmail">Email</label>
              <input id="pEmail" type="email" value={form.email}
                onChange={(e) => set('email', e.target.value)} />
            </div>
          </div>

          <div className="profile-row">
            <div className="field">
              <label htmlFor="pPhone">Phone number</label>
              <input id="pPhone" type="text" placeholder="9876543210"
                value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="pLocation">Location</label>
              <input id="pLocation" type="text" value={form.location}
                onChange={(e) => set('location', e.target.value)} />
            </div>
          </div>

          <div className="field">
            <label htmlFor="pBio">Bio</label>
            <textarea id="pBio" className="profile-textarea" rows={3}
              placeholder="Tell the community a bit about yourself…"
              value={form.bio} onChange={(e) => set('bio', e.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="pWebsite">Website</label>
            <input id="pWebsite" type="url" placeholder="https://yoursite.com"
              value={form.website} onChange={(e) => set('website', e.target.value)} />
          </div>

          <h3 className="profile-section-title" style={{ marginTop: 28 }}>Social links</h3>

          <div className="profile-row">
            <div className="field">
              <label htmlFor="pTwitter">Twitter / X</label>
              <div className="field input-wrap social-input">
                <span className="social-prefix">@</span>
                <input id="pTwitter" type="text" placeholder="handle"
                  value={form.twitter} onChange={(e) => set('twitter', e.target.value)}
                  style={{ paddingLeft: 30 }} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="pLinkedin">LinkedIn</label>
              <div className="field input-wrap social-input">
                <span className="social-prefix">in/</span>
                <input id="pLinkedin" type="text" placeholder="username"
                  value={form.linkedin} onChange={(e) => set('linkedin', e.target.value)}
                  style={{ paddingLeft: 36 }} />
              </div>
            </div>
          </div>

          <div className="profile-form-footer">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
