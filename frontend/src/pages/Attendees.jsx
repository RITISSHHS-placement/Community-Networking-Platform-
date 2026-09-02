import { useState } from 'react';

const MY_EVENTS = [
  { id: 1, title: 'Sunset Jazz Night', date: 'Jul 12', emoji: '🎷', grad: 'linear-gradient(135deg,#3a1f3d,#7a2f3f)', capacity: 400 },
  { id: 2, title: 'React & Beyond Workshop', date: 'Jul 18', emoji: '💻', grad: 'linear-gradient(135deg,#1f2f3d,#2f5a5a)', capacity: 200 },
  { id: 3, title: 'Startup Pitch Night', date: 'Jul 14', emoji: '🚀', grad: 'linear-gradient(135deg,#26314f,#3d557a)', capacity: 150 },
];

const SEED_ATTENDEES = {
  1: [
    { id: 1, name: 'Maya Chen', email: 'maya@example.com', ticket: 'VIP', checkedIn: true, rsvpDate: 'Jun 28' },
    { id: 2, name: 'Arjun Patel', email: 'arjun@example.com', ticket: 'General', checkedIn: false, rsvpDate: 'Jun 30' },
    { id: 3, name: 'Priya Nair', email: 'priya@example.com', ticket: 'General', checkedIn: true, rsvpDate: 'Jul 1' },
    { id: 4, name: 'Sam Torres', email: 'sam@example.com', ticket: 'General', checkedIn: false, rsvpDate: 'Jul 3' },
    { id: 5, name: 'Lena Fischer', email: 'lena@example.com', ticket: 'VIP', checkedIn: false, rsvpDate: 'Jul 5' },
  ],
  2: [
    { id: 1, name: 'Dev Sharma', email: 'dev@example.com', ticket: 'General', checkedIn: false, rsvpDate: 'Jul 2' },
    { id: 2, name: 'Aiko Tanaka', email: 'aiko@example.com', ticket: 'General', checkedIn: false, rsvpDate: 'Jul 4' },
    { id: 3, name: 'Carlos Ruiz', email: 'carlos@example.com', ticket: 'General', checkedIn: true, rsvpDate: 'Jul 6' },
  ],
  3: [
    { id: 1, name: 'Fatima Al-Rashid', email: 'fatima@example.com', ticket: 'Investor', checkedIn: false, rsvpDate: 'Jul 5' },
    { id: 2, name: 'Noah Williams', email: 'noah@example.com', ticket: 'General', checkedIn: false, rsvpDate: 'Jul 7' },
  ],
};

