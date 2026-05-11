// Variation A — "Pulse"
// Bold gradients, neon accents, glassy cards, dark surfaces, high energy.
// Theme: deep indigo bg, electric magenta→orange gradient, cyan flashes.

const PulseTheme = {
  bg: '#0B0717',
  bgSoft: '#14102A',
  surface: 'rgba(255,255,255,0.06)',
  surfaceSolid: '#1A1530',
  border: 'rgba(255,255,255,0.1)',
  text: '#F5F3FF',
  textDim: 'rgba(245,243,255,0.65)',
  textMute: 'rgba(245,243,255,0.4)',
  accent: '#FF3D7F',       // hot pink
  accent2: '#FF8A3D',      // orange
  accent3: '#00E0D1',      // cyan
  accentPurple: '#9D4DFF',
  hard: '#FF3D7F',
  okay: '#FFB547',
  easy: '#00E0D1',
  gradMain: 'linear-gradient(135deg, #FF3D7F 0%, #FF8A3D 100%)',
  gradCool: 'linear-gradient(135deg, #9D4DFF 0%, #00E0D1 100%)',
  font: 'Space Grotesk, system-ui, sans-serif',
  fontSerif: 'Instrument Serif, serif',
  fontMono: 'JetBrains Mono, monospace',
};

// ─── decorative bg glow ───────────────────────────────────────
const PulseBg = ({ variant = 'default' }) => {
  const blobs = variant === 'default' ? [
    { x: -40, y: -40, w: 260, h: 260, c: '#FF3D7F', o: 0.35 },
    { x: 200, y: 200, w: 240, h: 240, c: '#9D4DFF', o: 0.3 },
    { x: 40, y: 480, w: 260, h: 260, c: '#00E0D1', o: 0.22 },
  ] : [
    { x: -60, y: 300, w: 300, h: 300, c: '#FF8A3D', o: 0.25 },
    { x: 180, y: -60, w: 220, h: 220, c: '#00E0D1', o: 0.28 },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {blobs.map((b, i) => (
        <div key={i} style={{
          position: 'absolute', left: b.x, top: b.y, width: b.w, height: b.h,
          borderRadius: '50%', background: b.c, opacity: b.o,
          filter: 'blur(80px)',
        }} />
      ))}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at top, transparent 30%, rgba(11,7,23,0.8) 100%)',
      }} />
    </div>
  );
};

// ─── onboarding ───────────────────────────────────────────────
function PulseOnboarding() {
  return (
    <PhoneFrame bg={PulseTheme.bg} dark>
      <PulseBg />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', padding: '24px 28px 32px', fontFamily: PulseTheme.font, color: PulseTheme.text }}>
        <div style={{ fontFamily: PulseTheme.fontMono, fontSize: 11, letterSpacing: 2, color: PulseTheme.textMute, textTransform: 'uppercase' }}>
          RECALL · 01 / 03
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: -40 }}>
          {/* floating stack of cards */}
          <div style={{ position: 'relative', height: 260, marginBottom: 36 }}>
            {[
              { r: -8, x: -34, y: 50, bg: 'linear-gradient(135deg, #9D4DFF, #FF3D7F)', z: 1 },
              { r:  6, x:  26, y: 30, bg: 'linear-gradient(135deg, #FF8A3D, #FFB547)', z: 2 },
              { r: -3, x:  -6, y:  0, bg: 'linear-gradient(135deg, #00E0D1, #9D4DFF)', z: 3 },
            ].map((c, i) => (
              <div key={i} className="float" style={{
                position: 'absolute', left: '50%', top: c.y,
                transform: `translateX(-50%) translateX(${c.x}px) rotate(${c.r}deg)`,
                width: 200, height: 240, borderRadius: 24,
                background: c.bg, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.4)',
                zIndex: c.z, border: '1px solid rgba(255,255,255,0.2)',
                padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                animationDelay: `${i * 0.3}s`,
              }}>
                <div style={{ fontFamily: PulseTheme.fontMono, fontSize: 10, letterSpacing: 1.5, color: 'rgba(255,255,255,0.7)' }}>Q {i + 1} / 12</div>
                <div style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.2, color: '#fff' }}>
                  {i === 2 ? 'What is a foreign key?' : i === 1 ? 'Define 3NF.' : 'What does ACID stand for?'}
                </div>
              </div>
            ))}
          </div>
          <h1 style={{ fontFamily: PulseTheme.fontSerif, fontSize: 44, fontWeight: 400, lineHeight: 1.0, margin: 0, letterSpacing: -0.5 }}>
            Study <em style={{ color: PulseTheme.accent }}>less.</em><br/>Remember <em style={{ color: PulseTheme.accent3 }}>more.</em>
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.5, color: PulseTheme.textDim, marginTop: 14, marginBottom: 0 }}>
            Drop in your lecture slides. We'll turn them into flashcards and schedule every review into your calendar.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 24, height: 4, borderRadius: 2, background: PulseTheme.accent }}/>
            <div style={{ width: 4, height: 4, borderRadius: 2, background: PulseTheme.textMute }}/>
            <div style={{ width: 4, height: 4, borderRadius: 2, background: PulseTheme.textMute }}/>
          </div>
          <div style={{ flex: 1 }}/>
          <button style={{
            padding: '14px 22px', borderRadius: 999, border: 'none', color: '#fff',
            background: PulseTheme.gradMain, fontFamily: PulseTheme.font, fontWeight: 600, fontSize: 15,
            display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
            boxShadow: '0 10px 30px -6px rgba(255,61,127,0.5)',
          }}>
            Get started <IconArrowR size={18} />
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}

