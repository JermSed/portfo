"use client";

import React from "react";
import Drag from "./drag";
import Image from "next/image";
import { Permanent_Marker } from "next/font/google";

const permanentMarker = Permanent_Marker({
  subsets: ["latin"],
  weight: "400",
});

const Polaroid = ({ src, alt, caption }: { src: string; alt: string; caption: string }) => {
  return (
    <Drag className="h-[188px] w-[148px] rounded-[3px] border border-black/15 bg-[#f9f9f5] p-2 pb-10 shadow-[0_10px_18px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.15)] transition-shadow duration-300 ease-out hover:shadow-[0_16px_24px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.2)]">
      <div className="relative h-full overflow-hidden border border-black/10 bg-black/5">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 20vw, 35vw"
          className="h-fit max-w-full object-cover saturate-[0.92] contrast-[1.04]"
          draggable={false}
          quality={5}
        />
      </div>
      <div className="pointer-events-none absolute right-0 bottom-3 left-0 flex justify-center">
        <span
          className={`${permanentMarker.className} inline-block -rotate-2 text-center text-[15px] leading-none tracking-[0.01em] text-black/85`}
        >
          {caption}
        </span>
      </div>
    </Drag>
  );
};

export default Polaroid;
