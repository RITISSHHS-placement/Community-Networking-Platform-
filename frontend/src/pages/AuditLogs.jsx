import { useMemo, useState } from 'react';

const ACTOR_TYPES = ['All', 'Admin', 'Moderator', 'System'];
const ACTION_TYPES = ['All', 'User', 'Community', 'Event', 'Content', 'Security'];

const RAW_LOGS = [
  { id: 1, time: '2026-09-02 14:32:10', actor: 'admin@platform.com', actorType: 'Admin', action: 'User account suspended', target: 'user_4821', category: 'User', severity: 'high' },
  { id: 2, time: '2026-09-02 13:18:44', actor: 'system', actorType: 'System', action: 'Auto-flagged post for review', target: 'post #3812', category: 'Content', severity: 'medium' },
  { id: 3, time: '2026-09-02 11:05:02', actor: 'priya@example.com', actorType: 'Moderator', action: 'Post removed', target: 'post #3798', category: 'Content', severity: 'medium' },
  { id: 4, time: '2026-09-02 10:47:30', actor: 'admin@platform.com', actorType: 'Admin', action: 'Community created', target: 'Street Food Explorers', category: 'Community', severity: 'low' },
  { id: 5, time: '2026-09-01 22:11:55', actor: 'system', actorType: 'System', action: 'Failed login attempt (5x)', target: 'user_7734', category: 'Security', severity: 'high' },
  { id: 6, time: '2026-09-01 19:30:00', actor: 'admin@platform.com', actorType: 'Admin', action: 'Event bulk import', target: '12 events added', category: 'Event', severity: 'low' },
  { id: 7, time: '2026-09-01 16:02:17', actor: 'priya@example.com', actorType: 'Moderator', action: 'Member banned from community', target: 'Design Circle', category: 'Community', severity: 'high' },
  { id: 8, time: '2026-09-01 14:55:00', actor: 'system', actorType: 'System', action: 'Password reset email sent', target: 'lena@example.com', category: 'Security', severity: 'low' },
  { id: 9, time: '2026-09-01 11:20:40', actor: 'admin@platform.com', actorType: 'Admin', action: 'Role changed: Member → Moderator', target: 'arjun@example.com', category: 'User', severity: 'medium' },
  { id: 10, time: '2026-08-31 23:00:00', actor: 'system', actorType: 'System', action: 'Scheduled backup completed', target: 'DB snapshot v2026-08-31', category: 'Security', severity: 'low' },
  { id: 11, time: '2026-08-31 18:14:22', actor: 'admin@platform.com', actorType: 'Admin', action: 'Community deleted', target: 'Old Test Group', category: 'Community', severity: 'high' },
  { id: 12, time: '2026-08-31 15:09:03', actor: 'priya@example.com', actorType: 'Moderator', action: 'Flagged post resolved', target: 'post #3781', category: 'Content', severity: 'low' },
];

const SEV_COLOR = { high: 'var(--coral)', medium: 'var(--amber)', low: 'var(--text-dim)' };
const SEV_BG   = { high: 'rgba(255,107,74,0.1)', medium: 'rgba(255,200,87,0.1)', low: 'rgba(255,255,255,0.04)' };

