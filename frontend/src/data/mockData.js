const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export const roleData = {
  member: {
    label: 'Member',
    kpis: [
      { icon: '👥', color: 'coral', label: 'Communities joined', val: '6', trend: '+1 this month', up: true },
      { icon: '📅', color: 'amber', label: 'Upcoming RSVPs', val: '3', trend: '2 this week', up: true },
      { icon: '💬', color: 'violet', label: 'Unread messages', val: '12', trend: '4 new', up: true },
    ],
    actions: [
      { emoji: '🧭', label: 'Discover events near me', to: '/discover?focus=events' },
      { emoji: '👥', label: 'Join a new community', to: '/discover?focus=communities' },
      { emoji: '✏️', label: 'Update my profile', to: '/profile' },
    ],
  },
  moderator: {
    label: 'Moderator',
    kpis: [
      { icon: '🚩', color: 'coral', label: 'Flagged posts pending', val: '9', trend: '-3 today', up: false },
      { icon: '🛡️', color: 'violet', label: 'Communities moderated', val: '4', trend: 'steady', up: true },
      { icon: '✅', color: 'mint', label: 'Reports resolved', val: '27', trend: '+8 this week', up: true },
    ],
    actions: [
      { emoji: '🚩', label: 'Review flagged content', to: '/discover?focus=moderation' },
      { emoji: '📋', label: 'View moderation reports', to: '/discover?focus=moderation' },
      { emoji: '✉️', label: 'Message members', to: '/messages' },
    ],
  },
  organiser: {
    label: 'Event Organiser',
    kpis: [
      { icon: '🎤', color: 'coral', label: 'Live events', val: '5', trend: '2 this weekend', up: true },
      { icon: '🎟️', color: 'amber', label: 'Total RSVPs', val: '842', trend: '+120 this week', up: true },
      { icon: '💰', color: 'mint', label: 'Ticket revenue', val: '₹3,240', trend: '+18%', up: true },
    ],
    actions: [
      { emoji: '➕', label: 'Create a new event', to: '/events/create' },
      { emoji: '📊', label: 'View event analytics', to: '/discover?focus=analytics' },
      { emoji: '🧑‍🤝‍🧑', label: 'Manage attendees', to: '/events/attendees' },
    ],
  },
  manager: {
    label: 'Community Manager',
    kpis: [
      { icon: '🏘️', color: 'violet', label: 'Managed communities', val: '3', trend: 'steady', up: true },
      { icon: '👤', color: 'coral', label: 'Active members', val: '1,204', trend: '+64 this month', up: true },
      { icon: '📈', color: 'mint', label: 'Engagement rate', val: '71%', trend: '+5%', up: true },
    ],
    actions: [
      { emoji: '🏘️', label: 'Manage my community', to: '/community/manage' },
      { emoji: '📊', label: 'View community analytics', to: '/discover?focus=analytics' },
      { emoji: '✅', label: 'Approve new members', to: '/discover?focus=users' },
    ],
  },
  admin: {
    label: 'Admin',
    kpis: [
      { icon: '👥', color: 'coral', label: 'Total users', val: '18,420', trend: '+320 this week', up: true },
      { icon: '🩺', color: 'mint', label: 'System health', val: '99.97%', trend: 'uptime', up: true },
      { icon: '🔍', color: 'amber', label: 'Open audit flags', val: '2', trend: '-1 today', up: false },
    ],
    actions: [
      { emoji: '👤', label: 'Manage users', to: '/discover?focus=users' },
      { emoji: '🗂️', label: 'View audit logs', to: '/audit-logs' },
      { emoji: '⚙️', label: 'System settings', to: '/settings' },
    ],
  },
};

export const activity = [
  { icon: '🎟️', text: "You RSVP'd to Sunset Jazz Night", time: '12 min ago' },
  { icon: '💬', text: 'New reply in Founders Collective feed', time: '1 hr ago' },
  { icon: '👥', text: 'Trail Runners Club approved your join request', time: '3 hrs ago' },
  { icon: '🚩', text: 'A post was flagged in Design Circle', time: '5 hrs ago' },
  { icon: '📣', text: 'Community Manager posted an announcement', time: 'Yesterday' },
];

export const feedPosts = [
  { name: 'Maya Chen', role: 'Organiser', time: '2h', tag: 'Event', text: 'Tickets for Sunset Jazz Night just went live — early bird pricing ends Friday.', likes: 48, comments: 12, flagged: false },
  { name: 'Design Circle', role: 'Community', time: '6h', tag: 'Poll', text: 'Poll: which theme should we use for the next design meetup?', likes: 31, comments: 9, flagged: false },
  { name: 'Anonymous', role: 'Member', time: '1d', tag: 'Flagged', text: 'This post was flagged by the community and is pending moderator review.', likes: 2, comments: 1, flagged: true },
];