// ─── home (all courses) ───────────────────────────────────────
function PulseHome() {
  return (
    <PhoneFrame bg={PulseTheme.bg} dark>
      <PulseBg />
      <div style={{ position: 'relative', height: '100%', overflow: 'auto', fontFamily: PulseTheme.font, color: PulseTheme.text }}>
        <div style={{ padding: '20px 24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 13, color: PulseTheme.textDim }}>Friday, April 18</div>
              <div style={{ fontFamily: PulseTheme.fontSerif, fontSize: 32, lineHeight: 1.1, marginTop: 2 }}>
                Morning, <em style={{ color: PulseTheme.accent }}>Maya</em>
              </div>
            </div>
            <div style={{
              width: 44, height: 44, borderRadius: 22,
              background: 'linear-gradient(135deg, #9D4DFF, #FF3D7F)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 600, color: '#fff', fontSize: 15,
            }}>MK</div>
          </div>

          {/* today's pulse strip */}
          <div style={{
            marginTop: 18, borderRadius: 20, padding: 18,
            background: PulseTheme.gradMain,
            position: 'relative', overflow: 'hidden',
            boxShadow: '0 20px 40px -10px rgba(255,61,127,0.35)',
          }}>
            <div style={{ position: 'absolute', right: -20, top: -20, width: 120, height: 120, borderRadius: 60, background: 'rgba(255,255,255,0.15)' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontFamily: PulseTheme.fontMono, fontSize: 10, letterSpacing: 1.5, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase' }}>Today's pulse</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
                <div style={{ fontSize: 46, fontWeight: 700, color: '#fff', lineHeight: 1, letterSpacing: -1 }}>48</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>cards · 22 min</div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <button style={{
                  flex: 1, padding: '11px 14px', borderRadius: 12, border: 'none',
                  background: '#fff', color: '#1A1530', fontWeight: 600, fontSize: 13,
                  fontFamily: PulseTheme.font, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer',
                }}>
                  <IconZap size={14} color="#FF3D7F" /> Start session
                </button>
                <button style={{
                  padding: '11px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.35)',
                  background: 'rgba(255,255,255,0.12)', color: '#fff', fontWeight: 500, fontSize: 13,
                  fontFamily: PulseTheme.font, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <IconCal size={14} /> 9:30
                </button>
              </div>
            </div>
          </div>

          {/* stats */}
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            {[
              { v: '12', l: 'day streak', c: PulseTheme.accent2 },
              { v: '87%', l: 'retention', c: PulseTheme.accent3 },
              { v: '5', l: 'courses', c: PulseTheme.accentPurple },
            ].map((s, i) => (
              <div key={i} style={{
                flex: 1, padding: '12px 14px', borderRadius: 14,
                background: PulseTheme.surface, border: `1px solid ${PulseTheme.border}`,
              }}>
                <div style={{ fontSize: 20, fontWeight: 600, color: s.c, fontFamily: PulseTheme.font, letterSpacing: -0.5 }}>{s.v}</div>
                <div style={{ fontSize: 11, color: PulseTheme.textDim, marginTop: 1 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* courses header */}
        <div style={{ padding: '22px 24px 10px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 17, fontWeight: 600 }}>Your courses</div>
          <div style={{ fontSize: 12, color: PulseTheme.textDim, fontFamily: PulseTheme.fontMono }}>5 · SPRING '26</div>
        </div>

        {/* course cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 24px 24px' }}>
          {COURSES.slice(0, 4).map((c, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: 14, borderRadius: 16,
              background: PulseTheme.surface, border: `1px solid ${PulseTheme.border}`,
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: `linear-gradient(135deg, ${c.color}, ${c.color}aa)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: PulseTheme.fontMono, fontWeight: 600, color: '#fff',
                fontSize: 14, letterSpacing: 0.5, flexShrink: 0,
              }}>{c.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                <div style={{ fontSize: 11, color: PulseTheme.textDim, fontFamily: PulseTheme.fontMono, marginTop: 2 }}>
                  {c.code} · {c.topics} topics
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{
                  fontSize: 13, fontWeight: 600,
                  color: c.due > 20 ? PulseTheme.hard : c.due > 10 ? PulseTheme.okay : PulseTheme.easy,
                }}>{c.due}</div>
                <div style={{ fontSize: 10, color: PulseTheme.textMute, fontFamily: PulseTheme.fontMono }}>DUE</div>
              </div>
            </div>
          ))}

          {/* new course CTA */}
          <button style={{
            padding: 16, borderRadius: 16, background: 'transparent',
            border: `1.5px dashed ${PulseTheme.border}`, color: PulseTheme.textDim,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontSize: 14, fontWeight: 500, fontFamily: PulseTheme.font, cursor: 'pointer',
          }}>
            <IconPlus size={18} /> New course
          </button>
        </div>

        {/* nav bar spacer */}
        <div style={{ height: 80 }} />
      </div>

      {/* bottom nav */}
      <div style={{
        position: 'absolute', left: 16, right: 16, bottom: 16,
        padding: '10px 20px', borderRadius: 999,
        background: 'rgba(10,7,23,0.85)', backdropFilter: 'blur(20px)',
        border: `1px solid ${PulseTheme.border}`,
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        zIndex: 10,
      }}>
        {[
          { i: <IconHome size={20} />, a: true },
          { i: <IconCards size={20} /> },
          { i: <IconCal size={20} /> },
          { i: <IconProfile size={20} /> },
        ].map((n, i) => (
          <div key={i} style={{
            padding: '8px 14px', borderRadius: 20,
            background: n.a ? PulseTheme.gradMain : 'transparent',
            color: n.a ? '#fff' : PulseTheme.textDim,
            display: 'flex', alignItems: 'center',
          }}>{n.i}</div>
        ))}
      </div>
    </PhoneFrame>
  );
}

// ─── new course creation ──────────────────────────────────────
function PulseNewCourse() {
  return (
    <PhoneFrame bg={PulseTheme.bg} dark>
      <PulseBg variant="alt" />
      <div style={{ position: 'relative', height: '100%', padding: '18px 24px', fontFamily: PulseTheme.font, color: PulseTheme.text, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: PulseTheme.text, width: 36, height: 36, borderRadius: 10, display: 'grid', placeItems: 'center' }}>
            <IconClose size={18} />
          </button>
          <div style={{ fontFamily: PulseTheme.fontMono, fontSize: 11, letterSpacing: 2, color: PulseTheme.textMute }}>NEW COURSE</div>
          <div style={{ width: 36 }} />
        </div>

        <div style={{ marginTop: 28 }}>
          <h2 style={{ fontFamily: PulseTheme.fontSerif, fontSize: 30, lineHeight: 1.05, margin: 0, letterSpacing: -0.3 }}>
            What are you <em style={{ color: PulseTheme.accent3 }}>learning?</em>
          </h2>
          <p style={{ fontSize: 13, color: PulseTheme.textDim, marginTop: 8 }}>
            Give it a name and a color. You can add topics and upload materials next.
          </p>
        </div>

        {/* color preview */}
        <div style={{
          marginTop: 22, borderRadius: 18, padding: 20, position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg, #FF3D7F, #FF8A3D)',
          boxShadow: '0 20px 40px -10px rgba(255,61,127,0.3)',
          minHeight: 140,
        }}>
          <div style={{ position: 'absolute', right: -30, bottom: -30, width: 140, height: 140, borderRadius: 70, background: 'rgba(255,255,255,0.15)' }} />
          <div style={{ fontFamily: PulseTheme.fontMono, fontSize: 10, color: 'rgba(255,255,255,0.85)', letterSpacing: 1.2 }}>CS-3305</div>
          <div style={{ fontSize: 26, fontWeight: 600, color: '#fff', marginTop: 8, lineHeight: 1.1, fontFamily: PulseTheme.font }}>Database Systems</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <span style={{ padding: '4px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.2)', fontSize: 11, color: '#fff' }}>Spring '26</span>
            <span style={{ padding: '4px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.2)', fontSize: 11, color: '#fff' }}>Prof. Reyes</span>
          </div>
        </div>

        {/* inputs */}
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: PulseTheme.textMute, fontFamily: PulseTheme.fontMono, letterSpacing: 1, marginBottom: 6 }}>COURSE NAME</div>
            <div style={{
              padding: '14px 16px', borderRadius: 12,
              background: PulseTheme.surface, border: `1px solid ${PulseTheme.accent}`,
              fontSize: 15, color: PulseTheme.text, display: 'flex', alignItems: 'center',
            }}>
              Database Systems
              <div style={{ width: 2, height: 18, background: PulseTheme.accent, marginLeft: 2 }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: PulseTheme.textMute, fontFamily: PulseTheme.fontMono, letterSpacing: 1, marginBottom: 6 }}>CODE</div>
              <div style={{
                padding: '14px 16px', borderRadius: 12,
                background: PulseTheme.surface, border: `1px solid ${PulseTheme.border}`,
                fontSize: 15, color: PulseTheme.text, fontFamily: PulseTheme.fontMono,
              }}>CS-3305</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: PulseTheme.textMute, fontFamily: PulseTheme.fontMono, letterSpacing: 1, marginBottom: 6 }}>TERM</div>
              <div style={{
                padding: '14px 16px', borderRadius: 12,
                background: PulseTheme.surface, border: `1px solid ${PulseTheme.border}`,
                fontSize: 15, color: PulseTheme.text,
              }}>Spring '26</div>
            </div>
          </div>

          {/* color picker */}
          <div>
            <div style={{ fontSize: 11, color: PulseTheme.textMute, fontFamily: PulseTheme.fontMono, letterSpacing: 1, marginBottom: 8 }}>ACCENT</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {['#FF3D7F','#FF8A3D','#FFB547','#00E0D1','#4D7CFF','#9D4DFF','#FF4DCB','#5BD8A4'].map((col, i) => (
                <div key={i} style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: `linear-gradient(135deg, ${col}, ${col}aa)`,
                  border: i === 0 ? `2px solid #fff` : '2px solid transparent',
                  boxShadow: i === 0 ? `0 0 0 2px ${col}` : 'none',
                }} />
              ))}
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }} />
        <button style={{
          padding: '16px', borderRadius: 14, border: 'none',
          background: PulseTheme.gradMain, color: '#fff',
          fontFamily: PulseTheme.font, fontWeight: 600, fontSize: 15,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer',
          boxShadow: '0 15px 30px -10px rgba(255,61,127,0.5)',
        }}>
          Create course <IconArrowR size={18} />
        </button>
      </div>
    </PhoneFrame>
  );
}

// ─── course detail + AI generating ───────────────────────────
function PulseCourseDetail() {
  return (
    <PhoneFrame bg={PulseTheme.bg} dark>
      <PulseBg />
      <div style={{ position: 'relative', height: '100%', overflow: 'auto', fontFamily: PulseTheme.font, color: PulseTheme.text }}>
        {/* hero */}
        <div style={{
          padding: '20px 24px 32px',
          background: 'linear-gradient(135deg, #FF3D7F 0%, #FF8A3D 100%)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -40, top: -40, width: 180, height: 180, borderRadius: 90, background: 'rgba(255,255,255,0.12)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 36, height: 36, borderRadius: 10, display: 'grid', placeItems: 'center' }}>
              <IconBack size={18} />
            </button>
            <IconMore size={20} color="#fff" />
          </div>
          <div style={{ marginTop: 22, position: 'relative' }}>
            <div style={{ fontFamily: PulseTheme.fontMono, fontSize: 11, color: 'rgba(255,255,255,0.85)', letterSpacing: 1.5 }}>CS-3305 · SPRING '26</div>
            <div style={{ fontFamily: PulseTheme.fontSerif, fontSize: 34, lineHeight: 1.0, marginTop: 8, color: '#fff', fontWeight: 400 }}>
              Database<br/>Systems
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 18 }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>141</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>cards</div>
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>6</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>topics</div>
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>68%</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>mastery</div>
              </div>
            </div>
          </div>
        </div>

        {/* generating card */}
        <div style={{
          margin: '-22px 16px 0', padding: 16, borderRadius: 18,
          background: PulseTheme.surfaceSolid,
          border: `1px solid ${PulseTheme.accent3}40`,
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 20px 40px -10px rgba(0,224,209,0.2)',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,224,209,0.08), rgba(157,77,255,0.08))' }} />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, #00E0D1, #9D4DFF)',
              display: 'grid', placeItems: 'center',
            }}>
              <IconSpark size={22} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                Generating flashcards
                <span style={{ display: 'flex', gap: 3 }}>
                  <span className="gen-dot" style={{ width: 4, height: 4, borderRadius: 2, background: PulseTheme.accent3, display: 'inline-block' }} />
                  <span className="gen-dot" style={{ width: 4, height: 4, borderRadius: 2, background: PulseTheme.accent3, display: 'inline-block' }} />
                  <span className="gen-dot" style={{ width: 4, height: 4, borderRadius: 2, background: PulseTheme.accent3, display: 'inline-block' }} />
                </span>
              </div>
              <div style={{ fontSize: 11, color: PulseTheme.textDim, fontFamily: PulseTheme.fontMono, marginTop: 2 }}>
                Lecture 8 — Query Optimization.pdf · 17 / 24 pages
              </div>
            </div>
          </div>
          <div style={{ position: 'relative', marginTop: 12, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)' }}>
            <div style={{ width: '70%', height: '100%', borderRadius: 2, background: 'linear-gradient(90deg, #00E0D1, #9D4DFF)' }} />
          </div>
        </div>

        {/* topics */}
        <div style={{ padding: '22px 20px 0', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Topics</div>
          <div style={{ fontSize: 11, color: PulseTheme.textDim, fontFamily: PulseTheme.fontMono }}>6 · 141 CARDS</div>
        </div>
        <div style={{ padding: '10px 20px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {DB_TOPICS.slice(0, 4).map((t, i) => (
            <div key={i} style={{
              padding: 14, borderRadius: 14,
              background: PulseTheme.surface, border: `1px solid ${PulseTheme.border}`,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, position: 'relative',
                background: 'rgba(255,255,255,0.04)', display: 'grid', placeItems: 'center',
                fontFamily: PulseTheme.fontMono, fontSize: 11, color: PulseTheme.textDim,
              }}>{String(i + 1).padStart(2, '0')}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {t.name}
                  {t.due > 0 && (
                    <span style={{ padding: '2px 7px', borderRadius: 999, background: PulseTheme.accent, fontSize: 10, fontWeight: 600, color: '#fff' }}>
                      {t.due}
                    </span>
                  )}
                </div>
                <div style={{ marginTop: 6, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.06)' }}>
                  <div style={{
                    height: '100%', width: `${t.mastery * 100}%`, borderRadius: 2,
                    background: t.mastery > 0.7 ? PulseTheme.easy : t.mastery > 0.4 ? PulseTheme.okay : PulseTheme.hard,
                  }} />
                </div>
              </div>
              <div style={{ fontFamily: PulseTheme.fontMono, fontSize: 11, color: PulseTheme.textDim, flexShrink: 0 }}>{t.cards}</div>
            </div>
          ))}

          {/* upload material */}
          <button style={{
            padding: 16, borderRadius: 14, background: 'rgba(0,224,209,0.08)',
            border: `1.5px dashed ${PulseTheme.accent3}60`, color: PulseTheme.accent3,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontSize: 13.5, fontWeight: 600, fontFamily: PulseTheme.font, cursor: 'pointer', marginTop: 2,
          }}>
            <IconUpload size={16} /> Upload lecture materials
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}

// ─── study session — card front ─────────────────────────────
function PulseStudyFront() {
  return (
    <PhoneFrame bg={PulseTheme.bg} dark>
      <PulseBg />
      <div style={{ position: 'relative', height: '100%', padding: '18px 24px', fontFamily: PulseTheme.font, color: PulseTheme.text, display: 'flex', flexDirection: 'column' }}>
        {/* header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: PulseTheme.text, width: 36, height: 36, borderRadius: 10, display: 'grid', placeItems: 'center' }}>
            <IconClose size={18} />
          </button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: PulseTheme.textDim }}>Transactions & ACID</div>
            <div style={{ fontSize: 11, fontFamily: PulseTheme.fontMono, color: PulseTheme.textMute, marginTop: 1 }}>CARD 7 / 22</div>
          </div>
          <div style={{
            padding: '4px 10px', borderRadius: 10, background: 'rgba(255,255,255,0.06)',
            fontSize: 11, fontFamily: PulseTheme.fontMono, display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <IconClock size={12} /> 04:21
          </div>
        </div>

        {/* progress */}
        <div style={{ marginTop: 14, display: 'flex', gap: 3 }}>
          {Array.from({ length: 22 }).map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: i < 6 ? PulseTheme.gradMain : i === 6 ? PulseTheme.accent : 'rgba(255,255,255,0.08)',
            }} />
          ))}
        </div>

        {/* card */}
        <div className="flip-scene" style={{ flex: 1, marginTop: 24, marginBottom: 16 }}>
          <div className="flip-card" style={{ width: '100%', height: '100%' }}>
            <div className="flip-face" style={{
              borderRadius: 28, padding: '32px 28px',
              background: 'linear-gradient(140deg, #9D4DFF 0%, #FF3D7F 60%, #FF8A3D 100%)',
              boxShadow: '0 30px 60px -20px rgba(255,61,127,0.5)',
              display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', right: -40, top: -40, width: 160, height: 160, borderRadius: 80, background: 'rgba(255,255,255,0.12)' }} />
              <div style={{ position: 'absolute', left: -30, bottom: -30, width: 120, height: 120, borderRadius: 60, background: 'rgba(255,255,255,0.08)' }} />
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ padding: '5px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.2)', fontSize: 11, fontFamily: PulseTheme.fontMono, letterSpacing: 1, color: '#fff' }}>QUESTION</div>
                <div style={{ fontFamily: PulseTheme.fontMono, fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>07 / 22</div>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <div style={{ fontFamily: PulseTheme.fontSerif, fontSize: 28, lineHeight: 1.15, color: '#fff', fontWeight: 400, letterSpacing: -0.2, position: 'relative' }}>
                  {FLASHCARD.q}
                </div>
              </div>
              <div style={{ position: 'relative', fontSize: 11, color: 'rgba(255,255,255,0.7)', fontFamily: PulseTheme.fontMono }}>
                Lecture 7 · p. 14
              </div>
            </div>
          </div>
        </div>

        {/* reveal button */}
        <button style={{
          padding: '16px', borderRadius: 16, border: 'none',
          background: '#fff', color: '#1A1530',
          fontFamily: PulseTheme.font, fontWeight: 600, fontSize: 15,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer',
          boxShadow: '0 10px 30px -10px rgba(255,255,255,0.4)',
        }}>
          <IconFlip size={16} /> Tap to reveal answer
        </button>
      </div>
    </PhoneFrame>
  );
}

// ─── study session — card back (answer revealed) + rating ──
function PulseStudyBack() {
  return (
    <PhoneFrame bg={PulseTheme.bg} dark>
      <PulseBg />
      <div style={{ position: 'relative', height: '100%', padding: '18px 24px', fontFamily: PulseTheme.font, color: PulseTheme.text, display: 'flex', flexDirection: 'column' }}>
        {/* header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: PulseTheme.text, width: 36, height: 36, borderRadius: 10, display: 'grid', placeItems: 'center' }}>
            <IconClose size={18} />
          </button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: PulseTheme.textDim }}>Transactions & ACID</div>
            <div style={{ fontSize: 11, fontFamily: PulseTheme.fontMono, color: PulseTheme.textMute, marginTop: 1 }}>CARD 7 / 22</div>
          </div>
          <div style={{
            padding: '4px 10px', borderRadius: 10, background: 'rgba(255,255,255,0.06)',
            fontSize: 11, fontFamily: PulseTheme.fontMono, display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <IconClock size={12} /> 04:28
          </div>
        </div>

        <div style={{ marginTop: 14, display: 'flex', gap: 3 }}>
          {Array.from({ length: 22 }).map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: i < 6 ? PulseTheme.gradMain : i === 6 ? PulseTheme.accent : 'rgba(255,255,255,0.08)',
            }} />
          ))}
        </div>

        {/* card — answer side */}
        <div style={{ flex: 1, marginTop: 24, marginBottom: 16 }}>
          <div style={{
            height: '100%', borderRadius: 28, padding: '28px 24px',
            background: PulseTheme.surfaceSolid,
            border: `1px solid ${PulseTheme.border}`,
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 30px 60px -20px rgba(0,0,0,0.4)',
          }}>
            <div style={{ fontSize: 11, color: PulseTheme.textMute, fontFamily: PulseTheme.fontMono, marginBottom: 8, letterSpacing: 1 }}>QUESTION</div>
            <div style={{ fontFamily: PulseTheme.fontSerif, fontSize: 19, lineHeight: 1.25, fontWeight: 400, color: PulseTheme.textDim }}>
              {FLASHCARD.q}
            </div>
            <div style={{ height: 1, background: PulseTheme.border, margin: '16px 0' }} />
            <div style={{ fontSize: 11, color: PulseTheme.accent3, fontFamily: PulseTheme.fontMono, marginBottom: 8, letterSpacing: 1 }}>ANSWER</div>
            <div style={{ fontSize: 16, lineHeight: 1.45, color: PulseTheme.text, fontWeight: 400 }}>
              {FLASHCARD.a}
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <IconPdf size={14} color={PulseTheme.textDim} />
              <div style={{ fontSize: 11, color: PulseTheme.textDim, fontFamily: PulseTheme.fontMono }}>{FLASHCARD.source}</div>
            </div>
          </div>
        </div>

        {/* rating buttons */}
        <div>
          <div style={{ fontSize: 11, color: PulseTheme.textMute, fontFamily: PulseTheme.fontMono, letterSpacing: 1, textAlign: 'center', marginBottom: 10 }}>
            HOW WELL DID YOU KNOW IT?
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { l: 'Hard', s: '< 10m', c: PulseTheme.hard },
              { l: 'Okay', s: '2 days', c: PulseTheme.okay },
              { l: 'Easy', s: '9 days', c: PulseTheme.easy },
            ].map((r, i) => (
              <button key={i} style={{
                flex: 1, padding: '12px 8px', borderRadius: 14, border: 'none',
                background: `linear-gradient(135deg, ${r.c}, ${r.c}cc)`,
                color: '#0B0717',
                fontFamily: PulseTheme.font, fontWeight: 700, fontSize: 15,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                cursor: 'pointer',
                boxShadow: `0 8px 20px -8px ${r.c}`,
              }}>
                {r.l}
                <span style={{ fontSize: 10, fontWeight: 500, opacity: 0.8, fontFamily: PulseTheme.fontMono }}>{r.s}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

// ─── calendar / conflict resolution ─────────────────────────
function PulseCalendar() {
  const slots = [
    { t: '9:00', dur: 0.5, kind: 'busy', label: 'CS-3305 Lecture' },
    { t: '9:30', dur: 0.5, kind: 'busy' },
    { t: '10:00', dur: 1, kind: 'empty' },
    { t: '11:00', dur: 0.5, kind: 'suggested', label: 'Review · DB · 20 min' },
    { t: '11:30', dur: 0.5, kind: 'empty' },
    { t: '12:00', dur: 1, kind: 'busy', label: 'Lunch w/ Elena' },
    { t: '13:00', dur: 1, kind: 'empty' },
  ];
  return (
    <PhoneFrame bg={PulseTheme.bg} dark>
      <PulseBg />
      <div style={{ position: 'relative', height: '100%', overflow: 'auto', fontFamily: PulseTheme.font, color: PulseTheme.text }}>
        {/* header */}
        <div style={{ padding: '18px 24px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: PulseTheme.text, width: 36, height: 36, borderRadius: 10, display: 'grid', placeItems: 'center' }}>
              <IconBack size={18} />
            </button>
            <div style={{ fontFamily: PulseTheme.fontMono, fontSize: 11, letterSpacing: 2, color: PulseTheme.textMute }}>SCHEDULE</div>
            <IconMore size={20} color={PulseTheme.textDim} />
          </div>
          <div style={{ marginTop: 20, fontFamily: PulseTheme.fontSerif, fontSize: 30, lineHeight: 1.0, fontWeight: 400 }}>
            Upcoming<br/><em style={{ color: PulseTheme.accent }}>reviews</em>
          </div>
        </div>

        {/* conflict banner */}
        <div style={{ margin: '18px 16px 0', padding: 14, borderRadius: 16, background: `${PulseTheme.okay}14`, border: `1px solid ${PulseTheme.okay}40` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: `${PulseTheme.okay}30`, display: 'grid', placeItems: 'center' }}>
              <IconWarn size={16} color={PulseTheme.okay} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Scheduling conflict</div>
              <div style={{ fontSize: 11, color: PulseTheme.textDim, marginTop: 1 }}>
                DB review at 10:00 collides with Lab Session
              </div>
            </div>
          </div>
          <div style={{ marginTop: 12, padding: 10, borderRadius: 10, background: 'rgba(255,255,255,0.04)', fontSize: 12 }}>
            <div style={{ color: PulseTheme.textDim, fontSize: 11, fontFamily: PulseTheme.fontMono, marginBottom: 4 }}>SUGGESTED</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500 }}>
              <span style={{ padding: '2px 8px', borderRadius: 999, background: PulseTheme.gradMain, color: '#fff', fontSize: 11, fontWeight: 600 }}>11:00</span>
              Shift review to free slot <span style={{ color: PulseTheme.textDim, fontWeight: 400 }}>(+1 hr)</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button style={{ flex: 1, padding: '10px', borderRadius: 10, border: `1px solid ${PulseTheme.border}`, background: 'transparent', color: PulseTheme.textDim, fontSize: 12, fontFamily: PulseTheme.font, cursor: 'pointer' }}>Pick another time</button>
            <button style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none', background: PulseTheme.gradMain, color: '#fff', fontSize: 12, fontWeight: 600, fontFamily: PulseTheme.font, cursor: 'pointer' }}>Accept 11:00</button>
          </div>
        </div>

        {/* timeline */}
        <div style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Today · Friday</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {slots.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'stretch', gap: 12, minHeight: s.dur === 1 ? 60 : 40 }}>
                <div style={{ width: 44, paddingTop: 2, fontFamily: PulseTheme.fontMono, fontSize: 10, color: PulseTheme.textMute, textAlign: 'right', flexShrink: 0 }}>
                  {s.t}
                </div>
                <div style={{ flex: 1, position: 'relative', borderLeft: `1px solid ${PulseTheme.border}`, paddingLeft: 12, paddingBottom: 8 }}>
                  {s.kind === 'busy' && (
                    <div style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: `1px solid ${PulseTheme.border}`, fontSize: 11.5, color: PulseTheme.textDim, fontWeight: 500 }}>
                      {s.label || 'Busy'}
                    </div>
                  )}
                  {s.kind === 'suggested' && (
                    <div style={{ padding: '8px 12px', borderRadius: 10, background: PulseTheme.gradMain, fontSize: 12, color: '#fff', fontWeight: 600, boxShadow: `0 8px 20px -8px ${PulseTheme.accent}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <IconZap size={12} color="#fff" /> {s.label}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* this week section */}
          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 14, marginBottom: 10 }}>This week</div>
          {[
            { day: 'Sat', d: '19', sessions: 2, total: '32 cards' },
            { day: 'Mon', d: '21', sessions: 3, total: '48 cards' },
            { day: 'Wed', d: '23', sessions: 1, total: '18 cards' },
          ].map((w, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 12, background: PulseTheme.surface, border: `1px solid ${PulseTheme.border}`, marginBottom: 8 }}>
              <div style={{ width: 40, textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: 10, color: PulseTheme.textMute, fontFamily: PulseTheme.fontMono }}>{w.day.toUpperCase()}</div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>{w.d}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 500 }}>{w.sessions} session{w.sessions > 1 ? 's' : ''}</div>
                <div style={{ fontSize: 11, color: PulseTheme.textDim, fontFamily: PulseTheme.fontMono }}>{w.total}</div>
              </div>
              <IconArrowR size={14} color={PulseTheme.textMute} />
            </div>
          ))}
        </div>
      </div>
    </PhoneFrame>
  );
}

// ─── empty state ─────────────────────────────────────────────
function PulseEmpty() {
  return (
    <PhoneFrame bg={PulseTheme.bg} dark>
      <PulseBg />
      <div style={{ position: 'relative', height: '100%', padding: '18px 24px', fontFamily: PulseTheme.font, color: PulseTheme.text, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, color: PulseTheme.textDim }}>Welcome</div>
            <div style={{ fontFamily: PulseTheme.fontSerif, fontSize: 30, lineHeight: 1.0, marginTop: 2 }}>
              Hi, <em style={{ color: PulseTheme.accent }}>Maya</em>
            </div>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: 22, background: 'linear-gradient(135deg, #9D4DFF, #FF3D7F)', display: 'grid', placeItems: 'center', fontWeight: 600, color: '#fff', fontSize: 15 }}>MK</div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 8px' }}>
          {/* big sparkle illustration */}
          <div style={{ position: 'relative', width: 180, height: 180, marginBottom: 24 }}>
            <div style={{
              position: 'absolute', inset: 20,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,61,127,0.5), transparent 70%)',
              filter: 'blur(20px)',
            }} />
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 36,
              background: PulseTheme.gradMain,
              display: 'grid', placeItems: 'center',
              boxShadow: '0 30px 60px -20px rgba(255,61,127,0.5)',
              transform: 'rotate(-6deg)',
            }}>
              <IconSpark size={80} color="#fff" />
            </div>
            {/* little floaters */}
            <div className="float" style={{ position: 'absolute', top: -10, right: -10, padding: '6px 10px', borderRadius: 10, background: '#fff', color: PulseTheme.bg, fontSize: 11, fontWeight: 700, fontFamily: PulseTheme.fontMono, transform: 'rotate(6deg)' }}>AI ✦</div>
            <div className="float" style={{ position: 'absolute', bottom: 10, left: -18, padding: '6px 10px', borderRadius: 10, background: PulseTheme.accent3, color: PulseTheme.bg, fontSize: 11, fontWeight: 700, fontFamily: PulseTheme.fontMono, transform: 'rotate(-8deg)', animationDelay: '0.5s' }}>READY</div>
          </div>

          <div style={{ fontFamily: PulseTheme.fontSerif, fontSize: 28, lineHeight: 1.1, fontWeight: 400 }}>
            Your first <em style={{ color: PulseTheme.accent3 }}>course</em><br/>is a tap away.
          </div>
          <div style={{ fontSize: 13.5, color: PulseTheme.textDim, marginTop: 10, lineHeight: 1.5, maxWidth: 280 }}>
            Create a course, drop in your syllabus or lecture slides, and we'll do the rest.
          </div>
        </div>

        <button style={{
          padding: '16px', borderRadius: 16, border: 'none',
          background: PulseTheme.gradMain, color: '#fff',
          fontFamily: PulseTheme.font, fontWeight: 600, fontSize: 15,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer',
          boxShadow: '0 15px 30px -10px rgba(255,61,127,0.5)',
        }}>
          <IconPlus size={18} /> Create first course
        </button>
        <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: PulseTheme.textMute, fontFamily: PulseTheme.fontMono }}>
          OR TRY A DEMO COURSE
        </div>
      </div>
    </PhoneFrame>
  );
}

Object.assign(window, {
  PulseTheme, PulseOnboarding, PulseHome, PulseNewCourse,
  PulseCourseDetail, PulseStudyFront, PulseStudyBack,
  PulseCalendar, PulseEmpty,
});
