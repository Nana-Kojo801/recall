// Kanji Desktop — web companion to mobile Kanji variation.
// Dense but playful. Sidebar + main content. Cream bg, offset shadows, chunky serif.

const KD = {
  bg: '#F5EFE2',
  bgSoft: '#FBF6EA',
  surface: '#FFFFFF',
  ink: '#1C1917',
  inkSoft: '#4A4642',
  inkMute: '#8A8278',
  accent: '#E8482C',
  accent2: '#F4B400',
  accent3: '#2B7A3E',
  accent4: '#3B5BDB',
  accent5: '#C93FA9',
  font: 'Archivo, system-ui, sans-serif',
  fontSerif: 'Fraunces, serif',
  fontMono: 'JetBrains Mono, monospace',
  fontAccent: 'Caveat, cursive',
};

const KStar = ({ c = KD.ink, s = 14 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z"/></svg>
);
const KSqui = ({ c = KD.ink, w = 40 }) => (
  <svg width={w} height={10} viewBox="0 0 40 10"><path d="M1 5 Q 6 1 11 5 T 21 5 T 31 5 T 39 5" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
);

// Sidebar
function KSidebar({ active = 'courses' }) {
  const nav = [
    { id: 'today', l: 'Today', i: '✦' },
    { id: 'courses', l: 'Courses', i: '▤' },
    { id: 'calendar', l: 'Calendar', i: '▦' },
    { id: 'library', l: 'Library', i: '❐' },
    { id: 'stats', l: 'Stats', i: '△' },
    { id: 'settings', l: 'Settings', i: '⚙' },
  ];
  return (
    <div style={{ width: 220, background: KD.bgSoft, borderRight: `2px solid ${KD.ink}`, display: 'flex', flexDirection: 'column', padding: '18px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 6px 18px' }}>
        <div style={{ width: 30, height: 30, background: KD.accent, border: `2px solid ${KD.ink}`, display: 'grid', placeItems: 'center', color: '#fff', fontFamily: KD.fontSerif, fontWeight: 900, fontSize: 14 }}>R</div>
        <div style={{ fontFamily: KD.fontSerif, fontSize: 20, fontWeight: 800, letterSpacing: -0.4 }}>Recall</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {nav.map(n => (
          <div key={n.id} style={{
            padding: '8px 10px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10,
            background: n.id === active ? KD.ink : 'transparent', color: n.id === active ? KD.bg : KD.ink,
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>
            <span style={{ width: 16, textAlign: 'center', fontFamily: KD.fontMono, fontSize: 12 }}>{n.i}</span>
            {n.l}
            {n.id === 'courses' && <span style={{ marginLeft: 'auto', padding: '1px 6px', background: KD.accent, color: '#fff', fontFamily: KD.fontMono, fontSize: 9, borderRadius: 4, border: `1px solid ${n.id === active ? 'rgba(255,255,255,0.3)' : KD.ink}` }}>5</span>}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 18, padding: '0 6px', fontFamily: KD.fontMono, fontSize: 10, color: KD.inkMute, letterSpacing: 1 }}>COURSES</div>
      <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {[
          { c: KD.accent, n: 'Database Systems' },
          { c: KD.accent4, n: 'Written & Oral' },
          { c: KD.accent2, n: 'Linear Algebra' },
          { c: KD.accent3, n: 'Organic Chem.' },
          { c: KD.accent5, n: 'Philosophy' },
        ].map((c, i) => (
          <div key={i} style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: KD.inkSoft, borderRadius: 6 }}>
            <div style={{ width: 12, height: 12, background: c.c, border: `1.5px solid ${KD.ink}`, borderRadius: 3, flexShrink: 0 }} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.n}</span>
          </div>
        ))}
      </div>
      <div style={{ flex: 1 }} />
      {/* pulse panel */}
      <div style={{ padding: 12, background: KD.accent2, border: `2px solid ${KD.ink}`, borderRadius: 10, boxShadow: `3px 3px 0 ${KD.ink}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 8, right: 10 }}><KStar c={KD.ink} s={14}/></div>
        <div style={{ fontFamily: KD.fontMono, fontSize: 9, letterSpacing: 1, fontWeight: 700 }}>TODAY · 22 MIN</div>
        <div style={{ fontFamily: KD.fontSerif, fontSize: 32, fontWeight: 900, lineHeight: 1, letterSpacing: -1, marginTop: 2 }}>48</div>
        <div style={{ fontSize: 11, color: KD.ink, marginTop: -2 }}>cards due</div>
        <button style={{ width: '100%', marginTop: 8, padding: '8px', background: KD.ink, color: '#fff', border: 'none', borderRadius: 6, fontFamily: KD.font, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Start session →</button>
      </div>
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, padding: '0 6px' }}>
        <div style={{ width: 26, height: 26, borderRadius: 6, background: KD.accent5, border: `1.5px solid ${KD.ink}`, display: 'grid', placeItems: 'center', color: '#fff', fontFamily: KD.fontSerif, fontWeight: 800, fontSize: 12 }}>MK</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Maya Kapoor</div>
          <div style={{ fontSize: 10, color: KD.inkMute, fontFamily: KD.fontMono }}>Spring '26</div>
        </div>
      </div>
    </div>
  );
}

// Shell wrapper
function KShell({ active, title, subtitle, actions, children, bgTop = KD.bg }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', fontFamily: KD.font, color: KD.ink, background: KD.bg }}>
      <KSidebar active={active} />
      <div style={{ flex: 1, minWidth: 0, overflow: 'auto', background: bgTop }}>
        {(title || actions) && (
          <div style={{ padding: '18px 28px 14px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, borderBottom: `2px solid ${KD.ink}` }}>
            <div>
              {subtitle && <div style={{ fontFamily: KD.fontMono, fontSize: 10, letterSpacing: 1.5, color: KD.inkMute, fontWeight: 700 }}>{subtitle}</div>}
              <div style={{ fontFamily: KD.fontSerif, fontSize: 34, fontWeight: 800, letterSpacing: -0.8, lineHeight: 1, marginTop: 4 }}>{title}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>{actions}</div>
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
}

// Button helper
const KBtn = ({ children, bg = KD.ink, color = KD.bg, pad = '9px 14px', ...rest }) => (
  <button style={{
    padding: pad, background: bg, color, border: `2px solid ${KD.ink}`,
    borderRadius: 8, boxShadow: `2px 2px 0 ${KD.ink}`,
    fontFamily: KD.font, fontWeight: 700, fontSize: 13, cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 6,
  }} {...rest}>{children}</button>
);

// ─── Screen 1: Home / Today ──────────────────────────────
function KanjiDesktopHome() {
  const courseColors = [KD.accent, KD.accent4, KD.accent2, KD.accent3, KD.accent5];
  return (
    <KShell
      active="today"
      subtitle="FRIDAY · APR 18"
      title={<>Good morning, <span style={{ color: KD.accent }}>Maya</span>.</>}
      actions={<><KBtn bg={KD.surface} color={KD.ink}>🔍 Search</KBtn><KBtn bg={KD.accent} color="#fff">+ New course</KBtn></>}
    >
      <div style={{ padding: 28, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
        {/* today big card */}
        <div style={{ background: KD.accent2, border: `2.5px solid ${KD.ink}`, borderRadius: 18, boxShadow: `6px 6px 0 ${KD.ink}`, padding: 24, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 16, right: 22 }}><KStar c={KD.ink} s={20}/></div>
          <div style={{ fontFamily: KD.fontMono, fontSize: 11, letterSpacing: 1.5, fontWeight: 700 }}>DUE TODAY</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 6 }}>
            <div style={{ fontFamily: KD.fontSerif, fontSize: 92, fontWeight: 900, letterSpacing: -3, lineHeight: 0.9, color: KD.ink }}>48</div>
            <div>
              <div style={{ fontFamily: KD.fontSerif, fontSize: 18, fontWeight: 700 }}>cards · 22 min</div>
              <div style={{ fontSize: 12, color: KD.inkSoft, marginTop: 2 }}>across 3 topics in Database Systems + Philosophy</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <KBtn bg={KD.ink} color="#fff" pad="11px 16px">▶ Start session</KBtn>
            <KBtn bg="#fff" color={KD.ink} pad="11px 16px">⏰ Schedule for 9:30</KBtn>
          </div>

          {/* mini cards strip */}
          <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
            {[
              { c: KD.accent, l: 'DB · Transactions', n: 22 },
              { c: KD.accent3, l: 'DB · Indexing', n: 8 },
              { c: KD.accent5, l: 'PH · Mind-Body', n: 18 },
            ].map((b, i) => (
              <div key={i} style={{ flex: 1, padding: 10, background: '#fff', border: `1.5px solid ${KD.ink}`, borderRadius: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, background: b.c, border: `1.5px solid ${KD.ink}`, borderRadius: 3 }} />
                  <div style={{ fontSize: 11, fontWeight: 600, color: KD.inkSoft }}>{b.l}</div>
                </div>
                <div style={{ fontFamily: KD.fontSerif, fontSize: 22, fontWeight: 800, lineHeight: 1, letterSpacing: -0.5, marginTop: 6 }}>{b.n} <span style={{ fontSize: 11, color: KD.inkMute, fontWeight: 500 }}>cards</span></div>
              </div>
            ))}
          </div>
        </div>

        {/* side stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: '#fff', border: `2px solid ${KD.ink}`, borderRadius: 14, boxShadow: `4px 4px 0 ${KD.ink}`, padding: 16 }}>
            <div style={{ fontFamily: KD.fontSerif, fontSize: 18, fontWeight: 800 }}>Streak</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
              <div style={{ fontFamily: KD.fontSerif, fontSize: 40, fontWeight: 900, letterSpacing: -1, color: KD.accent, lineHeight: 1 }}>12</div>
              <div style={{ fontSize: 12, color: KD.inkSoft }}>days in a row 🔥</div>
            </div>
            <div style={{ display: 'flex', gap: 4, marginTop: 12 }}>
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} style={{ flex: 1, aspectRatio: '1', background: i < 12 ? KD.accent : KD.bgSoft, border: `1.5px solid ${KD.ink}`, borderRadius: 3 }}>
                </div>
              ))}
            </div>
            <div style={{ fontFamily: KD.fontAccent, fontSize: 15, color: KD.inkSoft, marginTop: 8 }}>keep it going!</div>
          </div>
          <div style={{ background: KD.accent4, color: '#fff', border: `2px solid ${KD.ink}`, borderRadius: 14, boxShadow: `4px 4px 0 ${KD.ink}`, padding: 16 }}>
            <div style={{ fontFamily: KD.fontMono, fontSize: 10, letterSpacing: 1.5 }}>NEXT REVIEW</div>
            <div style={{ fontFamily: KD.fontSerif, fontSize: 22, fontWeight: 800, lineHeight: 1.1, marginTop: 4 }}>DB · Normalization</div>
            <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>Mon 21 Apr · 10:30 — 10:50 · 31 cards</div>
            <div style={{ padding: 8, background: 'rgba(255,255,255,0.12)', border: `1.5px solid rgba(255,255,255,0.35)`, borderRadius: 8, marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
              <span style={{ padding: '2px 6px', background: KD.accent2, color: KD.ink, borderRadius: 4, fontFamily: KD.fontMono, fontWeight: 700 }}>SYNCED</span>
              Google Calendar · 1 event
            </div>
          </div>
        </div>
      </div>

      {/* courses row */}
      <div style={{ padding: '0 28px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontFamily: KD.fontSerif, fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>Your courses</div>
          <div style={{ fontFamily: KD.fontMono, fontSize: 11, color: KD.inkMute }}>5 · SPRING '26</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {COURSES.slice(0, 4).map((c, i) => (
            <div key={i} style={{ background: '#fff', border: `2px solid ${KD.ink}`, borderRadius: 14, boxShadow: `4px 4px 0 ${KD.ink}`, overflow: 'hidden', cursor: 'pointer' }}>
              <div style={{ height: 54, background: courseColors[i % 5], borderBottom: `2px solid ${KD.ink}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 10, right: 12, fontFamily: KD.fontMono, fontSize: 10, color: '#fff', fontWeight: 700, letterSpacing: 1, textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>{c.code}</div>
                <div style={{ position: 'absolute', bottom: -8, left: 12, fontFamily: KD.fontSerif, fontSize: 34, fontWeight: 900, color: '#fff', letterSpacing: -1 }}>{c.emoji}</div>
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ fontFamily: KD.fontSerif, fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>{c.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                  <div style={{ flex: 1, height: 4, background: KD.bgSoft, border: `1px solid ${KD.ink}`, borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${60 + i * 7}%`, height: '100%', background: KD.accent3 }} />
                  </div>
                  <div style={{ fontFamily: KD.fontMono, fontSize: 10, color: KD.inkMute }}>{60 + i * 7}%</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: KD.inkSoft }}>
                  <span>{c.topics} topics</span>
                  {c.due > 0 && <span style={{ padding: '2px 6px', background: KD.accent, color: '#fff', fontFamily: KD.fontMono, fontSize: 10, fontWeight: 700, borderRadius: 4, border: `1px solid ${KD.ink}` }}>{c.due} due</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </KShell>
  );
}

// ─── Screen 2: Course Detail ──────────────────────────────
function KanjiDesktopCourse() {
  return (
    <KShell active="courses">
      {/* hero */}
      <div style={{ background: KD.accent, color: '#fff', padding: '28px 28px 32px', borderBottom: `2.5px solid ${KD.ink}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 30, right: 40 }}><KStar c={KD.accent2} s={28}/></div>
        <div style={{ position: 'absolute', bottom: 20, right: 120, transform: 'rotate(-10deg)' }}><KSqui c="#fff" w={50}/></div>
        <div style={{ fontFamily: KD.fontMono, fontSize: 11, letterSpacing: 2 }}>CS-3305 · SPRING '26 · PROF. REYES</div>
        <div style={{ fontFamily: KD.fontSerif, fontSize: 48, fontWeight: 900, lineHeight: 0.95, letterSpacing: -1.5, marginTop: 8 }}>Database Systems</div>
        <div style={{ display: 'flex', gap: 20, marginTop: 18 }}>
          {[{ v: '141', l: 'cards' }, { v: '6', l: 'topics' }, { v: '68%', l: 'mastery' }, { v: '12', l: 'day streak' }].map((s, i) => (
            <div key={i}>
              <div style={{ fontFamily: KD.fontSerif, fontSize: 30, fontWeight: 900, lineHeight: 1, letterSpacing: -0.8 }}>{s.v}</div>
              <div style={{ fontFamily: KD.fontMono, fontSize: 10, letterSpacing: 1 }}>{s.l.toUpperCase()}</div>
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 8, alignSelf: 'flex-end' }}>
            <KBtn bg="#fff" color={KD.ink}>⚙ Settings</KBtn>
            <KBtn bg={KD.ink} color="#fff">▶ Study all due</KBtn>
          </div>
        </div>
      </div>

      <div style={{ padding: 28, display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24 }}>
        {/* topics list */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontFamily: KD.fontSerif, fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>Topics</div>
            <div style={{ fontFamily: KD.fontMono, fontSize: 11, color: KD.inkMute }}>6 · 141 CARDS</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {DB_TOPICS.map((t, i) => {
              const badgeColors = [KD.accent3, KD.accent2, KD.accent4, KD.accent, KD.accent5, KD.accent3];
              return (
                <div key={i} style={{ padding: 14, borderRadius: 12, background: '#fff', border: `2px solid ${KD.ink}`, boxShadow: `3px 3px 0 ${KD.ink}`, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 42, height: 42, background: badgeColors[i], border: `1.5px solid ${KD.ink}`, borderRadius: 8, display: 'grid', placeItems: 'center', color: '#fff', fontFamily: KD.fontSerif, fontSize: 16, fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ fontFamily: KD.fontSerif, fontSize: 15.5, fontWeight: 700 }}>{t.name}</div>
                      {t.due > 0 && <span style={{ padding: '2px 7px', background: KD.accent, color: '#fff', fontFamily: KD.fontMono, fontSize: 10, fontWeight: 700, borderRadius: 4, border: `1px solid ${KD.ink}` }}>{t.due} due</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                      <div style={{ flex: 1, maxWidth: 340, height: 6, background: KD.bgSoft, border: `1px solid ${KD.ink}`, borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${t.mastery * 100}%`, height: '100%', background: t.mastery > 0.7 ? KD.accent3 : t.mastery > 0.4 ? KD.accent2 : KD.accent }} />
                      </div>
                      <div style={{ fontFamily: KD.fontMono, fontSize: 10, color: KD.inkMute, width: 32 }}>{Math.round(t.mastery * 100)}%</div>
                      <div style={{ fontFamily: KD.fontMono, fontSize: 10, color: KD.inkMute }}>· {t.cards} cards</div>
                    </div>
                  </div>
                  <KBtn bg={KD.bgSoft} color={KD.ink} pad="7px 12px">Study →</KBtn>
                </div>
              );
            })}
          </div>
        </div>

        {/* side: AI generating + materials */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: KD.accent2, border: `2px solid ${KD.ink}`, borderRadius: 14, boxShadow: `4px 4px 0 ${KD.ink}`, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, background: '#fff', border: `1.5px solid ${KD.ink}`, borderRadius: 8, display: 'grid', placeItems: 'center' }}>✦</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                  Brewing flashcards
                  <span style={{ display: 'flex', gap: 3 }}>
                    <span className="gen-dot" style={{ width: 4, height: 4, borderRadius: 2, background: KD.ink, display: 'inline-block' }} />
                    <span className="gen-dot" style={{ width: 4, height: 4, borderRadius: 2, background: KD.ink, display: 'inline-block' }} />
                    <span className="gen-dot" style={{ width: 4, height: 4, borderRadius: 2, background: KD.ink, display: 'inline-block' }} />
                  </span>
                </div>
                <div style={{ fontFamily: KD.fontMono, fontSize: 10, marginTop: 1 }}>Query-opt.pdf · 17 / 24 pp</div>
              </div>
            </div>
            <div style={{ marginTop: 10, height: 6, background: '#fff', border: `1.5px solid ${KD.ink}`, borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: '70%', height: '100%', background: KD.ink }}/>
            </div>
            <div style={{ fontFamily: KD.fontAccent, fontSize: 14, marginTop: 6 }}>~ 3 new cards so far</div>
          </div>
          <div style={{ background: '#fff', border: `2px solid ${KD.ink}`, borderRadius: 14, boxShadow: `4px 4px 0 ${KD.ink}`, padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontFamily: KD.fontSerif, fontSize: 16, fontWeight: 800 }}>Materials</div>
              <div style={{ fontFamily: KD.fontMono, fontSize: 10, color: KD.inkMute }}>4 FILES</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
              {[
                { n: 'Lecture 7 — Transactions.pdf', s: '2.4 MB · 22 cards' },
                { n: 'Lecture 8 — Query Opt.pdf', s: '3.1 MB · processing…' },
                { n: 'Normalization worksheet.pdf', s: '0.8 MB · 12 cards' },
                { n: 'Midterm review.pptx', s: '5.2 MB · 18 cards' },
              ].map((f, i) => (
                <div key={i} style={{ padding: '8px 10px', background: KD.bgSoft, border: `1.5px solid ${KD.ink}`, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 26, height: 26, background: KD.accent, border: `1.5px solid ${KD.ink}`, borderRadius: 4, display: 'grid', placeItems: 'center', color: '#fff', fontFamily: KD.fontMono, fontSize: 9, fontWeight: 700, flexShrink: 0 }}>PDF</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.n}</div>
                    <div style={{ fontFamily: KD.fontMono, fontSize: 10, color: KD.inkMute }}>{f.s}</div>
                  </div>
                </div>
              ))}
            </div>
            <button style={{ width: '100%', padding: 10, marginTop: 8, background: '#fff', border: `2px dashed ${KD.ink}`, borderRadius: 8, fontFamily: KD.font, fontWeight: 700, fontSize: 12, cursor: 'pointer', color: KD.ink }}>+ Drop files or click to upload</button>
          </div>
        </div>
      </div>
    </KShell>
  );
}

// ─── Screen 3: Study Session ────────────────────────────
function KanjiDesktopStudy() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: KD.font, color: KD.ink, background: KD.bg, position: 'relative' }}>
      {/* top bar */}
      <div style={{ padding: '14px 28px', borderBottom: `2px solid ${KD.ink}`, display: 'flex', alignItems: 'center', gap: 16, background: KD.bgSoft }}>
        <KBtn bg="#fff" color={KD.ink} pad="6px 12px">✕ Exit</KBtn>
        <div>
          <div style={{ fontFamily: KD.fontMono, fontSize: 10, letterSpacing: 1.5, color: KD.inkMute, fontWeight: 700 }}>DATABASE SYSTEMS / CS-3305</div>
          <div style={{ fontFamily: KD.fontSerif, fontSize: 20, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1 }}>Transactions & ACID</div>
        </div>
        <div style={{ flex: 1, margin: '0 20px' }}>
          <div style={{ display: 'flex', gap: 3, marginBottom: 4 }}>
            {Array.from({ length: 22 }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 8, borderRadius: 3, background: i < 6 ? KD.accent3 : i === 6 ? KD.accent : KD.bgSoft, border: i <= 6 ? `1.5px solid ${KD.ink}` : `1.5px solid rgba(28,25,23,0.15)` }}/>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: KD.fontMono, fontSize: 10, color: KD.inkMute }}>
            <span>CARD 07 / 22</span>
            <span>~ 15 min left</span>
          </div>
        </div>
        <div style={{ padding: '6px 12px', background: '#fff', border: `2px solid ${KD.ink}`, borderRadius: 8, fontFamily: KD.fontMono, fontWeight: 700, fontSize: 13 }}>⏱ 04:28</div>
      </div>

      {/* body */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 320px', gap: 0, minHeight: 0 }}>
        {/* main */}
        <div style={{ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 40, left: 60 }}><KStar c={KD.accent} s={22}/></div>
          <div style={{ position: 'absolute', bottom: 120, right: 80, transform: 'rotate(-14deg)' }}><KSqui c={KD.accent3} w={50}/></div>

          {/* card */}
          <div style={{ width: '100%', maxWidth: 640, aspectRatio: '16 / 10', borderRadius: 22, background: '#fff', border: `3px solid ${KD.ink}`, boxShadow: `8px 8px 0 ${KD.ink}`, padding: 30, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 20, right: 24 }}><KStar c={KD.accent2} s={20}/></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ padding: '3px 9px', background: KD.ink, color: '#fff', fontFamily: KD.fontMono, fontSize: 11, fontWeight: 700, borderRadius: 4 }}>Q · 07</div>
              <div style={{ fontFamily: KD.fontMono, fontSize: 11, color: KD.inkMute, fontWeight: 600 }}>DB / ACID / ISOLATION</div>
            </div>
            <div style={{ fontFamily: KD.fontMono, fontSize: 10, letterSpacing: 1, color: KD.inkMute, marginTop: 16 }}>QUESTION</div>
            <div style={{ fontFamily: KD.fontSerif, fontSize: 22, fontWeight: 600, lineHeight: 1.3, color: KD.inkSoft, marginTop: 4 }}>
              {FLASHCARD.q}
            </div>
            <div style={{ height: 2, background: KD.ink, margin: '18px 0', borderRadius: 1 }}/>
            <div style={{ fontFamily: KD.fontMono, fontSize: 10, letterSpacing: 1, color: KD.accent3, fontWeight: 700 }}>ANSWER</div>
            <div style={{ fontSize: 16.5, lineHeight: 1.55, color: KD.ink, marginTop: 6 }}>
              {FLASHCARD.a}
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', background: KD.bgSoft, border: `1.5px solid ${KD.ink}`, borderRadius: 8, fontSize: 11, fontFamily: KD.fontMono, color: KD.inkSoft, alignSelf: 'flex-start' }}>
              📄 {FLASHCARD.source}
            </div>
          </div>

          {/* rating row */}
          <div style={{ marginTop: 22, width: '100%', maxWidth: 640 }}>
            <div style={{ fontFamily: KD.fontAccent, textAlign: 'center', fontSize: 19, fontWeight: 700, color: KD.inkSoft, marginBottom: 10 }}>How well did you know it?</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[
                { l: 'Hard', s: '< 10m', c: KD.accent, k: '1', tc: '#fff' },
                { l: 'Okay', s: '2 days', c: KD.accent2, k: '2', tc: KD.ink },
                { l: 'Easy', s: '9 days', c: KD.accent3, k: '3', tc: '#fff' },
              ].map((r, i) => (
                <button key={i} style={{ padding: '16px 10px', background: r.c, color: r.tc, border: `2.5px solid ${KD.ink}`, borderRadius: 12, boxShadow: `4px 4px 0 ${KD.ink}`, fontFamily: KD.font, fontWeight: 800, fontSize: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, cursor: 'pointer' }}>
                  {r.l}
                  <span style={{ fontFamily: KD.fontMono, fontSize: 11, fontWeight: 600, opacity: 0.85 }}>{r.s}</span>
                  <span style={{ marginTop: 6, padding: '2px 7px', background: r.tc === '#fff' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)', borderRadius: 4, fontFamily: KD.fontMono, fontSize: 9, fontWeight: 700 }}>press {r.k}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* right rail */}
        <div style={{ borderLeft: `2px solid ${KD.ink}`, background: KD.bgSoft, padding: 20, display: 'flex', flexDirection: 'column', gap: 14, overflow: 'auto' }}>
          <div>
            <div style={{ fontFamily: KD.fontMono, fontSize: 10, letterSpacing: 1.5, color: KD.inkMute, fontWeight: 700, marginBottom: 8 }}>THIS SESSION</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { v: '4', l: 'Easy', c: KD.accent3 },
                { v: '1', l: 'Okay', c: KD.accent2 },
                { v: '1', l: 'Hard', c: KD.accent },
                { v: '15', l: 'Left', c: KD.ink },
              ].map((s, i) => (
                <div key={i} style={{ padding: 10, background: '#fff', border: `1.5px solid ${KD.ink}`, borderRadius: 8 }}>
                  <div style={{ fontFamily: KD.fontSerif, fontSize: 22, fontWeight: 800, color: s.c, lineHeight: 1, letterSpacing: -0.5 }}>{s.v}</div>
                  <div style={{ fontFamily: KD.fontMono, fontSize: 10, color: KD.inkMute, marginTop: 2 }}>{s.l.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: 12, background: '#fff', border: `1.5px solid ${KD.ink}`, borderRadius: 10 }}>
            <div style={{ fontFamily: KD.fontMono, fontSize: 10, letterSpacing: 1, color: KD.inkMute, fontWeight: 700, marginBottom: 4 }}>HINT</div>
            <div style={{ fontSize: 12.5, color: KD.inkSoft, lineHeight: 1.4 }}>{FLASHCARD.hint}</div>
          </div>
          <div style={{ padding: 12, background: KD.accent4, color: '#fff', border: `1.5px solid ${KD.ink}`, borderRadius: 10 }}>
            <div style={{ fontFamily: KD.fontMono, fontSize: 10, letterSpacing: 1, fontWeight: 700, marginBottom: 4 }}>NEXT INTERVAL</div>
            <div style={{ fontFamily: KD.fontSerif, fontSize: 22, fontWeight: 800, lineHeight: 1 }}>If "Okay" → 2 days</div>
            <div style={{ fontSize: 11, opacity: 0.85, marginTop: 4 }}>Returns Sunday at ~9:30. We'll book it into your calendar after the session.</div>
          </div>
          <div>
            <div style={{ fontFamily: KD.fontMono, fontSize: 10, letterSpacing: 1.5, color: KD.inkMute, fontWeight: 700, marginBottom: 8 }}>RECENT RATINGS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {[
                { q: 'What is a transaction log?', r: 'Easy', c: KD.accent3 },
                { q: 'Define BCNF.', r: 'Okay', c: KD.accent2 },
                { q: '2PL protocol?', r: 'Hard', c: KD.accent },
                { q: 'Difference between CR & UR?', r: 'Easy', c: KD.accent3 },
              ].map((x, i) => (
                <div key={i} style={{ padding: '6px 10px', background: '#fff', border: `1.5px solid ${KD.ink}`, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5 }}>
                  <span style={{ padding: '1px 6px', background: x.c, color: x.c === KD.accent2 ? KD.ink : '#fff', fontFamily: KD.fontMono, fontSize: 9, fontWeight: 700, borderRadius: 3, flexShrink: 0 }}>{x.r.toUpperCase()}</span>
                  <span style={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{x.q}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Screen 4: Calendar + conflict ─────────────────────────
function KanjiDesktopCalendar() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayNums = [14, 15, 16, 17, 18, 19, 20];
  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16];
  // events: [day, startHr, durHr, label, color, kind]
  const events = [
    [0, 9, 1.5, 'CS-3305 Lecture', KD.accent4, 'busy'],
    [1, 10, 1, 'LA Problem set', KD.accent2, 'busy'],
    [2, 13, 1, 'Study · OC', KD.accent3, 'review'],
    [4, 9, 2, 'CS-3305 Lab', KD.accent4, 'busy'],   // Fri
    [4, 11, 0.5, 'DB Review', KD.accent, 'suggested'],   // Fri
    [4, 12, 1, 'Lunch · Elena', KD.accent5, 'busy'],
    [5, 10, 0.5, 'Study · PH', KD.accent5, 'review'],
    [6, 11, 1, 'Study · LA', KD.accent2, 'review'],
  ];

  return (
    <KShell
      active="calendar"
      subtitle="WEEK 16 · APR 14 — APR 20"
      title={<>Review schedule <span style={{ marginLeft: 6, display: 'inline-block' }}><KStar c={KD.accent2} s={22}/></span></>}
      actions={<><KBtn bg="#fff" color={KD.ink}>◀ Prev</KBtn><KBtn bg="#fff" color={KD.ink}>Next ▶</KBtn><KBtn bg={KD.ink} color="#fff">Sync Google Cal ✓</KBtn></>}
    >
      {/* conflict banner */}
      <div style={{ margin: '18px 28px 0', padding: 16, background: KD.accent2, border: `2.5px solid ${KD.ink}`, borderRadius: 14, boxShadow: `4px 4px 0 ${KD.ink}`, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 40, height: 40, background: KD.ink, borderRadius: 8, display: 'grid', placeItems: 'center', color: KD.accent2, fontSize: 18, fontWeight: 700 }}>!</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: KD.fontSerif, fontSize: 17, fontWeight: 800 }}>Calendar conflict · Friday 10:00</div>
          <div style={{ fontSize: 12, color: KD.inkSoft, marginTop: 2 }}>DB review collides with CS-3305 Lab. Nearest free slot: <strong style={{ color: KD.ink }}>Fri 11:00 (+1 hr)</strong>.</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <KBtn bg="#fff" color={KD.ink} pad="9px 14px">Pick another</KBtn>
          <KBtn bg={KD.ink} color="#fff" pad="9px 14px">Accept 11:00 →</KBtn>
        </div>
      </div>

      {/* upcoming reviews — moved ABOVE week grid */}
      <div style={{ padding: '18px 28px 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontFamily: KD.fontSerif, fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>Upcoming reviews</div>
          <div style={{ fontFamily: KD.fontMono, fontSize: 11, color: KD.inkMute, letterSpacing: 1 }}>NEXT 7 DAYS · 3 GROUPS</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { day: 'SAT', d: '19', sess: '2 sessions · 32 cards', c: KD.accent4, t: '9:30 & 14:00' },
            { day: 'MON', d: '21', sess: '3 sessions · 48 cards', c: KD.accent, t: '8:00 · 11:00 · 16:30' },
            { day: 'WED', d: '23', sess: '1 session · 18 cards', c: KD.accent5, t: '10:30 — 10:50' },
          ].map((w, i) => (
            <div key={i} style={{ padding: 14, background: '#fff', border: `2px solid ${KD.ink}`, borderRadius: 12, boxShadow: `3px 3px 0 ${KD.ink}`, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 54, height: 60, background: w.c, border: `1.5px solid ${KD.ink}`, borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                <div style={{ fontFamily: KD.fontMono, fontSize: 9, fontWeight: 700 }}>{w.day}</div>
                <div style={{ fontFamily: KD.fontSerif, fontSize: 22, fontWeight: 900, letterSpacing: -0.5, lineHeight: 1 }}>{w.d}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: KD.fontSerif, fontSize: 14, fontWeight: 700 }}>{w.sess}</div>
                <div style={{ fontFamily: KD.fontMono, fontSize: 10, color: KD.inkMute, marginTop: 4 }}>{w.t}</div>
              </div>
              <div style={{ color: KD.inkMute, fontSize: 16 }}>→</div>
            </div>
          ))}
        </div>
      </div>

      {/* week grid */}
      <div style={{ padding: '18px 28px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontFamily: KD.fontSerif, fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>Week view</div>
          <div style={{ fontFamily: KD.fontMono, fontSize: 11, color: KD.inkMute, letterSpacing: 1 }}>APR 14 — APR 20</div>
        </div>
        <div style={{ background: '#fff', border: `2.5px solid ${KD.ink}`, borderRadius: 14, boxShadow: `5px 5px 0 ${KD.ink}`, overflow: 'hidden' }}>
          {/* day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', borderBottom: `2px solid ${KD.ink}`, background: KD.bgSoft }}>
            <div />
            {days.map((d, i) => (
              <div key={i} style={{ padding: '10px 12px', borderLeft: `1.5px solid ${KD.ink}`, textAlign: 'center', background: i === 4 ? KD.accent2 : 'transparent' }}>
                <div style={{ fontFamily: KD.fontMono, fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>{d.toUpperCase()}</div>
                <div style={{ fontFamily: KD.fontSerif, fontSize: 22, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1 }}>{dayNums[i]}</div>
              </div>
            ))}
          </div>
          {/* body */}
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', gridAutoRows: 54 }}>
            {hours.map((h, ri) => (
              <React.Fragment key={h}>
                <div style={{ padding: '4px 8px', fontFamily: KD.fontMono, fontSize: 10, color: KD.inkMute, borderTop: ri === 0 ? 'none' : `1px solid rgba(28,25,23,0.1)`, textAlign: 'right' }}>
                  {h}:00
                </div>
                {days.map((_, di) => (
                  <div key={di} style={{ borderLeft: `1.5px solid rgba(28,25,23,0.1)`, borderTop: ri === 0 ? 'none' : `1px solid rgba(28,25,23,0.08)`, position: 'relative' }}/>
                ))}
              </React.Fragment>
            ))}
            {/* events overlay */}
            {events.map((e, i) => {
              const [day, start, dur, label, color, kind] = e;
              const top = (start - 8) * 54;
              const height = dur * 54 - 4;
              const leftPct = (60 / 100); // placeholder
              return (
                <div key={i} style={{
                  position: 'absolute', top: top + 2, height,
                  left: `calc(60px + ${day} * ((100% - 60px) / 7) + 3px)`,
                  width: `calc((100% - 60px) / 7 - 6px)`,
                  background: kind === 'suggested' ? color : kind === 'review' ? '#fff' : color,
                  color: kind === 'review' ? KD.ink : '#fff',
                  border: `2px solid ${KD.ink}`, borderRadius: 8,
                  padding: '4px 8px', fontSize: 11, fontWeight: 700, lineHeight: 1.2,
                  boxShadow: kind === 'suggested' ? `3px 3px 0 ${KD.ink}` : 'none',
                  overflow: 'hidden',
                  ...(kind === 'review' ? { borderStyle: 'dashed' } : {}),
                  ...(kind === 'suggested' ? { zIndex: 5 } : {}),
                }}>
                  {kind === 'suggested' && (
                    <div style={{ fontFamily: KD.fontMono, fontSize: 9, letterSpacing: 1, marginBottom: 2 }}>✦ SUGGESTED</div>
                  )}
                  {kind === 'review' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: KD.fontMono, fontSize: 9, color: color, letterSpacing: 1, marginBottom: 2 }}>
                      <div style={{ width: 7, height: 7, background: color, borderRadius: 2, border: `1px solid ${KD.ink}` }}/>REVIEW
                    </div>
                  )}
                  <div style={{ fontFamily: KD.fontSerif, fontSize: 12, fontWeight: 800 }}>{label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </KShell>
  );
}

// ─── Screen 5: New Course (right sheet) ─────────────────────────
function KanjiDesktopNewCourse() {
  return (
    <div style={{ width: '100%', height: '100%', fontFamily: KD.font, color: KD.ink, background: KD.bg, display: 'flex', position: 'relative' }}>
      <KSidebar active="courses" />
      {/* dimmed courses page behind */}
      <div style={{ flex: 1, minWidth: 0, overflow: 'hidden', background: KD.bg, position: 'relative', filter: 'blur(1px)', opacity: 0.55 }}>
        <div style={{ padding: '18px 28px 14px', borderBottom: `2px solid ${KD.ink}` }}>
          <div style={{ fontFamily: KD.fontMono, fontSize: 10, letterSpacing: 1.5, color: KD.inkMute, fontWeight: 700 }}>SPRING '26</div>
          <div style={{ fontFamily: KD.fontSerif, fontSize: 34, fontWeight: 800, letterSpacing: -0.8, lineHeight: 1, marginTop: 4 }}>Courses</div>
        </div>
        <div style={{ padding: 28, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[KD.accent, KD.accent4, KD.accent2, KD.accent3, KD.accent5, KD.accent].map((c, i) => (
            <div key={i} style={{ height: 150, background: '#fff', border: `2px solid ${KD.ink}`, borderRadius: 14, boxShadow: `4px 4px 0 ${KD.ink}`, overflow: 'hidden' }}>
              <div style={{ height: 54, background: c, borderBottom: `2px solid ${KD.ink}` }} />
              <div style={{ padding: 14 }}>
                <div style={{ height: 12, background: KD.bgSoft, borderRadius: 3, marginBottom: 8 }} />
                <div style={{ height: 4, background: KD.bgSoft, borderRadius: 2, marginBottom: 8 }} />
                <div style={{ height: 4, width: '60%', background: KD.bgSoft, borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* sheet backdrop */}
      <div className="sheet-backdrop" style={{ position: 'absolute', inset: 0, left: 220, background: 'rgba(28,25,23,0.42)' }}/>

      {/* sheet from right */}
      <div className="sheet-slide-in" style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: 540,
        background: KD.bg, borderLeft: `3px solid ${KD.ink}`,
        boxShadow: `-20px 0 50px rgba(28,25,23,0.3)`,
        display: 'flex', flexDirection: 'column',
      }}>
        {/* drag handle on left edge */}
        <div style={{ position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)', width: 4, height: 64, borderRadius: 2, background: 'rgba(28,25,23,0.2)' }}/>

        {/* header */}
        <div style={{ padding: '16px 22px', borderBottom: `2px solid ${KD.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: KD.bgSoft }}>
          <div style={{ fontFamily: KD.fontMono, fontSize: 11, letterSpacing: 2, background: KD.ink, color: KD.bg, padding: '4px 10px', borderRadius: 4, fontWeight: 700 }}>NEW COURSE</div>
          <button aria-label="Dismiss sheet" style={{ width: 32, height: 32, borderRadius: 8, border: `2px solid ${KD.ink}`, background: '#fff', cursor: 'pointer', boxShadow: `2px 2px 0 ${KD.ink}`, display: 'grid', placeItems: 'center' }}>
            <IconChevronR size={16} color={KD.ink} />
          </button>
        </div>
        {/* body */}
        <div style={{ padding: 24, overflow: 'auto', flex: 1 }}>
            <div style={{ fontFamily: KD.fontSerif, fontSize: 30, fontWeight: 800, lineHeight: 1.0, letterSpacing: -0.8 }}>
              Name your
              <span style={{ display: 'inline-block', position: 'relative', marginLeft: 8 }}>
                new course.
                <span style={{ position: 'absolute', left: -4, right: -4, bottom: 4, height: 10, background: KD.accent2, zIndex: -1, transform: 'rotate(-1deg)' }} />
              </span>
            </div>

            {/* preview */}
            <div style={{ marginTop: 18, padding: 18, background: KD.accent, color: '#fff', border: `2.5px solid ${KD.ink}`, borderRadius: 14, boxShadow: `5px 5px 0 ${KD.ink}`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 10, right: 14 }}><KStar c={KD.accent2} s={18}/></div>
              <div style={{ fontFamily: KD.fontMono, fontSize: 10, letterSpacing: 1.5 }}>CS-3305 · SPRING '26 · PROF. REYES</div>
              <div style={{ fontFamily: KD.fontSerif, fontSize: 30, fontWeight: 900, lineHeight: 1, letterSpacing: -0.8, marginTop: 6 }}>Database Systems</div>
              <div style={{ fontSize: 12, marginTop: 10, opacity: 0.9 }}>0 topics · 0 cards · awaiting materials</div>
            </div>

            {/* form */}
            <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontFamily: KD.fontMono, fontSize: 10, letterSpacing: 1, color: KD.inkMute, fontWeight: 700, marginBottom: 6 }}>COURSE NAME</div>
                <div style={{ padding: '11px 14px', borderRadius: 10, background: '#fff', border: `2px solid ${KD.ink}`, boxShadow: `2px 2px 0 ${KD.ink}`, fontSize: 15, display: 'flex', alignItems: 'center' }}>
                  Database Systems
                  <div style={{ width: 2, height: 18, background: KD.accent, marginLeft: 2 }} />
                </div>
              </div>
              <div>
                <div style={{ fontFamily: KD.fontMono, fontSize: 10, letterSpacing: 1, color: KD.inkMute, fontWeight: 700, marginBottom: 6 }}>CODE</div>
                <div style={{ padding: '11px 14px', borderRadius: 10, background: '#fff', border: `2px solid ${KD.ink}`, boxShadow: `2px 2px 0 ${KD.ink}`, fontSize: 15, fontFamily: KD.fontMono, fontWeight: 600 }}>CS-3305</div>
              </div>
              <div>
                <div style={{ fontFamily: KD.fontMono, fontSize: 10, letterSpacing: 1, color: KD.inkMute, fontWeight: 700, marginBottom: 6 }}>TERM</div>
                <div style={{ padding: '11px 14px', borderRadius: 10, background: '#fff', border: `2px solid ${KD.ink}`, boxShadow: `2px 2px 0 ${KD.ink}`, fontSize: 15 }}>Spring '26</div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontFamily: KD.fontMono, fontSize: 10, letterSpacing: 1, color: KD.inkMute, fontWeight: 700, marginBottom: 8 }}>COLOR</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[KD.accent, KD.accent2, KD.accent3, KD.accent4, KD.accent5, '#FF8A3D', '#00A6A6', '#6B4B9B'].map((col, i) => (
                    <div key={i} style={{
                      width: 34, height: 34, borderRadius: 8, background: col,
                      border: `2px solid ${KD.ink}`, boxShadow: `2px 2px 0 ${KD.ink}`,
                      transform: i === 0 ? 'translate(-1px, -1px)' : undefined,
                      position: 'relative',
                    }}>
                      {i === 0 && <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 14, fontWeight: 900 }}>✓</div>}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontFamily: KD.fontMono, fontSize: 10, letterSpacing: 1, color: KD.inkMute, fontWeight: 700, marginBottom: 6 }}>DROP YOUR FIRST MATERIALS (OPTIONAL)</div>
                <div style={{ padding: 18, background: '#fff', border: `2px dashed ${KD.ink}`, borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ fontFamily: KD.fontSerif, fontSize: 15, fontWeight: 700 }}>Drop PDFs or slides here</div>
                  <div style={{ fontSize: 11, color: KD.inkMute, marginTop: 2 }}>or click to browse · PDF, PPTX, DOCX</div>
                </div>
              </div>
            </div>
          </div>
          {/* footer */}
          <div style={{ padding: '14px 22px', borderTop: `2px solid ${KD.ink}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: KD.bgSoft }}>
            <div style={{ fontFamily: KD.fontAccent, fontSize: 16, color: KD.inkSoft }}>you can always edit this later ✨</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <KBtn bg="#fff" color={KD.ink}>Cancel</KBtn>
              <KBtn bg={KD.accent} color="#fff" pad="10px 16px">Create course →</KBtn>
            </div>
          </div>
      </div>
    </div>
  );
}

// ─── Screen 6: Onboarding / Sign-in ─────────────────────────
function KanjiDesktopOnboarding() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', fontFamily: KD.font, color: KD.ink, background: KD.bg, position: 'relative', overflow: 'hidden' }}>
      {/* left: hero */}
      <div style={{ flex: 1.2, padding: '40px 48px', display: 'flex', flexDirection: 'column', position: 'relative', borderRight: `2px solid ${KD.ink}` }}>
        <div style={{ position: 'absolute', top: 60, right: 60 }}><KStar c={KD.accent} s={28}/></div>
        <div style={{ position: 'absolute', top: 130, right: 110, transform: 'rotate(-12deg)' }}><KSqui c={KD.accent3} w={56}/></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: KD.accent, border: `2px solid ${KD.ink}`, display: 'grid', placeItems: 'center', color: '#fff', fontFamily: KD.fontSerif, fontWeight: 900, fontSize: 16, boxShadow: `2px 2px 0 ${KD.ink}` }}>R</div>
          <div style={{ fontFamily: KD.fontSerif, fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>Recall</div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 500 }}>
          <div style={{ fontFamily: KD.fontMono, fontSize: 11, letterSpacing: 2, color: KD.inkMute, fontWeight: 700 }}>v1 · SPRING '26</div>
          <h1 style={{ fontFamily: KD.fontSerif, fontSize: 64, fontWeight: 900, lineHeight: 0.95, letterSpacing: -2, margin: '12px 0 0' }}>
            Cram less.<br/>
            <span style={{ display: 'inline-block', position: 'relative' }}>
              Know more.
              <span style={{ position: 'absolute', left: -6, right: -6, bottom: 8, height: 14, background: KD.accent2, zIndex: -1, transform: 'rotate(-1deg)' }} />
            </span>
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.5, color: KD.inkSoft, marginTop: 18, maxWidth: 440 }}>
            Drop your lecture slides. We'll turn them into flashcards, schedule reviews into your calendar, and keep them coming back at the right interval.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
            <KBtn bg={KD.accent} color="#fff" pad="13px 22px">Continue with Google →</KBtn>
            <KBtn bg="#fff" color={KD.ink} pad="13px 22px">Use email</KBtn>
          </div>
          <div style={{ marginTop: 18, fontFamily: KD.fontMono, fontSize: 11, color: KD.inkMute }}>FREE · NO CARD · STUDENT VERIFIED</div>
        </div>
      </div>
      {/* right: card cluster */}
      <div style={{ flex: 1, position: 'relative', background: KD.bgSoft, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 80, left: 60, transform: 'rotate(-8deg)' }}>
          <div style={{ width: 220, height: 270, background: KD.accent, color: '#fff', border: `3px solid ${KD.ink}`, boxShadow: `8px 8px 0 ${KD.ink}`, borderRadius: 18, padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: KD.fontMono, fontSize: 11, letterSpacing: 1 }}>Q · 04</div>
            <div style={{ fontFamily: KD.fontSerif, fontSize: 28, fontWeight: 700, lineHeight: 1.05 }}>Define 3rd Normal Form.</div>
            <KSqui c="#fff" w={48}/>
          </div>
        </div>
        <div style={{ position: 'absolute', top: 60, right: 60, transform: 'rotate(6deg)' }}>
          <div style={{ width: 220, height: 270, background: KD.accent2, border: `3px solid ${KD.ink}`, boxShadow: `8px 8px 0 ${KD.ink}`, borderRadius: 18, padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: KD.fontMono, fontSize: 11, letterSpacing: 1 }}>Q · 07</div>
            <div style={{ fontFamily: KD.fontSerif, fontSize: 26, fontWeight: 700, lineHeight: 1.1 }}>What does ACID stand for?</div>
            <KStar c={KD.ink} s={20}/>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 80, left: '50%', transform: 'translateX(-50%) rotate(-2deg)' }}>
          <div style={{ width: 280, height: 130, background: KD.accent3, color: '#fff', border: `3px solid ${KD.ink}`, boxShadow: `8px 8px 0 ${KD.ink}`, borderRadius: 18, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <div style={{ fontFamily: KD.fontSerif, fontSize: 22, fontWeight: 800 }}>✦ AI generated</div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>from your slides, in seconds</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Screen 7: Empty state ─────────────────────────
function KanjiDesktopEmpty() {
  return (
    <KShell
      active="courses"
      subtitle="SPRING '26 · 0 COURSES"
      title="Your courses"
      actions={<><KBtn bg="#fff" color={KD.ink}>🔍 Search</KBtn><KBtn bg={KD.accent} color="#fff">+ New course</KBtn></>}
    >
      <div style={{ padding: '48px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: 'calc(100% - 100px)' }}>
        <div style={{ position: 'relative', marginBottom: 32 }}>
          <div style={{ width: 200, height: 200, background: KD.accent2, border: `3px solid ${KD.ink}`, borderRadius: 32, boxShadow: `10px 10px 0 ${KD.ink}`, display: 'grid', placeItems: 'center', transform: 'rotate(-4deg)' }}>
            <IconBook size={92} color={KD.ink} />
          </div>
          <div style={{ position: 'absolute', top: -16, right: -20 }}><KStar c={KD.accent} s={36}/></div>
          <div style={{ position: 'absolute', bottom: -10, left: -28, padding: '6px 12px', background: '#fff', border: `2.5px solid ${KD.ink}`, fontFamily: KD.fontMono, fontSize: 12, fontWeight: 700, transform: 'rotate(-6deg)', boxShadow: `3px 3px 0 ${KD.ink}` }}>EMPTY</div>
        </div>
        <h2 style={{ fontFamily: KD.fontSerif, fontSize: 44, fontWeight: 900, lineHeight: 1.0, letterSpacing: -1.2, margin: 0 }}>No courses yet.</h2>
        <div style={{ fontFamily: KD.fontAccent, fontSize: 26, color: KD.accent, lineHeight: 1.1, marginTop: 8 }}>Let's fix that ✨</div>
        <p style={{ fontSize: 14.5, color: KD.inkSoft, lineHeight: 1.55, marginTop: 14, maxWidth: 460 }}>
          Create a course and drop in your syllabus or lecture slides. We'll generate flashcards and schedule reviews around your week.
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
          <KBtn bg={KD.accent} color="#fff" pad="13px 20px">+ Create your first course</KBtn>
          <KBtn bg="#fff" color={KD.ink} pad="13px 20px">Browse demo deck →</KBtn>
        </div>

        {/* small example cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 40, width: '100%', maxWidth: 720 }}>
          {[
            { c: KD.accent, l: 'PDF', n: 'Lecture slides' },
            { c: KD.accent3, l: 'PPTX', n: 'Class decks' },
            { c: KD.accent4, l: 'DOCX', n: 'Notes & syllabi' },
          ].map((b, i) => (
            <div key={i} style={{ padding: 14, background: '#fff', border: `2px solid ${KD.ink}`, borderRadius: 12, boxShadow: `3px 3px 0 ${KD.ink}`, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, background: b.c, border: `1.5px solid ${KD.ink}`, borderRadius: 6, display: 'grid', placeItems: 'center', color: '#fff', fontFamily: KD.fontMono, fontSize: 10, fontWeight: 700 }}>{b.l}</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: KD.fontSerif, fontSize: 14, fontWeight: 700 }}>{b.n}</div>
                <div style={{ fontFamily: KD.fontMono, fontSize: 10, color: KD.inkMute }}>drop or click to upload</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </KShell>
  );
}

Object.assign(window, {
  KanjiDesktopHome, KanjiDesktopCourse, KanjiDesktopStudy,
  KanjiDesktopCalendar, KanjiDesktopNewCourse,
  KanjiDesktopOnboarding, KanjiDesktopEmpty,
  KShell, KSidebar, KBtn, KD,
});
