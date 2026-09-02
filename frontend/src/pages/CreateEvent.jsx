import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const CATEGORIES = ['Music', 'Tech', 'Wellness', 'Food & Drink', 'Art', 'Networking', 'Sports', 'Education'];
const EMOJIS = ['🎷', '💻', '🧘', '🍜', '🎨', '🚀', '⚽', '📚', '🎤', '🎉', '🏃', '🤖'];

export default function CreateEvent() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    title: '',
    category: 'Tech',
    emoji: '🎉',
    date: '',
    time: '',
    location: '',
    capacity: '',
    price: '',
    description: '',
    isFree: true,
    isPrivate: false,
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: false }));
  }

  function validate() {
    const e = {};
    if (!form.title.trim())    e.title = 'Event title is required';
    if (!form.date)            e.date = 'Date is required';
    if (!form.location.trim()) e.location = 'Location is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.isFree && (!form.price || isNaN(form.price))) e.price = 'Enter a valid price';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    showToast('Event created successfully!');
    navigate('/discover?focus=events');
  }

  return (
    <div className="container" style={{ paddingTop: 44, paddingBottom: 70 }}>
      <div className="eyebrow">Events</div>
      <h2 style={{ fontSize: 26, margin: '8px 0 4px' }}>Create a new event</h2>
      <p className="text-muted" style={{ fontSize: 14, marginBottom: 36 }}>
        Fill in the details and publish your event to the platform.
      </p>

      <div className="create-event-layout">
        <form className="panel create-event-form" onSubmit={handleSubmit} noValidate>

          {/* Emoji picker */}
          <div className="field" style={{ marginBottom: 24 }}>
            <label>Event emoji</label>
            <div className="emoji-picker">
              {EMOJIS.map((em) => (
                <button
                  type="button"
                  key={em}
                  className={`emoji-opt${form.emoji === em ? ' selected' : ''}`}
                  onClick={() => set('emoji', em)}
                  aria-label={em}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div className="profile-row">
            <div className={`field${errors.title ? ' has-error' : ''}`}>
              <label htmlFor="evTitle">Event title *</label>
              <input id="evTitle" type="text" placeholder="e.g. React & Beyond Workshop"
                value={form.title} onChange={(e) => set('title', e.target.value)} />
              <div className="err">{errors.title}</div>
            </div>
            <div className="field">
              <label htmlFor="evCat">Category</label>
              <select id="evCat" value={form.category} onChange={(e) => set('category', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="profile-row">
            <div className={`field${errors.date ? ' has-error' : ''}`}>
              <label htmlFor="evDate">Date *</label>
              <input id="evDate" type="date" value={form.date}
                onChange={(e) => set('date', e.target.value)} />
              <div className="err">{errors.date}</div>
            </div>
            <div className="field">
              <label htmlFor="evTime">Time</label>
              <input id="evTime" type="time" value={form.time}
                onChange={(e) => set('time', e.target.value)} />
            </div>
          </div>

          <div className={`field${errors.location ? ' has-error' : ''}`}>
            <label htmlFor="evLoc">Location *</label>
            <input id="evLoc" type="text" placeholder="Venue name or address"
              value={form.location} onChange={(e) => set('location', e.target.value)} />
            <div className="err">{errors.location}</div>
          </div>

          <div className={`field${errors.description ? ' has-error' : ''}`}>
            <label htmlFor="evDesc">Description *</label>
            <textarea id="evDesc" className="profile-textarea" rows={4}
              placeholder="Tell attendees what to expect…"
              value={form.description} onChange={(e) => set('description', e.target.value)} />
            <div className="err">{errors.description}</div>
          </div>

          <div className="profile-row">
            <div className="field">
              <label htmlFor="evCap">Capacity</label>
              <input id="evCap" type="number" placeholder="e.g. 200" min={1}
                value={form.capacity} onChange={(e) => set('capacity', e.target.value)} />
            </div>
            <div className="field">
              <label>Pricing</label>
              <div className="toggle-row">
                <button
                  type="button"
                  className={`toggle-opt${form.isFree ? ' active' : ''}`}
                  onClick={() => set('isFree', true)}
                >Free</button>
                <button
                  type="button"
                  className={`toggle-opt${!form.isFree ? ' active' : ''}`}
                  onClick={() => set('isFree', false)}
                >Paid</button>
              </div>
              {!form.isFree && (
                <div className={`field${errors.price ? ' has-error' : ''}`} style={{ marginTop: 10 }}>
                  <input type="number" placeholder="Price in ₹" min={1}
                    value={form.price} onChange={(e) => set('price', e.target.value)} />
                  <div className="err">{errors.price}</div>
                </div>
              )}
            </div>
          </div>

          <div className="ce-privacy">
            <label className="toggle-label">
              <input type="checkbox" checked={form.isPrivate}
                onChange={(e) => set('isPrivate', e.target.checked)} />
              <span className="toggle-check" />
              <span>Private event (invite only)</span>
            </label>
          </div>

          <div className="profile-form-footer" style={{ marginTop: 32 }}>
            <button type="button" className="btn btn-subtle" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Publishing…' : 'Publish event'}
            </button>
          </div>
        </form>

        {/* Preview card */}
        <div className="ce-preview">
          <p className="text-muted" style={{ fontSize: 12, marginBottom: 12, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Preview</p>
          <div className="event-card" style={{ maxWidth: 300 }}>
            <div className="event-banner" style={{ background: 'linear-gradient(135deg,#26314f,#3d557a)', fontSize: 32 }}>
              {form.emoji}
              <div className="dist-badge">0 mi</div>
            </div>
            <div className="event-body">
              <div className="e-cat">{form.category}</div>
              <h4>{form.title || 'Your event title'}</h4>
              <div className="event-meta">
                <span>📅 {form.date || 'TBD'}</span>
                <span className={`price-tag${form.isFree ? ' price-free' : ''}`}>
                  {form.isFree ? 'Free' : form.price ? `₹${form.price}` : '₹—'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