export default function AuditLogs() {
  const [search, setSearch] = useState('');
  const [actorFilter, setActorFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  const filtered = useMemo(() => {
    return RAW_LOGS.filter((l) => {
      const q = search.toLowerCase();
      const matchSearch = !q || l.action.toLowerCase().includes(q) ||
        l.actor.toLowerCase().includes(q) || l.target.toLowerCase().includes(q);
      const matchActor    = actorFilter === 'All'    || l.actorType === actorFilter;
      const matchCategory = categoryFilter === 'All' || l.category === categoryFilter;
      const matchSeverity = severityFilter === 'All' || l.severity === severityFilter;
      return matchSearch && matchActor && matchCategory && matchSeverity;
    });
  }, [search, actorFilter, categoryFilter, severityFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function resetFilters() {
    setSearch(''); setActorFilter('All'); setCategoryFilter('All'); setSeverityFilter('All'); setPage(1);
  }

  const activeFilters = (search ? 1 : 0) + (actorFilter !== 'All' ? 1 : 0) +
    (categoryFilter !== 'All' ? 1 : 0) + (severityFilter !== 'All' ? 1 : 0);

  return (
    <div className="container" style={{ paddingTop: 44, paddingBottom: 70 }}>
      <div className="eyebrow">Admin</div>
      <h2 style={{ fontSize: 26, margin: '8px 0 4px' }}>Audit Logs</h2>
      <p className="text-muted" style={{ fontSize: 14, marginBottom: 32 }}>
        A timestamped record of all admin, moderator, and system actions on the platform.
      </p>

      {/* Toolbar */}
      <div className="discover-toolbar" style={{ marginBottom: 20 }}>
        <div className="search-box" style={{ flex: 1 }}>
          <span>🔍</span>
          <input type="text" placeholder="Search actions, actors, targets…"
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          {search && <button className="search-clear" onClick={() => { setSearch(''); setPage(1); }}>✕</button>}
        </div>
        <select className="sort-select" value={actorFilter}
          onChange={(e) => { setActorFilter(e.target.value); setPage(1); }}>
          {ACTOR_TYPES.map((t) => <option key={t}>{t === 'All' ? 'Actor: All' : t}</option>)}
        </select>
        <select className="sort-select" value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}>
          {ACTION_TYPES.map((t) => <option key={t}>{t === 'All' ? 'Category: All' : t}</option>)}
        </select>
        <select className="sort-select" value={severityFilter}
          onChange={(e) => { setSeverityFilter(e.target.value); setPage(1); }}>
          {['All', 'high', 'medium', 'low'].map((t) => (
            <option key={t} value={t}>{t === 'All' ? 'Severity: All' : t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Filter summary */}
      <div className="result-summary" style={{ marginBottom: 16 }}>
        <span>Showing <strong>{filtered.length}</strong> of <strong>{RAW_LOGS.length}</strong> entries</span>
        {activeFilters > 0 && (
          <button className="btn btn-subtle btn-sm" onClick={resetFilters}>
            Clear {activeFilters} filter{activeFilters > 1 ? 's' : ''}
          </button>
        )}
      </div>

      {/* Log table */}
      <div className="panel">
        <div className="audit-table-head">
          <span>Timestamp</span>
          <span>Actor</span>
          <span>Action</span>
          <span>Target</span>
          <span>Severity</span>
        </div>

        {pageItems.length === 0 ? (
          <p className="text-muted" style={{ fontSize: 13, padding: '24px 0', textAlign: 'center' }}>
            No log entries match your filters.
          </p>
        ) : (
          pageItems.map((log) => (
            <div key={log.id}>
              <div
                className="audit-table-row"
                style={{ cursor: 'pointer' }}
                onClick={() => setExpanded(expanded === log.id ? null : log.id)}
              >
                <span className="audit-time">{log.time}</span>
                <span className="audit-actor">
                  <span className={`priv-badge`} style={{ background: SEV_BG[log.severity], color: SEV_COLOR[log.severity], border: `1px solid ${SEV_COLOR[log.severity]}22` }}>
                    {log.actorType}
                  </span>
                  <span style={{ marginLeft: 6, fontSize: 12.5 }}>{log.actor}</span>
                </span>
                <span className="audit-action">{log.action}</span>
                <span className="audit-target">{log.target}</span>
                <span>
                  <span className="severity-dot" style={{ background: SEV_COLOR[log.severity], display: 'inline-block', verticalAlign: 'middle', marginRight: 6 }} />
                  <span style={{ fontSize: 12.5, color: SEV_COLOR[log.severity], textTransform: 'capitalize' }}>{log.severity}</span>
                </span>
              </div>
              {expanded === log.id && (
                <div className="audit-detail">
                  <div className="event-detail-row"><span>🕐</span><span>Full timestamp: {log.time}</span></div>
                  <div className="event-detail-row"><span>👤</span><span>Actor: {log.actor} ({log.actorType})</span></div>
                  <div className="event-detail-row"><span>⚡</span><span>Action: {log.action}</span></div>
                  <div className="event-detail-row"><span>🎯</span><span>Target: {log.target}</span></div>
                  <div className="event-detail-row"><span>🏷️</span><span>Category: {log.category}</span></div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="audit-pagination">
          <button className="btn btn-subtle btn-sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            ← Prev
          </button>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Page {page} of {totalPages}</span>
          <button className="btn btn-subtle btn-sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
