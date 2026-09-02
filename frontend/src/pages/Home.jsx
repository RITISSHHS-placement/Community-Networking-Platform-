import { useNavigate } from 'react-router-dom';
import Radar from '../components/Radar';

const heroDots = [
  { top: '22%', left: '62%', label: "Jazz Night · 0.4mi" },
  { top: '68%', left: '30%', label: 'Founders Meetup · 1.2mi', variant: 'v2' },
  { top: '40%', left: '20%', label: 'Trail Run · 0.8mi', variant: 'v3' },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div id="view-home">
      <div className="container hero">
        <div className="hero-grid">
          <div>
            <div className="eyebrow">Community networking &amp; events discovery</div>
            <h1>
              Find your people.
              <br />
              Find what's <span className="hl">happening</span>.
            </h1>
            <p className="lead">
              Join communities built around what you're into, discover events nearby the moment
              they go live, and keep the conversation going — all from one dashboard.
            </p>
            <div className="hero-ctas">
              <button className="btn btn-primary" onClick={() => navigate('/register')}>
                Create free account
              </button>
              <button className="btn btn-ghost" onClick={() => navigate('/discover')}>
                Browse events near you
              </button>
            </div>
            <div className="trust-row">
              <div className="trust-item">
                <div className="t-num">2,400+</div>
                <div className="t-label">Active communities</div>
              </div>
              <div className="trust-item">
                <div className="t-num">18k</div>
                <div className="t-label">Events hosted</div>
              </div>
              <div className="trust-item">
                <div className="t-num">500+</div>
                <div className="t-label">Concurrent members</div>
              </div>
            </div>
          </div>
          <Radar center="📍" dots={heroDots} />
        </div>
      </div>

      <div className="container section">
        <div className="section-head">
          <div className="eyebrow">Built for the whole community</div>
          <h2>Everything a community needs to grow</h2>
        </div>
        <div className="feature-grid">
          <FeatureCard icon="👤" color="coral" title="Rich member profiles" text="Interests, skills, and activity — so members find each other, not just events." />
          <FeatureCard icon="🎟️" color="amber" title="Free & paid ticketing" text="Spin up an event in minutes with flexible ticket types and real-time RSVP tracking." />
          <FeatureCard icon="🧭" color="violet" title="Geo-location discovery" text="A radar view surfaces what's happening nearby, sorted by distance and relevance." />
          <FeatureCard icon="💬" color="mint" title="Posts, polls & chats" text="A living feed for every community, plus direct messages and group chats." />
          <FeatureCard icon="🛡️" color="coral" title="Moderation built-in" text="Flagging, review queues, and audit trails keep every community healthy." />
          <FeatureCard icon="📊" color="amber" title="Engagement analytics" text="Role-specific dashboards turn activity into decisions — for organisers and managers alike." />
        </div>

        <div className="showcase">
          <div>
            <div className="eyebrow">Role-based access</div>
            <h3>Every role sees exactly what it needs</h3>
            <p>
              From Guests browsing public events to Admins managing the whole platform,
              permissions are enforced at every layer — nobody sees more than their role allows.
            </p>
            <button className="btn btn-subtle" onClick={() => navigate('/dashboard')}>
              Preview a dashboard
            </button>
          </div>
          <div className="matrix-preview">
            <div className="matrix-row"><span>Create Event</span><span className="badge badge-limited">Member: Limited</span></div>
            <div className="matrix-row"><span>Moderate content</span><span className="badge badge-yes">Moderator: Yes</span></div>
            <div className="matrix-row"><span>Manage community</span><span className="badge badge-yes">Manager: Yes</span></div>
            <div className="matrix-row"><span>View analytics</span><span className="badge badge-limited">Organiser: Limited</span></div>
            <div className="matrix-row"><span>Manage users</span><span className="badge badge-no">Guest: No</span></div>
            <div className="matrix-row"><span>Audit logs</span><span className="badge badge-yes">Admin: Yes</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, color, title, text }) {
  return (
    <div className="feature-card">
      <div className="feature-icon" style={{ background: `rgba(255,255,255,0.06)`, color: `var(--${color})` }}>
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
