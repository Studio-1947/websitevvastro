const { useComposition, animate, interpolate, Easing, clamp, Captions } = window;

const ALL = window.PARAS_ALL || [];
const S = 2.42; // px per artwork unit — one shared scale across every step

const MOTION = {
  enter: (from, to, start, end) => animate({ from, to, start, end, ease: Easing.easeOutCubic }),
  draw: (from, to, start, end) => animate({ from, to, start, end, ease: Easing.easeInOutQuart }),
  pop: (from, to, start, end) => animate({ from, to, start, end, ease: Easing.easeOutBack }),
};

const ff = (T, a, b) => clamp(interpolate(T, [a, b], [0, 1], Easing.easeInOutSine), 0, 1);

function Layer({ children, opacity, y = 0, scale = 1 }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity, transform: `translateY(${y}px) scale(${scale})`,
    }}>{children}</div>
  );
}

function Piece({ logoColor = '#FFFFFF', logoScale = 1, glowOn = true }) {
  const { T, CUES, authoredTotal } = useComposition();
  const fill = logoColor;

  // ---- 1/2. the two letters, then their overlap -------------------------
  const paIn = MOTION.draw(0, 1, CUES.Letters + 0.25, CUES.Letters + 1.2)(T);
  const pIn = MOTION.draw(0, 1, CUES.Letters + 0.95, CUES.Letters + 1.9)(T);
  const slide = MOTION.draw(0, 1, CUES.Overlap + 0.25, CUES.Overlap + 1.35)(T);
  const lettersOp = ff(T, CUES.Letters + 0.05, CUES.Letters + 0.35) * (1 - ff(T, CUES.Stroke - 1.0, CUES.Stroke - 0.55));

  // ---- 3. one continuous monoline stroke --------------------------------
  const strokeDraw = MOTION.draw(0, 1, CUES.Stroke + 0.15, CUES.Stroke + 1.5)(T);
  const strokeOp = ff(T, CUES.Stroke, CUES.Stroke + 0.3) * (1 - ff(T, CUES.Mark - 1.0, CUES.Mark - 0.55));

  // ---- 4. the stroke thickens into a solid mark -------------------------
  const solidGrow = MOTION.draw(0, 1, CUES.Mark + 0.1, CUES.Mark + 1.2)(T);
  const solidOp = ff(T, CUES.Mark, CUES.Mark + 0.3) * (1 - ff(T, CUES.Frame - 1.0, CUES.Frame - 0.55));

  // ---- 5. the final logo builds, then the wordmark ----------------------
  const frame = MOTION.draw(0, 1, CUES.Frame + 0.15, CUES.Frame + 1.35)(T);
  const panel = MOTION.draw(0, 1, CUES.Panel, CUES.Panel + 1.1)(T);
  const counter = MOTION.draw(0, 1, CUES.Counter, CUES.Counter + 1.1)(T);
  const word = MOTION.draw(0, 1, CUES.Wordmark + 0.2, CUES.Wordmark + 1.5)(T);
  const lift = MOTION.enter(97, 0, CUES.Wordmark - 0.35, CUES.Wordmark + 1.1)(T);
  const finalOp = ff(T, CUES.Frame + 0.05, CUES.Frame + 0.3);
  const settle = MOTION.pop(0.96, 1, CUES.Settle - 0.4, CUES.Settle + 0.9)(T);
  const glow = MOTION.enter(0, 1, CUES.Settle - 0.3, CUES.Settle + 1.1)(T);
  const out = 1 - ff(T, authoredTotal - 0.75, authoredTotal - 0.08);

  const MARK = { x: 1396, y: 391, w: 168, h: 176 };
  const WORD = { x: 1396, y: 570, w: 172, h: 76 };

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: out, transform: `scale(${logoScale})` }}>
      <div style={{
        position: 'absolute', left: '50%', top: '50%', width: 900, height: 900, marginLeft: -450, marginTop: -450,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,236,222,0.10) 0%, rgba(255,236,222,0) 62%)',
        opacity: glowOn ? glow : 0, transform: `scale(${0.8 + glow * 0.2})`,
      }}></div>

      <Layer opacity={lettersOp}>
        <svg viewBox="275 445 155 135" width={155 * S} style={{ display: 'block', overflow: 'visible' }}>
          <defs>
            <clipPath id="wPa"><rect x="275" y="445" width="155" height={135 * paIn}></rect></clipPath>
            <clipPath id="wP"><rect x="275" y="445" width="155" height={135 * pIn}></rect></clipPath>
          </defs>
          <g fill={fill}>
            <g clipPath="url(#wPa)"><path d={ALL[4]}></path></g>
            <g clipPath="url(#wP)" transform={`translate(${-34 * slide}, ${-32 * slide})`}>
              <path d={ALL[2]}></path>
            </g>
          </g>
        </svg>
      </Layer>

      <Layer opacity={strokeOp}>
        <svg viewBox="828 428 147 143" width={147 * S} style={{ display: 'block', overflow: 'visible' }}>
          <defs>
            <clipPath id="wStroke"><rect x="828" y="428" width={147 * strokeDraw} height="143"></rect></clipPath>
          </defs>
          <g fill={fill} clipPath="url(#wStroke)"><path d={ALL[0]}></path></g>
        </svg>
      </Layer>

      <Layer opacity={solidOp}>
        <svg viewBox="1070 420 144 150" width={144 * S} style={{ display: 'block', overflow: 'visible' }}>
          <defs>
            <clipPath id="wSolid"><rect x="1070" y={570 - 150 * solidGrow} width="144" height={150 * solidGrow}></rect></clipPath>
          </defs>
          <g fill={fill} clipPath="url(#wSolid)">
            <path d={ALL[5]}></path>
            <path d={ALL[6]}></path>
            <path d={ALL[7]}></path>
          </g>
        </svg>
      </Layer>

      <Layer opacity={finalOp} y={lift} scale={settle}>
        <svg viewBox="1385 383 194 272" width={194 * S} style={{ display: 'block', overflow: 'visible' }}>
          <defs>
            <clipPath id="wipeFrame"><rect x={MARK.x} y={MARK.y} width={MARK.w} height={MARK.h * frame}></rect></clipPath>
            <clipPath id="wipePanel"><rect x={MARK.x} y={MARK.y + MARK.h * (1 - panel)} width={MARK.w} height={MARK.h * panel}></rect></clipPath>
            <clipPath id="wipeCounter"><rect x={MARK.x} y={MARK.y} width={MARK.w * counter} height={MARK.h}></rect></clipPath>
            <clipPath id="wipeWord"><rect x={WORD.x} y={WORD.y} width={WORD.w * word} height={WORD.h}></rect></clipPath>
          </defs>
          <g fill={fill}>
            <g clipPath="url(#wipeFrame)"><path d={ALL[8]}></path></g>
            <g clipPath="url(#wipePanel)"><path d={ALL[9]}></path></g>
            <g clipPath="url(#wipeCounter)"><path d={ALL[10]}></path></g>
            <g clipPath="url(#wipeWord)">
              <path d={ALL[11]}></path>
              <path d={ALL[12]}></path>
              <path d={ALL[13]}></path>
            </g>
          </g>
        </svg>
      </Layer>

      <Captions
        style={{
          bottom: '11%', font: '500 27px "Helvetica Neue", Helvetica, Arial, sans-serif',
          letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,236,222,0.78)', textShadow: 'none',
        }}
        items={[
          { at: CUES.Letters + 0.5, until: CUES.Stroke - 0.6, text: 'प  —  the Devanagari letter, and its Latin P' },
          { at: CUES.Overlap + 0.4, until: CUES.Stroke - 0.6, text: 'The two are brought together on a shared stem' },
          { at: CUES.Stroke + 0.4, until: CUES.Mark - 0.6, text: 'Redrawn as one continuous stroke' },
          { at: CUES.Mark + 0.3, until: CUES.Frame - 0.6, text: 'Weighted into a solid, squared mark' },
          { at: CUES.Frame + 0.3, text: 'Counters opened, the form closed' },
          { at: CUES.Wordmark + 0.5, until: CUES.Settle + 1.6, text: 'परस्पर  —  mutual, reciprocal' },
        ]}
      />
    </div>
  );
}

function ParasScene(props) {
  const { CompositionStage } = window;
  const bg = props.bgColor || '#7C2600';
  return (
    <CompositionStage width={1920} height={1080} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg={bg}>
      <Piece logoColor={props.logoColor} logoScale={props.logoScale} glowOn={props.glowOn !== false} />
    </CompositionStage>
  );
}

window.Piece = Piece;
window.ParasScene = ParasScene;
