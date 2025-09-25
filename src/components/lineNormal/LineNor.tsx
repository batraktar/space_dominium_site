import React, { useEffect, useRef } from 'react';
import './LineNor.css';

export type DottedSide = 'left' | 'right' | 'both';
export interface Variant {
  id: string;
  thumb: string;
  contentIcon: string;
  bullets: string[];
}
export interface Tab {
  id: 'social' | 'market' | 'sites' | 'retail' | 'apps';
  label: string;
  navIcon: string;
  contentIcon: string;
  variants: Variant[];
}

interface LineNorProps {
  dottedSide?: DottedSide;
  activeId: Tab['id'];
  onSelect?: (id: Tab['id']) => void; // якщо десь використаєш
  activeTab: Tab;
  activeVarIdx: number | null;
  setActiveVarIdx: React.Dispatch<React.SetStateAction<number | null>>;
}

function useStrokeDraw(
  pathsRefs: Array<React.RefObject<SVGPathElement | null>>,
  isOn: boolean,
  opts: { duration?: number; easing?: string } = {}
) {
  const { duration = 750, easing = 'ease-in-out' } = opts;
  const prevOn = useRef(isOn);

  useEffect(() => {
    if (prevOn.current === isOn) return;

    pathsRefs.forEach((ref) => {
      const el = ref.current;
      if (!el) return;

      const len = el.getTotalLength();
      el.style.strokeDasharray = `${len}`;
      el.getAnimations?.().forEach((a) => a.cancel());

      const keyframes: Keyframe[] = isOn
        ? [
          { strokeDashoffset: len as unknown as string, opacity: 0 },
          { strokeDashoffset: 0 as unknown as string, opacity: 1 },
        ]
        : [
          { strokeDashoffset: 0 as unknown as string, opacity: 1 },
          { strokeDashoffset: len as unknown as string, opacity: 0 },
        ];

      el.animate(keyframes, { duration, easing, fill: 'forwards' });
    });

    prevOn.current = isOn;
  }, [isOn, pathsRefs, duration, easing]);
}

