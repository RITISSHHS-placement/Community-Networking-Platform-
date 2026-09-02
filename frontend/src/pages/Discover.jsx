import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { events as rawEvents, communities as rawCommunities, categories, loadDiscoverData } from '../data/mockData';

// ── Static mock data for the three panels ─────────────────────────────────────

const FLAGGED_POSTS = [
  { id: 1, author: 'Anonymous', community: 'Design Circle', time: '2h ago', excerpt: 'This post was flagged for inappropriate language by 3 members.', severity: 'high', status: 'pending' },
  { id: 2, author: 'user_4821', community: 'AI Builders', time: '5h ago', excerpt: 'Suspected spam link shared in the general channel.', severity: 'medium', status: 'pending' },
  { id: 3, author: 'Maya Chen', community: 'Founders Collective', time: '1d ago', excerpt: 'Off-topic promotional content reported by moderator.', severity: 'low', status: 'resolved' },
  { id: 4, author: 'user_7734', community: 'Trail Runners Club', time: '2d ago', excerpt: 'Harassment complaint submitted against this member.', severity: 'high', status: 'pending' },
];

const ANALYTICS_STATS = [
  { label: 'Total RSVPs this week', val: '1,284', delta: '+18%', up: true, icon: '🎟️', color: 'coral' },
  { label: 'New members joined', val: '342', delta: '+9%', up: true, icon: '👥', color: 'violet' },
  { label: 'Posts published', val: '87', delta: '-4%', up: false, icon: '📝', color: 'amber' },
  { label: 'Active communities', val: '24', delta: '+2', up: true, icon: '🏘️', color: 'mint' },
];

const TOP_EVENTS_ANALYTICS = [
  { title: 'Sunset Jazz Night', rsvps: 312, capacity: 400, rate: 78 },
  { title: 'AI Builders Hack Night', rsvps: 289, capacity: 300, rate: 96 },
  { title: 'Street Food Crawl', rsvps: 201, capacity: 250, rate: 80 },
  { title: 'React & Beyond Workshop', rsvps: 145, capacity: 200, rate: 73 },
];

const INVITE_REQUESTS = [
  { id: 1, name: 'Arjun Patel', email: 'arjun@example.com', community: 'Founders Collective', role: 'Member', time: '1h ago', status: 'pending' },
  { id: 2, name: 'Priya Nair', email: 'priya@example.com', community: 'AI Builders', role: 'Member', time: '3h ago', status: 'pending' },
  { id: 3, name: 'Sam Torres', email: 'sam@example.com', community: 'Design Circle', role: 'Moderator', time: '6h ago', status: 'pending' },
  { id: 4, name: 'Lena Fischer', email: 'lena@example.com', community: 'Trail Runners Club', role: 'Member', time: '1d ago', status: 'approved' },
];

const focusOptions = ['events', 'communities', 'moderation', 'analytics', 'users'];

