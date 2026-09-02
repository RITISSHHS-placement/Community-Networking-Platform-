import { useState } from 'react';
import { useToast } from '../context/ToastContext';

const MY_COMMUNITIES = [
  { id: 1, name: 'Founders Collective', emoji: '🚀', members: 2140, priv: false, description: 'A space for founders to connect, share learnings, and grow together.' },
  { id: 2, name: 'AI Builders', emoji: '🤖', members: 3020, priv: false, description: 'Hands-on AI enthusiasts building real projects.' },
  { id: 3, name: 'Design Circle', emoji: '🎨', members: 980, priv: false, description: 'Where designers critique, collaborate, and create.' },
];

const SEED_MEMBERS = {
  1: [
    { id: 1, name: 'Maya Chen', role: 'Organiser', joined: 'Jan 2026', status: 'active' },
    { id: 2, name: 'Arjun Patel', role: 'Member', joined: 'Feb 2026', status: 'active' },
    { id: 3, name: 'Priya Nair', role: 'Moderator', joined: 'Mar 2026', status: 'active' },
    { id: 4, name: 'user_4821', role: 'Member', joined: 'Apr 2026', status: 'suspended' },
    { id: 5, name: 'Lena Fischer', role: 'Member', joined: 'Apr 2026', status: 'active' },
  ],
  2: [
    { id: 1, name: 'Dev Sharma', role: 'Member', joined: 'Feb 2026', status: 'active' },
    { id: 2, name: 'Aiko Tanaka', role: 'Moderator', joined: 'Mar 2026', status: 'active' },
  ],
  3: [
    { id: 1, name: 'Sam Torres', role: 'Member', joined: 'Jan 2026', status: 'active' },
    { id: 2, name: 'Noah Williams', role: 'Member', joined: 'Mar 2026', status: 'active' },
  ],
};

const TABS = ['members', 'announcements', 'settings'];

