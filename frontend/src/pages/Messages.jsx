import { useState } from 'react';

const MEMBERS = [
  { id: 1, name: 'Maya Chen', role: 'Organiser', avatar: '#FF6B4A', online: true, lastMsg: 'See you at the event!', time: '2m' },
  { id: 2, name: 'Arjun Patel', role: 'Member', avatar: '#9B8CFF', online: true, lastMsg: 'Thanks for the update.', time: '14m' },
  { id: 3, name: 'Priya Nair', role: 'Moderator', avatar: '#5FE0B7', online: false, lastMsg: 'I flagged that post.', time: '1h' },
  { id: 4, name: 'Sam Torres', role: 'Member', avatar: '#FFC857', online: false, lastMsg: 'Can we reschedule?', time: '3h' },
  { id: 5, name: 'Lena Fischer', role: 'Community Manager', avatar: '#FF6B4A', online: true, lastMsg: 'Announcement is live.', time: '1d' },
];

const THREAD_SEED = {
  1: [
    { from: 'them', text: 'Hey! Are you coming to Sunset Jazz Night?', time: '6:10 PM' },
    { from: 'me', text: 'Yes, just RSVP\'d! Super excited.', time: '6:12 PM' },
    { from: 'them', text: 'See you at the event!', time: '6:14 PM' },
  ],
  2: [
    { from: 'them', text: 'The new community guidelines are out.', time: '3:05 PM' },
    { from: 'me', text: 'Got it, I\'ll read through them.', time: '3:20 PM' },
    { from: 'them', text: 'Thanks for the update.', time: '3:22 PM' },
  ],
  3: [
    { from: 'them', text: 'I flagged that post.', time: 'Yesterday' },
  ],
  4: [
    { from: 'them', text: 'Can we reschedule the meetup?', time: 'Monday' },
  ],
  5: [
    { from: 'them', text: 'Announcement is live on the feed.', time: 'Sunday' },
  ],
};

export default function Messages() {
  const [selected, setSelected] = useState(MEMBERS[0]);
  const [threads, setThreads] = useState(THREAD_SEED);
  const [draft, setDraft] = useState('');
  const [memberSearch, setMemberSearch] = useState('');

  const filteredMembers = MEMBERS.filter((m) =>
    m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.role.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const currentThread = threads[selected.id] || [];

  function sendMessage() {
    if (!draft.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setThreads((prev) => ({
      ...prev,
      [selected.id]: [...(prev[selected.id] || []), { from: 'me', text: draft.trim(), time: now }],
    }));
    setDraft('');
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  return (
    <div className="container" style={{ paddingTop: 44, paddingBottom: 70 }}>
      <div className="eyebrow">Community</div>
      <h2 style={{ fontSize: 26, margin: '8px 0 28px' }}>Messages</h2>

      <div className="messages-layout">
        {/* ── Member list ── */}
        <div className="msg-sidebar panel">
          <div className="search-box" style={{ marginBottom: 14 }}>
            <span>🔍</span>
            <input type="text" placeholder="Search members…"
              value={memberSearch} onChange={(e) => setMemberSearch(e.target.value)} />
          </div>
          <div className="msg-member-list">
            {filteredMembers.map((m) => (
              <button
                key={m.id}
                className={`msg-member-row${selected.id === m.id ? ' active' : ''}`}
                onClick={() => setSelected(m)}
              >
                <div className="msg-avatar" style={{ background: `linear-gradient(135deg, ${m.avatar}, #1D2040)` }}>
                  {m.name[0]}
                  {m.online && <span className="online-dot" />}
                </div>
                <div className="msg-member-info">
                  <div className="msg-member-name">{m.name}</div>
                  <div className="msg-last">{m.lastMsg}</div>
                </div>
                <div className="msg-time">{m.time}</div>
              </button>
            ))}
            {filteredMembers.length === 0 && (
              <p className="text-muted" style={{ fontSize: 13, padding: '16px 8px' }}>No members found.</p>
            )}
          </div>
        </div>

        {/* ── Thread ── */}
        <div className="msg-thread-wrap panel">
          <div className="msg-thread-head">
            <div className="msg-avatar" style={{ background: `linear-gradient(135deg, ${selected.avatar}, #1D2040)`, width: 36, height: 36, fontSize: 14 }}>
              {selected.name[0]}
              {selected.online && <span className="online-dot" />}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{selected.name}</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-dim)' }}>
                {selected.role} · {selected.online ? '🟢 Online' : '⚫ Offline'}
              </div>
            </div>
          </div>

          <div className="msg-thread">
            {currentThread.length === 0 && (
              <p className="text-muted" style={{ fontSize: 13, textAlign: 'center', padding: '40px 0' }}>
                No messages yet. Say hi!
              </p>
            )}
            {currentThread.map((msg, i) => (
              <div key={i} className={`msg-bubble-wrap ${msg.from === 'me' ? 'me' : 'them'}`}>
                <div className={`msg-bubble ${msg.from === 'me' ? 'bubble-me' : 'bubble-them'}`}>
                  {msg.text}
                </div>
                <div className="msg-bubble-time">{msg.time}</div>
              </div>
            ))}
          </div>

          <div className="msg-compose">
            <textarea
              className="msg-input"
              rows={2}
              placeholder={`Message ${selected.name}…`}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKey}
            />
            <button className="btn btn-primary btn-sm msg-send" onClick={sendMessage} disabled={!draft.trim()}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
