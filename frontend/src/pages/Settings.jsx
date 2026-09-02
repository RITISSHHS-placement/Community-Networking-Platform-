import { useState } from 'react';
import { useToast } from '../context/ToastContext';

const SECTIONS = ['general', 'notifications', 'security', 'appearance', 'danger'];

export default function Settings() {
  const { showToast } = useToast();

  const [section, setSection] = useState('general');

  // General
  const [general, setGeneral] = useState({
    platformName: 'CommunityNed Platform',
    supportEmail: 'support@communityned.com',
    timezone: 'Asia/Kolkata',
    language: 'English',
    registrationOpen: true,
    requireEmailVerification: false,
  });

  // Notifications
  const [notifications, setNotifications] = useState({
    emailOnNewMember: true,
    emailOnFlaggedPost: true,
    emailOnEventRsvp: false,
    emailWeeklyDigest: true,
    pushNotifications: false,
  });

  // Security
  const [security, setSecurity] = useState({
    sessionTimeout: '60',
    maxLoginAttempts: '5',
    twoFactorRequired: false,
    passwordMinLength: '8',
    allowPublicProfiles: true,
  });

  // Appearance
  const [appearance, setAppearance] = useState({
    defaultTheme: 'dark',
    accentColor: '#FF6B4A',
    showRadarOnHome: true,
    compactCards: false,
  });

  function save(label) {
    showToast(`${label} settings saved`);
  }

  const SECTION_LABELS = {
    general: 'General',
    notifications: 'Notifications',
    security: 'Security',
    appearance: 'Appearance',
    danger: 'Danger zone',
  };

  return (
    <div className="container" style={{ paddingTop: 44, paddingBottom: 70 }}>
      <div className="eyebrow">Admin</div>
      <h2 style={{ fontSize: 26, margin: '8px 0 4px' }}>System Settings</h2>
      <p className="text-muted" style={{ fontSize: 14, marginBottom: 36 }}>
        Configure platform-wide behaviour, security policies, and appearance.
      </p>

      <div className="settings-layout">
        {/* Sidebar nav */}
        <nav className="settings-nav panel">
          {SECTIONS.map((s) => (
            <button
              key={s}
              className={`settings-nav-item${section === s ? ' active' : ''}${s === 'danger' ? ' danger-item' : ''}`}
              onClick={() => setSection(s)}
            >
              {SECTION_LABELS[s]}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="settings-content panel">

          {/* ── General ── */}
          {section === 'general' && (
            <>
              <h3 className="profile-section-title">General</h3>
              <div className="profile-row">
                <div className="field">
                  <label>Platform name</label>
                  <input type="text" value={general.platformName}
                    onChange={(e) => setGeneral((g) => ({ ...g, platformName: e.target.value }))} />
                </div>
                <div className="field">
                  <label>Support email</label>
                  <input type="email" value={general.supportEmail}
                    onChange={(e) => setGeneral((g) => ({ ...g, supportEmail: e.target.value }))} />
                </div>
              </div>
              <div className="profile-row">
                <div className="field">
                  <label>Timezone</label>
                  <select value={general.timezone}
                    onChange={(e) => setGeneral((g) => ({ ...g, timezone: e.target.value }))}>
                    <option>Asia/Kolkata</option>
                    <option>UTC</option>
                    <option>America/New_York</option>
                    <option>Europe/London</option>
                  </select>
                </div>
                <div className="field">
                  <label>Language</label>
                  <select value={general.language}
                    onChange={(e) => setGeneral((g) => ({ ...g, language: e.target.value }))}>
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Tamil</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, margin: '16px 0 24px' }}>
                {[
                  { key: 'registrationOpen', label: 'Open registration (allow new sign-ups)' },
                  { key: 'requireEmailVerification', label: 'Require email verification on sign-up' },
                ].map(({ key, label }) => (
                  <label key={key} className="toggle-label">
                    <input type="checkbox" checked={general[key]}
                      onChange={(e) => setGeneral((g) => ({ ...g, [key]: e.target.checked }))} />
                    <span className="toggle-check" />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
              <button className="btn btn-primary" onClick={() => save('General')}>Save changes</button>
            </>
          )}

          {/* ── Notifications ── */}
          {section === 'notifications' && (
            <>
              <h3 className="profile-section-title">Notifications</h3>
              <p className="text-muted" style={{ fontSize: 13, marginBottom: 20 }}>
                Control which platform events trigger email or push notifications to admins.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                {[
                  { key: 'emailOnNewMember', label: 'Email when a new member registers' },
                  { key: 'emailOnFlaggedPost', label: 'Email when a post is flagged' },
                  { key: 'emailOnEventRsvp', label: 'Email on each new RSVP' },
                  { key: 'emailWeeklyDigest', label: 'Weekly digest email' },
                  { key: 'pushNotifications', label: 'Enable push notifications (browser)' },
                ].map(({ key, label }) => (
                  <label key={key} className="toggle-label">
                    <input type="checkbox" checked={notifications[key]}
                      onChange={(e) => setNotifications((n) => ({ ...n, [key]: e.target.checked }))} />
                    <span className="toggle-check" />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
              <button className="btn btn-primary" onClick={() => save('Notification')}>Save changes</button>
            </>
          )}

          {/* ── Security ── */}
          {section === 'security' && (
            <>
              <h3 className="profile-section-title">Security</h3>
              <div className="profile-row">
                <div className="field">
                  <label>Session timeout (minutes)</label>
                  <input type="number" min={5} max={1440} value={security.sessionTimeout}
                    onChange={(e) => setSecurity((s) => ({ ...s, sessionTimeout: e.target.value }))} />
                </div>
                <div className="field">
                  <label>Max login attempts before lockout</label>
                  <input type="number" min={3} max={20} value={security.maxLoginAttempts}
                    onChange={(e) => setSecurity((s) => ({ ...s, maxLoginAttempts: e.target.value }))} />
                </div>
              </div>
              <div className="field" style={{ maxWidth: 260 }}>
                <label>Minimum password length</label>
                <input type="number" min={6} max={32} value={security.passwordMinLength}
                  onChange={(e) => setSecurity((s) => ({ ...s, passwordMinLength: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, margin: '16px 0 24px' }}>
                {[
                  { key: 'twoFactorRequired', label: 'Require 2FA for admin accounts' },
                  { key: 'allowPublicProfiles', label: 'Allow public member profiles' },
                ].map(({ key, label }) => (
                  <label key={key} className="toggle-label">
                    <input type="checkbox" checked={security[key]}
                      onChange={(e) => setSecurity((s) => ({ ...s, [key]: e.target.checked }))} />
                    <span className="toggle-check" />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
              <button className="btn btn-primary" onClick={() => save('Security')}>Save changes</button>
            </>
          )}

          {/* ── Appearance ── */}
          {section === 'appearance' && (
            <>
              <h3 className="profile-section-title">Appearance</h3>
              <div className="profile-row">
                <div className="field">
                  <label>Default theme</label>
                  <select value={appearance.defaultTheme}
                    onChange={(e) => setAppearance((a) => ({ ...a, defaultTheme: e.target.value }))}>
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="system">System default</option>
                  </select>
                </div>
                <div className="field">
                  <label>Accent color</label>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 8 }}>
                    {['#FF6B4A', '#9B8CFF', '#5FE0B7', '#FFC857'].map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setAppearance((a) => ({ ...a, accentColor: c }))}
                        style={{
                          width: 28, height: 28, borderRadius: '50%', background: c, border: 'none',
                          outline: appearance.accentColor === c ? `3px solid ${c}` : '3px solid transparent',
                          outlineOffset: 2, cursor: 'pointer',
                        }}
                        aria-label={c}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, margin: '16px 0 24px' }}>
                {[
                  { key: 'showRadarOnHome', label: 'Show radar animation on home page' },
                  { key: 'compactCards', label: 'Use compact event/community cards' },
                ].map(({ key, label }) => (
                  <label key={key} className="toggle-label">
                    <input type="checkbox" checked={appearance[key]}
                      onChange={(e) => setAppearance((a) => ({ ...a, [key]: e.target.checked }))} />
                    <span className="toggle-check" />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
              <button className="btn btn-primary" onClick={() => save('Appearance')}>Save changes</button>
            </>
          )}

          {/* ── Danger zone ── */}
          {section === 'danger' && (
            <>
              <h3 className="profile-section-title" style={{ color: 'var(--coral)' }}>Danger zone</h3>
              <p className="text-muted" style={{ fontSize: 13, marginBottom: 24 }}>
                These actions are irreversible. Proceed with caution.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: 'Clear all cached data', desc: 'Flushes the platform-wide cache. Users may experience slower load times briefly.' },
                  { label: 'Export all platform data', desc: 'Downloads a full JSON export of users, events, communities, and posts.' },
                  { label: 'Disable platform', desc: 'Puts the platform into maintenance mode. All users will see a maintenance message.' },
                  { label: 'Delete all guest accounts', desc: 'Permanently removes all accounts with the Guest role and their associated data.' },
                ].map((action) => (
                  <div key={action.label} className="danger-action-row">
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{action.label}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 3 }}>{action.desc}</div>
                    </div>
                    <button
                      className="btn btn-sm"
                      style={{ background: 'rgba(255,107,74,0.1)', color: 'var(--coral)', border: '1px solid rgba(255,107,74,0.25)', flexShrink: 0 }}
                      onClick={() => showToast(`Action: "${action.label}" — confirm in a real deployment`)}
                    >
                      {action.label.split(' ').slice(0, 2).join(' ')}…
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