export default function ManageCommunity() {
  const { showToast } = useToast();
  const [selected, setSelected] = useState(MY_COMMUNITIES[0]);
  const [tab, setTab] = useState('members');
  const [members, setMembers] = useState(SEED_MEMBERS);
  const [memberSearch, setMemberSearch] = useState('');
  const [announcements, setAnnouncements] = useState([
    { id: 1, text: 'Welcome to Founders Collective! Please read the community guidelines.', time: 'Jun 20', pinned: true },
    { id: 2, text: 'Monthly virtual meetup is scheduled for July 15th at 7 PM IST.', time: 'Jul 1', pinned: false },
  ]);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [communitySettings, setCommunitySettings] = useState({
    name: selected.name,
    description: selected.description,
    isPrivate: selected.priv,
    requireApproval: true,
    allowPosts: true,
  });

  function selectCommunity(c) {
    setSelected(c);
    setCommunitySettings({ name: c.name, description: c.description, isPrivate: c.priv, requireApproval: true, allowPosts: true });
  }

  const visibleMembers = (members[selected.id] || []).filter(
    (m) => m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.role.toLowerCase().includes(memberSearch.toLowerCase())
  );

  function removeMember(memberId) {
    setMembers((prev) => ({
      ...prev,
      [selected.id]: prev[selected.id].filter((m) => m.id !== memberId),
    }));
    showToast('Member removed');
  }

  function toggleSuspend(memberId) {
    setMembers((prev) => ({
      ...prev,
      [selected.id]: prev[selected.id].map((m) =>
        m.id === memberId ? { ...m, status: m.status === 'active' ? 'suspended' : 'active' } : m
      ),
    }));
  }

  function postAnnouncement() {
    if (!newAnnouncement.trim()) return;
    const now = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    setAnnouncements((prev) => [
      { id: Date.now(), text: newAnnouncement.trim(), time: now, pinned: false },
      ...prev,
    ]);
    setNewAnnouncement('');
    showToast('Announcement posted');
  }

  function deleteAnnouncement(id) {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  }

  function togglePin(id) {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, pinned: !a.pinned } : a))
    );
  }

  function saveSettings(e) {
    e.preventDefault();
    showToast('Community settings saved');
  }

  return (
    <div className="container" style={{ paddingTop: 44, paddingBottom: 70 }}>
      <div className="eyebrow">Community Manager</div>
      <h2 style={{ fontSize: 26, margin: '8px 0 4px' }}>Manage My Community</h2>
      <p className="text-muted" style={{ fontSize: 14, marginBottom: 32 }}>
        Oversee members, post announcements, and configure your community.
      </p>

      {/* Community selector */}
      <div className="attendee-event-row" style={{ marginBottom: 28 }}>
        {MY_COMMUNITIES.map((c) => (
          <button
            key={c.id}
            className={`attendee-event-card${selected.id === c.id ? ' active' : ''}`}
            onClick={() => selectCommunity(c)}
          >
            <div className="aec-banner" style={{ background: 'linear-gradient(135deg,#26314f,#3d557a)', fontSize: 26 }}>{c.emoji}</div>
            <div className="aec-body">
              <div className="aec-title">{c.name}</div>
              <div className="aec-count">{c.members.toLocaleString()} members</div>
            </div>
          </button>
        ))}
      </div>

      {/* Tab bar */}
      <div className="mod-tabs" style={{ marginBottom: 20 }}>
        {TABS.map((t) => (
          <button key={t} className={`mod-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Members tab ── */}
      {tab === 'members' && (
        <div className="panel">
          <div className="panel-head">
            <h3>Members ({(members[selected.id] || []).length})</h3>
          </div>
          <div className="search-box" style={{ marginBottom: 16, maxWidth: 340 }}>
            <span>🔍</span>
            <input type="text" placeholder="Search members…" value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)} />
            {memberSearch && <button className="search-clear" onClick={() => setMemberSearch('')}>✕</button>}
          </div>
          <div className="invite-list">
            {visibleMembers.length === 0 && (
              <p className="text-muted" style={{ fontSize: 13, padding: '12px 0' }}>No members found.</p>
            )}
            {visibleMembers.map((m) => (
              <div key={m.id} className={`invite-row${m.status === 'suspended' ? ' invite-done' : ''}`}>
                <div className="inv-avatar">{m.name[0]}</div>
                <div className="inv-info">
                  <div className="inv-name">{m.name}</div>
                  <div className="inv-meta">{m.role} · Joined {m.joined}</div>
                  {m.status === 'suspended' && (
                    <span className="invite-status-badge" style={{ background: 'rgba(255,107,74,0.1)', color: '#FF9E8A', border: '1px solid rgba(255,107,74,0.2)', marginTop: 4, display: 'inline-block' }}>
                      Suspended
                    </span>
                  )}
                </div>
                <div className="inv-actions">
                  <button
                    className={`btn btn-sm ${m.status === 'suspended' ? 'rsvp-btn' : 'btn-subtle'}`}
                    onClick={() => toggleSuspend(m.id)}
                  >
                    {m.status === 'suspended' ? 'Reinstate' : 'Suspend'}
                  </button>
                  <button className="btn btn-subtle btn-sm" onClick={() => removeMember(m.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Announcements tab ── */}
      {tab === 'announcements' && (
        <div className="panel">
          <div className="panel-head"><h3>Announcements</h3></div>
          <div className="field" style={{ marginBottom: 12 }}>
            <label>New announcement</label>
            <textarea className="profile-textarea" rows={3}
              placeholder="Write something for all community members…"
              value={newAnnouncement} onChange={(e) => setNewAnnouncement(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-sm" onClick={postAnnouncement} disabled={!newAnnouncement.trim()}>
            Post announcement
          </button>

          <div className="mod-list" style={{ marginTop: 24 }}>
            {announcements.map((a) => (
              <div key={a.id} className={`mod-row${a.pinned ? ' announcement-pinned' : ''}`}>
                <div className="mod-row-head">
                  {a.pinned && <span style={{ fontSize: 12, color: 'var(--amber)' }}>📌 Pinned</span>}
                  <span className="mod-time" style={{ marginLeft: a.pinned ? 0 : 'auto' }}>{a.time}</span>
                </div>
                <p className="mod-excerpt" style={{ marginBottom: 8 }}>{a.text}</p>
                <div className="mod-actions">
                  <button className="btn btn-subtle btn-sm" onClick={() => togglePin(a.id)}>
                    {a.pinned ? 'Unpin' : 'Pin'}
                  </button>
                  <button className="btn btn-subtle btn-sm" onClick={() => deleteAnnouncement(a.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Settings tab ── */}
      {tab === 'settings' && (
        <form className="panel" onSubmit={saveSettings}>
          <div className="panel-head"><h3>Community settings</h3></div>

          <div className="field">
            <label>Community name</label>
            <input type="text" value={communitySettings.name}
              onChange={(e) => setCommunitySettings((s) => ({ ...s, name: e.target.value }))} />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea className="profile-textarea" rows={3} value={communitySettings.description}
              onChange={(e) => setCommunitySettings((s) => ({ ...s, description: e.target.value }))} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, margin: '20px 0' }}>
            {[
              { key: 'isPrivate', label: 'Private community (invite only)' },
              { key: 'requireApproval', label: 'Require approval to join' },
              { key: 'allowPosts', label: 'Allow members to post' },
            ].map(({ key, label }) => (
              <label key={key} className="toggle-label">
                <input type="checkbox" checked={communitySettings[key]}
                  onChange={(e) => setCommunitySettings((s) => ({ ...s, [key]: e.target.checked }))} />
                <span className="toggle-check" />
                <span>{label}</span>
              </label>
            ))}
          </div>

          <button type="submit" className="btn btn-primary">Save settings</button>
        </form>
      )}
    </div>
  );
}
