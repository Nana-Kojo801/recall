// Variation C — "Block"
// Bold color blocks, oversized type, chunky buttons, full-bleed hero blocks.
// Feels like a magazine meets a highlighter meets Swiss poster.

const BlockTheme = {
  bg: '#FFFFFF',
  surface: '#FFFFFF',
  surface2: '#F5F2ED',
  ink: '#0F0F12',
  inkSoft: '#3A3A42',
  inkMute: '#7A7A84',
  accent: '#00FF85',        // electric lime
  accent2: '#FF3B00',       // blaze
  accent3: '#FFE600',       // highlighter
  accent4: '#4F46FF',       // cobalt
  accent5: '#FF4AC4',       // pink
  hard: '#FF3B00',
  okay: '#FFE600',
  easy: '#00FF85',
  font: 'Archivo, system-ui, sans-serif',
  fontSerif: 'Fraunces, serif',
  fontMono: 'JetBrains Mono, monospace',
};

// big heavy block
const Block = ({ children, bg, color, pad = 20, radius = 0, style = {} }) => (
  <div style={{
    background: bg, color, padding: pad, borderRadius: radius,
    fontFamily: BlockTheme.font, position: 'relative', overflow: 'hidden',
    ...style,
  }}>{children}</div>
);

// ─── onboarding ──────────────────────────────────────────────
function BlockOnboarding() {
  return (
    <PhoneFrame bg={BlockTheme.bg}>
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: BlockTheme.font, color: BlockTheme.ink }}>
        {/* big top block */}
        <div style={{
          background: BlockTheme.accent, padding: '24px 24px 32px', position: 'relative', overflow: 'hidden',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: BlockTheme.fontMono, fontSize: 11, fontWeight: 700, letterSpacing: 2, color: BlockTheme.ink }}>RECALL / v1.0</div>
            <div style={{ fontFamily: BlockTheme.fontMono, fontSize: 11, fontWeight: 600, color: BlockTheme.ink }}>01·03</div>
          </div>
          <div style={{ fontFamily: BlockTheme.fontSerif, fontSize: 76, fontWeight: 900, lineHeight: 0.88, letterSpacing: -3, marginTop: 16 }}>
            Know<br/>it.
          </div>
          <div style={{ fontFamily: BlockTheme.fontSerif, fontStyle: 'italic', fontSize: 22, fontWeight: 400, marginTop: 4 }}>
            For real this time.
          </div>
        </div>

        {/* black strip */}
        <div style={{ background: BlockTheme.ink, color: '#fff', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <IconSpark size={16} color={BlockTheme.accent}/>
          <div style={{ fontSize: 12, fontFamily: BlockTheme.fontMono, letterSpacing: 1 }}>AI FLASHCARDS · SPACED REPETITION</div>
        </div>

        {/* content */}
        <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column' }}>
          {/* card stack sample */}
          <div style={{ position: 'relative', height: 160, marginBottom: 14 }}>
            <div style={{ position: 'absolute', left: 0, top: 20, right: 40, height: 120, background: BlockTheme.accent3, border: `2px solid ${BlockTheme.ink}`, transform: 'rotate(-3deg)' }} />
            <div style={{ position: 'absolute', left: 30, top: 10, right: 10, height: 120, background: BlockTheme.accent2, border: `2px solid ${BlockTheme.ink}`, transform: 'rotate(2deg)', padding: 14, color: '#fff' }}>
              <div style={{ fontFamily: BlockTheme.fontMono, fontSize: 10, letterSpacing: 1 }}>Q · 07</div>
              <div style={{ fontFamily: BlockTheme.fontSerif, fontSize: 18, fontWeight: 700, marginTop: 4, lineHeight: 1.1 }}>What does ACID stand for?</div>
            </div>
          </div>

          <div style={{ fontSize: 14, color: BlockTheme.inkSoft, lineHeight: 1.5, marginBottom: 18 }}>
            Drop your lecture materials. We turn them into flashcards, schedule your reviews, and fit them around your day.
          </div>

          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, height: 4, background: BlockTheme.surface2, position: 'relative' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, width: '33%', height: '100%', background: BlockTheme.ink }} />
            </div>
            <button style={{
              padding: '14px 22px', background: BlockTheme.ink, color: BlockTheme.accent,
              border: 'none', fontFamily: BlockTheme.font, fontWeight: 700, fontSize: 15,
              display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
            }}>
              NEXT <IconArrowR size={16} />
            </button>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