export default function Attendees() {
  const [selectedEvent, setSelectedEvent] = useState(MY_EVENTS[0]);
  const [attendees, setAttendees] = useState(SEED_ATTENDEES);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'checked-in' | 'pending'

  const list = (attendees[selectedEvent.id] || [])
    .filter((a) => {
      const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'all' ||
        (filter === 'checked-in' && a.checkedIn) ||
        (filter === 'pending' && !a.checkedIn);
      return matchSearch && matchFilter;
    });

  const checkedInCount = (attendees[selectedEvent.id] || []).filter((a) => a.checkedIn).length;
  const totalCount = (attendees[selectedEvent.id] || []).length;

  function toggleCheckIn(eventId, attendeeId) {
    setAttendees((prev) => ({
      ...prev,
      [eventId]: prev[eventId].map((a) =>
        a.id === attendeeId ? { ...a, checkedIn: !a.checkedIn } : a
      ),
    }));
  }

  return (
    <div className="container" style={{ paddingTop: 44, paddingBottom: 70 }}>
      <div className="eyebrow">Events</div>
      <h2 style={{ fontSize: 26, margin: '8px 0 4px' }}>Manage Attendees</h2>
      <p className="text-muted" style={{ fontSize: 14, marginBottom: 32 }}>
        Track RSVPs and manage check-ins for your events.
      </p>

      {/* Event selector */}
      <div className="attendee-event-row">
        {MY_EVENTS.map((ev) => (
          <button
            key={ev.id}
            className={`attendee-event-card${selectedEvent.id === ev.id ? ' active' : ''}`}
            onClick={() => setSelectedEvent(ev)}
          >
            <div className="aec-banner" style={{ background: ev.grad }}>{ev.emoji}</div>
            <div className="aec-body">
              <div className="aec-title">{ev.title}</div>
              <div className="aec-date">📅 {ev.date}</div>
              <div className="aec-count">
                {(SEED_ATTENDEES[ev.id] || []).length} / {ev.capacity} RSVPs
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Stats bar */}
      <div className="attendee-stats panel" style={{ marginBottom: 20 }}>
        <div className="att-stat">
          <div className="att-stat-val">{totalCount}</div>
          <div className="att-stat-label">Total RSVPs</div>
        </div>
        <div className="att-stat">
          <div className="att-stat-val" style={{ color: 'var(--mint)' }}>{checkedInCount}</div>
          <div className="att-stat-label">Checked in</div>
        </div>
        <div className="att-stat">
          <div className="att-stat-val" style={{ color: 'var(--amber)' }}>{totalCount - checkedInCount}</div>
          <div className="att-stat-label">Pending</div>
        </div>
        <div className="att-stat">
          <div className="att-stat-val" style={{ color: 'var(--violet)' }}>
            {totalCount ? Math.round((checkedInCount / totalCount) * 100) : 0}%
          </div>
          <div className="att-stat-label">Check-in rate</div>
        </div>
        <div className="fill-bar-wrap" style={{ flex: 1, alignSelf: 'center', minWidth: 80 }}>
          <div
            className="fill-bar"
            style={{
              width: `${totalCount ? (checkedInCount / totalCount) * 100 : 0}%`,
              background: 'var(--mint)',
            }}
          />
        </div>
      </div>

      {/* Toolbar */}
      <div className="attendee-toolbar">
        <div className="search-box" style={{ flex: 1, maxWidth: 360 }}>
          <span>🔍</span>
          <input type="text" placeholder="Search by name or email…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>
        <div className="mod-tabs">
          {['all', 'checked-in', 'pending'].map((f) => (
            <button key={f} className={`mod-tab${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : f === 'checked-in' ? '✓ Checked in' : '⏳ Pending'}
            </button>
          ))}
        </div>
      </div>

      {/* Attendee table */}
      <div className="panel" style={{ marginTop: 16 }}>
        <div className="att-table-head">
          <span>Attendee</span>
          <span>Ticket</span>
          <span>RSVP date</span>
          <span>Status</span>
          <span>Action</span>
        </div>
        {list.length === 0 ? (
          <p className="text-muted" style={{ fontSize: 13, padding: '20px 0', textAlign: 'center' }}>
            No attendees match your search.
          </p>
        ) : (
          list.map((a) => (
            <div className="att-table-row" key={a.id}>
              <div className="att-person">
                <div className="inv-avatar" style={{ width: 32, height: 32, fontSize: 13 }}>{a.name[0]}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>{a.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-dim)' }}>{a.email}</div>
                </div>
              </div>
              <span className="att-ticket">{a.ticket}</span>
              <span style={{ fontSize: 12.5, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{a.rsvpDate}</span>
              <span>
                {a.checkedIn
                  ? <span className="invite-status-badge status-approved">Checked in</span>
                  : <span className="invite-status-badge" style={{ background: 'rgba(255,200,87,0.1)', color: 'var(--amber)', border: '1px solid rgba(255,200,87,0.25)' }}>Pending</span>
                }
              </span>
              <button
                className={`btn btn-sm ${a.checkedIn ? 'btn-subtle' : 'rsvp-btn'}`}
                onClick={() => toggleCheckIn(selectedEvent.id, a.id)}
              >
                {a.checkedIn ? 'Undo' : 'Check in'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
