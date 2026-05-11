// Shared utilities and icons used across all 3 variations
// All components registered on window for cross-file access.

// ─────────────────────────────────────────────────────────────
// Icons — minimal inline SVG set. All accept { size, color, stroke }.
// ─────────────────────────────────────────────────────────────
const Icon = ({ d, size = 22, color = 'currentColor', stroke = 2, fill = 'none', viewBox = '0 0 24 24' }) => (
  <svg width={size} height={size} viewBox={viewBox} fill={fill} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {typeof d === 'string' ? <path d={d} /> : d}
  </svg>
);

const IconPlus = (p) => <Icon {...p} d="M12 5v14M5 12h14" />;
const IconBack = (p) => <Icon {...p} d="M19 12H5M12 19l-7-7 7-7" />;
const IconClose = (p) => <Icon {...p} d="M18 6 6 18M6 6l12 12" />;
const IconSearch = (p) => <Icon {...p} d={<><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>} />;
const IconMore = (p) => <Icon {...p} d={<><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></>} fill="currentColor" stroke="none" />;
const IconCal = (p) => <Icon {...p} d={<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></>} />;
const IconHome = (p) => <Icon {...p} d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1Z" />;
const IconCards = (p) => <Icon {...p} d={<><rect x="3" y="6" width="14" height="14" rx="2"/><path d="M7 2h14v14"/></>} />;
const IconProfile = (p) => <Icon {...p} d={<><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>} />;
const IconUpload = (p) => <Icon {...p} d="M12 16V4m0 0-4 4m4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />;
const IconBook = (p) => <Icon {...p} d="M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3Zm14 16H7a3 3 0 0 0-3-3" />;
const IconSpark = (p) => <Icon {...p} d="M12 2l2.09 5.91L20 10l-5.91 2.09L12 18l-2.09-5.91L4 10l5.91-2.09Z" fill="currentColor" stroke="none" />;
const IconCheck = (p) => <Icon {...p} d="M5 12l5 5 9-11" />;
const IconArrowR = (p) => <Icon {...p} d="M5 12h14m-6-7 7 7-7 7" />;
const IconFlip = (p) => <Icon {...p} d={<><path d="M4 12a8 8 0 0 1 14-5.3M20 4v5h-5"/><path d="M20 12a8 8 0 0 1-14 5.3M4 20v-5h5"/></>} />;
const IconPdf = (p) => <Icon {...p} d={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/></>} />;
const IconClock = (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>} />;
const IconFlame = (p) => <Icon {...p} d="M12 2s5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 1-5 0 2 2 3 2 5s2-2 2-5-0-5 0-5Z" fill="currentColor" stroke="none" />;
const IconWarn = (p) => <Icon {...p} d={<><path d="M12 3 2 21h20Z"/><path d="M12 10v5M12 18v.01"/></>} />;
const IconZap = (p) => <Icon {...p} d="M13 2 3 14h7l-1 8 10-12h-7Z" fill="currentColor" stroke="none" />;
const IconLayers = (p) => <Icon {...p} d={<><path d="m12 2 10 5-10 5L2 7Z"/><path d="m2 12 10 5 10-5M2 17l10 5 10-5"/></>} />;
const IconDrop = (p) => <Icon {...p} d="M12 3v18M6 9l6-6 6 6" />;
const IconChevronR = (p) => <Icon {...p} d="M9 6l6 6-6 6" />;
const IconSettings = (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></>} />;
const IconBolt = (p) => <Icon {...p} d="M13 2 3 14h7l-1 8 10-12h-7Z" />;
const IconTrend = (p) => <Icon {...p} d={<><path d="m3 17 6-6 4 4 8-8"/><path d="M14 7h7v7"/></>} />;

Object.assign(window, {
  Icon, IconPlus, IconBack, IconClose, IconSearch, IconMore, IconCal, IconHome,
  IconCards, IconProfile, IconUpload, IconBook, IconSpark, IconCheck, IconArrowR,
  IconFlip, IconPdf, IconClock, IconFlame, IconWarn, IconZap, IconLayers, IconDrop,
  IconChevronR, IconSettings, IconBolt, IconTrend,
});