// ─── home ──────────────────────────────────────────────────
function BlockHome() {
  const courseColors = [BlockTheme.accent2, BlockTheme.accent4, BlockTheme.accent3, BlockTheme.accent5];
  return (
    <PhoneFrame bg={BlockTheme.bg}>
      <div style={{ position: 'relative', height: '100%', overflow: 'auto', fontFamily: BlockTheme.font, color: BlockTheme.ink }}>
        {/* header block */}
        <div style={{ padding: '18px 22px 14px', background: BlockTheme.ink, color: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: BlockTheme.fontMono, fontSize: 11, color: BlockTheme.accent, letterSpacing: 2 }}>RECALL / FRI 18 APR</div>
            <div style={{ width: 36, height: 36, background: BlockTheme.accent, color: BlockTheme.ink, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 14 }}>MK</div>
          </div>
          <div style={{ fontFamily: BlockTheme.fontSerif, fontSize: 44, fontWeight: 900, lineHeight: 0.95, letterSpacing: -1.5, marginTop: 10 }}>
            Hi, Maya.
          </div>
        </div>

        {/* today pulse block - big number */}
        <div style={{ background: BlockTheme.accent, padding: '20px 22px 22px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
            <div style={{ fontFamily: BlockTheme.fontSerif, fontSize: 96, fontWeight: 900, lineHeight: 0.8, letterSpacing: -4, color: BlockTheme.ink }}>48</div>
            <div style={{ paddingBottom: 6 }}>
              <div style={{ fontFamily: BlockTheme.fontMono, fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>CARDS DUE</div>
              <div style={{ fontSize: 12, color: BlockTheme.ink, marginTop: 1 }}>≈ 22 min · today</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button style={{
              flex: 1, padding: '14px', background: BlockTheme.ink, color: BlockTheme.accent,
              border: 'none', fontFamily: BlockTheme.font, fontWeight: 800, fontSize: 14, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <IconZap size={14} color={BlockTheme.accent}/> START SESSION
            </button>
            <button style={{
              padding: '14px', background: BlockTheme.bg, color: BlockTheme.ink,
              border: `2px solid ${BlockTheme.ink}`, fontFamily: BlockTheme.fontMono, fontWeight: 700, fontSize: 12, cursor: 'pointer',
            }}>9:30</button>
          </div>
        </div>

        {/* stat strip */}
        <div style={{ display: 'flex', borderBottom: `2px solid ${BlockTheme.ink}` }}>
          {[
            { v: '12', l: 'STREAK', c: BlockTheme.accent2 },
            { v: '87%', l: 'RETAINED', c: BlockTheme.accent3 },
            { v: '5', l: 'COURSES', c: BlockTheme.bg },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, padding: '12px 14px', background: s.c, borderRight: i < 2 ? `2px solid ${BlockTheme.ink}` : 'none' }}>
              <div style={{ fontFamily: BlockTheme.fontSerif, fontSize: 26, fontWeight: 900, lineHeight: 1, letterSpacing: -1 }}>{s.v}</div>
              <div style={{ fontFamily: BlockTheme.fontMono, fontSize: 10, fontWeight: 600, marginTop: 2, letterSpacing: 1 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* courses header */}
        <div style={{ padding: '18px 22px 8px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: BlockTheme.fontSerif, fontSize: 28, fontWeight: 900, letterSpacing: -0.8 }}>Courses</div>
          <div style={{ fontFamily: BlockTheme.fontMono, fontSize: 11, color: BlockTheme.inkMute, fontWeight: 600 }}>N=05</div>
        </div>

        <div style={{ padding: '0 22px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {COURSES.slice(0, 4).map((c, i) => {
            const bg = courseColors[i % 4];
            const light = bg === BlockTheme.accent3 || bg === BlockTheme.accent;
            const tc = light ? BlockTheme.ink : '#fff';
            return (
              <div key={i} style={{ background: bg, padding: 14, position: 'relative', color: tc, border: `2px solid ${BlockTheme.ink}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 46, height: 46, background: BlockTheme.ink,
                  display: 'grid', placeItems: 'center', color: bg,
                  fontFamily: BlockTheme.fontMono, fontSize: 13, fontWeight: 800, flexShrink: 0,
                }}>{c.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: BlockTheme.fontSerif, fontSize: 18, fontWeight: 800, lineHeight: 1.0, letterSpacing: -0.3 }}>{c.name}</div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 4, alignItems: 'center' }}>
                    <div style={{ fontFamily: BlockTheme.fontMono, fontSize: 10, opacity: 0.85 }}>{c.code}</div>
                    <div style={{ fontSize: 11 }}>· {c.topics} topics</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: BlockTheme.fontSerif, fontSize: 26, fontWeight: 900, lineHeight: 0.9 }}>{c.due}</div>
                  <div style={{ fontFamily: BlockTheme.fontMono, fontSize: 9, fontWeight: 700, letterSpacing: 1 }}>DUE</div>
                </div>
              </div>
            );
          })}
          <button style={{
            padding: 14, background: BlockTheme.bg, color: BlockTheme.ink,
            border: `2px dashed ${BlockTheme.ink}`, fontFamily: BlockTheme.font, fontWeight: 700, fontSize: 13,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer',
          }}>
            <IconPlus size={16}/> ADD COURSE
          </button>
        </div>

        <div style={{ height: 74 }} />
      </div>

      {/* tab bar */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: BlockTheme.ink, borderTop: `2px solid ${BlockTheme.ink}`,
        display: 'flex', justifyContent: 'space-around', alignItems: 'stretch',
        zIndex: 10, height: 58,
      }}>
        {[{ i: <IconHome size={20}/>, l: 'HOME', a: true }, { i: <IconCards size={20}/>, l: 'CARDS' }, { i: <IconCal size={20}/>, l: 'CAL' }, { i: <IconProfile size={20}/>, l: 'ME' }].map((n, i) => (
          <div key={i} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
            background: n.a ? BlockTheme.accent : 'transparent',
            color: n.a ? BlockTheme.ink : 'rgba(255,255,255,0.55)',
          }}>
            {n.i}
            <div style={{ fontFamily: BlockTheme.fontMono, fontSize: 9, fontWeight: 700 }}>{n.l}</div>
          </div>
        ))}
      </div>
    </PhoneFrame>
  );
}

// ─── new course ──────────────────────────────────────────
function BlockNewCourse() {
  return (
    <PhoneFrame bg={BlockTheme.bg}>
      <div style={{ position: 'relative', height: '100%', fontFamily: BlockTheme.font, color: BlockTheme.ink, display: 'flex', flexDirection: 'column' }}>
        {/* header block */}
        <div style={{ background: BlockTheme.ink, color: '#fff', padding: '18px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button style={{ width: 34, height: 34, background: BlockTheme.accent, border: 'none', display: 'grid', placeItems: 'center' }}>
              <IconClose size={18} color={BlockTheme.ink} stroke={2.5} />
            </button>
            <div style={{ fontFamily: BlockTheme.fontMono, fontSize: 11, letterSpacing: 2, color: BlockTheme.accent }}>NEW / COURSE</div>
            <div style={{ width: 34 }}/>
          </div>
          <div style={{ fontFamily: BlockTheme.fontSerif, fontSize: 40, fontWeight: 900, letterSpacing: -1.2, lineHeight: 0.95, marginTop: 10 }}>
            Name it.<br/>
            <span style={{ color: BlockTheme.accent }}>Brand it.</span>
          </div>
        </div>

        <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14, flex: 1, overflow: 'auto' }}>
          {/* preview block */}
          <div style={{ background: BlockTheme.accent2, color: '#fff', padding: 18, border: `2px solid ${BlockTheme.ink}`, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 10, right: 14, padding: '2px 6px', background: '#fff', color: BlockTheme.ink, fontFamily: BlockTheme.fontMono, fontSize: 9, fontWeight: 700 }}>PREVIEW</div>
            <div style={{ fontFamily: BlockTheme.fontMono, fontSize: 10, letterSpacing: 1.5 }}>CS-3305</div>
            <div style={{ fontFamily: BlockTheme.fontSerif, fontSize: 26, fontWeight: 900, lineHeight: 1.0, letterSpacing: -0.6, marginTop: 6 }}>Database<br/>Systems</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
              <span style={{ padding: '2px 8px', background: '#fff', color: BlockTheme.ink, fontFamily: BlockTheme.fontMono, fontSize: 10, fontWeight: 700 }}>SPRING '26</span>
              <span style={{ padding: '2px 8px', background: BlockTheme.ink, color: '#fff', fontFamily: BlockTheme.fontMono, fontSize: 10, fontWeight: 700 }}>REYES</span>
            </div>
          </div>

          <div>
            <div style={{ fontFamily: BlockTheme.fontMono, fontSize: 10, color: BlockTheme.inkMute, letterSpacing: 1.5, fontWeight: 700, marginBottom: 6 }}>COURSE NAME</div>
            <div style={{ padding: '12px 14px', background: BlockTheme.surface2, border: `2px solid ${BlockTheme.ink}`, fontSize: 15, display: 'flex', alignItems: 'center' }}>
              Database Systems
              <div style={{ width: 2, height: 18, background: BlockTheme.accent2, marginLeft: 2 }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: BlockTheme.fontMono, fontSize: 10, color: BlockTheme.inkMute, letterSpacing: 1.5, fontWeight: 700, marginBottom: 6 }}>CODE</div>
              <div style={{ padding: '12px 14px', background: BlockTheme.surface2, border: `2px solid ${BlockTheme.ink}`, fontSize: 15, fontFamily: BlockTheme.fontMono, fontWeight: 600 }}>CS-3305</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: BlockTheme.fontMono, fontSize: 10, color: BlockTheme.inkMute, letterSpacing: 1.5, fontWeight: 700, marginBottom: 6 }}>TERM</div>
              <div style={{ padding: '12px 14px', background: BlockTheme.surface2, border: `2px solid ${BlockTheme.ink}`, fontSize: 15 }}>Spring '26</div>
            </div>
          </div>
          <div>
            <div style={{ fontFamily: BlockTheme.fontMono, fontSize: 10, color: BlockTheme.inkMute, letterSpacing: 1.5, fontWeight: 700, marginBottom: 8 }}>COLOR BLOCK</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {[BlockTheme.accent2, BlockTheme.accent3, BlockTheme.accent, BlockTheme.accent4, BlockTheme.accent5, '#FF8A3D', '#6B4B9B', BlockTheme.ink].map((col, i) => (
                <div key={i} style={{ height: 48, background: col, border: `2px solid ${BlockTheme.ink}`, position: 'relative' }}>
                  {i === 0 && <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
                    <div style={{ width: 18, height: 18, background: BlockTheme.ink, display: 'grid', placeItems: 'center' }}><IconCheck size={12} color={BlockTheme.accent} stroke={3.5}/></div>
                  </div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <button style={{
          padding: '18px', background: BlockTheme.accent, color: BlockTheme.ink,
          border: 'none', fontFamily: BlockTheme.font, fontWeight: 800, fontSize: 16, letterSpacing: 0.5,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer',
        }}>
          CREATE COURSE <IconArrowR size={18} stroke={2.5}/>
        </button>
      </div>
    </PhoneFrame>
  );
}

// ─── course detail ───────────────────────────────────────
function BlockCourseDetail() {
  return (
    <PhoneFrame bg={BlockTheme.bg}>
      <div style={{ position: 'relative', height: '100%', overflow: 'auto', fontFamily: BlockTheme.font, color: BlockTheme.ink }}>
        {/* big color block hero */}
        <div style={{ background: BlockTheme.accent2, color: '#fff', padding: '18px 22px 26px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button style={{ width: 34, height: 34, background: '#fff', color: BlockTheme.ink, border: `2px solid ${BlockTheme.ink}`, display: 'grid', placeItems: 'center' }}>
              <IconBack size={18} />
            </button>
            <IconMore size={20} color="#fff" />
          </div>
          <div style={{ fontFamily: BlockTheme.fontMono, fontSize: 11, letterSpacing: 2, marginTop: 18 }}>CS-3305 / SPRING '26</div>
          <div style={{ fontFamily: BlockTheme.fontSerif, fontSize: 46, fontWeight: 900, lineHeight: 0.9, letterSpacing: -1.5, marginTop: 8 }}>
            Database<br/>Systems.
          </div>
        </div>

        {/* tri stats block */}
        <div style={{ display: 'flex', borderBottom: `2px solid ${BlockTheme.ink}` }}>
          {[{ v: '141', l: 'CARDS' }, { v: '6', l: 'TOPICS' }, { v: '68%', l: 'MASTERY' }].map((s, i) => (
            <div key={i} style={{ flex: 1, padding: '12px 14px', borderRight: i < 2 ? `2px solid ${BlockTheme.ink}` : 'none' }}>
              <div style={{ fontFamily: BlockTheme.fontSerif, fontSize: 28, fontWeight: 900, lineHeight: 1, letterSpacing: -1 }}>{s.v}</div>
              <div style={{ fontFamily: BlockTheme.fontMono, fontSize: 9, fontWeight: 700, letterSpacing: 1.5, marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* generating bar */}
        <div style={{ background: BlockTheme.accent3, padding: 14, borderBottom: `2px solid ${BlockTheme.ink}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, background: BlockTheme.ink, color: BlockTheme.accent3, display: 'grid', placeItems: 'center' }}>
              <IconSpark size={18} color={BlockTheme.accent3}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: BlockTheme.font, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                GENERATING CARDS
                <span style={{ display: 'flex', gap: 3 }}>
                  <span className="gen-dot" style={{ width: 4, height: 4, background: BlockTheme.ink, display: 'inline-block' }}/>
                  <span className="gen-dot" style={{ width: 4, height: 4, background: BlockTheme.ink, display: 'inline-block' }}/>
                  <span className="gen-dot" style={{ width: 4, height: 4, background: BlockTheme.ink, display: 'inline-block' }}/>
                </span>
              </div>
              <div style={{ fontFamily: BlockTheme.fontMono, fontSize: 10, marginTop: 1 }}>QUERY-OPT.PDF · 17/24 PP</div>
            </div>
          </div>
          <div style={{ marginTop: 10, height: 6, background: '#fff', border: `1.5px solid ${BlockTheme.ink}`, overflow: 'hidden' }}>
            <div style={{ width: '70%', height: '100%', background: BlockTheme.ink }}/>
          </div>
        </div>

        {/* topics header */}
        <div style={{ padding: '18px 22px 8px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: BlockTheme.fontSerif, fontSize: 26, fontWeight: 900, letterSpacing: -0.8 }}>Topics</div>
          <div style={{ fontFamily: BlockTheme.fontMono, fontSize: 10, color: BlockTheme.inkMute, fontWeight: 600 }}>06 / 141</div>
        </div>

        {/* topics */}
        <div>
          {DB_TOPICS.slice(0, 4).map((t, i) => (
            <div key={i} style={{ padding: '14px 22px', borderTop: `2px solid ${BlockTheme.ink}`, borderBottom: i === 3 ? `2px solid ${BlockTheme.ink}` : 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ fontFamily: BlockTheme.fontSerif, fontSize: 28, fontWeight: 900, color: BlockTheme.inkMute, letterSpacing: -1, width: 34, flexShrink: 0, lineHeight: 1 }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: BlockTheme.font, fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {t.name}
                  {t.due > 0 && <span style={{ padding: '2px 6px', background: BlockTheme.accent2, color: '#fff', fontFamily: BlockTheme.fontMono, fontSize: 10, fontWeight: 700 }}>{t.due} DUE</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                  <div style={{ flex: 1, height: 4, background: BlockTheme.surface2 }}>
                    <div style={{ width: `${t.mastery * 100}%`, height: '100%', background: t.mastery > 0.7 ? BlockTheme.easy : t.mastery > 0.4 ? BlockTheme.accent3 : BlockTheme.hard }} />
                  </div>
                  <div style={{ fontFamily: BlockTheme.fontMono, fontSize: 10, color: BlockTheme.inkMute, fontWeight: 600, width: 32, textAlign: 'right' }}>{Math.round(t.mastery * 100)}%</div>
                </div>
              </div>
              <div style={{ fontFamily: BlockTheme.fontMono, fontSize: 11, color: BlockTheme.inkMute, fontWeight: 600, flexShrink: 0 }}>{t.cards}c</div>
            </div>
          ))}
        </div>

        <div style={{ padding: 22 }}>
          <button style={{
            width: '100%', padding: '14px', background: BlockTheme.ink, color: BlockTheme.accent,
            border: 'none', fontFamily: BlockTheme.font, fontWeight: 800, fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', letterSpacing: 0.5,
          }}>
            <IconUpload size={16} color={BlockTheme.accent}/> UPLOAD MATERIAL
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}

// ─── study front ────────────────────────────────────────
function BlockStudyFront() {
  return (
    <PhoneFrame bg={BlockTheme.bg}>
      <div style={{ position: 'relative', height: '100%', fontFamily: BlockTheme.font, color: BlockTheme.ink, display: 'flex', flexDirection: 'column' }}>
        {/* header */}
        <div style={{ padding: '16px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${BlockTheme.ink}` }}>
          <button style={{ width: 32, height: 32, background: BlockTheme.ink, color: '#fff', border: 'none', display: 'grid', placeItems: 'center' }}>
            <IconClose size={16} color="#fff"/>
          </button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: BlockTheme.fontMono, fontSize: 10, letterSpacing: 1.5, fontWeight: 700 }}>TRANSACTIONS · ACID</div>
            <div style={{ fontFamily: BlockTheme.fontSerif, fontSize: 18, fontWeight: 900, lineHeight: 1, letterSpacing: -0.3 }}>07/22</div>
          </div>
          <div style={{ padding: '3px 8px', background: BlockTheme.accent, fontFamily: BlockTheme.fontMono, fontSize: 10, fontWeight: 700 }}>04:21</div>
        </div>

        {/* progress segmented */}
        <div style={{ display: 'flex', height: 6, borderBottom: `2px solid ${BlockTheme.ink}` }}>
          {Array.from({ length: 22 }).map((_, i) => (
            <div key={i} style={{ flex: 1, background: i < 6 ? BlockTheme.easy : i === 6 ? BlockTheme.accent2 : BlockTheme.bg, borderRight: i < 21 ? `1px solid ${BlockTheme.ink}` : 'none' }} />
          ))}
        </div>

        {/* card area */}
        <div className="flip-scene" style={{ flex: 1, padding: 22, display: 'flex' }}>
          <div className="flip-card" style={{ width: '100%' }}>
            <div className="flip-face" style={{
              background: BlockTheme.accent3,
              border: `2px solid ${BlockTheme.ink}`,
              padding: 24, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
            }}>
              {/* big Q */}
              <div style={{ position: 'absolute', top: -30, right: -20, fontFamily: BlockTheme.fontSerif, fontSize: 240, fontWeight: 900, lineHeight: 1, color: 'rgba(0,0,0,0.08)', letterSpacing: -12 }}>Q</div>
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ padding: '3px 9px', background: BlockTheme.ink, color: BlockTheme.accent3, fontFamily: BlockTheme.fontMono, fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>QUESTION</div>
                <div style={{ fontFamily: BlockTheme.fontMono, fontSize: 10, fontWeight: 600 }}>07 · 22</div>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative' }}>
                <div style={{ fontFamily: BlockTheme.fontSerif, fontSize: 32, fontWeight: 800, lineHeight: 1.1, letterSpacing: -0.5 }}>
                  {FLASHCARD.q}
                </div>
              </div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 24, height: 2, background: BlockTheme.ink }} />
                <div style={{ fontFamily: BlockTheme.fontMono, fontSize: 10, fontWeight: 600 }}>LECTURE 7 · P.14</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '0 22px 22px' }}>
          <button style={{
            width: '100%', padding: '16px', background: BlockTheme.ink, color: BlockTheme.accent,
            border: 'none', fontFamily: BlockTheme.font, fontWeight: 800, fontSize: 15, letterSpacing: 0.5,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer',
          }}>
            <IconFlip size={16} color={BlockTheme.accent}/> TAP TO REVEAL
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}

// ─── study back ────────────────────────────────────────
function BlockStudyBack() {
  return (
    <PhoneFrame bg={BlockTheme.bg}>
      <div style={{ position: 'relative', height: '100%', fontFamily: BlockTheme.font, color: BlockTheme.ink, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${BlockTheme.ink}` }}>
          <button style={{ width: 32, height: 32, background: BlockTheme.ink, color: '#fff', border: 'none', display: 'grid', placeItems: 'center' }}>
            <IconClose size={16} color="#fff"/>
          </button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: BlockTheme.fontMono, fontSize: 10, letterSpacing: 1.5, fontWeight: 700 }}>TRANSACTIONS · ACID</div>
            <div style={{ fontFamily: BlockTheme.fontSerif, fontSize: 18, fontWeight: 900, lineHeight: 1, letterSpacing: -0.3 }}>07/22</div>
          </div>
          <div style={{ padding: '3px 8px', background: BlockTheme.accent, fontFamily: BlockTheme.fontMono, fontSize: 10, fontWeight: 700 }}>04:28</div>
        </div>

        <div style={{ display: 'flex', height: 6, borderBottom: `2px solid ${BlockTheme.ink}` }}>
          {Array.from({ length: 22 }).map((_, i) => (
            <div key={i} style={{ flex: 1, background: i < 6 ? BlockTheme.easy : i === 6 ? BlockTheme.accent2 : BlockTheme.bg, borderRight: i < 21 ? `1px solid ${BlockTheme.ink}` : 'none' }} />
          ))}
        </div>

        <div style={{ flex: 1, padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Q mini */}
          <div style={{ padding: 14, background: BlockTheme.surface2, border: `2px solid ${BlockTheme.ink}` }}>
            <div style={{ fontFamily: BlockTheme.fontMono, fontSize: 10, fontWeight: 700, letterSpacing: 1, color: BlockTheme.inkMute, marginBottom: 4 }}>QUESTION</div>
            <div style={{ fontFamily: BlockTheme.fontSerif, fontSize: 16, fontWeight: 600, lineHeight: 1.25 }}>
              {FLASHCARD.q}
            </div>
          </div>

          {/* A big */}
          <div style={{ flex: 1, padding: 18, background: BlockTheme.accent, border: `2px solid ${BlockTheme.ink}`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -10, fontFamily: BlockTheme.fontSerif, fontSize: 200, fontWeight: 900, lineHeight: 1, color: 'rgba(0,0,0,0.1)', letterSpacing: -10 }}>A</div>
            <div style={{ position: 'relative' }}>
              <div style={{ padding: '3px 9px', background: BlockTheme.ink, color: BlockTheme.accent, fontFamily: BlockTheme.fontMono, fontSize: 11, fontWeight: 700, display: 'inline-block', letterSpacing: 1 }}>ANSWER</div>
              <div style={{ fontSize: 16, lineHeight: 1.45, marginTop: 12, fontWeight: 500 }}>
                {FLASHCARD.a}
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: 12, left: 18, right: 18, padding: '6px 10px', background: BlockTheme.ink, color: '#fff', fontFamily: BlockTheme.fontMono, fontSize: 10, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconPdf size={12} color="#fff"/> {FLASHCARD.source}
            </div>
          </div>
        </div>

        {/* rating */}
        <div style={{ borderTop: `2px solid ${BlockTheme.ink}` }}>
          <div style={{ padding: '8px 22px', fontFamily: BlockTheme.fontMono, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textAlign: 'center', background: BlockTheme.ink, color: BlockTheme.accent }}>
            RATE YOUR RECALL
          </div>
          <div style={{ display: 'flex' }}>
            {[
              { l: 'HARD', s: '<10m', c: BlockTheme.hard, tc: '#fff' },
              { l: 'OKAY', s: '2d', c: BlockTheme.accent3, tc: BlockTheme.ink },
              { l: 'EASY', s: '9d', c: BlockTheme.accent, tc: BlockTheme.ink },
            ].map((r, i) => (
              <button key={i} style={{
                flex: 1, padding: '16px 8px', background: r.c, color: r.tc,
                border: 'none', borderRight: i < 2 ? `2px solid ${BlockTheme.ink}` : 'none',
                fontFamily: BlockTheme.font, fontWeight: 800, fontSize: 16,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, cursor: 'pointer',
              }}>
                {r.l}
                <span style={{ fontFamily: BlockTheme.fontMono, fontSize: 10, fontWeight: 600 }}>{r.s}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

// ─── calendar ──────────────────────────────────────
function BlockCalendar() {
  const slots = [
    { t: '9:00', kind: 'busy', label: 'CS-3305 Lab' },
    { t: '10:00', kind: 'busy-continue' },
    { t: '11:00', kind: 'suggested', label: 'DB Review · 20 min' },
    { t: '12:00', kind: 'busy', label: 'Lunch / Elena' },
    { t: '13:00', kind: 'empty' },
    { t: '14:00', kind: 'busy', label: 'HU-2100 Seminar' },
  ];
  return (
    <PhoneFrame bg={BlockTheme.bg}>
      <div style={{ position: 'relative', height: '100%', overflow: 'auto', fontFamily: BlockTheme.font, color: BlockTheme.ink }}>
        {/* header */}
        <div style={{ padding: '18px 22px 22px', background: BlockTheme.ink, color: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button style={{ width: 34, height: 34, background: BlockTheme.accent, color: BlockTheme.ink, border: 'none', display: 'grid', placeItems: 'center' }}>
              <IconBack size={18} color={BlockTheme.ink}/>
            </button>
            <div style={{ fontFamily: BlockTheme.fontMono, fontSize: 11, letterSpacing: 2, color: BlockTheme.accent }}>CAL / SYNC</div>
            <IconMore size={20} color="#fff" />
          </div>
          <div style={{ fontFamily: BlockTheme.fontSerif, fontSize: 42, fontWeight: 900, lineHeight: 0.95, letterSpacing: -1.2, marginTop: 12 }}>
            Upcoming<br/>reviews.
          </div>
        </div>

        {/* conflict block — the loudest element */}
        <div style={{ background: BlockTheme.accent2, color: '#fff', padding: 16, borderBottom: `2px solid ${BlockTheme.ink}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: '#fff', display: 'grid', placeItems: 'center' }}>
              <IconWarn size={16} color={BlockTheme.accent2}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: BlockTheme.font, fontSize: 14, fontWeight: 800, letterSpacing: 0.5 }}>CONFLICT DETECTED</div>
              <div style={{ fontFamily: BlockTheme.fontMono, fontSize: 10, fontWeight: 500, opacity: 0.9, marginTop: 1 }}>10:00 DB review × CS-3305 Lab</div>
            </div>
          </div>
          <div style={{ marginTop: 12, padding: 10, background: BlockTheme.ink, border: `2px solid ${BlockTheme.ink}` }}>
            <div style={{ fontFamily: BlockTheme.fontMono, fontSize: 10, color: BlockTheme.accent, fontWeight: 700, letterSpacing: 1, marginBottom: 3 }}>→ NEXT FREE SLOT</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <div style={{ fontFamily: BlockTheme.fontSerif, fontSize: 26, fontWeight: 900, color: BlockTheme.accent, lineHeight: 1, letterSpacing: -1 }}>11:00</div>
              <div style={{ fontSize: 12, color: '#fff' }}>+1 hr shift</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 0, marginTop: 10 }}>
            <button style={{ flex: 1, padding: '10px', background: '#fff', color: BlockTheme.ink, border: 'none', fontFamily: BlockTheme.font, fontWeight: 700, fontSize: 12, cursor: 'pointer', letterSpacing: 0.5 }}>PICK TIME</button>
            <div style={{ width: 2, background: BlockTheme.ink }}/>
            <button style={{ flex: 1, padding: '10px', background: BlockTheme.accent, color: BlockTheme.ink, border: 'none', fontFamily: BlockTheme.font, fontWeight: 800, fontSize: 12, cursor: 'pointer', letterSpacing: 0.5 }}>ACCEPT 11:00</button>
          </div>
        </div>

        {/* timeline */}
        <div style={{ padding: '16px 0' }}>
          <div style={{ padding: '0 22px 10px', fontFamily: BlockTheme.fontSerif, fontSize: 22, fontWeight: 900, letterSpacing: -0.6 }}>Today · Fri 18</div>
          <div>
            {slots.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'stretch', minHeight: 42, borderTop: `1.5px solid ${BlockTheme.ink}`, borderBottom: i === slots.length - 1 ? `1.5px solid ${BlockTheme.ink}` : 'none' }}>
                <div style={{ width: 60, padding: '8px 0 8px 22px', fontFamily: BlockTheme.fontMono, fontSize: 11, fontWeight: 600, color: BlockTheme.inkMute, flexShrink: 0 }}>{s.t}</div>
                <div style={{ flex: 1, padding: 8, borderLeft: `1.5px solid ${BlockTheme.ink}`, background: s.kind === 'suggested' ? BlockTheme.accent : s.kind === 'empty' ? BlockTheme.bg : BlockTheme.surface2 }}>
                  {s.kind === 'busy' && (
                    <div style={{ padding: '6px 10px', background: '#fff', border: `1.5px solid ${BlockTheme.ink}`, fontSize: 12, fontWeight: 600, display: 'inline-block' }}>
                      {s.label}
                    </div>
                  )}
                  {s.kind === 'busy-continue' && (
                    <div style={{ fontFamily: BlockTheme.fontMono, fontSize: 10, color: BlockTheme.inkMute, padding: '6px 0' }}>↳ continued</div>
                  )}
                  {s.kind === 'suggested' && (
                    <div style={{ padding: '6px 10px', background: BlockTheme.ink, color: BlockTheme.accent, fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <IconZap size={12} color={BlockTheme.accent}/> {s.label}
                    </div>
                  )}
                  {s.kind === 'empty' && (
                    <div style={{ fontFamily: BlockTheme.fontMono, fontSize: 10, color: BlockTheme.inkMute, padding: '6px 0' }}>· free</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '0 22px 16px' }}>
          <div style={{ fontFamily: BlockTheme.fontSerif, fontSize: 22, fontWeight: 900, letterSpacing: -0.6, marginBottom: 10 }}>This week</div>
          {[
            { day: 'SAT', d: '19', s: '2 sessions · 32 cards', c: BlockTheme.accent4 },
            { day: 'MON', d: '21', s: '3 sessions · 48 cards', c: BlockTheme.accent2 },
            { day: 'WED', d: '23', s: '1 session · 18 cards', c: BlockTheme.accent5 },
          ].map((w, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'stretch', marginBottom: 8, border: `2px solid ${BlockTheme.ink}` }}>
              <div style={{ width: 56, background: w.c, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontFamily: BlockTheme.fontMono, fontSize: 10, fontWeight: 700 }}>{w.day}</div>
                <div style={{ fontFamily: BlockTheme.fontSerif, fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}>{w.d}</div>
              </div>
              <div style={{ flex: 1, padding: '10px 12px', display: 'flex', alignItems: 'center' }}>
                <div style={{ fontSize: 12.5, fontWeight: 600 }}>{w.s}</div>
              </div>
              <div style={{ width: 38, display: 'grid', placeItems: 'center', borderLeft: `1.5px solid ${BlockTheme.ink}` }}>
                <IconArrowR size={14}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PhoneFrame>
  );
}

// ─── empty ──────────────────────────────────────
function BlockEmpty() {
  return (
    <PhoneFrame bg={BlockTheme.bg}>
      <div style={{ position: 'relative', height: '100%', fontFamily: BlockTheme.font, color: BlockTheme.ink, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '18px 22px 14px', background: BlockTheme.ink, color: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: BlockTheme.fontMono, fontSize: 11, color: BlockTheme.accent, letterSpacing: 2 }}>RECALL / FRI 18 APR</div>
            <div style={{ width: 36, height: 36, background: BlockTheme.accent, color: BlockTheme.ink, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 14 }}>MK</div>
          </div>
          <div style={{ fontFamily: BlockTheme.fontSerif, fontSize: 38, fontWeight: 900, lineHeight: 0.95, letterSpacing: -1.2, marginTop: 10 }}>Hi, Maya.</div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'center', padding: '0 22px' }}>
          {/* giant block */}
          <div style={{ background: BlockTheme.accent3, border: `2px solid ${BlockTheme.ink}`, padding: 24, position: 'relative', overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ position: 'absolute', top: -40, right: -30, fontFamily: BlockTheme.fontSerif, fontSize: 260, fontWeight: 900, lineHeight: 1, letterSpacing: -12, color: 'rgba(0,0,0,0.08)' }}>0</div>
            <div style={{ position: 'relative' }}>
              <div style={{ padding: '3px 8px', background: BlockTheme.ink, color: BlockTheme.accent3, fontFamily: BlockTheme.fontMono, fontSize: 10, fontWeight: 700, display: 'inline-block', letterSpacing: 1 }}>STATUS</div>
              <div style={{ fontFamily: BlockTheme.fontSerif, fontSize: 60, fontWeight: 900, lineHeight: 0.88, letterSpacing: -2.5, marginTop: 10 }}>
                Zero<br/>courses.
              </div>
              <div style={{ fontSize: 13.5, color: BlockTheme.ink, lineHeight: 1.45, marginTop: 12, fontWeight: 500 }}>
                Let's fix that. Create a course, upload your syllabus, and we'll build your first deck.
              </div>
            </div>
          </div>

          {/* 2-step list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: `2px solid ${BlockTheme.ink}` }}>
            {[
              { n: '01', t: 'Create a course', s: 'Name it and pick a color block' },
              { n: '02', t: 'Upload slides or a PDF', s: 'We generate flashcards automatically' },
              { n: '03', t: 'Study & schedule', s: 'We book reviews in your calendar' },
            ].map((step, i) => (
              <div key={i} style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: i < 2 ? `2px solid ${BlockTheme.ink}` : 'none', background: i === 0 ? BlockTheme.accent : BlockTheme.bg }}>
                <div style={{ fontFamily: BlockTheme.fontSerif, fontSize: 28, fontWeight: 900, letterSpacing: -0.8, width: 40, lineHeight: 1 }}>{step.n}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>{step.t}</div>
                  <div style={{ fontSize: 11, color: BlockTheme.inkSoft, marginTop: 1 }}>{step.s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: 22 }}>
          <button style={{
            width: '100%', padding: '18px', background: BlockTheme.accent2, color: '#fff',
            border: 'none', fontFamily: BlockTheme.font, fontWeight: 800, fontSize: 16, letterSpacing: 0.5,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer',
          }}>
            <IconPlus size={18} color="#fff" stroke={3}/> CREATE FIRST COURSE
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}

Object.assign(window, {
  BlockTheme, BlockOnboarding, BlockHome, BlockNewCourse,
  BlockCourseDetail, BlockStudyFront, BlockStudyBack,
  BlockCalendar, BlockEmpty,
});