export default function Discover() {
  const location = useLocation();

  // Toolbar state
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [dist, setDist] = useState(15);
  const [sort, setSort] = useState('nearest');
  const [focus, setFocus] = useState(new URLSearchParams(location.search).get('focus') || 'events');

  // View toggle: 'grid' | 'list'
  const [viewMode, setViewMode] = useState('grid');

  // RSVP'd event ids (index-based for mock data)
  const [rsvped, setRsvped] = useState(new Set());

  // Expanded event index (detail expand)
  const [expandedIdx, setExpandedIdx] = useState(null);

  // Joined community indices
  const [joined, setJoined] = useState(new Set());

  // Local copy of communities so we can bump member counts
  const [communityList, setCommunityList] = useState([...rawCommunities]);

  // ── Moderation panel state ────────────────────────────────────────────────
  const [flaggedPosts, setFlaggedPosts] = useState(FLAGGED_POSTS);
  const [modFilter, setModFilter] = useState('all'); // 'all' | 'pending' | 'resolved'

  // ── Analytics panel state ─────────────────────────────────────────────────
  const [analyticsTab, setAnalyticsTab] = useState('overview'); // 'overview' | 'events' | 'members'

  // ── Users panel state ─────────────────────────────────────────────────────
  const [invites, setInvites] = useState(INVITE_REQUESTS);
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    const nextFocus = new URLSearchParams(location.search).get('focus') || 'events';
    setFocus(nextFocus);
  }, [location.search]);

  useEffect(() => {
    loadDiscoverData().then(() => {
      setCommunityList([...rawCommunities]);
    });
  }, []);

  useEffect(() => {
    const node = document.getElementById(focus);
    if (node) node.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [focus]);

  // ── Filtered + sorted event list ──────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = rawEvents
      .map((ev, i) => ({ ...ev, _idx: i }))
      .filter(
        (ev) =>
          (category === 'All' || ev.cat === category) &&
          ev.dist <= dist &&
          (search === '' || ev.title.toLowerCase().includes(search.toLowerCase()))
      );
    if (sort === 'nearest')  list = [...list].sort((a, b) => a.dist - b.dist);
    if (sort === 'soonest')  list = [...list].sort((a, b) => a.date.localeCompare(b.date));
    if (sort === 'popular')  list = [...list].sort((a, b) => b.popularity - a.popularity);
    return list;
  }, [category, search, dist, sort]);

  // ── Active filter count for summary badge ─────────────────────────────────
  const activeFilterCount = (category !== 'All' ? 1 : 0) + (search !== '' ? 1 : 0) + (dist < 50 ? 1 : 0);

  function resetFilters() {
    setCategory('All');
    setSearch('');
    setDist(15);
    setSort('nearest');
  }

  // ── RSVP toggle ───────────────────────────────────────────────────────────
  function toggleRsvp(idx) {
    setRsvped((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  }

  // ── Expand / collapse event card ──────────────────────────────────────────
  function toggleExpand(idx) {
    setExpandedIdx((prev) => (prev === idx ? null : idx));
  }

  // ── Community join toggle (bumps member count) ────────────────────────────
  function toggleJoin(i) {
    setJoined((prev) => {
      const next = new Set(prev);
      const wasJoined = next.has(i);
      wasJoined ? next.delete(i) : next.add(i);

      setCommunityList((cl) =>
        cl.map((c, idx) => {
          if (idx !== i) return c;
          const base = parseInt(c.members.replace(/,/g, ''), 10) || 0;
          const bumped = wasJoined ? base - 1 : base + 1;
          return { ...c, members: bumped.toLocaleString() };
        })
      );

      return next;
    });
  }

  // ── Moderation actions ────────────────────────────────────────────────────
  function resolvePost(id) {
    setFlaggedPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'resolved' } : p))
    );
  }
  function dismissPost(id) {
    setFlaggedPosts((prev) => prev.filter((p) => p.id !== id));
  }

  const visibleFlags = flaggedPosts.filter(
    (p) => modFilter === 'all' || p.status === modFilter
  );

  // ── User invite actions ───────────────────────────────────────────────────
  function updateInvite(id, status) {
    setInvites((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status } : inv))
    );
  }

  const visibleInvites = invites.filter(
    (inv) =>
      userSearch === '' ||
      inv.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      inv.community.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div>
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="container discover-head">
        <div className="eyebrow">Geo-location discovery</div>
        <h2 style={{ fontSize: 28, margin: '8px 0 4px' }}>What's happening near Coimbatore</h2>
        <p className="text-muted" style={{ fontSize: 14 }}>
          Filter by category, distance, or search — updates instantly.
        </p>
      </div>

      <div className="container">

        {/* ── Toolbar ──────────────────────────────────────────────────── */}
        <div className="discover-toolbar">
          <div className="search-box">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search events, communities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear search">
                ✕
              </button>
            )}
          </div>

          <div className="dist-control">
            <span>Within</span>
            <input
              type="range"
              min="1"
              max="50"
              value={dist}
              onChange={(e) => setDist(parseInt(e.target.value, 10))}
            />
            <span>{dist} mi</span>
          </div>

          <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="nearest">Sort: Nearest</option>
            <option value="soonest">Sort: Soonest</option>
            <option value="popular">Sort: Most popular</option>
          </select>

          {/* View toggle */}
          <div className="view-toggle" role="group" aria-label="View mode">
            <button
              className={`view-btn${viewMode === 'grid' ? ' active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              title="Grid view"
            >
              ⊞
            </button>
            <button
              className={`view-btn${viewMode === 'list' ? ' active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
              title="List view"
            >
              ☰
            </button>
          </div>
        </div>

        {/* ── Category chips ───────────────────────────────────────────── */}
        <div className="chip-row">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`chip${category === cat ? ' active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          {focusOptions.map((option) => (
            <button
              key={option}
              className={`chip chip-section${focus === option ? ' active' : ''}`}
              onClick={() => setFocus(option)}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>

        {/* ── Result count + filter summary ────────────────────────────── */}
        <div className="result-summary">
          <span className="result-count">
            Showing <strong>{filtered.length}</strong> of <strong>{rawEvents.length}</strong> events
            {category !== 'All' && <span className="filter-pill">{category}</span>}
            {search && <span className="filter-pill">"{search}"</span>}
            {dist < 50 && <span className="filter-pill">≤ {dist} mi</span>}
          </span>
          {activeFilterCount > 0 && (
            <button className="btn btn-subtle btn-sm" onClick={resetFilters}>
              Clear {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}
            </button>
          )}
        </div>

        {/* ── Events ───────────────────────────────────────────────────── */}
        <div id="events">
          {filtered.length === 0 ? (
            <div className="empty-state show">
              <div className="e-emoji">🛰️</div>
              <h4>Nothing out here yet</h4>
              <p>No events match your filters within range. Try widening the distance or clearing a category.</p>
              <button className="btn btn-subtle" onClick={resetFilters}>
                Reset filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid view */
            <div className="event-grid">
              {filtered.map((ev) => {
                const isRsvped = rsvped.has(ev._idx);
                const isExpanded = expandedIdx === ev._idx;
                return (
                  <div className={`event-card${isExpanded ? ' expanded' : ''}`} key={ev._idx}>
                    <div
                      className="event-banner"
                      style={{ background: ev.grad, cursor: 'pointer' }}
                      onClick={() => toggleExpand(ev._idx)}
                      role="button"
                      aria-expanded={isExpanded}
                      aria-label={`${isExpanded ? 'Collapse' : 'Expand'} details for ${ev.title}`}
                    >
                      {ev.emoji}
                      <div className="dist-badge">{ev.dist} mi</div>
                      <div className="expand-hint">{isExpanded ? '▲ Less' : '▼ More'}</div>
                    </div>
                    <div className="event-body">
                      <div className="e-cat">{ev.cat}</div>
                      <h4>{ev.title}</h4>
                      <div className="event-meta">
                        <span>📅 {ev.date}</span>
                        <span className={`price-tag${ev.price === 0 ? ' price-free' : ''}`}>
                          {ev.price === 0 ? 'Free' : `₹${ev.price}`}
                        </span>
                      </div>

                      {/* Expanded detail */}
                      {isExpanded && (
                        <div className="event-detail">
                          <div className="event-detail-row">
                            <span>🔥</span>
                            <span>{ev.popularity} interested</span>
                          </div>
                          <div className="event-detail-row">
                            <span>📍</span>
                            <span>{ev.dist} mi from you · Coimbatore</span>
                          </div>
                          <div className="event-detail-row">
                            <span>🏷️</span>
                            <span>{ev.cat} event</span>
                          </div>
                        </div>
                      )}

                      <button
                        className={`btn btn-sm btn-block rsvp-btn${isRsvped ? ' rsvped' : ''}`}
                        style={{ marginTop: 12 }}
                        onClick={() => toggleRsvp(ev._idx)}
                      >
                        {isRsvped ? '✓ Going' : 'RSVP'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List view */
            <div className="event-list">
              {filtered.map((ev) => {
                const isRsvped = rsvped.has(ev._idx);
                const isExpanded = expandedIdx === ev._idx;
                return (
                  <div className={`event-list-row${isExpanded ? ' expanded' : ''}`} key={ev._idx}>
                    <div className="elr-banner" style={{ background: ev.grad }}>
                      {ev.emoji}
                    </div>
                    <div className="elr-body">
                      <div className="elr-top">
                        <div>
                          <span className="e-cat">{ev.cat}</span>
                          <h4 className="elr-title">{ev.title}</h4>
                        </div>
                        <div className="elr-right">
                          <span className="dist-badge" style={{ position: 'static' }}>{ev.dist} mi</span>
                          <span className={`price-tag${ev.price === 0 ? ' price-free' : ''}`}>
                            {ev.price === 0 ? 'Free' : `₹${ev.price}`}
                          </span>
                          <span className="elr-date">📅 {ev.date}</span>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="event-detail" style={{ marginTop: 10 }}>
                          <div className="event-detail-row"><span>🔥</span><span>{ev.popularity} interested</span></div>
                          <div className="event-detail-row"><span>📍</span><span>{ev.dist} mi · Coimbatore</span></div>
                        </div>
                      )}
                    </div>
                    <div className="elr-actions">
                      <button
                        className={`btn btn-sm rsvp-btn${isRsvped ? ' rsvped' : ''}`}
                        onClick={() => toggleRsvp(ev._idx)}
                      >
                        {isRsvped ? '✓ Going' : 'RSVP'}
                      </button>
                      <button
                        className="btn btn-subtle btn-sm"
                        onClick={() => toggleExpand(ev._idx)}
                      >
                        {isExpanded ? 'Less' : 'Details'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Communities ──────────────────────────────────────────────── */}
        <div id="communities">
          <div className="section-head" style={{ marginTop: 10 }}>
            <div className="eyebrow">Communities nearby</div>
            <h2 style={{ fontSize: 22 }}>Join the conversation</h2>
          </div>
          <div className="community-scroll">
            {communityList.map((c, i) => {
              const isJoined = joined.has(i);
              return (
                <div className={`community-card${isJoined ? ' joined' : ''}`} key={i}>
                  <div className="c-top">
                    <span style={{ fontSize: 22 }}>{c.emoji}</span>
                    <span className="priv-badge">{c.priv ? 'Private' : 'Public'}</span>
                  </div>
                  <h4>{c.name}</h4>
                  <p>
                    <span className="members-count">{c.members}</span> members
                    {isJoined && <span className="joined-dot"> · you're in</span>}
                  </p>
                  <button
                    className={`btn btn-sm${isJoined ? ' btn-joined' : ' btn-subtle'}`}
                    style={{ marginTop: 12, width: '100%' }}
                    onClick={() => toggleJoin(i)}
                  >
                    {isJoined ? '✓ Joined' : 'Join'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Moderation queue ─────────────────────────────────────────── */}
        <div id="moderation" className="panel discover-panel">
          <div className="panel-head">
            <h3>🚩 Moderation queue</h3>
            <span className="mod-badge">{flaggedPosts.filter((p) => p.status === 'pending').length} pending</span>
          </div>

          {/* Filter tabs */}
          <div className="mod-tabs">
            {['all', 'pending', 'resolved'].map((t) => (
              <button
                key={t}
                className={`mod-tab${modFilter === t ? ' active' : ''}`}
                onClick={() => setModFilter(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {visibleFlags.length === 0 ? (
            <p className="text-muted" style={{ fontSize: 13, padding: '16px 0' }}>
              No items in this view.
            </p>
          ) : (
            <div className="mod-list">
              {visibleFlags.map((post) => (
                <div className={`mod-row${post.status === 'resolved' ? ' mod-resolved' : ''}`} key={post.id}>
                  <div className="mod-row-head">
                    <span className={`severity-dot sev-${post.severity}`} title={post.severity} />
                    <span className="mod-author">{post.author}</span>
                    <span className="mod-community">in {post.community}</span>
                    <span className="mod-time">{post.time}</span>
                    {post.status === 'resolved' && <span className="filter-pill" style={{ marginLeft: 'auto' }}>Resolved</span>}
                  </div>
                  <p className="mod-excerpt">{post.excerpt}</p>
                  {post.status === 'pending' && (
                    <div className="mod-actions">
                      <button className="btn btn-sm rsvp-btn" onClick={() => resolvePost(post.id)}>
                        ✓ Resolve
                      </button>
                      <button className="btn btn-subtle btn-sm" onClick={() => dismissPost(post.id)}>
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Analytics ────────────────────────────────────────────────── */}
        <div id="analytics" className="panel discover-panel">
          <div className="panel-head">
            <h3>📊 Analytics</h3>
          </div>

          {/* Tab switcher */}
          <div className="mod-tabs" style={{ marginBottom: 20 }}>
            {['overview', 'events', 'members'].map((t) => (
              <button
                key={t}
                className={`mod-tab${analyticsTab === t ? ' active' : ''}`}
                onClick={() => setAnalyticsTab(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {analyticsTab === 'overview' && (
            <div className="analytics-kpi-grid">
              {ANALYTICS_STATS.map((s) => (
                <div className="analytics-kpi" key={s.label}>
                  <div className="ak-top">
                    <span className={`ak-icon ak-${s.color}`}>{s.icon}</span>
                    <span className={`k-trend ${s.up ? 'trend-up' : 'trend-down'}`}>{s.delta}</span>
                  </div>
                  <div className="ak-val">{s.val}</div>
                  <div className="ak-label">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {analyticsTab === 'events' && (
            <div className="analytics-table">
              <div className="at-header">
                <span>Event</span>
                <span>RSVPs</span>
                <span>Capacity</span>
                <span>Fill rate</span>
              </div>
              {TOP_EVENTS_ANALYTICS.map((ev) => (
                <div className="at-row" key={ev.title}>
                  <span className="at-name">{ev.title}</span>
                  <span>{ev.rsvps}</span>
                  <span>{ev.capacity}</span>
                  <span>
                    <div className="fill-bar-wrap">
                      <div
                        className="fill-bar"
                        style={{ width: `${ev.rate}%`, background: ev.rate >= 90 ? 'var(--mint)' : ev.rate >= 70 ? 'var(--amber)' : 'var(--coral)' }}
                      />
                    </div>
                    <span className="fill-pct">{ev.rate}%</span>
                  </span>
                </div>
              ))}
            </div>
          )}

          {analyticsTab === 'members' && (
            <div className="analytics-members">
              <div className="am-stat-row">
                <div className="am-stat">
                  <div className="am-val">18,420</div>
                  <div className="am-label">Total users</div>
                </div>
                <div className="am-stat">
                  <div className="am-val" style={{ color: 'var(--mint)' }}>+342</div>
                  <div className="am-label">Joined this week</div>
                </div>
                <div className="am-stat">
                  <div className="am-val" style={{ color: 'var(--amber)' }}>71%</div>
                  <div className="am-label">Avg engagement rate</div>
                </div>
                <div className="am-stat">
                  <div className="am-val" style={{ color: 'var(--violet)' }}>4.2</div>
                  <div className="am-label">Avg communities / user</div>
                </div>
              </div>
              <div className="am-bar-section">
                <p className="text-muted" style={{ fontSize: 12.5, marginBottom: 10 }}>Role breakdown</p>
                {[
                  { role: 'Member', pct: 68, color: 'var(--coral)' },
                  { role: 'Guest', pct: 16, color: 'var(--text-dim)' },
                  { role: 'Moderator', pct: 8, color: 'var(--violet)' },
                  { role: 'Event Organiser', pct: 5, color: 'var(--amber)' },
                  { role: 'Community Manager', pct: 3, color: 'var(--mint)' },
                ].map((r) => (
                  <div className="am-role-row" key={r.role}>
                    <span className="am-role-label">{r.role}</span>
                    <div className="fill-bar-wrap" style={{ flex: 1 }}>
                      <div className="fill-bar" style={{ width: `${r.pct}%`, background: r.color }} />
                    </div>
                    <span className="fill-pct">{r.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── User operations ──────────────────────────────────────────── */}
        <div id="users" className="panel discover-panel">
          <div className="panel-head">
            <h3>👤 User operations</h3>
            <span className="mod-badge">{invites.filter((i) => i.status === 'pending').length} pending</span>
          </div>

          {/* Search */}
          <div className="search-box" style={{ marginBottom: 16, maxWidth: 320 }}>
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search by name or community..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
            {userSearch && (
              <button className="search-clear" onClick={() => setUserSearch('')} aria-label="Clear">✕</button>
            )}
          </div>

          {visibleInvites.length === 0 ? (
            <p className="text-muted" style={{ fontSize: 13, padding: '16px 0' }}>No requests match your search.</p>
          ) : (
            <div className="invite-list">
              {visibleInvites.map((inv) => (
                <div className={`invite-row${inv.status !== 'pending' ? ' invite-done' : ''}`} key={inv.id}>
                  <div className="inv-avatar">{inv.name.charAt(0)}</div>
                  <div className="inv-info">
                    <div className="inv-name">{inv.name}</div>
                    <div className="inv-meta">{inv.email} · {inv.community} · {inv.role}</div>
                    <div className="inv-time">{inv.time}</div>
                  </div>
                  <div className="inv-actions">
                    {inv.status === 'pending' ? (
                      <>
                        <button className="btn btn-sm rsvp-btn" onClick={() => updateInvite(inv.id, 'approved')}>
                          ✓ Approve
                        </button>
                        <button className="btn btn-subtle btn-sm" onClick={() => updateInvite(inv.id, 'rejected')}>
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className={`invite-status-badge status-${inv.status}`}>
                        {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