const fallbackEvents = [
  { title: 'Sunset Jazz Night', cat: 'Music', date: 'Jul 12', dist: 0.4, price: 0, popularity: 98, emoji: '🎷', grad: 'linear-gradient(135deg,#3a1f3d,#7a2f3f)' },
  { title: 'Founders Coffee Meetup', cat: 'Networking', date: 'Jul 5', dist: 1.2, price: 0, popularity: 76, emoji: '☕', grad: 'linear-gradient(135deg,#26314f,#3d557a)' },
  { title: 'React & Beyond Workshop', cat: 'Tech', date: 'Jul 18', dist: 3.1, price: 25, popularity: 120, emoji: '💻', grad: 'linear-gradient(135deg,#1f2f3d,#2f5a5a)' },
  { title: 'Sunrise Yoga in the Park', cat: 'Wellness', date: 'Jul 3', dist: 0.8, price: 0, popularity: 54, emoji: '🧘', grad: 'linear-gradient(135deg,#2a3d2c,#4a6a4d)' },
  { title: 'Street Food Crawl', cat: 'Food & Drink', date: 'Jul 9', dist: 2.4, price: 15, popularity: 143, emoji: '🍜', grad: 'linear-gradient(135deg,#3d2a1f,#6a4a2f)' },
  { title: 'Local Artists Open Studio', cat: 'Art', date: 'Jul 20', dist: 4.6, price: 0, popularity: 61, emoji: '🎨', grad: 'linear-gradient(135deg,#2f223d,#5a3a6a)' },
  { title: 'Startup Pitch Night', cat: 'Networking', date: 'Jul 14', dist: 6.2, price: 10, popularity: 88, emoji: '🚀', grad: 'linear-gradient(135deg,#26314f,#3d557a)' },
  { title: 'Modular Synth Jam', cat: 'Music', date: 'Jul 25', dist: 8.9, price: 20, popularity: 39, emoji: '🎹', grad: 'linear-gradient(135deg,#3a1f3d,#7a2f3f)' },
  { title: 'Trail Running Club Run', cat: 'Wellness', date: 'Jul 6', dist: 1.9, price: 0, popularity: 67, emoji: '🏃', grad: 'linear-gradient(135deg,#2a3d2c,#4a6a4d)' },
  { title: 'AI Builders Hack Night', cat: 'Tech', date: 'Jul 22', dist: 12.5, price: 0, popularity: 110, emoji: '🤖', grad: 'linear-gradient(135deg,#1f2f3d,#2f5a5a)' },
];

const fallbackCommunities = [
  { name: 'Founders Collective', members: '2,140', priv: false, emoji: '🚀' },
  { name: 'Design Circle', members: '980', priv: false, emoji: '🎨' },
  { name: 'Trail Runners Club', members: '640', priv: true, emoji: '🏃' },
  { name: 'AI Builders', members: '3,020', priv: false, emoji: '🤖' },
  { name: 'Jazz & Vinyl Society', members: '410', priv: true, emoji: '🎷' },
  { name: 'Street Food Explorers', members: '1,560', priv: false, emoji: '🍜' },
];

export let events = [...fallbackEvents];
export let communities = [...fallbackCommunities];

export async function loadDiscoverData() {
  try {
    const [eventData, communityData] = await Promise.all([
      fetchJson(`${API_BASE}/api/events/discover`).catch(() => fallbackEvents),
      fetchJson(`${API_BASE}/api/communities/discover`).catch(() => fallbackCommunities),
    ]);

    events = Array.isArray(eventData) ? eventData.map((item) => ({
      title: item.title || item.name || 'Untitled event',
      cat: item.category || item.type || 'General',
      date: item.date || item.eventDate || 'TBD',
      dist: Number(item.dist ?? item.distance ?? 0),
      price: Number(item.price ?? 0),
      popularity: Number(item.popularity ?? 0),
      emoji: item.emoji || '🎉',
      grad: item.grad || 'linear-gradient(135deg,#26314f,#3d557a)',
    })) : [...fallbackEvents];

    communities = Array.isArray(communityData)
      ? communityData.map((item) => ({
          name: item.name || 'Community',
          members: String(item.members ?? item.memberCount ?? '0'),
          priv: Boolean(item.priv ?? item.private ?? false),
          emoji: item.emoji || '🌐',
        }))
      : [...fallbackCommunities];
  } catch (error) {
    events = [...fallbackEvents];
    communities = [...fallbackCommunities];
  }
}

export const categories = ['All', 'Music', 'Tech', 'Wellness', 'Food & Drink', 'Art', 'Networking'];

export const roleOptions = [
  { key: 'Member', emoji: '🙋', desc: 'Join & attend' },
  { key: 'Event Organiser', emoji: '🎤', desc: 'Host events' },
  { key: 'Community Manager', emoji: '🏘️', desc: 'Lead communities' },
  { key: 'Moderator', emoji: '🛡️', desc: 'Keep it civil' },
  { key: 'Admin', emoji: '⚙️', desc: 'Run the platform' },
  { key: 'Guest', emoji: '👀', desc: 'Just browsing' },
];
