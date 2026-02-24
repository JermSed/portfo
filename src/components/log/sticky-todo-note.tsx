"use client";

import { useState } from "react";

const initialItems = [
  "sign the guestbook",
  "leave a memory",
  "grab a sticker :)",
  "come back soon",
];

const StickyTodoNote = () => {
  const [checked, setChecked] = useState<boolean[]>(
    initialItems.map(() => false)
  );

  const toggleItem = (index: number) => {
    setChecked((prev) => prev.map((value, i) => (i === index ? !value : value)));
  };

  return (
    <div
      className="absolute top-[10vmin] left-[8vmin] z-10 h-[19vmin] w-[16vmin] -rotate-6 overflow-hidden rounded-[0.28vmin] border border-[#d6b95c]/55 p-[1.2vmin] text-[#4a3f22] shadow-[0_1.35vmin_2.2vmin_rgba(0,0,0,0.32),0_0.2vmin_0.45vmin_rgba(0,0,0,0.22)]"
      style={{
        fontFamily:
          '"Noteworthy", "Chalkboard SE", "Bradley Hand", "Segoe Print", cursive',
        background:
          "linear-gradient(170deg, rgba(255,246,171,0.98) 0%, rgba(255,233,131,0.96) 62%, rgba(242,206,95,0.95) 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute top-[0.4vmin] left-1/2 h-[1.7vmin] w-[6.4vmin] -translate-x-1/2 -rotate-2 rounded-[0.2vmin] border border-white/35 bg-white/35 shadow-[0_0.15vmin_0.3vmin_rgba(0,0,0,0.18)]"
        style={{ backdropFilter: "blur(0.5px)" }}
      />
      <div
        className="pointer-events-none absolute top-0 right-0 h-[2.5vmin] w-[2.5vmin]"
        style={{
          background:
            "linear-gradient(225deg, rgba(255,255,255,0.7) 0%, rgba(255,248,204,0.42) 42%, rgba(255,248,204,0) 42%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, rgba(145,120,39,0.16) 0px, rgba(145,120,39,0.16) 1px, rgba(145,120,39,0) 1px, rgba(145,120,39,0) 14px)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-multiply"
        style={{ backgroundImage: "url(/noise.svg)", backgroundSize: "170px 170px" }}
      />

      <p className="-rotate-[1.8deg] text-[1.62vmin] font-medium tracking-[0.015em] lowercase [text-shadow:0_0.03vmin_0_rgba(20,17,10,0.35)]">
        to-do
      </p>
      <ul className="mt-[0.7vmin] space-y-[0.42vmin] text-[1.25vmin] leading-[1.45] tracking-[0.004em] [text-shadow:0_0.02vmin_0_rgba(20,17,10,0.25)]">
        {initialItems.map((item, index) => {
          const rowClass =
            index === 0
              ? "-rotate-[0.9deg]"
              : index === 1
                ? "ml-[0.25vmin] rotate-[0.6deg]"
                : index === 2
                  ? "-ml-[0.15vmin] -rotate-[0.5deg]"
                  : "ml-[0.2vmin] rotate-[0.7deg]";

          return (
            <li key={item} className={rowClass}>
              <button
                type="button"
                onClick={() => toggleItem(index)}
                className="cursor-pointer"
                aria-label={`Toggle ${item}`}
              >
                [{checked[index] ? "x" : " "}]
              </button>{" "}
              {item}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default StickyTodoNote;
