import React, { useEffect, useMemo, useRef, useState } from 'react';

const STORAGE_KEY = 'jeremy-stamp-board-v1';

const stampOptions = [
  { id: 'hello', label: 'Hello!', color: 'bg-indigo-500', textColor: 'text-white' },
  { id: 'welcome', label: 'You made it 🎉', color: 'bg-emerald-500', textColor: 'text-white' },
  { id: 'ship', label: 'Ship it', color: 'bg-orange-500', textColor: 'text-white' },
  { id: 'nice', label: 'Nice pick', color: 'bg-amber-400', textColor: 'text-ink-900' },
  { id: 'wave', label: '👋 Hi there', color: 'bg-sky-500', textColor: 'text-white' },
];

function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function StampPlayground() {
  const boardRef = useRef(null);
  const [activeStamp, setActiveStamp] = useState(stampOptions[0]);
  const [stamps, setStamps] = useState([]);
  const [hoverPoint, setHoverPoint] = useState(null);
  const [isPointerDown, setIsPointerDown] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setStamps(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Could not load stamps', err);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stamps));
    } catch (err) {
      console.error('Could not save stamps', err);
    }
  }, [stamps]);

  const stampPalette = useMemo(() => stampOptions, []);

  const handlePointerPosition = (event) => {
    if (!boardRef.current || !activeStamp) return;
    const rect = boardRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setHoverPoint({ x, y });
    return { x, y };
  };

  const placeStamp = (coords) => {
    const { x, y } = coords;
    const newStamp = {
      id: createId(),
      label: activeStamp.label,
      color: activeStamp.color,
      textColor: activeStamp.textColor,
      x,
      y,
      rotation: Math.random() * 12 - 6,
      depth: Math.random() * 0.08 + 0.9,
    };

    setStamps((prev) => [...prev, newStamp]);
  };

  const handlePointerDown = (event) => {
    setIsPointerDown(true);
    const coords = handlePointerPosition(event);
    if (coords) placeStamp(coords);
  };

  const handlePointerMove = (event) => {
    if (!boardRef.current) return;
    const coords = handlePointerPosition(event);
    if (coords && isPointerDown) {
      placeStamp(coords);
    }
  };

  const handlePointerUp = () => {
    setIsPointerDown(false);
  };

  const handlePointerLeave = () => {
    setIsPointerDown(false);
    setHoverPoint(null);
  };

  const handleClear = () => setStamps([]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Say hi</p>
          <h2 className="section-title text-xl">Leave a stamp on the page</h2>
          <p className="text-sm text-ink-500">Pick a stamp, click or drag across the canvas, and it will stay here on your next visit.</p>
        </div>
        <button
          onClick={handleClear}
          className="text-sm font-medium text-ink-900 px-3 py-2 rounded-full border border-slate-200 hover:border-accent-200 hover:text-accent-700 bg-white transition shadow-subtle"
        >
          Clear canvas
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {stampPalette.map((stamp) => {
          const isActive = activeStamp?.id === stamp.id;
          return (
            <button
              key={stamp.id}
              onClick={() => setActiveStamp(stamp)}
              className={`rounded-full px-4 py-2 text-sm font-semibold shadow-subtle transition border ${
                isActive ? 'border-ink-900 text-ink-900 bg-white' : 'border-slate-200 text-ink-700 bg-white/80 hover:border-accent-200'
              }`}
            >
              {stamp.label}
            </button>
          );
        })}
      </div>

      <div
        ref={boardRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        className="stamp-board relative h-[360px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-subtle cursor-crosshair"
      >
        {hoverPoint && (
          <span
            className="pointer-events-none absolute inline-flex -translate-x-1/2 -translate-y-1/2 select-none items-center justify-center rounded-full px-4 py-2 text-sm font-semibold border border-dashed border-ink-500/40 text-ink-700 bg-white/80 shadow-subtle stamp-preview"
            style={{ left: `${hoverPoint.x}%`, top: `${hoverPoint.y}%` }}
          >
            {activeStamp?.label}
          </span>
        )}
        {stamps.map((stamp) => (
          <span
            key={stamp.id}
            className={`pointer-events-none absolute inline-flex -translate-x-1/2 -translate-y-1/2 select-none items-center justify-center rounded-full px-3 py-2 text-sm font-semibold stamp-ink shadow-subtle ${stamp.color} ${stamp.textColor}`}
            style={{
              left: `${stamp.x}%`,
              top: `${stamp.y}%`,
              transform: `translate(-50%, -50%) rotate(${stamp.rotation}deg) scale(${stamp.depth})`,
              opacity: 0.9,
            }}
          >
            {stamp.label}
          </span>
        ))}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#e2e8f0_1px,transparent_0)] bg-[size:36px_36px] opacity-50" />
        <div className="pointer-events-none absolute inset-0 stamp-grain" />
      </div>
    </section>
  );
}