// ─────────────────────────────────────────────────────────────
// Phone frame — custom Android-style frame. Lightweight wrapper
// that ALL variations use. Accepts the variation's own theme.
// ─────────────────────────────────────────────────────────────
function PhoneFrame({ children, theme, bg, dark = false, noFrame = false }) {
  const W = 380, H = 780;
  const statusColor = dark ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.85)';
  return (
    <div style={{
      width: W, height: H, borderRadius: 44, position: 'relative',
      background: bg || (dark ? '#0a0a0f' : '#fff'),
      border: noFrame ? 'none' : '10px solid #141319',
      boxShadow: noFrame ? 'none' : '0 40px 80px -20px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.8)',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* status bar */}
      <div style={{
        height: 32, padding: '0 22px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexShrink: 0, position: 'relative',
        zIndex: 20, color: statusColor,
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'DM Sans, system-ui', letterSpacing: 0.2 }}>9:41</span>
        <div style={{
          position: 'absolute', left: '50%', top: 8, transform: 'translateX(-50%)',
          width: 18, height: 18, borderRadius: '50%', background: '#0a0a0f',
        }} />
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <svg width="14" height="10" viewBox="0 0 14 10"><path d="M7 9.2L.2 2.4a9.6 9.6 0 0 1 13.6 0z" fill={statusColor}/></svg>
          <svg width="14" height="10" viewBox="0 0 14 10"><path d="M13 9V1L1 9z" fill={statusColor}/></svg>
          <svg width="22" height="10" viewBox="0 0 22 10">
            <rect x="0.5" y="0.5" width="18" height="9" rx="2" fill="none" stroke={statusColor} strokeOpacity="0.5"/>
            <rect x="2" y="2" width="13" height="6" rx="1" fill={statusColor}/>
            <rect x="19.5" y="3" width="2" height="4" rx="0.5" fill={statusColor} fillOpacity="0.5"/>
          </svg>
        </div>
      </div>
      {/* content */}
      <div className="phone-scroll" style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {children}
      </div>
      {/* home indicator */}
      <div style={{
        height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, position: 'relative', zIndex: 20,
      }}>
        <div style={{
          width: 120, height: 4, borderRadius: 4,
          background: dark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
        }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Screen label — sits above the phone, like a Figma artboard tag
// ─────────────────────────────────────────────────────────────
function ScreenLabel({ n, title, color = 'rgba(40,30,20,0.85)' }) {
  return (
    <div style={{
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 11, fontWeight: 500, color,
      letterSpacing: 0.5, textTransform: 'uppercase',
      marginBottom: 14, display: 'flex', alignItems: 'baseline', gap: 8,
    }}>
      <span style={{ opacity: 0.5 }}>{String(n).padStart(2, '0')}</span>
      <span>{title}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Row of phones for a variation. Wraps each phone in a label.
// ─────────────────────────────────────────────────────────────
function PhoneRow({ screens, theme, labelColor }) {
  return (
    <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
      {screens.map((s, i) => (
        <div key={i} data-screen-label={`${String(i + 1).padStart(2, '0')} ${s.title}`}>
          <ScreenLabel n={i + 1} title={s.title} color={labelColor} />
          {s.content}
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { PhoneFrame, ScreenLabel, PhoneRow });

// ─────────────────────────────────────────────────────────────
// Sample data shared across variations
// ─────────────────────────────────────────────────────────────
const COURSES = [
  { name: 'Database Systems',        code: 'CS-3305', due: 24, topics: 6, streak: 12, color: '#FF4D6D', emoji: 'DB' },
  { name: 'Written & Oral Comm.',    code: 'HU-2100', due: 8,  topics: 4, streak: 5,  color: '#4D7CFF', emoji: 'WC' },
  { name: 'Linear Algebra',          code: 'MA-2040', due: 16, topics: 9, streak: 22, color: '#FFB84D', emoji: 'LA' },
  { name: 'Organic Chemistry',       code: 'CH-3110', due: 32, topics: 7, streak: 3,  color: '#5BD8A4', emoji: 'OC' },
  { name: 'Intro to Philosophy',     code: 'PH-1010', due: 5,  topics: 3, streak: 8,  color: '#B84DFF', emoji: 'PH' },
];

const DB_TOPICS = [
  { name: 'Relational Model',      cards: 24, mastery: 0.82, due: 0 },
  { name: 'Normalization (1NF–BCNF)', cards: 31, mastery: 0.54, due: 12 },
  { name: 'SQL Joins & Subqueries', cards: 18, mastery: 0.91, due: 3 },
  { name: 'Transactions & ACID',   cards: 22, mastery: 0.38, due: 9 },
  { name: 'Indexing & B-Trees',    cards: 19, mastery: 0.67, due: 0 },
  { name: 'Query Optimization',    cards: 27, mastery: 0.22, due: 0 },
];

const FLASHCARD = {
  q: 'What does the ACID property "Isolation" guarantee?',
  a: 'Concurrent transactions produce the same result as if they were executed sequentially. Each transaction is unaware of other transactions running in parallel.',
  hint: 'Think about what happens when two transactions touch the same row.',
  source: 'Lecture 7 — Transactions.pdf, p. 14',
};

Object.assign(window, { COURSES, DB_TOPICS, FLASHCARD });
