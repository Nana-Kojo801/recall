// Variation B — "Kanji"
// Retro Memphis / playful patterns — cream bg, offset shadows, squiggles,
// bold primary colors, chunky serif, stickers and stars.

const KanjiTheme = {
  bg: '#F5EFE2',
  bgSoft: '#FBF6EA',
  surface: '#FFFFFF',
  ink: '#1C1917',
  inkSoft: '#4A4642',
  inkMute: '#8A8278',
  line: '#1C1917',
  accent: '#E8482C',     // vermilion
  accent2: '#F4B400',    // mustard
  accent3: '#2B7A3E',    // forest
  accent4: '#3B5BDB',    // cobalt
  accent5: '#C93FA9',    // magenta
  hard: '#E8482C',
  okay: '#F4B400',
  easy: '#2B7A3E',
  font: 'Archivo, system-ui, sans-serif',
  fontSerif: 'Fraunces, serif',
  fontMono: 'JetBrains Mono, monospace',
  fontAccent: 'Caveat, cursive',
};

// decorative shapes as reusable SVGs
const Squiggle = ({ color = KanjiTheme.ink, w = 40, h = 10 }) => (
  <svg width={w} height={h} viewBox="0 0 40 10" fill="none">
    <path d="M1 5 Q 6 1 11 5 T 21 5 T 31 5 T 39 5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const Star = ({ color = KanjiTheme.ink, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
  </svg>
);
const Dots = ({ color = KanjiTheme.ink, cols = 6, rows = 3, gap = 8 }) => (
  <svg width={cols * gap} height={rows * gap}>
    {Array.from({ length: rows }).map((_, r) =>
      Array.from({ length: cols }).map((_, c) => (
        <circle key={`${r}-${c}`} cx={c * gap + 2} cy={r * gap + 2} r={1.5} fill={color} />
      ))
    )}
  </svg>
);

// Neo-brutalist button with hard offset shadow
const KBox = ({ children, bg = KanjiTheme.surface, color = KanjiTheme.ink, pad = '10px 14px', radius = 12, shadow = 4, rotate = 0, border = 2, style = {} }) => (
  <div style={{
    background: bg, color, padding: pad, borderRadius: radius,
    border: `${border}px solid ${KanjiTheme.line}`,
    boxShadow: `${shadow}px ${shadow}px 0 ${KanjiTheme.line}`,
    transform: rotate ? `rotate(${rotate}deg)` : undefined,
    display: 'inline-flex', alignItems: 'center',
    fontFamily: KanjiTheme.font, fontWeight: 600,
    ...style,
  }}>{children}</div>
);

// Paper texture background
const KanjiBg = () => (
  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
    {/* subtle grid paper */}
    <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
      <defs>
        <pattern id="kg" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="12" r="0.8" fill="#1C1917" opacity="0.12"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#kg)"/>
    </svg>
  </div>
);

// ─── onboarding ──────────────────────────────────────────────
function KanjiOnboarding() {
  return (
    <PhoneFrame bg={KanjiTheme.bg}>
      <KanjiBg />
      {/* scattered stickers */}
      <div style={{ position: 'absolute', top: 60, right: 26 }}><Star color={KanjiTheme.accent} size={26}/></div>
      <div style={{ position: 'absolute', top: 120, left: 24, transform: 'rotate(-14deg)' }}><Squiggle color={KanjiTheme.accent3} w={48}/></div>
      <div style={{ position: 'absolute', bottom: 180, right: 30 }}><Dots color={KanjiTheme.accent4} cols={4} rows={3}/></div>

      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', padding: '20px 24px 28px', fontFamily: KanjiTheme.font, color: KanjiTheme.ink }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: KanjiTheme.fontMono, fontSize: 11, letterSpacing: 2, background: KanjiTheme.ink, color: KanjiTheme.bg, padding: '4px 10px', borderRadius: 4 }}>RECALL</div>
          <div style={{ fontFamily: KanjiTheme.fontMono, fontSize: 11, color: KanjiTheme.inkMute }}>1 / 3</div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: -20 }}>
          {/* playful card cluster */}
          <div style={{ position: 'relative', height: 240, marginBottom: 28 }}>
            <div className="float" style={{ position: 'absolute', left: 8, top: 30, transform: 'rotate(-8deg)' }}>
              <div style={{
                width: 150, height: 180, borderRadius: 16,
                background: KanjiTheme.accent, border: `3px solid ${KanjiTheme.line}`,
                boxShadow: `6px 6px 0 ${KanjiTheme.line}`,
                padding: 16, color: '#fff', fontFamily: KanjiTheme.fontSerif, fontSize: 20, fontWeight: 600, lineHeight: 1.1,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}>
                <div style={{ fontFamily: KanjiTheme.fontMono, fontSize: 10, letterSpacing: 1 }}>Q · 04</div>
                <div>Define<br/>3NF.</div>
                <Squiggle color="#fff" w={40}/>
              </div>
            </div>
            <div className="float" style={{ position: 'absolute', right: 10, top: 10, transform: 'rotate(6deg)', animationDelay: '0.3s' }}>
              <div style={{
                width: 150, height: 180, borderRadius: 16,
                background: KanjiTheme.accent2, border: `3px solid ${KanjiTheme.line}`,
                boxShadow: `6px 6px 0 ${KanjiTheme.line}`,
                padding: 16, color: KanjiTheme.ink, fontFamily: KanjiTheme.fontSerif, fontSize: 19, fontWeight: 600, lineHeight: 1.1,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}>
                <div style={{ fontFamily: KanjiTheme.fontMono, fontSize: 10, letterSpacing: 1 }}>Q · 07</div>
                <div>What does ACID stand for?</div>
                <Star color={KanjiTheme.line} size={16}/>
              </div>
            </div>
            <div className="float" style={{ position: 'absolute', left: '50%', bottom: 0, transform: 'translateX(-50%) rotate(-2deg)', animationDelay: '0.6s' }}>
              <div style={{
                width: 160, height: 100, borderRadius: 14,
                background: KanjiTheme.accent3, border: `3px solid ${KanjiTheme.line}`,
                boxShadow: `6px 6px 0 ${KanjiTheme.line}`,
                padding: 12, color: '#fff',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 6,
              }}>
                <IconSpark size={24} color="#fff" />
                <div style={{ fontFamily: KanjiTheme.fontSerif, fontSize: 15, fontWeight: 600 }}>AI generated</div>
              </div>
            </div>
          </div>

          <h1 style={{ fontFamily: KanjiTheme.fontSerif, fontSize: 42, fontWeight: 700, lineHeight: 0.95, margin: 0, letterSpacing: -1 }}>
            Cram less.<br/>
            <span style={{ display: 'inline-block', position: 'relative' }}>
              Know more.
              <span style={{ position: 'absolute', left: -4, right: -4, bottom: 6, height: 10, background: KanjiTheme.accent2, zIndex: -1, transform: 'rotate(-1deg)' }} />
            </span>
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.45, color: KanjiTheme.inkSoft, marginTop: 14 }}>
            Upload your lecture slides. We'll turn them into flashcards and book review time into your calendar.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 24 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: i === 0 ? 20 : 8, height: 8, borderRadius: 4, background: i === 0 ? KanjiTheme.ink : 'rgba(28,25,23,0.2)' }}/>
            ))}
          </div>
          <div style={{ flex: 1 }}/>
          <button style={{
            padding: '12px 20px', borderRadius: 999, border: `2.5px solid ${KanjiTheme.line}`,
            background: KanjiTheme.accent, color: '#fff', fontFamily: KanjiTheme.font, fontWeight: 700, fontSize: 15,
            boxShadow: `4px 4px 0 ${KanjiTheme.line}`,
            display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
          }}>
            Begin <IconArrowR size={16} />
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}

