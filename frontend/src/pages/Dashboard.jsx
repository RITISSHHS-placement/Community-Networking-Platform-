import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { roleData, activity, feedPosts } from '../data/mockData';

const roleKeys = ['member', 'moderator', 'organiser', 'manager', 'admin'];
const roleKeyMap = {
  Member: 'member',
  Moderator: 'moderator',
  'Event Organiser': 'organiser',
  'Community Manager': 'manager',
  Admin: 'admin',
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState(roleKeyMap[user?.role] || 'member');

  useEffect(() => {
    const nextRole = roleKeyMap[user?.role] || 'member';
    setCurrentRole((prev) => (roleData[nextRole] ? nextRole : prev));
  }, [user?.role]);

  const data = roleData[currentRole] || roleData.member;

  return (
    <div className="container dash-header">
      <div className="dash-topbar">
        <div>
          <div className="eyebrow">Your dashboard</div>
          <h2 style={{ fontSize: 26, marginTop: 8 }}>
            Welcome back, {user ? user.name.split(' ')[0] : 'Jordan'}
          </h2>
        </div>
        <div className="role-switch">
          {roleKeys.map((k) => (
            <button
              key={k}
              className={`role-chip${currentRole === k ? ' active' : ''}`}
              onClick={() => setCurrentRole(k)}
            >
              {roleData[k].label}
            </button>
          ))}
        </div>
      </div>

      <div className="kpi-grid">
        {data.kpis.map((k, i) => (
          <div className="kpi-card" key={i}>
            <div className="k-top">
              <div className="k-icon" style={{ background: 'rgba(255,255,255,0.06)', color: `var(--${k.color})` }}>
                {k.icon}
              </div>
              <div className={`k-trend ${k.up ? 'trend-up' : 'trend-down'}`}>{k.trend}</div>
            </div>
            <div className="k-val">{k.val}</div>
            <div className="k-label">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        <div className="panel">
          <div className="panel-head">
            <h3>Recent activity</h3>
          </div>
          <div>
            {activity.map((a, i) => (
              <div className="activity-item" key={i}>
                <div className="activity-icon">{a.icon}</div>
                <div>
                  <div className="activity-text">{a.text}</div>
                  <div className="activity-time">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="panel" style={{ marginBottom: 20 }}>
            <div className="panel-head">
              <h3>Quick actions</h3>
            </div>
            <div className="quick-actions">
              {data.actions.map((a, i) => (
                <button className="qa-btn" key={i} onClick={() => a.to && navigate(a.to)}>
                  <span className="qa-emoji">{a.emoji}</span>
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h3>Community feed</h3>
            </div>
            <div>
              {feedPosts.map((p, i) => (
                <div className="feed-post" key={i}>
                  <div className="feed-post-head">
                    <div className="fp-avatar" />
                    <div>
                      <div className="fp-name">{p.name}</div>
                      <div className="fp-meta">{p.role} · {p.time}</div>
                    </div>
                    <div className="feed-tag">{p.tag}</div>
                  </div>
                  <p className={p.flagged ? 'flagged' : ''}>{p.text}</p>
                  <div className="fp-stats">
                    <span>❤️ {p.likes}</span>
                    <span>💬 {p.comments}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
