"use client";

import { cn } from "@/lib/utils";
import Drag from "./drag";
import React from "react";
import { motion } from "framer-motion";
import { Permanent_Marker } from "next/font/google";

const permanentMarker = Permanent_Marker({
  subsets: ["latin"],
  weight: "400",
});

const Note = React.memo(
  ({
    name,
    content,
    signature,
    initialX,
    initialY,
  }: {
    name: string;
    content: string;
    signature: string;
    initialX?: number;
    initialY?: number;
  }) => {
    const isSvgSignature = signature.trimStart().startsWith("<svg");
    const signatureSvgDataUri = isSvgSignature
      ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(signature)}`
      : null;

    return (
      <Drag
        className={cn("z-10")}
        initialX={initialX}
        initialY={initialY}
      >
        <motion.div
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative min-h-[188px] w-[148px] rounded-[3px] border border-black/15 bg-[#f9f9f5] p-2 text-black shadow-[0_10px_18px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.15)] transition-shadow duration-300 ease-out hover:shadow-[0_16px_24px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.2)]"
        >
          {signature ? (
            <div className="relative h-[130px] overflow-hidden border border-black/10 bg-black">
              {isSvgSignature && signatureSvgDataUri ? (
                <img
                  src={signatureSvgDataUri}
                  className="relative z-10 h-full w-full object-cover"
                  draggable={false}
                  alt="ascii selfie"
                />
              ) : (
                <pre className="z-10 p-1.5 text-[6px] leading-[6px] font-mono text-white whitespace-pre">
                  {signature}
                </pre>
              )}
            </div>
          ) : null}
          <div className="pointer-events-none mt-2 px-2 pb-2">
            <div
              className={`${permanentMarker.className} -rotate-1 text-[14px] leading-[1.05] tracking-[0.01em] text-black/90`}
            >
              <p className="truncate">{name}</p>
              <p className="whitespace-pre-wrap wrap-break-word">{content}</p>
            </div>
          </div>
        </motion.div>
      </Drag>
    );
  }
);

export default Note;