// ─── home ──────────────────────────────────────────────────
function KanjiHome() {
  return (
    <PhoneFrame bg={KanjiTheme.bg}>
      <KanjiBg />
      <div style={{ position: 'relative', height: '100%', overflow: 'auto', fontFamily: KanjiTheme.font, color: KanjiTheme.ink }}>
        <div style={{ padding: '20px 22px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: KanjiTheme.fontMono, fontSize: 11, color: KanjiTheme.inkMute, letterSpacing: 1 }}>FRI · APR 18</div>
              <div style={{ fontFamily: KanjiTheme.fontSerif, fontSize: 34, fontWeight: 700, lineHeight: 1.0, marginTop: 2, letterSpacing: -0.5 }}>
                Hi, Maya
                <span style={{ display: 'inline-block', marginLeft: 6, transform: 'translateY(-4px)' }}><Star color={KanjiTheme.accent2} size={22} /></span>
              </div>
            </div>
            <div style={{
              width: 46, height: 46, borderRadius: 14, background: KanjiTheme.accent5,
              border: `2.5px solid ${KanjiTheme.line}`, boxShadow: `3px 3px 0 ${KanjiTheme.line}`,
              display: 'grid', placeItems: 'center', color: '#fff', fontFamily: KanjiTheme.fontSerif, fontWeight: 700, fontSize: 16,
            }}>MK</div>
          </div>

          {/* today card */}
          <div style={{
            marginTop: 18, padding: 18, borderRadius: 20,
            background: KanjiTheme.accent2, border: `2.5px solid ${KanjiTheme.line}`,
            boxShadow: `5px 5px 0 ${KanjiTheme.line}`, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 10, right: 14, opacity: 0.3 }}><Dots color={KanjiTheme.line} cols={6} rows={4}/></div>
            <div style={{ fontFamily: KanjiTheme.fontMono, fontSize: 10, letterSpacing: 1.5, color: KanjiTheme.ink }}>DUE TODAY</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
              <div style={{ fontFamily: KanjiTheme.fontSerif, fontSize: 52, fontWeight: 900, color: KanjiTheme.ink, lineHeight: 1, letterSpacing: -2 }}>48</div>
              <div style={{ fontSize: 13, color: KanjiTheme.ink }}>cards · 22 min</div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button style={{
                flex: 1, padding: '10px 12px', borderRadius: 10,
                background: KanjiTheme.ink, color: '#fff', border: `2.5px solid ${KanjiTheme.line}`,
                fontFamily: KanjiTheme.font, fontWeight: 700, fontSize: 13,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer',
              }}>
                <IconZap size={13} color="#fff" /> Start studying
              </button>
              <button style={{
                padding: '10px 12px', borderRadius: 10,
                background: '#fff', color: KanjiTheme.ink, border: `2.5px solid ${KanjiTheme.line}`,
                fontFamily: KanjiTheme.fontMono, fontWeight: 600, fontSize: 12, cursor: 'pointer',
              }}>9:30</button>
            </div>
          </div>

          {/* streak banner */}
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <div style={{ flex: 1, padding: '10px 14px', borderRadius: 14, background: '#fff', border: `2px solid ${KanjiTheme.line}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <IconFlame size={20} color={KanjiTheme.accent} />
              <div>
                <div style={{ fontFamily: KanjiTheme.fontSerif, fontSize: 20, fontWeight: 700, lineHeight: 1 }}>12</div>
                <div style={{ fontSize: 10, color: KanjiTheme.inkMute, fontFamily: KanjiTheme.fontMono }}>STREAK</div>
              </div>
            </div>
            <div style={{ flex: 1, padding: '10px 14px', borderRadius: 14, background: '#fff', border: `2px solid ${KanjiTheme.line}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Star color={KanjiTheme.accent2} size={20} />
              <div>
                <div style={{ fontFamily: KanjiTheme.fontSerif, fontSize: 20, fontWeight: 700, lineHeight: 1 }}>87%</div>
                <div style={{ fontSize: 10, color: KanjiTheme.inkMute, fontFamily: KanjiTheme.fontMono }}>RETAINED</div>
              </div>
            </div>
          </div>
        </div>

        {/* courses */}
        <div style={{ padding: '22px 22px 12px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: KanjiTheme.fontSerif, fontSize: 22, fontWeight: 700 }}>Courses</div>
          <div style={{ padding: '3px 8px', borderRadius: 6, background: KanjiTheme.ink, color: KanjiTheme.bg, fontSize: 11, fontFamily: KanjiTheme.fontMono }}>5</div>
        </div>

        <div style={{ padding: '0 22px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {COURSES.slice(0, 4).map((c, i) => {
            const bgColors = [KanjiTheme.accent, KanjiTheme.accent4, KanjiTheme.accent2, KanjiTheme.accent3];
            const bg = bgColors[i % 4];
            const textColor = i === 2 ? KanjiTheme.ink : '#fff';
            return (
              <div key={i} style={{
                padding: 14, borderRadius: 16,
                background: '#fff', border: `2.5px solid ${KanjiTheme.line}`,
                boxShadow: `4px 4px 0 ${KanjiTheme.line}`,
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 54, height: 54, borderRadius: 12,
                  background: bg, border: `2px solid ${KanjiTheme.line}`,
                  display: 'grid', placeItems: 'center',
                  color: textColor, fontFamily: KanjiTheme.fontSerif, fontWeight: 900, fontSize: 18,
                  flexShrink: 0, position: 'relative', overflow: 'hidden',
                }}>
                  {i === 0 && <div style={{ position: 'absolute', inset: 0, opacity: 0.2 }}><Dots color="#fff" cols={4} rows={4}/></div>}
                  <span style={{ position: 'relative' }}>{c.emoji}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: KanjiTheme.fontSerif, fontSize: 16, fontWeight: 700, lineHeight: 1.1 }}>{c.name}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4, alignItems: 'center' }}>
                    <span style={{ fontFamily: KanjiTheme.fontMono, fontSize: 10, color: KanjiTheme.inkMute }}>{c.code}</span>
                    <span style={{ width: 3, height: 3, borderRadius: 2, background: KanjiTheme.inkMute }} />
                    <span style={{ fontSize: 11, color: KanjiTheme.inkSoft }}>{c.topics} topics</span>
                  </div>
                </div>
                <div style={{
                  padding: '4px 8px', borderRadius: 8, background: c.due > 0 ? KanjiTheme.ink : '#fff',
                  color: c.due > 0 ? KanjiTheme.bg : KanjiTheme.inkMute,
                  border: `1.5px solid ${KanjiTheme.line}`, flexShrink: 0,
                  fontFamily: KanjiTheme.fontMono, fontSize: 11, fontWeight: 600,
                }}>{c.due} due</div>
              </div>
            );
          })}

          <button style={{
            padding: 16, borderRadius: 16, background: 'transparent',
            border: `2.5px dashed ${KanjiTheme.line}`,
            color: KanjiTheme.ink, fontFamily: KanjiTheme.font, fontWeight: 700, fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer',
          }}>
            <IconPlus size={16} /> Add a new course
          </button>
        </div>

        <div style={{ height: 80 }} />
      </div>

      {/* floating nav */}
      <div style={{
        position: 'absolute', left: 20, right: 20, bottom: 16,
        padding: '8px 14px', borderRadius: 999,
        background: '#fff', border: `2.5px solid ${KanjiTheme.line}`,
        boxShadow: `4px 4px 0 ${KanjiTheme.line}`,
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        zIndex: 10,
      }}>
        {[{ i: <IconHome size={18} />, a: true }, { i: <IconCards size={18} /> }, { i: <IconCal size={18} /> }, { i: <IconProfile size={18} /> }].map((n, i) => (
          <div key={i} style={{
            padding: '8px 14px', borderRadius: 999,
            background: n.a ? KanjiTheme.ink : 'transparent',
            color: n.a ? KanjiTheme.bg : KanjiTheme.inkMute,
          }}>{n.i}</div>
        ))}
      </div>
    </PhoneFrame>
  );
}

// ─── new course (right-sliding sheet · full-width on mobile) ──
function KanjiNewCourse() {
  return (
    <PhoneFrame bg={KanjiTheme.bg}>
      {/* dim hint of the courses page behind the sheet */}
      <div className="sheet-backdrop" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <KanjiBg />
        <div style={{ padding: '20px 22px', opacity: 0.55, filter: 'blur(1px)', fontFamily: KanjiTheme.font, color: KanjiTheme.ink }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: KanjiTheme.fontMono, fontSize: 11, color: KanjiTheme.inkMute, letterSpacing: 1 }}>FRI · APR 18</div>
              <div style={{ fontFamily: KanjiTheme.fontSerif, fontSize: 30, fontWeight: 700 }}>Hi, Maya</div>
            </div>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: KanjiTheme.accent5, border: `2.5px solid ${KanjiTheme.line}` }} />
          </div>
          <div style={{ marginTop: 18, height: 110, borderRadius: 18, background: KanjiTheme.accent2, border: `2.5px solid ${KanjiTheme.line}` }} />
          <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, height: 50, borderRadius: 12, background: '#fff', border: `2px solid ${KanjiTheme.line}` }} />
            <div style={{ flex: 1, height: 50, borderRadius: 12, background: '#fff', border: `2px solid ${KanjiTheme.line}` }} />
          </div>
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(28,25,23,0.32)' }} />
      </div>

      {/* sheet — full-width on mobile, slides from right */}
      <div className="sheet-slide-in" style={{
        position: 'absolute', inset: 0, background: KanjiTheme.bg,
        boxShadow: `-18px 0 40px rgba(28,25,23,0.25)`,
        borderLeft: `2.5px solid ${KanjiTheme.line}`,
        display: 'flex', flexDirection: 'column',
      }}>
        <KanjiBg />
        <div style={{ position: 'absolute', top: 110, right: 20 }}><Star color={KanjiTheme.accent} size={22}/></div>
        <div style={{ position: 'absolute', top: 170, left: 20, transform: 'rotate(-14deg)' }}><Squiggle color={KanjiTheme.accent3} w={44}/></div>
        {/* drag handle on left edge */}
        <div style={{ position: 'absolute', left: 5, top: '50%', transform: 'translateY(-50%)', width: 4, height: 60, borderRadius: 2, background: 'rgba(28,25,23,0.28)' }}/>

      <div style={{ position: 'relative', height: '100%', padding: '18px 22px', fontFamily: KanjiTheme.font, color: KanjiTheme.ink, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: KanjiTheme.fontMono, fontSize: 11, letterSpacing: 2, background: KanjiTheme.ink, color: KanjiTheme.bg, padding: '4px 10px', borderRadius: 4 }}>NEW COURSE</div>
          <div style={{ flex: 1 }} />
          <button style={{ width: 36, height: 36, borderRadius: 10, background: '#fff', border: `2px solid ${KanjiTheme.line}`, display: 'grid', placeItems: 'center', boxShadow: `2px 2px 0 ${KanjiTheme.line}` }} aria-label="Dismiss sheet">
            <IconChevronR size={18} color={KanjiTheme.ink} />
          </button>
        </div>

        <h2 style={{ fontFamily: KanjiTheme.fontSerif, fontSize: 34, fontWeight: 700, lineHeight: 1.0, margin: '22px 0 0', letterSpacing: -0.5 }}>
          Name your
          <span style={{ display: 'block', position: 'relative', width: 'fit-content' }}>
            new course.
            <span style={{ position: 'absolute', left: -4, right: -4, bottom: 4, height: 10, background: KanjiTheme.accent2, zIndex: -1, transform: 'rotate(-1deg)' }} />
          </span>
        </h2>

        {/* preview */}
        <div style={{
          marginTop: 20, padding: 18, borderRadius: 18,
          background: KanjiTheme.accent, border: `2.5px solid ${KanjiTheme.line}`,
          boxShadow: `5px 5px 0 ${KanjiTheme.line}`, position: 'relative', overflow: 'hidden',
          minHeight: 120,
        }}>
          <div style={{ position: 'absolute', top: 10, right: 14, opacity: 0.25 }}><Dots color="#fff" cols={5} rows={4}/></div>
          <div style={{ fontFamily: KanjiTheme.fontMono, fontSize: 10, color: '#fff', letterSpacing: 1.5 }}>CS-3305</div>
          <div style={{ fontFamily: KanjiTheme.fontSerif, fontSize: 26, fontWeight: 800, color: '#fff', marginTop: 6, lineHeight: 1.0 }}>Database Systems</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
            <div style={{ padding: '3px 9px', borderRadius: 999, background: '#fff', color: KanjiTheme.ink, fontSize: 11, fontFamily: KanjiTheme.fontMono, fontWeight: 600, border: `1.5px solid ${KanjiTheme.line}` }}>SPRING '26</div>
            <div style={{ padding: '3px 9px', borderRadius: 999, background: 'rgba(255,255,255,0.25)', color: '#fff', fontSize: 11, fontWeight: 500 }}>Prof. Reyes</div>
          </div>
        </div>

        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: KanjiTheme.inkMute, fontFamily: KanjiTheme.fontMono, letterSpacing: 1, marginBottom: 6 }}>COURSE NAME</div>
            <div style={{
              padding: '12px 14px', borderRadius: 10,
              background: '#fff', border: `2px solid ${KanjiTheme.ink}`,
              boxShadow: `2px 2px 0 ${KanjiTheme.line}`,
              fontSize: 15, display: 'flex', alignItems: 'center',
            }}>
              Database Systems
              <div style={{ width: 2, height: 18, background: KanjiTheme.accent, marginLeft: 2 }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: KanjiTheme.inkMute, fontFamily: KanjiTheme.fontMono, letterSpacing: 1, marginBottom: 6 }}>CODE</div>
              <div style={{ padding: '12px 14px', borderRadius: 10, background: '#fff', border: `2px solid ${KanjiTheme.line}`, boxShadow: `2px 2px 0 ${KanjiTheme.line}`, fontSize: 15, fontFamily: KanjiTheme.fontMono }}>CS-3305</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: KanjiTheme.inkMute, fontFamily: KanjiTheme.fontMono, letterSpacing: 1, marginBottom: 6 }}>TERM</div>
              <div style={{ padding: '12px 14px', borderRadius: 10, background: '#fff', border: `2px solid ${KanjiTheme.line}`, boxShadow: `2px 2px 0 ${KanjiTheme.line}`, fontSize: 15 }}>Spring '26</div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: KanjiTheme.inkMute, fontFamily: KanjiTheme.fontMono, letterSpacing: 1, marginBottom: 8 }}>PICK A COLOR & PATTERN</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[KanjiTheme.accent, KanjiTheme.accent2, KanjiTheme.accent3, KanjiTheme.accent4, KanjiTheme.accent5, '#FF8A3D', '#00A6A6', '#6B4B9B'].map((col, i) => (
                <div key={i} style={{
                  width: 36, height: 36, borderRadius: 10, background: col,
                  border: `2px solid ${KanjiTheme.line}`,
                  boxShadow: i === 0 ? `3px 3px 0 ${KanjiTheme.line}` : `2px 2px 0 ${KanjiTheme.line}`,
                  transform: i === 0 ? 'translate(-1px, -1px)' : undefined,
                  position: 'relative',
                }}>
                  {i === 0 && <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}><IconCheck size={16} color="#fff" stroke={3}/></div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }} />
        <button style={{
          padding: '14px', borderRadius: 14,
          background: KanjiTheme.accent, color: '#fff',
          border: `2.5px solid ${KanjiTheme.line}`, boxShadow: `4px 4px 0 ${KanjiTheme.line}`,
          fontFamily: KanjiTheme.font, fontWeight: 700, fontSize: 15,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer',
        }}>
          Create course <IconArrowR size={18} />
        </button>
      </div>
      </div>
    </PhoneFrame>
  );
}