const LineNor: React.FC<LineNorProps> = ({
  dottedSide = 'left',
  activeId: _activeId,
  onSelect: _onSelect,
  activeTab,
  activeVarIdx,
  setActiveVarIdx,
}) => {
  const leftIsDotted = dottedSide === 'left' || dottedSide === 'both';
  const rightIsDotted = dottedSide === 'right' || dottedSide === 'both';

  // refs для суцільних сегментів
  const L1 = useRef<SVGPathElement | null>(null);
  const L2 = useRef<SVGPathElement | null>(null);
  const R1 = useRef<SVGPathElement | null>(null);
  const R2 = useRef<SVGPathElement | null>(null);

  useStrokeDraw([L1, L2], !leftIsDotted);
  useStrokeDraw([R1, R2], !rightIsDotted);

  return (
    <div className="line_wrapper">
      <div className="line-svg">
        <svg width="1044" height="154" viewBox="0 0 1044 154" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Ліва частина */}
          <svg width="1044" height="154" viewBox="0 0 1044 154" fill="none" style={{ maxWidth: '100%' }}>
            <circle cx="3" cy="151" r="2.5" stroke="black" />
            <path d="M3 149C3 63 3 63.2333 40 63" stroke="#1E1E5B" strokeWidth="2" strokeDasharray="4 4" fill="none" />
            <path d="M40 63H240" stroke="#1E1E5B" strokeWidth="2" strokeDasharray="4 4" fill="none" />
            <path ref={L1} d="M3 149C3 63 3 63.2333 40 63" stroke="url(#paint4)" strokeWidth="2" fill="none" style={{ opacity: 0 }} />
            <path ref={L2} d="M40 63H240" stroke="#A88AED" strokeWidth="2" fill="none" style={{ opacity: 0 }} />
          </svg>

          {/* Права частина */}
          <svg width="1044" height="154" viewBox="0 0 1044 154" fill="none" style={{ maxWidth: '100%' }}>
            <circle cx="1040.5" cy="151" r="2.5" stroke="black" />
            <path d="M1040.5 149C1040.5 63 1040.5 63.2333 1003.5 63" stroke="#1E1E5B" strokeWidth="2" strokeDasharray="4 4" fill="none" />
            <path d="M1003.5 63H803" stroke="#1E1E5B" strokeWidth="2" strokeDasharray="4 4" fill="none" />
            <path ref={R1} d="M1040.5 149C1040.5 63 1040.5 63.2333 1003.5 63" stroke="url(#paint4)" strokeWidth="2" fill="none" style={{ opacity: 0 }} />
            <path ref={R2} d="M1003.5 63H803" stroke="#A88AED" strokeWidth="2" fill="none" style={{ opacity: 0 }} />
          </svg>

          {/* Центр/горизонталі */}
          <circle cx="524.4" cy="3" r="2" stroke="#1E1E5B" strokeWidth="2" />
          <path d="M524.4 64L524.4 6" stroke="url(#paint0)" strokeWidth="2" />
          <path d="M244.4 63H803.4" stroke="#A88AED" strokeWidth="2" />

          {/* Відгалуження */}
          <circle cx="3" cy="3" r="2" transform="matrix(-1 0 0 1 843.4 148)" stroke="#1E1E5B" strokeWidth="2" />
          <circle cx="3" cy="3" r="2" transform="matrix(-1 0 0 1 630.4 148)" stroke="#1E1E5B" strokeWidth="2" />
          <circle cx="3" cy="3" r="2" transform="matrix(-1 0 0 1 420 148)" stroke="#1E1E5B" strokeWidth="2" />
          <circle cx="3" cy="3" r="2" transform="matrix(-1 0 0 1 210 148)" stroke="#1E1E5B" strokeWidth="2" />
          <path d="M840.4 149C840.4 64.5 848.4 63 803.4 63" stroke="url(#paint1)" strokeWidth="2" />
          <path d="M627.4 149C627.4 64.5 635.4 63 590.4 63" stroke="url(#paint2)" strokeWidth="2" />
          <path d="M416.957 149C416.957 64.5 408.861 63 454.4 63" stroke="url(#paint3)" strokeWidth="2" />
          <path d="M206.957 149C206.957 64.5 198.861 63 244.4 63" stroke="url(#paint4)" strokeWidth="2" />

          <defs>
            <linearGradient id="paint0" x1="524.9" y1="6" x2="524.9" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1E1E5B" />
              <stop offset="1" stopColor="#9B89C0" />
            </linearGradient>
            <linearGradient id="paint1" x1="821.9" y1="63" x2="821.9" y2="149" gradientUnits="userSpaceOnUse">
              <stop stopColor="#A88AED" />
              <stop offset="1" stopColor="#1E1E5B" />
            </linearGradient>
            <linearGradient id="paint2" x1="608.9" y1="63" x2="608.9" y2="149" gradientUnits="userSpaceOnUse">
              <stop stopColor="#A88AED" />
              <stop offset="1" stopColor="#1E1E5B" />
            </linearGradient>
            <linearGradient id="paint3" x1="435.679" y1="63" x2="435.679" y2="149" gradientUnits="userSpaceOnUse">
              <stop stopColor="#A88AED" />
              <stop offset="1" stopColor="#1E1E5B" />
            </linearGradient>
            <linearGradient id="paint4" x1="225.679" y1="63" x2="225.679" y2="149" gradientUnits="userSpaceOnUse">
              <stop stopColor="#A88AED" />
              <stop offset="1" stopColor="#1E1E5B" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* НИЖНІ СЕКТОРИ */}
      <div className="line_icon_wrapper" role="tablist" aria-label="Підменю">
        {activeTab?.variants?.map((v, i) => {
          const isActive = i === activeVarIdx;
          return (
            <div key={v.id} className={`line_icon ${isActive ? 'is-active' : ''}`}>
              <button
                type="button"
                className="box_line_icon"
                role="tab"
                aria-selected={isActive}
                tabIndex={0}
                onClick={() => setActiveVarIdx(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setActiveVarIdx(i);
                }}
                aria-label={`Вибрати варіант ${i + 1}`}
              >
                <img src={v.thumb} alt="" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LineNor;
