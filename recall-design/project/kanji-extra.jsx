// Kanji — Library / Stats / Settings screens for mobile + desktop.

// ─── helpers (re-using KanjiTheme + KD declared in sibling files) ──
const _kStar = (c, s = 14) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z"/></svg>
);
const _kSqui = (c, w = 40) => (
  <svg width={w} height={10} viewBox="0 0 40 10"><path d="M1 5 Q 6 1 11 5 T 21 5 T 31 5 T 39 5" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
);

// ════════════════════════════════════════════════════════════
// MOBILE — Library
// ════════════════════════════════════════════════════════════
function KanjiLibrary() {
  const T = KanjiTheme;
  const tags = ['All', 'Due today', 'Hardest', 'Recent', 'DB', 'OC', 'PH'];
  const cards = [
    { c: T.accent,  cs: '#fff', q: 'What does ACID stand for?', t: 'DB · ACID', m: 0.34 },
    { c: T.accent2, cs: T.ink,  q: 'Define BCNF.', t: 'DB · Norm.', m: 0.62 },
    { c: T.accent3, cs: '#fff', q: 'SN1 vs. SN2 mechanism?', t: 'OC · Mech.', m: 0.78 },
    { c: T.accent4, cs: '#fff', q: 'What is a B-tree?', t: 'DB · Index', m: 0.55 },
    { c: T.accent5, cs: '#fff', q: 'Mind-Body problem — Descartes', t: 'PH · Mind', m: 0.48 },
    { c: '#fff',    cs: T.ink,  q: 'Eigenvalue intuition.', t: 'LA · Vec.', m: 0.81 },
  ];
  return (
    <PhoneFrame bg={T.bg}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none' }}>
        <svg width="100%" height="100%"><defs><pattern id="kglib" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="0.8" fill="#1C1917" opacity="0.12"/></pattern></defs><rect width="100%" height="100%" fill="url(#kglib)"/></svg>
      </div>
      <div style={{ position: 'relative', height: '100%', overflow: 'auto', fontFamily: T.font, color: T.ink }}>
        <div style={{ padding: '20px 22px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: T.fontMono, fontSize: 11, color: T.inkMute, letterSpacing: 1 }}>YOUR DECK</div>
              <div style={{ fontFamily: T.fontSerif, fontSize: 30, fontWeight: 800, lineHeight: 1, marginTop: 2, letterSpacing: -0.5 }}>
                Library
                <span style={{ display: 'inline-block', marginLeft: 6, transform: 'translateY(-3px)' }}>{_kStar(T.accent2, 18)}</span>
              </div>
            </div>
            <button style={{ width: 40, height: 40, borderRadius: 10, background: '#fff', border: `2px solid ${T.line}`, boxShadow: `2px 2px 0 ${T.line}`, display: 'grid', placeItems: 'center' }}>
              <IconSearch size={16} />
            </button>
          </div>

          {/* search */}
          <div style={{ marginTop: 14, padding: '11px 14px', background: '#fff', border: `2px solid ${T.line}`, borderRadius: 12, boxShadow: `2px 2px 0 ${T.line}`, display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconSearch size={15} color={T.inkMute} />
            <div style={{ flex: 1, fontSize: 13.5, color: T.inkMute }}>Search 386 cards…</div>
            <div style={{ padding: '2px 6px', background: T.bgSoft, border: `1px solid ${T.line}`, borderRadius: 4, fontFamily: T.fontMono, fontSize: 10, color: T.inkSoft }}>⌘K</div>
          </div>

          {/* counts */}
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {[
              { v: '386', l: 'cards', c: '#fff', tc: T.ink },
              { v: '48', l: 'due', c: T.accent, tc: '#fff' },
              { v: '6', l: 'hard', c: T.accent2, tc: T.ink },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, padding: 10, borderRadius: 12, background: s.c, border: `2px solid ${T.line}`, boxShadow: `2px 2px 0 ${T.line}`, color: s.tc }}>
                <div style={{ fontFamily: T.fontSerif, fontSize: 24, fontWeight: 800, lineHeight: 1, letterSpacing: -0.5 }}>{s.v}</div>
                <div style={{ fontFamily: T.fontMono, fontSize: 9, opacity: 0.7, marginTop: 1 }}>{s.l.toUpperCase()}</div>
              </div>
            ))}
          </div>

          {/* tags */}
          <div style={{ marginTop: 14, marginLeft: -22, marginRight: -22, paddingLeft: 22, paddingRight: 22, display: 'flex', gap: 6, overflowX: 'auto' }}>
            {tags.map((t, i) => (
              <div key={i} style={{
                padding: '6px 12px', borderRadius: 999, flexShrink: 0,
                background: i === 0 ? T.ink : '#fff', color: i === 0 ? T.bg : T.ink,
                border: `2px solid ${T.line}`, fontSize: 11.5, fontFamily: T.font, fontWeight: 700,
                boxShadow: i === 0 ? 'none' : `2px 2px 0 ${T.line}`,
              }}>{t}</div>
            ))}
          </div>
        </div>

        {/* card grid */}
        <div style={{ padding: '14px 22px 100px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {cards.map((c, i) => (
            <div key={i} style={{
              aspectRatio: '0.78', borderRadius: 14, background: c.c, color: c.cs,
              border: `2.5px solid ${T.line}`, boxShadow: `3px 3px 0 ${T.line}`,
              padding: 12, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              transform: i % 2 ? 'rotate(0.5deg)' : 'rotate(-0.5deg)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ padding: '2px 6px', borderRadius: 4, background: c.cs === T.ink ? T.ink : '#fff', color: c.cs === T.ink ? '#fff' : T.ink, fontFamily: T.fontMono, fontSize: 9, fontWeight: 700 }}>Q · {String(i + 1).padStart(2, '0')}</div>
                {c.m < 0.5 && <div style={{ width: 8, height: 8, borderRadius: 4, background: T.accent, border: `1.5px solid ${T.line}` }}/>}
              </div>
              <div style={{ fontFamily: T.fontSerif, fontSize: 14, fontWeight: 700, lineHeight: 1.2 }}>{c.q}</div>
              <div>
                <div style={{ height: 4, borderRadius: 2, background: c.cs === T.ink ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.3)', marginBottom: 4 }}>
                  <div style={{ width: `${c.m * 100}%`, height: '100%', background: c.m > 0.7 ? T.easy : c.m > 0.4 ? T.okay : T.hard, borderRadius: 2 }}/>
                </div>
                <div style={{ fontFamily: T.fontMono, fontSize: 9, opacity: 0.75 }}>{c.t}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', left: 20, right: 20, bottom: 16, padding: '8px 14px', borderRadius: 999, background: '#fff', border: `2.5px solid ${T.line}`, boxShadow: `4px 4px 0 ${T.line}`, display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 10 }}>
        {[
          { i: <IconHome size={18} /> },
          { i: <IconCards size={18} />, a: true },
          { i: <IconCal size={18} /> },
          { i: <IconProfile size={18} /> },
        ].map((n, i) => (
          <div key={i} style={{ padding: '8px 14px', borderRadius: 999, background: n.a ? T.ink : 'transparent', color: n.a ? T.bg : T.inkMute }}>{n.i}</div>
        ))}
      </div>
    </PhoneFrame>
  );
}

// ════════════════════════════════════════════════════════════
// MOBILE — Stats
// ════════════════════════════════════════════════════════════
function KanjiStats() {
  const T = KanjiTheme;
  const heatRows = 7, heatCols = 18;
  const heat = Array.from({ length: heatRows * heatCols }).map(() => Math.random());
  const bars = [0.6, 0.85, 0.7, 0.95, 0.55, 0.9, 0.4, 0.78, 0.88, 0.65, 0.82, 0.95, 1.0, 0.7];
  return (
    <PhoneFrame bg={T.bg}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none' }}>
        <svg width="100%" height="100%"><defs><pattern id="kgst" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="0.8" fill="#1C1917" opacity="0.12"/></pattern></defs><rect width="100%" height="100%" fill="url(#kgst)"/></svg>
      </div>
      <div style={{ position: 'relative', height: '100%', overflow: 'auto', fontFamily: T.font, color: T.ink }}>
        <div style={{ padding: '20px 22px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button style={{ width: 36, height: 36, borderRadius: 10, background: '#fff', border: `2px solid ${T.line}`, boxShadow: `2px 2px 0 ${T.line}`, display: 'grid', placeItems: 'center' }}><IconBack size={18}/></button>
            <div style={{ fontFamily: T.fontMono, fontSize: 11, letterSpacing: 2, background: T.ink, color: T.bg, padding: '4px 10px', borderRadius: 4 }}>STATS · APR</div>
            <IconMore size={20} color={T.inkSoft}/>
          </div>

          <h2 style={{ fontFamily: T.fontSerif, fontSize: 32, fontWeight: 800, lineHeight: 1.0, margin: '18px 0 0', letterSpacing: -0.5 }}>
            You're on a
            <span style={{ display: 'block', position: 'relative', width: 'fit-content' }}>
              roll, Maya.
              <span style={{ position: 'absolute', left: -4, right: -4, bottom: 4, height: 10, background: T.accent2, zIndex: -1, transform: 'rotate(-1deg)' }} />
            </span>
          </h2>
        </div>

        {/* hero stat */}
        <div style={{ margin: '16px 16px 0', padding: 18, borderRadius: 18, background: T.accent, color: '#fff', border: `2.5px solid ${T.line}`, boxShadow: `5px 5px 0 ${T.line}`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 14, right: 14 }}>{_kStar(T.accent2, 22)}</div>
          <div style={{ fontFamily: T.fontMono, fontSize: 10, letterSpacing: 1.5 }}>RETENTION · 30 DAYS</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
            <div style={{ fontFamily: T.fontSerif, fontSize: 64, fontWeight: 900, letterSpacing: -2, lineHeight: 0.9 }}>87%</div>
            <div style={{ fontSize: 13, opacity: 0.9 }}>+4 vs. last month</div>
          </div>
          {/* sparkline */}
          <div style={{ height: 50, display: 'flex', alignItems: 'flex-end', gap: 3, marginTop: 14 }}>
            {bars.map((b, i) => (
              <div key={i} style={{ flex: 1, height: `${b * 100}%`, background: i === bars.length - 2 ? '#fff' : 'rgba(255,255,255,0.55)', border: `1.5px solid ${T.line}`, borderRadius: 2 }}/>
            ))}
          </div>
        </div>

        {/* stat row */}
        <div style={{ padding: '12px 16px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { v: '12', l: 'STREAK', s: 'days', c: T.accent2, tc: T.ink, ico: <IconFlame size={20} color={T.accent}/> },
            { v: '386', l: 'CARDS', s: 'studied', c: '#fff', tc: T.ink, ico: _kStar(T.accent3, 18) },
            { v: '4.2h', l: 'TIME', s: 'this week', c: T.accent4, tc: '#fff', ico: <IconClock size={18} color="#fff"/> },
            { v: '92%', l: 'ON-TIME', s: 'reviews', c: T.accent3, tc: '#fff', ico: <IconCheck size={18} color="#fff"/> },
          ].map((s, i) => (
            <div key={i} style={{ padding: 12, borderRadius: 12, background: s.c, color: s.tc, border: `2px solid ${T.line}`, boxShadow: `3px 3px 0 ${T.line}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: T.fontMono, fontSize: 9, letterSpacing: 1, opacity: 0.8 }}>{s.l}</div>
                {s.ico}
              </div>
              <div style={{ fontFamily: T.fontSerif, fontSize: 28, fontWeight: 800, lineHeight: 1.1, letterSpacing: -0.5, marginTop: 4 }}>{s.v}</div>
              <div style={{ fontSize: 11, opacity: 0.85 }}>{s.s}</div>
            </div>
          ))}
        </div>

        {/* heatmap */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ padding: 14, borderRadius: 14, background: '#fff', border: `2px solid ${T.line}`, boxShadow: `3px 3px 0 ${T.line}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontFamily: T.fontSerif, fontSize: 16, fontWeight: 800 }}>Activity</div>
              <div style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMute }}>LAST 18 WEEKS</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${heatCols}, 1fr)`, gap: 2, marginTop: 10 }}>
              {heat.map((v, i) => {
                const op = v < 0.2 ? 0.08 : v < 0.5 ? 0.35 : v < 0.8 ? 0.65 : 1;
                return <div key={i} style={{ aspectRatio: '1', background: T.accent3, opacity: op, borderRadius: 2, border: `0.5px solid ${T.line}` }}/>;
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: T.fontMono, fontSize: 9, color: T.inkMute }}>
              <span>Less</span>
              <span>More</span>
            </div>
          </div>
        </div>

        {/* by course */}
        <div style={{ padding: '16px 16px 100px' }}>
          <div style={{ fontFamily: T.fontSerif, fontSize: 18, fontWeight: 800, marginBottom: 10 }}>By course</div>
          {[
            { n: 'Database Systems', m: 0.68, c: T.accent },
            { n: 'Linear Algebra', m: 0.81, c: T.accent2 },
            { n: 'Organic Chem.', m: 0.42, c: T.accent3 },
            { n: 'Philosophy', m: 0.74, c: T.accent5 },
          ].map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, background: '#fff', border: `2px solid ${T.line}`, borderRadius: 12, boxShadow: `2px 2px 0 ${T.line}`, marginBottom: 8 }}>
              <div style={{ width: 10, height: 36, background: c.c, border: `1.5px solid ${T.line}`, borderRadius: 3, flexShrink: 0 }}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{c.n}</div>
                <div style={{ height: 5, borderRadius: 2.5, background: T.bgSoft, border: `1px solid ${T.line}`, marginTop: 6, overflow: 'hidden' }}>
                  <div style={{ width: `${c.m * 100}%`, height: '100%', background: c.m > 0.7 ? T.easy : c.m > 0.5 ? T.okay : T.hard }}/>
                </div>
              </div>
              <div style={{ fontFamily: T.fontMono, fontSize: 12, fontWeight: 700, width: 36, textAlign: 'right' }}>{Math.round(c.m * 100)}%</div>
            </div>
          ))}
        </div>
      </div>
    </PhoneFrame>
  );
}

// ════════════════════════════════════════════════════════════
// MOBILE — Settings (standalone page)
// ════════════════════════════════════════════════════════════
function KanjiSettings() {
  const T = KanjiTheme;
  const Toggle = ({ on }) => (
    <div style={{ width: 38, height: 22, borderRadius: 11, background: on ? T.accent3 : '#fff', border: `2px solid ${T.line}`, position: 'relative', boxShadow: `1.5px 1.5px 0 ${T.line}` }}>
      <div style={{ position: 'absolute', top: 1, left: on ? 16 : 1, width: 16, height: 16, borderRadius: '50%', background: '#fff', border: `1.5px solid ${T.line}`, transition: 'left 0.2s' }}/>
    </div>
  );
  return (
    <PhoneFrame bg={T.bg}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none' }}>
        <svg width="100%" height="100%"><defs><pattern id="kgset" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="0.8" fill="#1C1917" opacity="0.12"/></pattern></defs><rect width="100%" height="100%" fill="url(#kgset)"/></svg>
      </div>
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 22px 12px', fontFamily: T.font, color: T.ink, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button aria-label="Back" style={{ width: 36, height: 36, borderRadius: 10, background: '#fff', border: `2px solid ${T.line}`, boxShadow: `2px 2px 0 ${T.line}`, display: 'grid', placeItems: 'center' }}>
            <IconBack size={16}/>
          </button>
          <div style={{ fontFamily: T.fontMono, fontSize: 11, letterSpacing: 2, background: T.ink, color: T.bg, padding: '4px 10px', borderRadius: 4 }}>SETTINGS</div>
          <div style={{ width: 36 }}/>
        </div>

        <h1 style={{ position: 'relative', fontFamily: T.fontSerif, fontSize: 32, fontWeight: 800, lineHeight: 1, margin: '0 22px 14px', letterSpacing: -0.5 }}>
          Account
          <span style={{ display: 'inline-block', marginLeft: 6, transform: 'translateY(-3px)' }}>{_kStar(T.accent2, 18)}</span>
        </h1>

        <div style={{ flex: 1, overflow: 'auto', padding: '0 22px 100px', fontFamily: T.font, color: T.ink }}>
          {/* profile card */}
          <div style={{ padding: 14, borderRadius: 16, background: T.accent5, color: '#fff', border: `2.5px solid ${T.line}`, boxShadow: `4px 4px 0 ${T.line}`, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: '#fff', color: T.accent5, border: `2px solid ${T.line}`, display: 'grid', placeItems: 'center', fontFamily: T.fontSerif, fontWeight: 900, fontSize: 18 }}>MK</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: T.fontSerif, fontSize: 18, fontWeight: 800, lineHeight: 1.1 }}>Maya Kapoor</div>
              <div style={{ fontFamily: T.fontMono, fontSize: 10.5, letterSpacing: 0.5, opacity: 0.9, marginTop: 2 }}>maya@uni.edu · Spring '26</div>
            </div>
            <div style={{ padding: '4px 9px', background: T.ink, color: T.accent2, borderRadius: 6, border: `1.5px solid ${T.line}`, fontFamily: T.fontMono, fontSize: 10, fontWeight: 700 }}>PRO</div>
          </div>

          {[
            {
              h: 'Study',
              rows: [
                { l: 'Daily reminder', s: '8:00 AM', toggle: true, on: true },
                { l: 'Sound on flip', s: 'Soft tick', toggle: true, on: false },
                { l: 'Daily card limit', s: '60 cards' },
                { l: 'Hardest-first ordering', toggle: true, on: true },
              ],
            },
            {
              h: 'Calendar',
              rows: [
                { l: 'Google Calendar', s: 'maya@uni.edu', tag: 'CONNECTED', tagC: T.accent3 },
                { l: 'Auto-resolve conflicts', s: '+/- 2 hr window', toggle: true, on: true },
                { l: 'Block-out hours', s: 'After 22:00' },
              ],
            },
            {
              h: 'Account',
              rows: [
                { l: 'Subscription', s: 'Recall Pro · renews May 12', chev: true },
                { l: 'Export library', s: '386 cards · CSV / Anki', chev: true },
                { l: 'Sign out', danger: true },
              ],
            },
          ].map((g, gi) => (
            <div key={gi} style={{ marginTop: 18 }}>
              <div style={{ fontFamily: T.fontMono, fontSize: 10, letterSpacing: 1.5, color: T.inkMute, fontWeight: 700, marginBottom: 8, paddingLeft: 4 }}>{g.h.toUpperCase()}</div>
              <div style={{ background: '#fff', border: `2px solid ${T.line}`, borderRadius: 14, boxShadow: `3px 3px 0 ${T.line}`, overflow: 'hidden' }}>
                {g.rows.map((r, ri) => (
                  <div key={ri} style={{ padding: '13px 14px', display: 'flex', alignItems: 'center', gap: 10, borderTop: ri === 0 ? 'none' : `1.5px solid rgba(28,25,23,0.1)` }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: r.danger ? T.accent : T.ink }}>{r.l}</div>
                      {r.s && <div style={{ fontFamily: T.fontMono, fontSize: 10.5, color: T.inkMute, marginTop: 2 }}>{r.s}</div>}
                    </div>
                    {r.toggle && <Toggle on={r.on}/>}
                    {r.tag && <span style={{ padding: '2px 7px', background: r.tagC, color: '#fff', fontFamily: T.fontMono, fontSize: 9, fontWeight: 700, borderRadius: 4, border: `1px solid ${T.line}` }}>{r.tag}</span>}
                    {r.chev && <IconChevronR size={14} color={T.inkMute}/>}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={{ marginTop: 24, fontFamily: T.fontMono, fontSize: 10, color: T.inkMute, textAlign: 'center', letterSpacing: 1 }}>
            RECALL · v1.4.2 · MAY 2026
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 20, right: 20, bottom: 16, padding: '8px 14px', borderRadius: 999, background: '#fff', border: `2.5px solid ${T.line}`, boxShadow: `4px 4px 0 ${T.line}`, display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 10 }}>
        {[
          { i: <IconHome size={18} /> },
          { i: <IconCards size={18} /> },
          { i: <IconCal size={18} /> },
          { i: <IconProfile size={18} />, a: true },
        ].map((n, i) => (
          <div key={i} style={{ padding: '8px 14px', borderRadius: 999, background: n.a ? T.ink : 'transparent', color: n.a ? T.bg : T.inkMute }}>{n.i}</div>
        ))}
      </div>
    </PhoneFrame>
  );
}

// ════════════════════════════════════════════════════════════
// DESKTOP — Library
// ════════════════════════════════════════════════════════════
function KanjiDesktopLibrary() {
  const cards = [
    { c: KD.accent,  cs: '#fff', q: 'What does ACID stand for?', t: 'DB · ACID · L7', m: 0.34 },
    { c: KD.accent2, cs: KD.ink,  q: 'Define BCNF.', t: 'DB · Norm. · L4', m: 0.62 },
    { c: KD.accent3, cs: '#fff', q: 'SN1 vs. SN2 mechanism?', t: 'OC · Mech.', m: 0.78 },
    { c: KD.accent4, cs: '#fff', q: 'What is a B-tree?', t: 'DB · Index', m: 0.55 },
    { c: KD.accent5, cs: '#fff', q: 'Mind-Body — Descartes', t: 'PH · Mind', m: 0.48 },
    { c: '#fff',    cs: KD.ink,  q: 'Eigenvalue intuition.', t: 'LA · Vec.', m: 0.81 },
    { c: KD.accent,  cs: '#fff', q: 'What is 2-Phase Locking?', t: 'DB · Tx', m: 0.41 },
    { c: KD.accent3, cs: '#fff', q: 'Hofmann elimination?', t: 'OC · Mech.', m: 0.72 },
  ];
  return (
    <KShell
      active="library"
      subtitle="386 CARDS · 5 COURSES"
      title={<>Library <span style={{ marginLeft: 6, display: 'inline-block' }}>{_kStar(KD.accent2, 22)}</span></>}
      actions={<><KBtn bg="#fff" color={KD.ink}>↓ Export CSV</KBtn><KBtn bg={KD.ink} color="#fff">+ New card</KBtn></>}
    >
      {/* search + chips */}
      <div style={{ padding: '18px 28px 0', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ flex: 1, padding: '10px 14px', background: '#fff', border: `2px solid ${KD.ink}`, borderRadius: 10, boxShadow: `2px 2px 0 ${KD.ink}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <IconSearch size={15} color={KD.inkMute}/>
          <div style={{ flex: 1, fontSize: 13, color: KD.inkMute }}>Search 386 cards by question, answer, source, or tag…</div>
          <div style={{ padding: '2px 8px', background: KD.bgSoft, border: `1px solid ${KD.ink}`, borderRadius: 4, fontFamily: KD.fontMono, fontSize: 10 }}>⌘K</div>
        </div>
        <KBtn bg="#fff" color={KD.ink}>⇅ Sort</KBtn>
        <KBtn bg="#fff" color={KD.ink}>▦ View</KBtn>
      </div>

      {/* tags row */}
      <div style={{ padding: '14px 28px 0', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {['All · 386', 'Due today · 48', 'Hardest · 17', 'Recent · 24', 'DB · 141', 'LA · 84', 'OC · 72', 'PH · 56', 'WC · 33'].map((t, i) => (
          <div key={i} style={{ padding: '5px 11px', borderRadius: 999, background: i === 0 ? KD.ink : '#fff', color: i === 0 ? KD.bg : KD.ink, border: `2px solid ${KD.ink}`, fontFamily: KD.font, fontSize: 11.5, fontWeight: 700, boxShadow: i === 0 ? 'none' : `2px 2px 0 ${KD.ink}` }}>{t}</div>
        ))}
      </div>

      {/* grid */}
      <div style={{ padding: '18px 28px 28px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {cards.map((c, i) => (
          <div key={i} style={{ aspectRatio: '0.78', background: c.c, color: c.cs, border: `2.5px solid ${KD.ink}`, borderRadius: 14, boxShadow: `4px 4px 0 ${KD.ink}`, padding: 14, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden', transform: i % 2 ? 'rotate(0.4deg)' : 'rotate(-0.4deg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ padding: '2px 7px', borderRadius: 4, background: c.cs === KD.ink ? KD.ink : '#fff', color: c.cs === KD.ink ? '#fff' : KD.ink, fontFamily: KD.fontMono, fontSize: 10, fontWeight: 700 }}>Q · {String(i + 1).padStart(2, '0')}</div>
              {c.m < 0.5 && <span style={{ padding: '1px 6px', background: KD.ink, color: '#fff', fontFamily: KD.fontMono, fontSize: 9, fontWeight: 700, borderRadius: 3 }}>HARD</span>}
            </div>
            <div style={{ fontFamily: KD.fontSerif, fontSize: 18, fontWeight: 700, lineHeight: 1.15 }}>{c.q}</div>
            <div>
              <div style={{ height: 5, borderRadius: 3, background: c.cs === KD.ink ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.3)', marginBottom: 6 }}>
                <div style={{ width: `${c.m * 100}%`, height: '100%', background: c.m > 0.7 ? KD.accent3 : c.m > 0.4 ? KD.accent2 : KD.accent, borderRadius: 3 }}/>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: KD.fontMono, fontSize: 9, opacity: 0.85 }}>{c.t}</div>
                <div style={{ fontFamily: KD.fontMono, fontSize: 9, opacity: 0.85 }}>{Math.round(c.m * 100)}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </KShell>
  );
}

// ════════════════════════════════════════════════════════════
// DESKTOP — Stats
// ════════════════════════════════════════════════════════════
function KanjiDesktopStats() {
  const heatRows = 7, heatCols = 28;
  const heat = Array.from({ length: heatRows * heatCols }).map(() => Math.random());
  const bars = [0.6, 0.85, 0.7, 0.95, 0.55, 0.9, 0.4, 0.78, 0.88, 0.65, 0.82, 0.95, 1.0, 0.7, 0.9, 0.85, 0.95, 0.78, 0.92, 0.7, 0.88, 0.95, 0.92, 0.98];
  return (
    <KShell
      active="stats"
      subtitle="LAST 30 DAYS · APR 2026"
      title={<>You're on a <span style={{ color: KD.accent }}>roll</span>, Maya.</>}
      actions={<><KBtn bg="#fff" color={KD.ink}>30 days</KBtn><KBtn bg="#fff" color={KD.ink}>↓ Export</KBtn></>}
    >
      {/* hero strip */}
      <div style={{ padding: '20px 28px 0', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 14 }}>
        <div style={{ padding: 18, background: KD.accent, color: '#fff', border: `2.5px solid ${KD.ink}`, borderRadius: 14, boxShadow: `5px 5px 0 ${KD.ink}`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 14, right: 14 }}>{_kStar(KD.accent2, 22)}</div>
          <div style={{ fontFamily: KD.fontMono, fontSize: 10, letterSpacing: 1.5 }}>RETENTION</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <div style={{ fontFamily: KD.fontSerif, fontSize: 72, fontWeight: 900, letterSpacing: -2.5, lineHeight: 0.9 }}>87%</div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>+4 vs. last month</div>
          </div>
          <div style={{ height: 50, display: 'flex', alignItems: 'flex-end', gap: 2, marginTop: 12 }}>
            {bars.map((b, i) => (
              <div key={i} style={{ flex: 1, height: `${b * 100}%`, background: i === bars.length - 2 ? '#fff' : 'rgba(255,255,255,0.55)', border: `1px solid ${KD.ink}`, borderRadius: 2 }}/>
            ))}
          </div>
        </div>
        {[
          { v: '12', l: 'STREAK', s: 'days', c: KD.accent2, tc: KD.ink },
          { v: '4.2h', l: 'TIME', s: 'this week · +18m', c: KD.accent4, tc: '#fff' },
          { v: '92%', l: 'ON-TIME', s: 'reviews', c: KD.accent3, tc: '#fff' },
        ].map((s, i) => (
          <div key={i} style={{ padding: 16, background: s.c, color: s.tc, border: `2px solid ${KD.ink}`, borderRadius: 14, boxShadow: `4px 4px 0 ${KD.ink}` }}>
            <div style={{ fontFamily: KD.fontMono, fontSize: 10, letterSpacing: 1.5, opacity: 0.85 }}>{s.l}</div>
            <div style={{ fontFamily: KD.fontSerif, fontSize: 44, fontWeight: 900, letterSpacing: -1.5, lineHeight: 0.95, marginTop: 4 }}>{s.v}</div>
            <div style={{ fontSize: 12, opacity: 0.9, marginTop: 4 }}>{s.s}</div>
          </div>
        ))}
      </div>

      {/* heatmap + by course */}
      <div style={{ padding: '18px 28px 0', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
        <div style={{ padding: 18, background: '#fff', border: `2px solid ${KD.ink}`, borderRadius: 14, boxShadow: `4px 4px 0 ${KD.ink}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontFamily: KD.fontSerif, fontSize: 18, fontWeight: 800 }}>Activity</div>
            <div style={{ fontFamily: KD.fontMono, fontSize: 10, color: KD.inkMute }}>LAST 28 WEEKS</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${heatCols}, 1fr)`, gap: 3, marginTop: 14 }}>
            {heat.map((v, i) => {
              const op = v < 0.2 ? 0.08 : v < 0.5 ? 0.35 : v < 0.8 ? 0.65 : 1;
              return <div key={i} style={{ aspectRatio: '1', background: KD.accent3, opacity: op, borderRadius: 2, border: `0.5px solid ${KD.ink}` }}/>;
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontFamily: KD.fontMono, fontSize: 10, color: KD.inkMute }}>
            <span>Less</span>
            <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
              {[0.1, 0.4, 0.7, 1].map(o => <div key={o} style={{ width: 12, height: 12, background: KD.accent3, opacity: o, border: `0.5px solid ${KD.ink}`, borderRadius: 2 }}/>)}
            </div>
            <span>More</span>
          </div>
        </div>
        <div style={{ padding: 18, background: KD.accent2, border: `2px solid ${KD.ink}`, borderRadius: 14, boxShadow: `4px 4px 0 ${KD.ink}` }}>
          <div style={{ fontFamily: KD.fontMono, fontSize: 10, letterSpacing: 1.5 }}>BEST HOUR</div>
          <div style={{ fontFamily: KD.fontSerif, fontSize: 44, fontWeight: 900, letterSpacing: -1.5, lineHeight: 0.95, marginTop: 4 }}>9 AM</div>
          <div style={{ fontFamily: KD.fontAccent, fontSize: 17, marginTop: 4 }}>retention is +9% in the morning</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 3, marginTop: 14 }}>
            {[0.3, 0.45, 0.7, 1.0, 0.85, 0.6, 0.5, 0.4, 0.55, 0.65, 0.7, 0.6, 0.55, 0.4, 0.3, 0.25].map((v, i) => (
              <div key={i} style={{ height: 32, alignSelf: 'flex-end' }}>
                <div style={{ width: '100%', height: `${v * 100}%`, background: KD.ink, border: `1px solid ${KD.ink}`, borderRadius: 2 }}/>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontFamily: KD.fontMono, fontSize: 9 }}>
            <span>6a</span><span>12p</span><span>6p</span><span>10p</span>
          </div>
        </div>
      </div>

      {/* by course list */}
      <div style={{ padding: '18px 28px 28px' }}>
        <div style={{ fontFamily: KD.fontSerif, fontSize: 22, fontWeight: 800, letterSpacing: -0.5, marginBottom: 12 }}>By course</div>
        <div style={{ background: '#fff', border: `2px solid ${KD.ink}`, borderRadius: 14, boxShadow: `4px 4px 0 ${KD.ink}`, overflow: 'hidden' }}>
          {[
            { n: 'Database Systems', code: 'CS-3305', m: 0.68, c: KD.accent, cards: 141, due: 24, trend: '+5%' },
            { n: 'Linear Algebra', code: 'MA-2040', m: 0.81, c: KD.accent2, cards: 84, due: 16, trend: '+2%' },
            { n: 'Organic Chemistry', code: 'CH-3110', m: 0.42, c: KD.accent3, cards: 72, due: 32, trend: '−3%' },
            { n: 'Philosophy', code: 'PH-1010', m: 0.74, c: KD.accent5, cards: 56, due: 5, trend: '+8%' },
            { n: 'Written & Oral Comm.', code: 'HU-2100', m: 0.66, c: KD.accent4, cards: 33, due: 8, trend: '+1%' },
          ].map((c, i) => (
            <div key={i} style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 16, borderTop: i === 0 ? 'none' : `1.5px solid rgba(28,25,23,0.1)` }}>
              <div style={{ width: 8, height: 36, background: c.c, border: `1.5px solid ${KD.ink}`, borderRadius: 3 }}/>
              <div style={{ width: 220 }}>
                <div style={{ fontFamily: KD.fontSerif, fontSize: 15, fontWeight: 700 }}>{c.n}</div>
                <div style={{ fontFamily: KD.fontMono, fontSize: 10, color: KD.inkMute }}>{c.code}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, height: 8, background: KD.bgSoft, border: `1.5px solid ${KD.ink}`, borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${c.m * 100}%`, height: '100%', background: c.m > 0.7 ? KD.accent3 : c.m > 0.5 ? KD.accent2 : KD.accent }}/>
                </div>
                <div style={{ fontFamily: KD.fontMono, fontSize: 12, fontWeight: 700, width: 36, textAlign: 'right' }}>{Math.round(c.m * 100)}%</div>
              </div>
              <div style={{ width: 80, textAlign: 'center' }}><div style={{ fontFamily: KD.fontSerif, fontSize: 16, fontWeight: 800 }}>{c.cards}</div><div style={{ fontFamily: KD.fontMono, fontSize: 9, color: KD.inkMute }}>CARDS</div></div>
              <div style={{ width: 60, textAlign: 'center' }}><div style={{ fontFamily: KD.fontSerif, fontSize: 16, fontWeight: 800, color: c.due > 20 ? KD.accent : KD.ink }}>{c.due}</div><div style={{ fontFamily: KD.fontMono, fontSize: 9, color: KD.inkMute }}>DUE</div></div>
              <div style={{ padding: '3px 8px', background: c.trend.startsWith('+') ? KD.accent3 : KD.accent, color: '#fff', fontFamily: KD.fontMono, fontSize: 10, fontWeight: 700, borderRadius: 4, border: `1.5px solid ${KD.ink}` }}>{c.trend}</div>
            </div>
          ))}
        </div>
      </div>
    </KShell>
  );
}

// ════════════════════════════════════════════════════════════
// DESKTOP — Settings (standalone page)
// ════════════════════════════════════════════════════════════
function KanjiDesktopSettings() {
  const Toggle = ({ on }) => (
    <div style={{ width: 38, height: 22, borderRadius: 11, background: on ? KD.accent3 : '#fff', border: `2px solid ${KD.ink}`, position: 'relative', boxShadow: `1.5px 1.5px 0 ${KD.ink}` }}>
      <div style={{ position: 'absolute', top: 1, left: on ? 16 : 1, width: 16, height: 16, borderRadius: '50%', background: '#fff', border: `1.5px solid ${KD.ink}` }}/>
    </div>
  );
  return (
    <KShell
      active="settings"
      subtitle="ACCOUNT · SYNC · STUDY"
      title={<>Settings <span style={{ marginLeft: 6, display: 'inline-block' }}>{_kStar(KD.accent2, 22)}</span></>}
      actions={<><KBtn bg="#fff" color={KD.ink}>↓ Export data</KBtn><KBtn bg={KD.ink} color="#fff">Save changes</KBtn></>}
    >
      <div style={{ padding: '22px 28px 32px', maxWidth: 820 }}>
          {/* profile */}
          <div style={{ padding: 16, borderRadius: 14, background: KD.accent5, color: '#fff', border: `2.5px solid ${KD.ink}`, boxShadow: `5px 5px 0 ${KD.ink}`, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: '#fff', color: KD.accent5, border: `2px solid ${KD.ink}`, display: 'grid', placeItems: 'center', fontFamily: KD.fontSerif, fontWeight: 900, fontSize: 20 }}>MK</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: KD.fontSerif, fontSize: 20, fontWeight: 800, lineHeight: 1.05 }}>Maya Kapoor</div>
              <div style={{ fontFamily: KD.fontMono, fontSize: 11, opacity: 0.92, marginTop: 2 }}>maya@uni.edu · Spring '26 · 386 cards</div>
            </div>
            <div style={{ padding: '4px 10px', background: KD.ink, color: KD.accent2, borderRadius: 6, border: `1.5px solid ${KD.ink}`, fontFamily: KD.fontMono, fontSize: 10, fontWeight: 700 }}>PRO</div>
          </div>

          {[
            {
              h: 'Study',
              rows: [
                { l: 'Daily reminder', s: 'Weekdays at 8:00 AM', toggle: true, on: true },
                { l: 'Sound on flip', s: 'Soft tick', toggle: true, on: false },
                { l: 'Daily card limit', s: '60 cards · auto-distribute' },
                { l: 'Hardest-first ordering', s: 'Surface low-mastery cards first', toggle: true, on: true },
                { l: 'Show source on flip', s: 'Lecture title + page number', toggle: true, on: true },
              ],
            },
            {
              h: 'Calendar & sync',
              rows: [
                { l: 'Google Calendar', s: 'maya@uni.edu', tag: 'CONNECTED', tagC: KD.accent3 },
                { l: 'Auto-resolve conflicts', s: 'Search ±2 hr window for free slot', toggle: true, on: true },
                { l: 'Block-out hours', s: 'Never schedule after 22:00 or before 7:00' },
                { l: 'Two-way sync', s: 'Reflect calendar deletions in Recall', toggle: true, on: false },
              ],
            },
            {
              h: 'Account',
              rows: [
                { l: 'Subscription', s: 'Recall Pro · renews May 12 · $4 / mo', chev: true },
                { l: 'Export library', s: '386 cards · CSV / Anki / JSON', chev: true },
                { l: 'Sign out of all devices', danger: true },
              ],
            },
          ].map((g, gi) => (
            <div key={gi} style={{ marginTop: 22 }}>
              <div style={{ fontFamily: KD.fontMono, fontSize: 10, letterSpacing: 1.5, color: KD.inkMute, fontWeight: 700, marginBottom: 8, paddingLeft: 4 }}>{g.h.toUpperCase()}</div>
              <div style={{ background: '#fff', border: `2px solid ${KD.ink}`, borderRadius: 12, boxShadow: `3px 3px 0 ${KD.ink}`, overflow: 'hidden' }}>
                {g.rows.map((r, ri) => (
                  <div key={ri} style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12, borderTop: ri === 0 ? 'none' : `1.5px solid rgba(28,25,23,0.1)` }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: r.danger ? KD.accent : KD.ink }}>{r.l}</div>
                      {r.s && <div style={{ fontFamily: KD.fontMono, fontSize: 10.5, color: KD.inkMute, marginTop: 2 }}>{r.s}</div>}
                    </div>
                    {r.toggle && <Toggle on={r.on}/>}
                    {r.tag && <span style={{ padding: '2px 8px', background: r.tagC, color: '#fff', fontFamily: KD.fontMono, fontSize: 9.5, fontWeight: 700, borderRadius: 4, border: `1px solid ${KD.ink}` }}>{r.tag}</span>}
                    {r.chev && <IconChevronR size={14} color={KD.inkMute}/>}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={{ marginTop: 20, padding: 14, background: KD.bgSoft, border: `1.5px solid ${KD.ink}`, borderRadius: 10, fontFamily: KD.fontMono, fontSize: 10.5, color: KD.inkMute, textAlign: 'center', letterSpacing: 1 }}>
            RECALL · v1.4.2 · MAY 2026 · all settings sync across devices
          </div>
      </div>
    </KShell>
  );
}

Object.assign(window, {
  KanjiLibrary, KanjiStats, KanjiSettings,
  KanjiDesktopLibrary, KanjiDesktopStats, KanjiDesktopSettings,
});