// ─── course detail ─────────────────────────────────────────
function KanjiCourseDetail() {
  return (
    <PhoneFrame bg={KanjiTheme.bg}>
      <KanjiBg />
      <div style={{ position: 'relative', height: '100%', overflow: 'auto', fontFamily: KanjiTheme.font, color: KanjiTheme.ink }}>
        {/* hero */}
        <div style={{ padding: '18px 22px 20px', background: KanjiTheme.accent, position: 'relative', overflow: 'hidden', borderBottom: `3px solid ${KanjiTheme.line}` }}>
          <div style={{ position: 'absolute', top: 16, right: 16, opacity: 0.3 }}><Dots color="#fff" cols={6} rows={5}/></div>
          <div style={{ position: 'absolute', bottom: 14, right: 28 }}><Star color={KanjiTheme.accent2} size={22}/></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button style={{ width: 36, height: 36, borderRadius: 10, background: '#fff', border: `2px solid ${KanjiTheme.line}`, display: 'grid', placeItems: 'center' }}>
              <IconBack size={18} />
            </button>
            <IconMore size={20} color="#fff" />
          </div>
          <div style={{ marginTop: 18, position: 'relative' }}>
            <div style={{ fontFamily: KanjiTheme.fontMono, fontSize: 11, color: 'rgba(255,255,255,0.9)', letterSpacing: 1.5 }}>CS-3305 · SPRING '26</div>
            <div style={{ fontFamily: KanjiTheme.fontSerif, fontSize: 34, fontWeight: 800, lineHeight: 1.0, marginTop: 6, color: '#fff', letterSpacing: -0.5 }}>
              Database<br/>Systems
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              {[
                { v: '141', l: 'cards' },
                { v: '6', l: 'topics' },
                { v: '68%', l: 'mastery' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.15)', borderRadius: 10, border: `1.5px solid rgba(255,255,255,0.35)` }}>
                  <div style={{ fontFamily: KanjiTheme.fontSerif, fontSize: 18, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{s.v}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)', fontFamily: KanjiTheme.fontMono }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI generating */}
        <div style={{
          margin: '14px 16px 0', padding: 14, borderRadius: 16,
          background: KanjiTheme.accent2, border: `2.5px solid ${KanjiTheme.line}`,
          boxShadow: `4px 4px 0 ${KanjiTheme.line}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, background: '#fff',
              border: `2px solid ${KanjiTheme.line}`,
              display: 'grid', placeItems: 'center', position: 'relative',
            }}>
              <IconSpark size={18} color={KanjiTheme.accent} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                Brewing flashcards
                <span style={{ display: 'flex', gap: 3 }}>
                  <span className="gen-dot" style={{ width: 4, height: 4, borderRadius: 2, background: KanjiTheme.ink, display: 'inline-block' }} />
                  <span className="gen-dot" style={{ width: 4, height: 4, borderRadius: 2, background: KanjiTheme.ink, display: 'inline-block' }} />
                  <span className="gen-dot" style={{ width: 4, height: 4, borderRadius: 2, background: KanjiTheme.ink, display: 'inline-block' }} />
                </span>
              </div>
              <div style={{ fontSize: 11, color: KanjiTheme.inkSoft, fontFamily: KanjiTheme.fontMono, marginTop: 1 }}>
                Query Optimization.pdf · 17 / 24 pp
              </div>
            </div>
          </div>
          <div style={{ marginTop: 10, height: 6, borderRadius: 3, background: '#fff', border: `1.5px solid ${KanjiTheme.line}`, overflow: 'hidden' }}>
            <div style={{ width: '70%', height: '100%', background: KanjiTheme.ink }} />
          </div>
        </div>

        {/* topics */}
        <div style={{ padding: '18px 20px 6px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: KanjiTheme.fontSerif, fontSize: 20, fontWeight: 700 }}>Topics</div>
          <div style={{ fontFamily: KanjiTheme.fontMono, fontSize: 10, color: KanjiTheme.inkMute }}>6 · 141 CARDS</div>
        </div>
        <div style={{ padding: '6px 20px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {DB_TOPICS.slice(0, 4).map((t, i) => {
            const badgeColors = [KanjiTheme.accent3, KanjiTheme.accent2, KanjiTheme.accent4, KanjiTheme.accent];
            return (
              <div key={i} style={{
                padding: 12, borderRadius: 14, background: '#fff',
                border: `2px solid ${KanjiTheme.line}`, boxShadow: `3px 3px 0 ${KanjiTheme.line}`,
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 9, background: badgeColors[i % 4],
                  border: `1.5px solid ${KanjiTheme.line}`,
                  display: 'grid', placeItems: 'center', color: '#fff',
                  fontFamily: KanjiTheme.fontSerif, fontSize: 14, fontWeight: 800,
                  flexShrink: 0,
                }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: KanjiTheme.fontSerif, fontSize: 14.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {t.name}
                    {t.due > 0 && (
                      <span style={{ padding: '2px 6px', borderRadius: 6, background: KanjiTheme.accent, color: '#fff', fontFamily: KanjiTheme.fontMono, fontSize: 10, border: `1px solid ${KanjiTheme.line}` }}>
                        {t.due}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5 }}>
                    <div style={{ flex: 1, height: 6, borderRadius: 3, background: KanjiTheme.bgSoft, border: `1px solid ${KanjiTheme.line}`, overflow: 'hidden' }}>
                      <div style={{ width: `${t.mastery * 100}%`, height: '100%', background: t.mastery > 0.7 ? KanjiTheme.easy : t.mastery > 0.4 ? KanjiTheme.okay : KanjiTheme.hard }} />
                    </div>
                    <div style={{ fontFamily: KanjiTheme.fontMono, fontSize: 10, color: KanjiTheme.inkMute, width: 30, textAlign: 'right' }}>{Math.round(t.mastery * 100)}%</div>
                  </div>
                </div>
              </div>
            );
          })}

          <button style={{
            padding: 14, borderRadius: 14, background: '#fff',
            border: `2.5px dashed ${KanjiTheme.line}`,
            color: KanjiTheme.ink, fontFamily: KanjiTheme.font, fontWeight: 700, fontSize: 13.5,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer',
          }}>
            <IconUpload size={16} /> Upload a PDF or slides
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}

// ─── study front ────────────────────────────────────────────
function KanjiStudyFront() {
  return (
    <PhoneFrame bg={KanjiTheme.bg}>
      <KanjiBg />
      <div style={{ position: 'relative', height: '100%', padding: '18px 22px', fontFamily: KanjiTheme.font, color: KanjiTheme.ink, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button style={{ width: 36, height: 36, borderRadius: 10, background: '#fff', border: `2px solid ${KanjiTheme.line}`, boxShadow: `2px 2px 0 ${KanjiTheme.line}`, display: 'grid', placeItems: 'center' }}>
            <IconClose size={18} />
          </button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: KanjiTheme.fontSerif, fontSize: 14, fontWeight: 700 }}>Transactions & ACID</div>
            <div style={{ fontFamily: KanjiTheme.fontMono, fontSize: 10, color: KanjiTheme.inkMute, marginTop: 1 }}>CARD 07 / 22</div>
          </div>
          <div style={{
            padding: '4px 9px', borderRadius: 8, background: '#fff', border: `2px solid ${KanjiTheme.line}`,
            fontSize: 11, fontFamily: KanjiTheme.fontMono, fontWeight: 600,
          }}>04:21</div>
        </div>

        {/* segmented progress */}
        <div style={{ marginTop: 14, display: 'flex', gap: 3 }}>
          {Array.from({ length: 22 }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: i < 6 ? KanjiTheme.accent3 : i === 6 ? KanjiTheme.accent : 'rgba(28,25,23,0.1)', border: i <= 6 ? `1px solid ${KanjiTheme.line}` : 'none' }} />
          ))}
        </div>

        {/* card */}
        <div style={{ flex: 1, marginTop: 22, marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="flip-scene" style={{ width: '100%', height: '100%' }}>
            <div className="flip-card">
              <div className="flip-face" style={{
                borderRadius: 24, padding: 24,
                background: KanjiTheme.accent,
                border: `3px solid ${KanjiTheme.line}`,
                boxShadow: `8px 8px 0 ${KanjiTheme.line}`,
                display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: 16, right: 14, opacity: 0.22 }}><Dots color="#fff" cols={5} rows={4}/></div>
                <div style={{ position: 'absolute', bottom: 20, right: 20 }}><Star color={KanjiTheme.accent2} size={22}/></div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                  <div style={{ padding: '4px 10px', borderRadius: 8, background: '#fff', border: `2px solid ${KanjiTheme.line}`, fontFamily: KanjiTheme.fontMono, fontWeight: 700, fontSize: 11, color: KanjiTheme.ink }}>Q · 07</div>
                  <div style={{ fontFamily: KanjiTheme.fontMono, fontSize: 11, color: '#fff' }}>DB / ACID</div>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                  <div style={{ fontFamily: KanjiTheme.fontSerif, fontSize: 30, fontWeight: 700, lineHeight: 1.1, color: '#fff', letterSpacing: -0.3, position: 'relative' }}>
                    {FLASHCARD.q}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
                  <Squiggle color="#fff" w={32} />
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', fontFamily: KanjiTheme.fontMono }}>Lecture 7 · p.14</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button style={{
          padding: '14px', borderRadius: 14,
          background: KanjiTheme.ink, color: '#fff',
          border: `2.5px solid ${KanjiTheme.line}`, boxShadow: `4px 4px 0 ${KanjiTheme.line}`,
          fontFamily: KanjiTheme.font, fontWeight: 700, fontSize: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer',
        }}>
          <IconFlip size={16} /> Flip card
        </button>
      </div>
    </PhoneFrame>
  );
}

// ─── study back ────────────────────────────────────────────
function KanjiStudyBack() {
  return (
    <PhoneFrame bg={KanjiTheme.bg}>
      <KanjiBg />
      <div style={{ position: 'relative', height: '100%', padding: '18px 22px', fontFamily: KanjiTheme.font, color: KanjiTheme.ink, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button style={{ width: 36, height: 36, borderRadius: 10, background: '#fff', border: `2px solid ${KanjiTheme.line}`, boxShadow: `2px 2px 0 ${KanjiTheme.line}`, display: 'grid', placeItems: 'center' }}>
            <IconClose size={18} />
          </button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: KanjiTheme.fontSerif, fontSize: 14, fontWeight: 700 }}>Transactions & ACID</div>
            <div style={{ fontFamily: KanjiTheme.fontMono, fontSize: 10, color: KanjiTheme.inkMute, marginTop: 1 }}>CARD 07 / 22</div>
          </div>
          <div style={{ padding: '4px 9px', borderRadius: 8, background: '#fff', border: `2px solid ${KanjiTheme.line}`, fontSize: 11, fontFamily: KanjiTheme.fontMono, fontWeight: 600 }}>04:28</div>
        </div>

        <div style={{ marginTop: 14, display: 'flex', gap: 3 }}>
          {Array.from({ length: 22 }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: i < 6 ? KanjiTheme.accent3 : i === 6 ? KanjiTheme.accent : 'rgba(28,25,23,0.1)', border: i <= 6 ? `1px solid ${KanjiTheme.line}` : 'none' }} />
          ))}
        </div>

        {/* card back */}
        <div style={{ flex: 1, marginTop: 20, marginBottom: 16 }}>
          <div style={{
            height: '100%', borderRadius: 22, padding: 20,
            background: '#fff', border: `3px solid ${KanjiTheme.line}`,
            boxShadow: `6px 6px 0 ${KanjiTheme.line}`,
            display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 14, right: 16 }}><Star color={KanjiTheme.accent2} size={18}/></div>
            <div style={{ fontFamily: KanjiTheme.fontMono, fontSize: 10, letterSpacing: 1, color: KanjiTheme.inkMute, marginBottom: 6 }}>QUESTION</div>
            <div style={{ fontFamily: KanjiTheme.fontSerif, fontSize: 17, fontWeight: 600, lineHeight: 1.25, color: KanjiTheme.inkSoft }}>
              {FLASHCARD.q}
            </div>
            <div style={{ height: 2, background: KanjiTheme.line, margin: '16px -4px', borderRadius: 1 }} />
            <div style={{ fontFamily: KanjiTheme.fontMono, fontSize: 10, letterSpacing: 1, color: KanjiTheme.accent3, marginBottom: 6 }}>ANSWER</div>
            <div style={{ fontSize: 15.5, lineHeight: 1.45, color: KanjiTheme.ink, fontFamily: KanjiTheme.font }}>
              {FLASHCARD.a}
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ padding: '8px 10px', borderRadius: 8, background: KanjiTheme.bgSoft, border: `1.5px solid ${KanjiTheme.line}`, display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
              <IconPdf size={14} color={KanjiTheme.inkSoft} />
              <div style={{ fontSize: 10.5, fontFamily: KanjiTheme.fontMono, color: KanjiTheme.inkSoft }}>{FLASHCARD.source}</div>
            </div>
          </div>
        </div>

        <div>
          <div style={{ textAlign: 'center', fontFamily: KanjiTheme.fontAccent, fontSize: 17, fontWeight: 700, color: KanjiTheme.inkSoft, marginBottom: 6 }}>
            How well did you know it?
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { l: 'Hard', s: '< 10m', c: KanjiTheme.hard, tc: '#fff' },
              { l: 'Okay', s: '2 days', c: KanjiTheme.accent2, tc: KanjiTheme.ink },
              { l: 'Easy', s: '9 days', c: KanjiTheme.easy, tc: '#fff' },
            ].map((r, i) => (
              <button key={i} style={{
                flex: 1, padding: '11px 8px', borderRadius: 12,
                background: r.c, color: r.tc,
                border: `2.5px solid ${KanjiTheme.line}`,
                boxShadow: `3px 3px 0 ${KanjiTheme.line}`,
                fontFamily: KanjiTheme.font, fontWeight: 700, fontSize: 15,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                cursor: 'pointer',
              }}>
                {r.l}
                <span style={{ fontSize: 10, fontWeight: 500, fontFamily: KanjiTheme.fontMono, opacity: 0.8 }}>{r.s}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

// ─── calendar + conflict ──────────────────────────────────
function KanjiCalendar() {
  const slots = [
    { t: '9:00', kind: 'busy', label: 'CS-3305 Lab', dur: 2 },
    { t: '10:00', kind: 'busy', dur: 0 },
    { t: '11:00', kind: 'suggested', label: 'Review · DB · 20 min', dur: 1 },
    { t: '12:00', kind: 'busy', label: 'Lunch w/ Elena', dur: 1 },
    { t: '13:00', kind: 'empty', dur: 1 },
  ];
  return (
    <PhoneFrame bg={KanjiTheme.bg}>
      <KanjiBg />
      <div style={{ position: 'relative', height: '100%', overflow: 'auto', fontFamily: KanjiTheme.font, color: KanjiTheme.ink }}>
        <div style={{ padding: '18px 22px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button style={{ width: 36, height: 36, borderRadius: 10, background: '#fff', border: `2px solid ${KanjiTheme.line}`, boxShadow: `2px 2px 0 ${KanjiTheme.line}`, display: 'grid', placeItems: 'center' }}>
              <IconBack size={18} />
            </button>
            <div style={{ fontFamily: KanjiTheme.fontMono, fontSize: 11, letterSpacing: 2, background: KanjiTheme.ink, color: KanjiTheme.bg, padding: '4px 10px', borderRadius: 4 }}>CALENDAR</div>
            <IconMore size={20} color={KanjiTheme.inkSoft} />
          </div>
          <h2 style={{ fontFamily: KanjiTheme.fontSerif, fontSize: 32, fontWeight: 800, lineHeight: 1.0, margin: '18px 0 0', letterSpacing: -0.5 }}>
            Review schedule
            <span style={{ display: 'inline-block', marginLeft: 6 }}><Star color={KanjiTheme.accent2} size={22}/></span>
          </h2>
        </div>

        {/* conflict card */}
        <div style={{ margin: '16px 16px 0', padding: 14, borderRadius: 16, background: KanjiTheme.accent2, border: `2.5px solid ${KanjiTheme.line}`, boxShadow: `4px 4px 0 ${KanjiTheme.line}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: KanjiTheme.ink, display: 'grid', placeItems: 'center' }}>
              <IconWarn size={16} color={KanjiTheme.accent2} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: KanjiTheme.fontSerif, fontSize: 15, fontWeight: 700 }}>Calendar conflict</div>
              <div style={{ fontSize: 11, color: KanjiTheme.inkSoft, marginTop: 1 }}>10:00 review clashes with CS-3305 Lab</div>
            </div>
          </div>
          <div style={{ marginTop: 12, padding: 10, borderRadius: 10, background: '#fff', border: `2px solid ${KanjiTheme.line}` }}>
            <div style={{ fontFamily: KanjiTheme.fontMono, fontSize: 10, color: KanjiTheme.inkMute, letterSpacing: 1, marginBottom: 4 }}>NEXT FREE SLOT</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ padding: '3px 9px', borderRadius: 999, background: KanjiTheme.accent3, color: '#fff', fontSize: 11, fontWeight: 700, fontFamily: KanjiTheme.fontMono, border: `1.5px solid ${KanjiTheme.line}` }}>11:00</span>
              <span style={{ fontSize: 12, fontWeight: 500 }}>Shift review +1 hr</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button style={{ flex: 1, padding: '9px', borderRadius: 10, background: '#fff', border: `2px solid ${KanjiTheme.line}`, color: KanjiTheme.ink, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: KanjiTheme.font }}>Pick another</button>
            <button style={{ flex: 1, padding: '9px', borderRadius: 10, background: KanjiTheme.ink, color: '#fff', border: `2px solid ${KanjiTheme.line}`, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: KanjiTheme.font }}>Accept 11:00</button>
          </div>
        </div>

        {/* upcoming reviews — moved ABOVE timeline */}
        <div style={{ padding: '18px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontFamily: KanjiTheme.fontSerif, fontSize: 16, fontWeight: 700 }}>Upcoming reviews</div>
            <div style={{ fontFamily: KanjiTheme.fontMono, fontSize: 10, color: KanjiTheme.inkMute, letterSpacing: 1 }}>NEXT 7 DAYS</div>
          </div>
          {[
            { day: 'Sat', d: '19', s: '2 sessions · 32 cards', c: KanjiTheme.accent4 },
            { day: 'Mon', d: '21', s: '3 sessions · 48 cards', c: KanjiTheme.accent },
            { day: 'Wed', d: '23', s: '1 session · 18 cards', c: KanjiTheme.accent5 },
          ].map((w, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, borderRadius: 12, background: '#fff', border: `2px solid ${KanjiTheme.line}`, boxShadow: `3px 3px 0 ${KanjiTheme.line}`, marginBottom: 8 }}>
              <div style={{ width: 42, height: 44, borderRadius: 8, background: w.c, border: `1.5px solid ${KanjiTheme.line}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <div style={{ fontSize: 9, fontFamily: KanjiTheme.fontMono }}>{w.day.toUpperCase()}</div>
                <div style={{ fontFamily: KanjiTheme.fontSerif, fontSize: 16, fontWeight: 800, lineHeight: 1 }}>{w.d}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600 }}>{w.s}</div>
              </div>
              <IconArrowR size={14} color={KanjiTheme.inkMute} />
            </div>
          ))}
        </div>

        {/* timeline */}
        <div style={{ padding: '18px 20px 100px' }}>
          <div style={{ fontFamily: KanjiTheme.fontSerif, fontSize: 16, fontWeight: 700, marginBottom: 10 }}>Today · Fri Apr 18</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {slots.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, fontFamily: KanjiTheme.fontMono, fontSize: 11, color: KanjiTheme.inkMute, textAlign: 'right', flexShrink: 0 }}>{s.t}</div>
                {s.kind === 'busy' && (
                  <div style={{ flex: 1, padding: '8px 12px', borderRadius: 10, background: '#fff', border: `2px solid ${KanjiTheme.line}`, fontSize: 12, fontWeight: 600 }}>
                    {s.label || 'Busy'}
                  </div>
                )}
                {s.kind === 'suggested' && (
                  <div style={{ flex: 1, padding: '10px 12px', borderRadius: 10, background: KanjiTheme.accent3, color: '#fff', border: `2.5px solid ${KanjiTheme.line}`, boxShadow: `3px 3px 0 ${KanjiTheme.line}`, fontSize: 12.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <IconZap size={12} color="#fff" /> {s.label}
                  </div>
                )}
                {s.kind === 'empty' && (
                  <div style={{ flex: 1, padding: '8px 12px', borderRadius: 10, border: `2px dashed rgba(28,25,23,0.25)`, fontSize: 11, color: KanjiTheme.inkMute }}>Free</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

// ─── empty ──────────────────────────────────────────────
function KanjiEmpty() {
  return (
    <PhoneFrame bg={KanjiTheme.bg}>
      <KanjiBg />
      <div style={{ position: 'absolute', top: 80, right: 30 }}><Star color={KanjiTheme.accent} size={26}/></div>
      <div style={{ position: 'absolute', top: 140, left: 28, transform: 'rotate(-10deg)' }}><Squiggle color={KanjiTheme.accent4} w={50}/></div>
      <div style={{ position: 'absolute', bottom: 240, left: 28 }}><Dots color={KanjiTheme.accent3} cols={5} rows={3}/></div>

      <div style={{ position: 'relative', height: '100%', padding: '20px 22px 28px', fontFamily: KanjiTheme.font, color: KanjiTheme.ink, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: KanjiTheme.fontMono, fontSize: 11, color: KanjiTheme.inkMute, letterSpacing: 1 }}>FRI · APR 18</div>
            <div style={{ fontFamily: KanjiTheme.fontSerif, fontSize: 30, fontWeight: 700, lineHeight: 1.0, marginTop: 2 }}>Hi, Maya</div>
          </div>
          <div style={{
            width: 46, height: 46, borderRadius: 14, background: KanjiTheme.accent5,
            border: `2.5px solid ${KanjiTheme.line}`, boxShadow: `3px 3px 0 ${KanjiTheme.line}`,
            display: 'grid', placeItems: 'center', color: '#fff', fontFamily: KanjiTheme.fontSerif, fontWeight: 700, fontSize: 16,
          }}>MK</div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{
            width: 170, height: 170, borderRadius: 28, background: KanjiTheme.accent2,
            border: `3px solid ${KanjiTheme.line}`, boxShadow: `8px 8px 0 ${KanjiTheme.line}`,
            display: 'grid', placeItems: 'center', transform: 'rotate(-4deg)', marginBottom: 28, position: 'relative',
          }}>
            <IconBook size={72} color={KanjiTheme.ink} />
            <div style={{ position: 'absolute', top: -14, right: -14 }}><Star color={KanjiTheme.accent} size={30}/></div>
            <div style={{ position: 'absolute', bottom: -10, left: -16, padding: '4px 8px', borderRadius: 6, background: '#fff', border: `2px solid ${KanjiTheme.line}`, fontFamily: KanjiTheme.fontMono, fontSize: 10, fontWeight: 700, transform: 'rotate(-6deg)' }}>EMPTY</div>
          </div>

          <h2 style={{ fontFamily: KanjiTheme.fontSerif, fontSize: 28, fontWeight: 800, lineHeight: 1.05, margin: 0, letterSpacing: -0.3 }}>
            No courses yet.
          </h2>
          <div style={{ fontFamily: KanjiTheme.fontAccent, fontSize: 20, color: KanjiTheme.accent, lineHeight: 1.1, marginTop: 6 }}>Let's fix that!</div>
          <p style={{ fontSize: 13.5, color: KanjiTheme.inkSoft, lineHeight: 1.5, marginTop: 12, maxWidth: 270 }}>
            Create a course and drop in your syllabus or lecture slides. We'll generate flashcards and schedule your reviews.
          </p>
        </div>

        <button style={{
          padding: '14px', borderRadius: 14,
          background: KanjiTheme.accent, color: '#fff',
          border: `2.5px solid ${KanjiTheme.line}`, boxShadow: `4px 4px 0 ${KanjiTheme.line}`,
          fontFamily: KanjiTheme.font, fontWeight: 700, fontSize: 15,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer',
        }}>
          <IconPlus size={18} /> Create first course
        </button>
      </div>
    </PhoneFrame>
  );
}

Object.assign(window, {
  KanjiTheme, KanjiOnboarding, KanjiHome, KanjiNewCourse,
  KanjiCourseDetail, KanjiStudyFront, KanjiStudyBack,
  KanjiCalendar, KanjiEmpty,
});
